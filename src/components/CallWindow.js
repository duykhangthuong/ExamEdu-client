import hark from "hark";
import React, { useEffect, useState } from "react";

const CallWindow = ({ stream, userFullname, userEmail, index }) => {

    const [isSpeaking, setIsSpeaking] = useState(false);
    
    var speech = hark(stream);
    speech.on('speaking', function () {
        setIsSpeaking(true);
    });
    speech.on('stopped_speaking', function () {
        setIsSpeaking(false);
    });

    useEffect(() => {
        try {
            let video = document.getElementById("video"+index); //Khong xai dom thi cai video no bi chop chop (flickering)
            video.srcObject = stream;
            video.play();
        } catch (error) {
            
        }
    },[]);

    return (
        <div style={ isSpeaking ? {border : "solid red"} : {border : "solid black"}}> {/* nho style lai cai nay, t de style vay cho de hieu thoi */}
            <div>{userFullname}</div>
            <div>{userEmail}</div>
            <video style={{ height: "30vh" }} id={"video"+index} autoPlay></video>
            <button onClick={() =>
                stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled}
            >mute this student</button> {/*mute nguoi khac (nhu nut tat am tren meet ay)*/}
        </div>
    )

}

export default CallWindow;