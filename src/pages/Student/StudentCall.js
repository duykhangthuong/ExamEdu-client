import Peer from "peerjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const StudentCall = () => {
    const roomID = "test";
    const user = useSelector((state) => state.user);
    var local_stream;

    const changeLocalVideoState = () => {
        local_stream.getVideoTracks()[0].enabled = !local_stream.getVideoTracks()[0].enabled;
        console.log(user)
    }
    const changeLocalAudioState = () => {
        local_stream.getAudioTracks()[0].enabled = !local_stream.getAudioTracks()[0].enabled;
    }

    var peer = new Peer();
    peer.on('open', (id) => {
        console.log("Connected with Id: " + id)
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            let video = document.getElementById("local-video");
            local_stream = stream;
            video.srcObject = stream;
            video.muted = true;
            video.play();
            let call = peer.call(roomID, stream, {
                 metadata: { userEmail: user.email,
                            userFullname: user.fullname } });
            let count = 0;
            call.on('stream', (stream) => {
                count++;
                if (count === 2)
                    return;
                let video = document.createElement('video');
                const remoteVideos = document.getElementById('remote-video');
                video.srcObject = stream;
                remoteVideos.append(video)
                video.play();
            })
        })

    })

    useEffect(() => {
        window.addEventListener("beforeunload", (ev) => {
            ev.preventDefault();
            return ev.returnValue = 'Are you sure you want to close?';
        });
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

export default StudentCall;