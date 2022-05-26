import Peer from "peerjs";
import { useEffect, useState } from "react";

const Invigilate = () => {

	const roomID = "test";
	var local_stream;

	const changeLocalVideoState = () => {
		local_stream.getVideoTracks()[0].enabled = !local_stream.getVideoTracks()[0].enabled;
	}
	const changeLocalAudioState = () => {
		local_stream.getAudioTracks()[0].enabled = !local_stream.getAudioTracks()[0].enabled;
	}


	const createRemoteVideoWindow = (stream) => {
		let video = document.createElement('video');
		const remoteVideos = document.getElementById('remote-video');
		video.srcObject = stream;
		remoteVideos.append(video)
		video.play();
	}


	useEffect(() => {
		window.addEventListener("beforeunload", (ev) => {
			ev.preventDefault();
			return ev.returnValue = 'Are you sure you want to closeeeeee?';
		});
		var peer = new Peer(roomID);
		peer.on('open', (id) => {
			console.log("Peer Connected with ID: ", id)
			navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
				local_stream = stream;
				let video = document.getElementById("local-video");
				video.srcObject = stream;
				video.muted = true;
				video.play();
			})
			peer.on('call', (call) => {
				console.log(call.metadata.userEmail, call.metadata.userFullname)
				call.answer(local_stream);
				let count = 0;
				call.on('stream', (stream) => {
					count++;
					if (count === 2)
						return;
					createRemoteVideoWindow(stream);
				})
			})

		})
	}, []);

	return (
		<div>
			<video id="local-video"></video>
			<div id="remote-video"></div>
			<button onClick={() => changeLocalVideoState()}>video state</button>
			<button onClick={() => changeLocalAudioState()}>audio</button>
		</div>
	);
}

export default Invigilate;