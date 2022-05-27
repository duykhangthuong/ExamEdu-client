import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";

const Invigilate = () => {

	const roomID = "test";
	const local_stream = useRef();
	const remoteStreamList = useRef([]);
	//var remoteStreamTemp;
	const [test, seTest] = useState(1);
	var temp = remoteStreamList;
	const changeLocalVideoState = () => {
		local_stream.current.getVideoTracks()[0].enabled = !local_stream.current.getVideoTracks()[0].enabled;
		//setRemoteStreamList([...remoteStreamList, remoteStreamTemp]);
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
			call.answer(local_stream.current);
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
				seTest(Math.random()); //dung de force rerender
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
			<video id="local-video" style={{ height: "5vh" }}></video>
			<div id="remote-video"></div>
			{
				remoteStreamList.current.map((stream, index) => {
					return (
						<div key={index}>
							<div>{stream.userFullname}</div>
							<div>{stream.userEmail}</div>
							<video style={{ height: "5vh" }} ref={video =>{
								try {
									console.log(index,stream);
									video.srcObject = stream.stream;
								} catch (error) {
									
								}
								}} autoPlay></video> 
						</div>
					)
				})
			}
			<h5>{test}</h5>
			
			<button onClick={() => changeLocalVideoState()}>video state</button>
			<button onClick={() => changeLocalAudioState()}>audio</button>
		</div>
	);
}

export default Invigilate;