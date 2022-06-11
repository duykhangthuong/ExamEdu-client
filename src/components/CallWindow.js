import hark from "hark";
import React, { useEffect, useState } from "react";
import style from "styles/CallWindow.module.css";

const CallWindow = ({ stream, userEmail, index }) => {

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [audioState, setAudioState] = useState(true);
    var speech = hark(stream);
    speech.on('speaking', function () {
        setIsSpeaking(true);
    });
    speech.on('stopped_speaking', function () {
        setIsSpeaking(false);
    });

    useEffect(() => {
        try {
            let video = document.getElementById("video" + index); //Khong xai dom thi cai video no bi chop chop (flickering)
            video.srcObject = stream;
            video.play();
        } catch (error) {

        }
    }, []);

    // useEffect(() => {
    //     let windowWrapper = document.getElementById("windowWrapper" + index);
    //     switch (size) {
    //         case 1:
    //             windowWrapper.className = `${style.wrapper_1} + ${style.wrapper_general}`;
    //             break;
    //         case 2:
    //             windowWrapper.className = `${style.wrapper_2} + ${style.wrapper_general}`;
    //             break;
    //         case 3:
    //             windowWrapper.className = `${style.wrapper_3} + ${style.wrapper_general}`;
    //             break;
    //         case 4: case 5: case 6:
    //             windowWrapper.className = `${style.wrapper_4} + ${style.wrapper_general}`;
    //             break;
    //         default:
    //             windowWrapper.className = `${style.wrapper_9} + ${style.wrapper_general}`;
    //             break;
    //     }
    // }, [size]);

    const changeLocalAudioState = () => {
        stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
        setAudioState(stream.getAudioTracks()[0].enabled);
    }
    return (
        <div
            style={isSpeaking ? { border: "solid red" } : {}}
            className={`${style.wrapper_general}`}> {/* nho style lai cai nay, t de style vay cho de hieu thoi */}
            <div className={`${style.infor_wrapper}`}>
                <div className={`${style.content_name}`}>{userEmail}</div>
                <div className={`${style.media_button}`}
                    data-toggle="tooltip" data-placement="bottom" title="Mark this student as cheating">
                    <i className={`bi bi-bookmark-x-fill`}></i>
                </div>
                <div className={audioState
                    ? `${style.media_button}`
                    : `${style.media_button_off}`}
                    onClick={() => { changeLocalAudioState() }}>
                    <i className={audioState
                        ? `bi bi-mic-fill ${style.media_icon}`
                        : `bi bi-mic-mute-fill ${style.media_icon}`}></i>
                </div>
            </div>
            <video id={"video" + index} className={`${style.video_style}`} autoPlay></video>
        </div>
    )

}

export default CallWindow;