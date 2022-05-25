import Peer from "peerjs";

const Invigilate = () => {

    const roomID = "test";
    var local_stream;
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
          call.answer(local_stream);
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

export default Invigilate;