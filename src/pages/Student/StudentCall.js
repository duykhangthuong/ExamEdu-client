import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { API } from "utilities/constants";
import { useLazyFetch } from "utilities/useFetch";
import style from "styles/StudentCall.module.css";
const StudentCall = ({examId}) => {
    const roomID = "test";
    const user = useSelector((state) => state.user);
    const [videoState, setVideoState] = useState(true);
    const [audioState, setAudioState] = useState(true);
    const local_stream = useRef();
    const [forceRender, setForceRender] = useState(1);
    const [fetchSate, setFetchSate] = useState(false);
    const changeLocalVideoState = () => {
        local_stream.current.getVideoTracks()[0].enabled = !local_stream.current.getVideoTracks()[0].enabled;
        setVideoState(local_stream.current.getVideoTracks()[0].enabled);
    }
    const changeLocalAudioState = () => {
        local_stream.current.getAudioTracks()[0].enabled = !local_stream.current.getAudioTracks()[0].enabled;
        setAudioState(local_stream.current.getAudioTracks()[0].enabled);
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
                studentDisconnect();  //nho bo commet cai nay
                peer.destroy();
                ev.preventDefault();
                return ev.returnValue = 'Are you sure you want to close?';
            });
        }
    }, [fetchSate]);

    return (
        <div>
            <video id="local-video" className={`${style.local_video}`}></video>
            <video id="remote-video" className={`${style.remote_video}`} autoPlay></video>
            <div
                    className={`${style.buttons_group} d-flex justify-content-center`}
                >
                    {/* Button Micro */}
                    <div
                        className={
                            audioState
                                ? `${style.media_button}`
                                : `${style.media_button_off}`
                        }
                        onClick={() => {
                            changeLocalAudioState();
                        }}
                    >
                        <i
                            className={
                                audioState
                                    ? `bi bi-mic-fill ${style.media_icon}`
                                    : `bi bi-mic-mute-fill ${style.media_icon}`
                            }
                        ></i>
                    </div>

                    {/* Button Video */}
                    <div
                        className={
                            videoState
                                ? `${style.media_button}`
                                : `${style.media_button_off}`
                        }
                        onClick={() => changeLocalVideoState()}
                    >
                        <i
                            className={
                                videoState
                                    ? `bi bi-camera-video-fill ${style.media_icon}`
                                    : `bi bi-camera-video-off-fill ${style.media_icon}`
                            }
                        ></i>
                    </div>
                </div>
        </div>
    );
}

export default StudentCall;
