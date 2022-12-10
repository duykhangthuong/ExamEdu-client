import { HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { API, HUB } from "utilities/constants";
import { useLazyFetch, useFetch } from "utilities/useFetch";
import styles from "../../styles/PrejoinRoom.module.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Wrapper from "components/Wrapper";
import Heading from "components/Heading";
const PrejoinRoom = () => {
    const [headers, setHeaders] = useState();

    const checkSEB = useFetch(
        `${API}/exam/SEB`,
        {
            onCompletes: (data) => {
                setHeaders(data["User-Agent"].toString());
            }
        }
    );
    const user = useSelector((state) => state.user);
    const param = useParams();
    const examId = param.examId;
    const local_stream = useRef();
    const history = useHistory();
    const [roomID, setRoomID] = useState("");
    const [connection, setConnection] = useState(null);
    const [fetchRoomId, fetchRoomIdResult] = useLazyFetch(
        `${API}/invigilate/roomId/${examId}`,
        {
            onCompletes: (data) => {
                setRoomID(data.roomId);

            }
        }
    );

    const [updateMaxTime, updateMaxTimeResult] = useLazyFetch(`${API}/exam/maxFinishTime?examId=${examId}&studentId=${user.accountId}`,
        {
            method: "PUT"
        }
    );

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                local_stream.current = stream;
                // console.log(stream);
                let video = document.getElementById("local-video");
                try {
                    video.srcObject = local_stream.current;
                    video.muted = true;
                    video.play();
                } catch (error) { }
            });
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
                    connection.send("CreateName", `${examId}`);
                    connection.on("ForceJoinRoom", () => {
                        //doan nay dung de force join room
                        joinRoom(); //(truong hop no vo prejoin room truoc luc giang vien start room)
                    }); //khi giang vien start nhung nguoi o prejoin room se duoc auto join room (khong can ngoi canh)
                })
                .catch((error) => console.log(error));
        }
    }, [connection]);
    const joinRoom = () => {
        history.push(`/exam/${examId}`); //nho doi link nay
        updateMaxTime();
    };

    if (headers !== undefined && !headers.includes("SEB")) {
        return <Wrapper className="d-flex justify-content-center align-items-center">
            <div className={styles.notification_box}>
                <Heading size="3">
                    Please use Safe Exam Browser to take exam
                </Heading>
            </div>
        </Wrapper>
    }

    return (
        <div
            className={`${styles.container} d-flex flex-column flex-md-row justify-content-center align-items-center `}
        >
            <div className={styles.videoContainer}>
                <video
                    id="local-video"
                    ref={local_stream}
                    autoPlay
                    className={styles.mainVideo}
                ></video>
            </div>
            {/* cái check này tao biến thành cái component riêng ở dưới đó, có gì đổi tên lại dùm */}
            <Check roomID={roomID} updateMaxTime={updateMaxTime} />
        </div>
    );
};

export default PrejoinRoom;

const Check = ({ roomID,updateMaxTime }) => {
    const param = useParams();
    const examId = param.examId;
    const history = useHistory();
    const joinRoom = () => {
        history.push(`/exam/${examId}`); //nho doi link nay
        updateMaxTime();
    };
    return (
        <div>
            {roomID != null && roomID != "" ? (
                <div className="d-flex flex-column justify-content-center">
                    <h2 className={styles.readyText}>Ready to join?</h2>
                    <button
                        onClick={() => joinRoom()}
                        className={styles.joinButton}
                    >
                        <span className={styles.Button_inner}>Join room</span>
                    </button>
                </div>
            ) : (
                <h5>
                    Room is not available, when room is available system will
                    let you in
                </h5>
            )}
        </div>
    );
};
