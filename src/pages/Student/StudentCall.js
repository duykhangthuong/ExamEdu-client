import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { API, HUB } from "utilities/constants";
import { useLazyFetch } from "utilities/useFetch";
import style from "styles/StudentCall.module.css";
import { HubConnectionBuilder } from "@microsoft/signalr";
import Button from "components/Button";
const StudentCall = ({ examId }) => {
    const user = useSelector((state) => state.user);
    const [videoState, setVideoState] = useState(true);
    const [audioState, setAudioState] = useState(true);
    const [connection, setConnection] = useState(null);
    const local_stream = useRef();
    const [fetchSate, setFetchSate] = useState(false);
    const [AISuccessState, setAISuccessState] = useState(false);
    const width = 384;
    const height = 288;
    const changeLocalVideoState = () => {
        local_stream.current.getVideoTracks()[0].enabled =
            !local_stream.current.getVideoTracks()[0].enabled;
        setVideoState(local_stream.current.getVideoTracks()[0].enabled);
    };
    const changeLocalAudioState = () => {
        local_stream.current.getAudioTracks()[0].enabled =
            !local_stream.current.getAudioTracks()[0].enabled;
        setAudioState(local_stream.current.getAudioTracks()[0].enabled);
    };

    const [fetchRoomId, fetchRoomIdResult] = useLazyFetch(
        `${API}/invigilate/roomId/${examId}`,
        {
            method: "GET",
            onCompletes: (data) => {
                setFetchSate(true);
            }
        }
    );

    const [studentDisconnect, studentDisconnectResponse] = useLazyFetch(
        `${API}/invigilate/studentDisconnect`,
        {
            method: "POST",
            body: {
                ExamId: examId,
                RoomId: user.email
            }
        }
    );

    const [studentCheatingNotify, studentCheatingNotifyResponse] = useLazyFetch(
        `${API}/invigilate/studentCheatingNotify`,
        {
            method: "POST",
            body: {
                ExamId: examId,
                RoomId: user.email
            }
        }
    );

    const connectVideo = (roomId) => {
        var peer = new Peer();
        peer.on("open", (id) => {
            console.log("Connected with Id: " + id);
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    let video = document.getElementById("local-video");
                    local_stream.current = stream;
                    video.srcObject = stream;
                    video.muted = true;
                    video.play();
                    let call = peer.call(roomId, stream, {
                        metadata: {
                            userEmail: user.email,
                            userFullname: user.fullname,
                            userRole: user.role
                        }
                    });
                    let count = 0;
                    call.on("stream", (stream) => {
                        count++;
                        if (count === 2) return;
                        try {
                            let video = document.getElementById("remote-video"); //Khong xai dom thi cai video no bi chop chop (flickering)
                            video.srcObject = stream;
                            video.play();
                        } catch (error) {}
                    });
                });
        });
        window.addEventListener("beforeunload", (ev) => {
            studentDisconnect(); //nho bo commet cai nay
            peer.destroy();
            ev.preventDefault();
            return (ev.returnValue = "Are you sure you want to close?");
        });
    };

    //LINK AI
    const [fetchAI, fetchAIResult] = useLazyFetch(
        `https://ml-api-cheatingdetector.herokuapp.com/predict/`
    );
    const captureVideo = () => {
        let canvas = document.querySelector("#canvas");
        let video = document.querySelector("#local-video");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(video, 0, 0, width, height);
        canvas.toBlob(function (blob) {
            const formData = new FormData();
            formData.append("file", blob);

            fetchAI("", {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                method: "POST",
                body: formData,
                onCompletes: (data) => {
                    console.log(data);
                    // setAISuccessState(!AISuccessState);
                    if (data !== undefined) {
                        if (data.isNotCheating === 0) {
                            console.log("STUDENT CHEATING!");
                            studentCheatingNotify();
                        }
                    }
                }
            });
        });

        // let image_data_url = canvas.toDataURL("image/jpeg");
        // // data url of the image
        // console.log(image_data_url);
    };

    //Capture video of student every 3 seconds
    useEffect(() => {
        const timerId = setInterval(() => {
            captureVideo();
        }, 3000);

        return () => clearInterval(timerId);
    }, []);

    // useEffect(() => {
    //     if (fetchAIResult.data !== undefined) {
    //         if (fetchAIResult.data.isNotCheating === 0) {
    //             studentCheatingNotify();
    //         }
    //     }
    // }, [AISuccessState]);

    useEffect(() => {
        fetchRoomId();
        const newConnection = new HubConnectionBuilder()
            .withUrl(`${HUB}/notification`)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    // Define User
                    connection.send("CreateName", `student${examId}`);
                    connection.on("restartConnection", (roomId) => {
                        connectVideo(roomId);
                    });
                })
                .catch((error) => console.log(error));
        }
    }, [connection]);

    useEffect(() => {
        if (fetchRoomIdResult.data != undefined) {
            connectVideo(fetchRoomIdResult.data.roomId);
        }
    }, [fetchSate]);

    return (
        <div>
            <video id="local-video" className={`${style.local_video}`}></video>
            <video
                id="remote-video"
                className={`${style.remote_video}`}
                autoPlay
            ></video>

            {/* <Button
                onClick={() => {
                    captureVideo();
                }}
            >
                Capture Video
            </Button> */}
            <canvas
                id="canvas"
                width="384"
                height="288"
                style={{ display: "none" }}
            ></canvas>

            <div
                className={`${style.buttons_group} d-flex justify-content-center`}
            >
                {/* /* Button Micro */}
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
};

export default StudentCall;
