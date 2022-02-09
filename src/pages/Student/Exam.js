import Wrapper from "../../components/Wrapper";
import styles from "../../styles/Exam.module.css";
import Icon from "components/Icon";
import { useState, useEffect } from "react";
// import Button from "../../components/Button";

function ExamHeader() {
    // const [timeLeft, setTimeLeft] = useState(10);
    // useEffect(() => {
    //     var timerId = setTimeout(() => {
    //         setTimeLeft((prev) => {
    //             return prev > 0 ? prev - 1 : 0;
    //         });
    //     }, 1000);
    //     if (timeLeft === 0) {
    //         clearTimeout(timerId);
    //     }
    //     //clean up function de clear
    //     return () => {
    //         clearTimeout(timerId);
    //     };
    // }, [timeLeft]);
    // if (timeLeft === 0) {
    //     console.log("Time up");
    // }
    // const {initialMinute = 0,initialSeconds = 0} = props;
    const [minutes, setMinutes] = useState(1);
    const [seconds, setSeconds] = useState(30);
    useEffect(() => {
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(myInterval);
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            }
        }, 1000);
        return () => {
            clearInterval(myInterval);
        };
    });
    return (
        <header
            className={`d-md-flex justify-content-md-between ${styles.exam_header}`}
        >
            <div>
                <div className={`${styles.exam_name}`}>
                    <b>Progress Test</b>
                </div>
                <div className={`${styles.exam_module}`}>SWD221</div>
            </div>
            <div>
                {minutes === 0 && seconds === 0 ? null : (
                    <h1>
                        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                    </h1>
                )}
            </div>
        </header>
    );
}
function Exam() {
    return (
        <div className={`${styles.wrapper}`}>
            <ExamHeader />

            <Wrapper className="justify-content-center">
                <div className={styles.page_container}>
                    <form>
                        <div className={`${styles.exam_question}`}>
                            <div>Question 1</div>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut
                                enim ad minim veniam, quis nostrud exercitation
                                ullamco laboris nisi ut aliquip ex ea commodo
                                consequat
                            </p>
                            {/* <img src="https://i.ibb.co/kScwdKg/L0-5-1.png" alt="L0-5-1" border="0" style={{width: "25vw"}}></img> */}
                            {/* Horizontal line */}
                            <div
                                className={`${styles.horizontal_line} mb-2`}
                            ></div>
                            <div>
                                <div className={`${styles.answer_option}`}>
                                    <input
                                        type="radio"
                                        id="html"
                                        name="fav_language"
                                        value="HTML"
                                    />
                                      <label for="html">HTML</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        id="html"
                                        name="fav_language"
                                        value="HTML"
                                    />
                                      <label for="html">HTML</label>
                                </div>
                            </div>
                        </div>
                        <footer
                            className={`d-md-flex justify-content-md-between ${styles.exam_footer}`}
                        >
                            <div className="d-flex justify-content-between">
                                <button
                                    className={`shadow-light ${styles.btn_gray}`}
                                >
                                    <Icon
                                        icon="arrow-circle-left"
                                        className="me-2"
                                    ></Icon>
                                    Previous
                                </button>
                                <button
                                    className={`shadow-light ${styles.btn_gray}`}
                                >
                                    Next
                                    <Icon
                                        icon="arrow-circle-right"
                                        className="ms-2"
                                    ></Icon>
                                </button>
                            </div>
                            <div
                                className={`d-md-flex justify-content-md-between ${styles.btn_finish_wrapper}`}
                            >
                                <div
                                // className={`${styles.btn_finish_wrapper}`}
                                >
                                    <button
                                        className={`shadow-light ${styles.btn_gray}`}
                                    >
                                        Review later
                                    </button>
                                </div>
                                <div
                                // className={`${styles.btn_finish_wrapper}`}
                                >
                                    <button className={`${styles.btn_finish}`}>
                                        Finish
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </form>
                </div>
            </Wrapper>
        </div>
    );
}
export default Exam;
