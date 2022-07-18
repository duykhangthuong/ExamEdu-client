import CallWindow from "components/CallWindow";
import { HubConnectionBuilder } from "@microsoft/signalr";
import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLazyFetch } from "utilities/useFetch";
import { API, HUB } from "utilities/constants";
import style from "styles/Invigilate.module.css";

const Invigilate = () => {
    const examId = 34;
    const local_stream = useRef();
    const remoteStreamList = useRef([]);
    const user = useSelector((state) => state.user);
    const [fetchSate, setFetchSate] = useState(false);
    const [connection, setConnection] = useState(null);
    const [forceRender, setForceRender] = useState(1);
    const [videoState, setVideoState] = useState(true);
    const [audioState, setAudioState] = useState(true);
    const [numberOfGridColumn, setNumberOfGridColumn] = useState(1);
    const [createRoomId, createRoomIdResponse] = useLazyFetch(
        `${API}/invigilate/GenerateRoomId`,
        {
            method: "POST",
            body: {
                ExamId: examId,
                RoomId: ""
            },
            onCompletes: () => {
                fetchRoomId();
            },
            onError: (error) => {
                fetchRoomId();
            }
        }
    );
    const [startRoom, startRoomResponse] = useLazyFetch(
        `${API}/invigilate/startRoom`,
        {
            method: "POST",
            body: {
                ExamId: examId,
                RoomId: ""
            }
        }
    );
    const [fetchRoomId, fetchRoomIdResult] = useLazyFetch(
        `${API}/invigilate/roomId/${examId}`,
        {
            method: "GET",
            onCompletes: (data) => {
                setFetchSate(true);
            }
        }
    );
    const [fetchCheatingTypeList, fetchCheatingTypeListResponse] = useLazyFetch(
        `${API}/Cheat/CheatingTypeList`,
        {
            method: "GET"
        }
    );

    const notifyLeaveRoom = (email) => {
        console.log(email + "Have leave room");
    };

    useEffect(() => {
        window.addEventListener("beforeunload", (ev) => {
            ev.preventDefault();
            return (ev.returnValue = "Are you sure you want to closeeeeee?");
        });

        const newConnection = new HubConnectionBuilder()
            .withUrl(`${HUB}/notification`)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
        fetchCheatingTypeList();
        createRoomId();
    }, []);

    useEffect(() => {
        if (connection) {
            connection
                .start()
                .then(() => {
                    // Define User
                    connection.send("CreateName", `teacher${examId}`);
                    connection.on("StudentDisconnect", (email) => {
                        console.log(email);
                        remoteStreamList.current =
                            remoteStreamList.current.filter((item) => {
                                return item.userEmail !== email;
                            });
                        notifyLeaveRoom(email); //nho custom ham nay cho thanh cai hop thong bao
                        setForceRender(Math.random());
                    });
                })
                .catch((error) => console.log(error));
        }
    }, [connection]);

    useEffect(() => {
        if (fetchRoomIdResult.data != undefined) {
            var peer = new Peer(fetchRoomIdResult.data.roomId);
            console.log(fetchRoomIdResult);
            peer.on("open", (id) => {
                console.log("Peer Connected with ID: ", id);
                navigator.mediaDevices
                    .getUserMedia({ video: true, audio: true })
                    .then((stream) => {
                        local_stream.current = stream;
                        let video = document.getElementById("local-video");
                        video.srcObject = stream;
                        video.muted = true;
                        video.play();
                    });
                peer.on("call", (call) => {
                    call.answer(local_stream.current, {
                        metadata: {
                            userEmail: user.email,
                            userRole: user.role
                        }
                    });
                    let count = 0;

                    call.on("stream", (stream) => {
                        count++;
                        if (count === 2) return;

                        remoteStreamList.current = [
                            ...remoteStreamList.current,
                            {
                                stream: stream,
                                userEmail: call.metadata.userEmail
                            }
                        ];
                        if (remoteStreamList.current.length <= 4) {
                            setNumberOfGridColumn(
                                remoteStreamList.current.length
                            );
                        }
                        setForceRender(Math.random()); //dung de force rerender
                    });
                });
            });
        }
    }, [fetchSate]);

    //var remoteStreamTemp;

    const changeLocalVideoState = () => {
        local_stream.current.getVideoTracks()[0].enabled =
            !local_stream.current.getVideoTracks()[0].enabled;
        setVideoState(local_stream.current.getVideoTracks()[0].enabled);
        console.log(remoteStreamList.current.length);
    };
    const changeLocalAudioState = () => {
        local_stream.current.getAudioTracks()[0].enabled =
            !local_stream.current.getAudioTracks()[0].enabled;
        setAudioState(local_stream.current.getAudioTracks()[0].enabled);
    };

    return (
        <div>
            <div
                className={`${style.all_videos_container}`}
                style={{
                    gridTemplateColumns: `repeat(${numberOfGridColumn}, minmax(250px, 60vw))`
                }}
            >
                {remoteStreamList.current.map((stream, index) => {
                    return (
                        <div key={index}>
                            <CallWindow
                                stream={stream.stream}
                                userEmail={stream.userEmail}
                                index={index}
                                cheatingTypeList={
                                    fetchCheatingTypeListResponse.data
                                }
                                examId={examId}
                            />
                        </div>
                    );
                })}
            </div>

            <div className={`${style.local_window}`}>
                {/* Video Webcam */}
                <video id="local-video" className={style.video_proctor}></video>

                <div
                    className={`${style.buttons_group} d-flex justify-content-evenly`}
                >
                    {/* Button Micro */}
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
                    {/* Button Start Room */}
                    <button
                        onClick={() => startRoom()}
                        className={style.button_start}
                    >
                        Start Room
                    </button>
                </div>
                {/* Button Grid */}
                <input
                    type="range"
                    className={`form-range ${style.slide_range}`}
                    min="1"
                    max="5"
                    defaultValue={
                        numberOfGridColumn > 4 ? 4 : numberOfGridColumn
                    }
                    id="customRange2"
                    // onChange={(e) => setNumberOfGridColumn(e.target.value)}
                    onMouseUp={(e) => setNumberOfGridColumn(e.target.value)}
                />
            </div>

            <h5 style={{ display: "none" }}>{forceRender}</h5>
        </div>
    );
};

export default Invigilate;
