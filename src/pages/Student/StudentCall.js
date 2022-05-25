import Peer from "peerjs";

const StudentCall = () => {

    const roomID = "test";

    var peer = new Peer();
    peer.on('open', (id) => {
        console.log("Connected with Id: " + id)
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            let video = document.getElementById("local-video");
            video.srcObject = stream;
            video.muted = true;
            video.play();
            let call = peer.call(roomID, stream)
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

    return (
        <div>
            <video id="local-video"></video>
            <div id="remote-video"></div>
        </div>
    );
}

export default StudentCall;