import OurModal from "components/OurModal";

import styles from "../../styles/Exam.module.css";
import Icon from "components/Icon";
import { useState, useEffect } from "react";
import { useRef } from "react";
import useOutsideClick from "utilities/useOutsideClick";

//Exam header include Exam name, module and time
function ExamHeader() {
    const [minutes, setMinutes] = useState(120);
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
                {/* Exam Name */}
                <div className={`fs-4`}>
                    <b>Progress Test</b>
                </div>
                {/* Exam module */}
                <div className={`fs-6`}>SWD221</div>
            </div>

            {/* Exam time left */}
            <div className="me-md-5 d-md-flex align-items-center">
                {/* <Icon icon="clock" className="me-2"></Icon> */}
                {minutes === 0 && seconds === 0 ? null : (
                    <span className={`fs-4`}>
                        <Icon
                            icon="clock"
                            className="me-1"
                            color="var(--color-blue)"
                        ></Icon>
                        {minutes}:{seconds < 10 ? `0${seconds}` : seconds} Min
                    </span>
                )}
            </div>
        </header>
    );
}
// Modal to display question number in mobile view
const NumberQuestionModal = ({ children }) => {
    const modalRef = useRef(null);
    const { isClicked, setIsClicked } = useOutsideClick(modalRef);
    return (
        <>
            <Icon
                className={`d-inline d-md-none`}
                id={styles.btnModal}
                icon="bars"
                onClick={setIsClicked}
            />
            <OurModal
                modalRef={modalRef}
                isClicked={isClicked}
                setIsClicked={setIsClicked}
                modalClassName={`d-md-none ${styles.question_modal}`}
            >
                <div>
                    <div className={`text-center ${styles.questionBlock}`}>
                        {/* children is array of number question */}
                        {children}
                    </div>
                    <div>
                        <Icon
                            icon="circle"
                            className="me-3 ms-2"
                            style={{ color: "#7AE765" }}
                        ></Icon>
                        Attempted
                    </div>
                    <div>
                        <Icon
                            icon="circle"
                            className="me-3 ms-2"
                            style={{ color: "var(--color-blue)" }}
                        ></Icon>
                        To be review
                    </div>
                </div>
            </OurModal>
        </>
    );
};

//Question number button
function NumberQuestion({ number, onClick, color }) {
    return (
        <button
            className={`btn btn-secondary ${styles.questionButton}`}
            type="button"
            onClick={onClick}
            style={{ backgroundColor: color }}
        >
            {number}
        </button>
    );
}
const arr = Array.from({ length: 60 }, () => Math.floor(Math.random() * 40)); //mock data for number question

function Exam() {
    console.log("re render");

    const [question, setQuestion] = useState(0);
    const [answerChecked, setAnswerChecked] = useState();
    const [listAnswer, setListAnswer] = useState([]);
    const [essayAnswer, setEssayAnswer] = useState("");
    const addAnswerToList = (answer) => {
        // console.log("Add answer to list");
        let arrId = result[question].answers.map((a) => a.id); //get all answer Id in each question

        if (
            arrId.includes(answer) &&
            !listAnswer.some((r) => arrId.indexOf(r) >= 0)
        ) {
            setListAnswer([...listAnswer, answer]); //If list answer does not have the answer of this question, add answer to list
            // console.log("vo if 1");
            // In case user want to change the answer after choose one
        } else if (!listAnswer.includes(answer) && arrId.includes(answer)) {
            // console.log("vo if 2");
            //If list answer does not have the same input answer of this question
            let previousAnswer = listAnswer.filter((value) =>
                arrId.includes(value)
            );
            // console.log("previous answer: " + previousAnswer);
            // console.log("Replace answer: " + answer);
            // get index of previous answer to replace
            let previousAnswerIndex = listAnswer.indexOf(...previousAnswer);
            listAnswer.splice(previousAnswerIndex, 1, answer);
            // console.log("After: " + listAnswer);
            // console.log("vo if 2");
        }
    };

    console.log(essayAnswer);
    console.log(listAnswer);
    return (
        <div>
            <ExamHeader />
            <NumberQuestionModal>
                {result.map((number, index) => {
                    let answerGetByQuestionNumber = number.answers.map(
                        (a) => a.id
                    ); //get all answer id by this question number
                    let isDone = answerGetByQuestionNumber.includes(
                        listAnswer[index]
                    ); //boolean check nếu list answer có phần tử nằm trong answerGetByQuestionNumber
                    //...(đáp án đã được check, nằm trong list answer)
                    return (
                        <NumberQuestion
                            key={index}
                            number={index + 1}
                            onClick={() => setQuestion(index)}
                            color={isDone ? "#7AE765" : "var(--color-gray)"}
                        />
                    );
                })}
            </NumberQuestionModal>
            <div className={`d-md-flex ${styles.wrapper}`}>
                <div className={`d-none d-md-block ${styles.questionBlock}`}>
                    {result.map((number, index) => {
                        let answerGetByQuestionNumber = number.answers.map(
                            (a) => a.id
                        ); //get all answer id by this question number
                        let isDone = answerGetByQuestionNumber.some(
                            (answer) => listAnswer.indexOf(answer) >= 0
                        ); //boolean check nếu list answer có phần tử nào nằm trong answerGetByQuestionNumber
                        //...(đáp án đã được check, nằm trong list answer)
                        return (
                            <NumberQuestion
                                key={index}
                                number={index + 1}
                                onClick={() => setQuestion(index)}
                                color={isDone ? "#7AE765" : "var(--color-gray)"}
                            />
                        );
                    })}
                    <div>
                        <Icon
                            icon="circle"
                            className="me-4 ms-2"
                            style={{ color: "#7AE765" }}
                        ></Icon>
                        Attempted
                    </div>
                    <div>
                        <Icon
                            icon="circle"
                            className="me-4 ms-2"
                            style={{ color: "var(--color-blue)" }}
                        ></Icon>
                        To be review
                    </div>
                </div>
                <div className={styles.page_container}>
                    <form>
                        <div className={`${styles.exam_question}`}>
                            <div style={{ color: "var(--color-gray)" }}>
                                <b>Question {question + 1}</b>
                            </div>
                            <p>{result[question].questionContent}</p>
                            {/* Image of question */}
                            {result[question].questionImageURL && ( //Check if image url is null, don't render image
                                <img
                                    id={`${styles.imgQuestion}`}
                                    src={result[question].questionImageURL}
                                    alt="L0-5-1"
                                    border="0"
                                />
                            )}
                            {/* Horizontal line */}
                            <div
                                className={`${styles.horizontal_line} mb-2`}
                            ></div>
                            {/* Answer option */}
                            <div>
                                {result[question].answers.length > 1 ? (
                                    result[question].answers.map((answer) => (
                                        <div
                                            className={`${styles.answer_option}`}
                                            key={answer.id}
                                        >
                                            <input
                                                type="radio"
                                                id={answer.id}
                                                checked={listAnswer.includes(
                                                    answer.id
                                                )}
                                                onChange={() => {
                                                    setAnswerChecked(answer.id);
                                                    addAnswerToList(answer.id);
                                                    // changeBackGroundQuestionNumber();
                                                }}
                                                value={answer.id}
                                            />
                                            <label htmlFor={answer.id}>
                                                {answer.answerContent}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <textarea
                                        name="answer"
                                        cols="163"
                                        rows="16"
                                        onChange={(e) =>
                                            setEssayAnswer(e.target.value)
                                        }
                                    ></textarea>
                                )}
                            </div>
                        </div>

                        <footer
                            className={`d-md-flex justify-content-md-between mt-3`}
                        >
                            <div className="d-flex justify-content-between">
                                {/* Button for previous question */}
                                <button
                                    type="button"
                                    disabled={question === 0} //If question is the first one
                                    className={`btn shadow-light ${styles.btn_gray} ${styles.exam_btn}`}
                                    onClick={() => {
                                        setQuestion(question - 1);
                                    }}
                                >
                                    <Icon
                                        icon="arrow-circle-left"
                                        className="me-2"
                                    ></Icon>
                                    Previous
                                </button>
                                {/* Button for next question */}
                                <button
                                    type="button"
                                    disabled={question === result.length - 1} //if question is the last one
                                    className={`btn shadow-light ${styles.btn_gray} ${styles.exam_btn}`}
                                    onClick={() => {
                                        setQuestion(question + 1);
                                    }}
                                >
                                    Next
                                    <Icon
                                        icon="arrow-circle-right"
                                        className="ms-2"
                                    ></Icon>
                                </button>
                            </div>

                            <div
                                className={`d-md-flex justify-content-md-between text-center`}
                            >
                                <div>
                                    {/* Button for review later */}
                                    <button
                                        type="button"
                                        className={`btn shadow-light ${styles.btn_gray} ${styles.exam_btn}`}
                                    >
                                        Review later
                                    </button>
                                </div>
                                <div>
                                    {/* Finish button */}
                                    <button
                                        className={`btn ${styles.btn_finish} ${styles.exam_btn}`}
                                    >
                                        Finish
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </form>
                </div>
            </div>
        </div>
    );
}
const result = [
    {
        questionId: 21,
        questionContent:
            "Which of the following if limitation of Non-buffered Event-Based architecture?",
        questionImageURL: "https://i.ibb.co/kScwdKg/L0-5-1.png",
        answers: [
            {
                id: 1,
                answerContent:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
            },
            {
                id: 2,
                answerContent:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
            },
            {
                id: 3,
                answerContent:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
            },
            {
                id: 4,
                answerContent:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
            },
        ],
    },
    {
        questionId: 47,
        questionContent:
            "Main- subroutine architecture can also be applied in any object-oriented software design",
        questionImageURL: "https://i.ibb.co/3N0f31H/FA-Management.png",
        answers: [
            {
                id: 5,
                answerContent: "True",
            },
            {
                id: 6,
                answerContent: "False",
            },
        ],
    },
    {
        questionId: 34,
        questionContent:
            "Design produces architectures that specify products and components in the form of which of the following",
        questionImageURL: "",
        answers: [
            {
                id: 7,
                answerContent:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
            },
        ],
    },
];
export default Exam;
