import hark from "hark";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import style from "styles/CallWindow.module.css";
import Swal from "sweetalert2";
import { API, REQUIRED, HUB } from "utilities/constants";
import { useLazyFetch } from "utilities/useFetch";
import { useForm } from "utilities/useForm";
import ValidateMessage from "./ValidateMessage";
import Pill from "components/Pill";
import { HubConnectionBuilder } from "@microsoft/signalr";

<<<<<<< HEAD
const CallWindow = ({ stream, userEmail, index, examId, cheatingTypeList }) => {
=======
const CallWindow = ({
    stream,
    userEmail,
    index,
    examId,
    cheatingTypeList
}) => {
>>>>>>> 1c81094116f8c94bd43edf8ca2e22f71594943bb
    const [connection, setConnection] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [audioState, setAudioState] = useState(true);
    const [isWarning, setIsWarning] = useState(false);
    const [isOpenReportForm, setIsOpenReportForm] = useState(false); //Modal boostrap state
    const { values, onChange, onSubmit, errors } = useForm(
        form,
        sendCheatingReport
    );
    const [postCheatingReport, { postCheatingReportloading }] = useLazyFetch(
        `${API}/Cheat/StudentCheating`,
        {
            method: "POST",
            body: {
                ExamId: examId,
                StudentEmail: userEmail,
                Time: new Date(),
                Comment: values.comment,
                IsComfirmed: false,
                CheatingTypeId: values.cheatingType
            },
            onCompletes: () => {
                Swal.fire("Success", "Report success", "success");
                hideReportForm();
            },
            onError: (error) => {
                Swal.fire("Error", error.message, "error");
            }
        }
    );

    var speech = hark(stream);
    speech.on("speaking", function () {
        setIsSpeaking(true);
    });
    speech.on("stopped_speaking", function () {
        setIsSpeaking(false);
    });

    useEffect(() => {
        try {
            let video = document.getElementById("video" + index); //Khong xai dom thi cai video no bi chop chop (flickering)
            video.srcObject = stream;
            video.play();
        } catch (error) {}
    }, []);

    function sendCheatingReport() {
        postCheatingReport();
    }

    const showReportForm = () => {
        setIsOpenReportForm(true);
    };

    const hideReportForm = () => {
        setIsOpenReportForm(false);
    };

    const changeLocalAudioState = () => {
        stream.getAudioTracks()[0].enabled =
            !stream.getAudioTracks()[0].enabled;
        setAudioState(stream.getAudioTracks()[0].enabled);
    };

    useEffect(() => {
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
                    connection.send("CreateName", `teacher${examId}`);
                    connection.on("StudentCheatingNotify", (email) => {
                        setIsWarning(userEmail === email);
                        console.log("Cheating email: ", email);
                    });
                })
                .catch((error) => console.log(error));
        }
    }, [connection]);

    return (
        <>
            <div
                style={isSpeaking ? { border: "solid 3px #0044ff" } : {}}
                className={`${style.wrapper_general}`}
            >
                <Pill
                    content="CHEATING WARNING"
                    className={
                        `${style.warning_pill_style} 
                        ${isWarning == true
                            ? `${style.cheating_warning} mx-3 p-2`
                            : `${style.hide_cheating_warning}`}
                        `
                    }
                    onClick={() => {
                        setIsWarning(false);
                    }}
                    defaultColor="red"
                />

                {/* nho style lai cai nay, t de style vay cho de hieu thoi */}
                <div className={`${style.infor_wrapper} d-flex`}>
                    <div className={`${style.content_name} me-auto`}>
                        {userEmail}
                    </div>
<<<<<<< HEAD
=======
                    <Pill
                        content="CHEATING WARNING"
                        className={
                            isWarning == true
                                ? `${style.cheating_warning} mx-3 p-2`
                                : `${style.hide_cheating_warning}`
                        }
                        onClick={() => {
                            setIsWarning(false);
                        }}
                        defaultColor="red"
                    />
>>>>>>> 1c81094116f8c94bd43edf8ca2e22f71594943bb

                    <div
                        className={`${style.media_button} me-2`}
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Mark this student as cheating"
                        onClick={showReportForm}
                    >
                        <i className={`bi bi-bookmark-x-fill`}></i>
                    </div>

                    <div
                        className={
                            audioState
                                ? `${style.media_button}`
                                : `${style.media_button_off}`
                        }
                        onClick={() => {
                            changeLocalAudioState();
                        }}
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title="Mute this student"
                    >
                        <i
                            className={
                                audioState
                                    ? `bi bi-mic-fill ${style.media_icon}`
                                    : `bi bi-mic-mute-fill ${style.media_icon}`
                            }
                        ></i>
                    </div>
                </div>
                <video
                    id={"video" + index}
                    className={`${style.video_style}`}
                    autoPlay
                ></video>
            </div>
            <Modal
                show={isOpenReportForm}
                onHide={hideReportForm}
                className="d-flex justify-content-center align-items-center"
                size="lg"
            >
                <Modal.Header>
                    <Modal.Title>Report {userEmail}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={onSubmit}>
                        <label>Cheating type</label>
                        <select
                            className="form-select"
                            onChange={onChange}
                            value={values.cheatingType}
                            id="cheatingType"
                        >
                            {cheatingTypeList?.map((cheatingType, index) => {
                                return (
                                    <option
                                        key={index}
                                        value={cheatingType.cheatingTypeId}
                                    >
                                        {cheatingType.cheatingTypeName}
                                    </option>
                                );
                            })}
                        </select>
                        {errors.cheatingType && (
                            <ValidateMessage message={errors.cheatingType} />
                        )}
                        <div className="form-group">
                            <label>Comment</label>
                            <input
                                type={"text"}
                                className="form-control"
                                onChange={onChange}
                                value={values.comment}
                                placeholder="Leave a comment"
                                id="comment"
                            />
                            {errors.comment && (
                                <ValidateMessage message={errors.comment} />
                            )}
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-danger" onClick={hideReportForm}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => sendCheatingReport()}
                    >
                        {postCheatingReportloading && (
                            <div
                                className="spinner-border text-light me-3"
                                role="status"
                            ></div>
                        )}
                        {!postCheatingReportloading && "Send"}
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CallWindow;
const form = {
    cheatingType: {
        validate: REQUIRED,
        message: "Please select cheating type"
    },
    comment: {
        validate: REQUIRED,
        message: "Please enter comment"
    }
};
