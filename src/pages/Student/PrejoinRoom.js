import { HubConnectionBuilder } from "@microsoft/signalr";
import Wrapper from "components/Wrapper";
import Loading from "pages/Loading";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { API, HUB } from "utilities/constants";
import { useLazyFetch } from "utilities/useFetch";
import styles from "../../styles/PrejoinRoom.module.css";
import { useParams } from "react-router-dom";
const PrejoinRoom = () => {
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
                } catch (error) {}
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
    };

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
            <Check roomID={roomID} />
        </div>
    );
};

export default PrejoinRoom;

const Check = ({ roomID }) => {
    const param = useParams();
    const examId = param.examId;
    const history = useHistory();
    const joinRoom = () => {
        history.push(`/exam/${examId}`); //nho doi link nay
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
