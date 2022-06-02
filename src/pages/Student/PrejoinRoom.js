import { HubConnectionBuilder } from "@microsoft/signalr";
import Loading from "pages/Loading";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { API } from "utilities/constants";
import { useLazyFetch } from "utilities/useFetch";


const PrejoinRoom = () => {
    const examId = 1;
    const local_stream = useRef();
    const history = useHistory();
    const [rommID, setRoomID] = useState("");
    const [connection, setConnection] = useState(null);
    const [fetchRoomId, fetchRoomIdResult] = useLazyFetch(
        `${API}/invigilate/roomId/${examId}`, {
        onCompletes: (data) => {
            setRoomID(data.roomId);
        }
    });

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            local_stream.current = stream;
            console.log(stream)
            let video = document.getElementById("local-video");
            try {
                video.srcObject = local_stream.current;
                video.muted = true;
                video.play();
            } catch (error) {

            }
        })
        fetchRoomId();
        const newConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:5001/hubs/notification")
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
                    connection.send(
                        "CreateName",
                        `${examId}`
                    );
                    connection.on("ForceJoinRoom", () => { //doan nay dung de force join room 
                        joinRoom();                        //(truong hop no vo prejoin room truoc luc giang vien start room)
                    });                                    //khi giang vien start nhung nguoi o prejoin room se duoc auto join room (khong can ngoi canh)
                })
                .catch((error) => console.log(error));
        }
    }, [connection]);

    const joinRoom = () => {
        history.push('/student'); //nho doi link nay
    }


    return (
        <div>
            <h1>PrejoinRoom</h1>
            <video id="local-video" style={{ height: "30vh" }}></video>
            {
                (rommID != null && rommID != '')
                    ? <div>
                        <h5>room is available to join</h5>
                        <button onClick={() => joinRoom()}>join room</button>
                    </div>
                    : <h5>Room is not available, when room is available system will let you in </h5>
            }
        </div>
    )
}

export default PrejoinRoom;