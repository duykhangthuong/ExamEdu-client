import CallWindow from "components/CallWindow";
import hark from "hark";
import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const Invigilate = () => {

	const roomID = "test";
	const local_stream = useRef();
	const remoteStreamList = useRef([]);
	const user = useSelector((state) => state.user);
	//var remoteStreamTemp;
	const [forceRender, setForceRender] = useState(1);
	const changeLocalVideoState = () => {
		local_stream.current.getVideoTracks()[0].enabled = !local_stream.current.getVideoTracks()[0].enabled;
	}
	const changeLocalAudioState = () => {
		local_stream.current.getAudioTracks()[0].enabled = !local_stream.current.getAudioTracks()[0].enabled;
	}

	var peer = new Peer(roomID);
	peer.on('open', (id) => {
		console.log("Peer Connected with ID: ", id)
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			local_stream.current = stream;
			let video = document.getElementById("local-video");
			video.srcObject = stream;
			video.muted = true;
			video.play();
		})
		peer.on('call', (call) => {
			call.answer(local_stream.current, {
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

				remoteStreamList.current = [...remoteStreamList.current, {
					stream: stream,
					userEmail: call.metadata.userEmail,
					userFullname: call.metadata.userFullname
				}];
				setForceRender(Math.random()); //dung de force rerender
			})
		})

	})


	useEffect(() => {
		window.addEventListener("beforeunload", (ev) => {
			ev.preventDefault();
			return ev.returnValue = 'Are you sure you want to closeeeeee?';
		});
	}, []);



	return (
		<div>
			<video id="local-video" style={{ height: "10vh" }}></video>
			<div id="remote-video"></div>
			<button onClick={() => changeLocalVideoState()}>video state</button> {/*tu mute hoac tu tat cam minh*/}
			<button onClick={() => changeLocalAudioState()}>audio</button>
			{
				remoteStreamList.current.map((stream, index) => {
					return (
						<div key={index}>						
							<CallWindow
								stream={stream.stream}
								userFullname={stream.userFullname}
								userEmail={stream.userEmail} />
							<hr></hr>
						</div>
					)
				})
			}
			<h5>{forceRender}</h5>
		</div>
	);
}

export default Invigilate;