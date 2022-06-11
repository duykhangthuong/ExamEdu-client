import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { API } from "utilities/constants";
import { useLazyFetch } from "utilities/useFetch";
const StudentCall = () => {
    const roomID = "test";
    const user = useSelector((state) => state.user);
    const examId = 1;

    const local_stream = useRef();
    const [forceRender, setForceRender] = useState(1);
    const [fetchSate, setFetchSate] = useState(false);
    const changeLocalVideoState = () => {
        local_stream.current.getVideoTracks()[0].enabled = !local_stream.current.getVideoTracks()[0].enabled;
    }
    const changeLocalAudioState = () => {
        local_stream.current.getAudioTracks()[0].enabled = !local_stream.current.getAudioTracks()[0].enabled;
    }

	const [fetchRoomId, fetchRoomIdResult] = useLazyFetch(
		`${API}/invigilate/roomId/${examId}`, {
		method: "GET",
		onCompletes: (data) => {
			setFetchSate(true);
		}
	});

    const [studentDisconnect, studentDisconnectResponse] = useLazyFetch(`${API}/invigilate/studentDisconnect`, {
		method: "POST",
		body: {
			ExamId: examId,
			RoomId: user.email
		}
	});

    useEffect(() => {
        fetchRoomId();
    }, []);

    useEffect(() => {
        if (fetchRoomIdResult.data != undefined) {
            var peer = new Peer();
            peer.on('open', (id) => {
                console.log("Connected with Id: " + id)
                navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                    let video = document.getElementById("local-video");
                    local_stream.current = stream;
                    video.srcObject = stream;
                    video.muted = true;
                    video.play();
                    let call = peer.call(fetchRoomIdResult.data.roomId, stream, {
                        metadata: {
                            userEmail: user.email,
                            userFullname: user.fullname,
                            userRole: user.role
                        }
                    });
                    let count = 0;
                    call.on('stream', (stream) => {
                        count++;
                        if (count === 2)
                            return;
                        try {
                            let video = document.getElementById("remote-video"); //Khong xai dom thi cai video no bi chop chop (flickering)
                            video.srcObject = stream;
                            video.play();
                        } catch (error) {
    
                        }
                    })
                })
    
            })
            window.addEventListener("beforeunload", (ev) => {
                //studentDisconnect();  //nho bo commet cai nay
                peer.destroy();
                ev.preventDefault();
                return ev.returnValue = 'Are you sure you want to close?';
            });
        }
    }, [fetchSate]);

    return (
        <div>
            <video id="local-video"></video>
            <video id="remote-video" autoPlay></video>
            <button onClick={() => changeLocalVideoState()}>local video state</button>
            <button onClick={() => changeLocalAudioState()}>Local audio state</button>
        </div>
    );
}

export default StudentCall;
