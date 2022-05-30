import hark from "hark";
import React, { useState } from "react";

const CallWindow = ({ stream, userFullname, userEmail }) => {

    const [isSpeaking, setIsSpeaking] = useState(false);
    
    var speech = hark(stream);
    speech.on('speaking', function () {
        setIsSpeaking(true);
    });
    speech.on('stopped_speaking', function () {
        setIsSpeaking(false);
    });

    return (
        <div style={isSpeaking ? {border : "solid"} : {}}>
            <div>{userFullname}</div>
            <div>{userEmail}</div>
            <video style={{ height: "30vh" }} ref={video => {
                try {
                    video.srcObject = stream;
                } catch (error) {

                }
            }} autoPlay></video>
            <button onClick={() =>
                stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled}
            >mute this student</button> {/*mute nguoi khac (nhu nut tat am tren meet ay)*/}
            {isSpeaking && <div>speaking</div>} {/*Dung is speaking de style tuy y luc cua so dang co am thanh*/}
            <hr></hr>
        </div>
    )

}

export default CallWindow;