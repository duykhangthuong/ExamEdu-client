import Heading from "components/Heading";
import Wrapper from "components/Wrapper";
import Icon from "components/Icon";
import styles from "styles/AddQuestionRequest.module.css";
import Button from "components/Button";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useFetch, useLazyFetch } from "utilities/useFetch";
import { useSelector } from "react-redux";
import { API } from "utilities/constants";
import Loading from "pages/Loading";
function AddQuestionRequest() {
    const user = useSelector((state) => state.user.accountId);
    const fetchModuleResult = useFetch(`${API}/Module/teacher/${user}`);
    const [questionList, setQuestionList] = useState([]);
    const [module, setModule] = useState();
    useEffect(() => {
        setModule(fetchModuleResult.data?.payload[0].moduleId);
    }, [fetchModuleResult.loading]);
    const [isFinalExam, setIsFinalExam] = useState(false);
    const [questionType, setQuestionType] = useState(1);

    const [postData, postDataResult] = useLazyFetch(`${API}/question/request`, {
        method: "POST",
        body: {
            requesterId: user,
            description: "",
            isFinalExam: isFinalExam,
            questions: questionList
        },
        onCompletes: () => {
            Swal.fire("Success", "Add question request created", "success");
            setQuestionList([]);
        },
        onError: (error) => {
            Swal.fire("Error", error.message, "error");
        }
    });

    // console.log("question List: ");
    // console.log(questionList);
    const addNewQuestion = () => {
        if (questionType === 1) {
            setQuestionList([
                ...questionList,
                {
                    questionContent: "",
                    questionTypeId: 1,
                    levelId: 1,
                    moduleId: module,
                    duplicatedQuestion: "",
                    answers: [
                        {
                            answerContent: "",
                            isCorrect: true
                        },
                        {
                            answerContent: "",
                            isCorrect: false
                        }
                    ]
                }
            ]);
        } else {
            setQuestionList([
                ...questionList,
                {
                    questionContent: "",
                    questionTypeId: 2,
                    levelId: 1,
                    moduleId: module,
                    duplicatedQuestion: "",
                    answers: [
                        {
                            answerContent: "",
                            isCorrect: true
                        }
                    ]
                }
            ]);
        }
    };
    const deleteQuestion = (index) => {
        const updateList = questionList.filter((question, i) => index !== i);
        setQuestionList(updateList);
    };
    const addNewAnswer = (index) => {
        let updateList = questionList.map((question, i) => {
            if (index === i) {
                question.answers.push({
                    answerContent: "",
                    isCorrect: false
                });
                return question;
            } else {
                return question;
            }
        });
        setQuestionList(updateList);
    };
    const deleteAnswer = (idxQ, idxA) => {
        const updateList = questionList.map((question, i) => {
            if (idxQ === i) {
                question.answers = question.answers.filter(
                    (ans, i) => idxA !== i
                );
            }
            return question;
        });
        setQuestionList(updateList);
    };
    const addQuestionContentToQuestion = (index, value) => {
        const updateList = questionList.map((question, i) => {
            if (index === i) {
                question.questionContent = value;
            }
            return question;
        });
        setQuestionList(updateList);
    };
    const addAnswerContentToQuestion = (idxQ, idxA, value) => {
        const updateList = questionList.map((question, index) => {
            if (index === idxQ) {
                question.answers.map((ans, i) => {
                    if (idxA === i) {
                        ans.answerContent = value;
                    }
                    return ans;
                });
            }
            return question;
        });
        setQuestionList(updateList);
    };
    const updateModuleQuestion = (moduleId) => {
        moduleId = parseInt(moduleId); //phải parse thành int thì setModule mới set lại cái state là kiểu number
        setModule(moduleId);
        const updateList = questionList.map((question, i) => {
            question.moduleId = moduleId;
            return question;
        });
        setQuestionList(updateList);
    };
    const updateLevelEachQuestion = (index, levelId) => {
        levelId = parseInt(levelId);
        const updateList = questionList.map((question, i) => {
            if (index === i) {
                question.levelId = levelId;
            }
            return question;
        });
        setQuestionList(updateList);
    };
    const updateTrueAnswer = (idxQ, idxA) => {
        const updateList = questionList.map((question, index) => {
            if (index === idxQ) {
                question.answers.map((ans, i) => {
                    if (idxA === i) {
                        ans.isCorrect = true;
                    } else {
                        ans.isCorrect = false;
                    }
                    return ans;
                });
            }
            return question;
        });
        setQuestionList(updateList);
    };
    const checkTrueAnswer = (idxQ, idxA) => {
        return questionList[idxQ].answers[idxA].isCorrect;
    };
    const changeQuestionType = (questionTypeId) => {
        if (questionList.length !== 0) {
            Swal.fire({
                title: "Are you sure?",
                text: "If you change question type, it will delete all the question of previous type. Continue?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e76565",
                cancelButtonColor: "#363940",
                confirmButtonText: "Confirm",
                customClass: {
                    popup: "roundCorner"
                }
            }).then((result) => {
                //nếu người dùng nhấn OK
                if (result.isConfirmed) {
                    setQuestionType(questionTypeId);
                    setQuestionList([]);
                }
            });
        } else {
            setQuestionType(questionTypeId);
        }
    };

    //hàm để hiện lên SweetAlert để hỏi lại khi nhấn submit
    function showModalConfirmSubmit() {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to send the request?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e76565",
            cancelButtonColor: "#363940",
            confirmButtonText: "Confirm",
            customClass: {
                popup: "roundCorner"
            }
        }).then((result) => {
            //nếu người dùng nhấn OK
            if (result.isConfirmed) {
                postData();
                // fetchDataAdd();
            }
        });
    }

    const [fetchDataCheck, fetchResultCheck] = useLazyFetch(
        "http://127.0.0.1:2022/check",
        {
            method: "post",
            body: {
                questions: questionList.map((question) => {
                    return question["questionContent"];
                })
            },
            onError: (error) => {
                Swal.fire("Error", error.message, "error");
            }
        }
    );
    const [fetchDataAdd, fetchResultAdd] = useLazyFetch(
        "http://127.0.0.1:2022/add/question",
        {
            method: "post",
            body: {
                questions: questionList.map((question) => {
                    return question["questionContent"];
                })
            },
            onError: (error) => {
                Swal.fire("Error", error.message, "error");
            }
        }
    );

    useEffect(() => {
        //set question list state but add content to duplicatedQuestion field
        const updateList = questionList.map((question, i) => {
            question.duplicatedQuestion = fetchResultCheck.data?.results[i];
            return question;
        });
        setQuestionList(updateList);

        // console.log(fetchResultCheck.data);
        // console.log("sau khi check");
        // console.log(questionList);
    }, [fetchResultCheck.loading]);

    if (
        fetchModuleResult.loading ||
        postDataResult.loading ||
        fetchResultCheck.loading
    ) {
        return <Loading />;
    }

    return (
        <Wrapper>
            <Heading>Request Add New Question</Heading>
            <div className={`${styles.wrapper}`}>
                <Heading size={2} className={`text-center mb-3`}>
                    New Question
                </Heading>
                <div
                    className={`${styles.totalOption} d-flex justify-content-around`}
                >
                    <div className="text-center">
                        <label htmlFor="questionType">Question Type</label>
                        <select
                            class="w-30 form-select"
                            aria-label="Default select example"
                            id="questionType"
                            // onChange={() =>
                            //     changeQuestionType(
                            //         parseInt(
                            //             document.getElementById("questionType")
                            //                 .value
                            //         )
                            //     )
                            // }
                            onChange={(e) =>
                                changeQuestionType(parseInt(e.target.value))
                            }
                            value={questionType}
                        >
                            <option value={1}>Multiple choice</option>
                            <option value={2}>Text</option>
                        </select>
                    </div>
                    <div className="text-center">
                        <label htmlFor="questionModule">Module</label>
                        <select
                            class="w-35 form-select"
                            aria-label="Default select example"
                            id="questionModule"
                            onChange={(e) =>
                                updateModuleQuestion(e.target.value)
                            }
                        >
                            {fetchModuleResult.data?.payload.map(
                                (module, index) => {
                                    return (
                                        <option
                                            value={module.moduleId}
                                            key={module.moduleId}
                                        >
                                            {module.moduleCode}
                                        </option>
                                    );
                                }
                            )}
                        </select>
                    </div>
                    <div className="text-center">
                        <label htmlFor="bank">Bank</label>
                        <select
                            class="w-30 form-select"
                            aria-label="Default select example"
                            id="bank"
                            onChange={(e) => {
                                const bool_value = e.target.value == "true"; //parse boolean value from option to pass to setIsFinalExam (làm thế setState nó mới nhận là bool)
                                setIsFinalExam(bool_value);
                            }}
                        >
                            <option value={false}>Progress Test</option>
                            <option value={true}>Final exam</option>
                        </select>
                    </div>
                </div>

                {/* Horizontal line */}
                <div className={`${styles.horizontal_line} mb-2`}></div>

                {questionList.map((question, index) => {
                    if (questionType === 1)
                        return (
                            <div key={index}>
                                <div className={`${styles.questionBlock}`}>
                                    <div className="d-flex justify-content-between">
                                        <span className="fw-bold">
                                            Question {index + 1}
                                        </span>
                                        <div className="d-flex">
                                            <select
                                                class="w-13 form-select"
                                                aria-label="Default select example"
                                                id={`question${index}Level`}
                                                value={
                                                    questionList[index].levelId
                                                }
                                                onChange={(e) =>
                                                    updateLevelEachQuestion(
                                                        index,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value={1}>
                                                    Level 1
                                                </option>
                                                <option value={2}>
                                                    Level 2
                                                </option>
                                                <option value={3}>
                                                    Level 3
                                                </option>
                                            </select>
                                            <Button
                                                circle={true}
                                                className="ms-2"
                                                btn="secondary"
                                                onClick={() =>
                                                    deleteQuestion(index)
                                                }
                                            >
                                                <Icon
                                                    onClick={() =>
                                                        deleteQuestion(index)
                                                    }
                                                    icon="trash"
                                                    color="#fff"
                                                    className="fs-5"
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column justify-content-center">
                                        <textarea
                                            value={question.questionContent}
                                            onChange={(e) =>
                                                addQuestionContentToQuestion(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            cols="73"
                                            rows="5"
                                            className="mt-2 p-3 fs-5"
                                        ></textarea>
                                        <div className="text-danger mt-2">
                                            {question.duplicatedQuestion ? (
                                                <>
                                                    <Icon
                                                        icon="exclamation-triangle"
                                                        className="me-2"
                                                    />
                                                    Warning duplicated question:
                                                    <strong>
                                                        {
                                                            question.duplicatedQuestion
                                                        }
                                                    </strong>
                                                </>
                                            ) : (
                                                " "
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        className={`${styles.answerOptionBlock}`}
                                    >
                                        {question.answers.map((ans, i) => {
                                            return (
                                                <div
                                                    className={`${styles.answerOption} d-flex justify-content-between`}
                                                    key={i}
                                                >
                                                    <div className="d-flex align-items-center">
                                                        <input
                                                            class="form-check-input"
                                                            type="radio"
                                                            value={true}
                                                            name={`answerOfQuestion${index}`}
                                                            onChange={() =>
                                                                updateTrueAnswer(
                                                                    index,
                                                                    i
                                                                )
                                                            }
                                                            checked={checkTrueAnswer(
                                                                index,
                                                                i
                                                            )}
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="p-2"
                                                        value={
                                                            ans.answerContent
                                                        }
                                                        onChange={(e) => {
                                                            addAnswerContentToQuestion(
                                                                index,
                                                                i,
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                    <Button
                                                        circle={true}
                                                        className="ms-2"
                                                        btn="secondary"
                                                        onClick={() =>
                                                            deleteAnswer(
                                                                index,
                                                                i
                                                            )
                                                        }
                                                    >
                                                        <Icon
                                                            icon="trash"
                                                            color="#fff"
                                                            className="fs-5"
                                                        />
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => addNewAnswer(index)}
                                    >
                                        Add new answer
                                    </button>
                                </div>
                                <hr />
                            </div>
                        );
                    else {
                        return (
                            <div key={index}>
                                <div className={`${styles.questionBlock}`}>
                                    <div className="d-flex justify-content-between">
                                        <span className="fw-bold">
                                            Question {index + 1}
                                        </span>
                                        <div className="d-flex">
                                            <select
                                                class="w-13 form-select"
                                                aria-label="Default select example"
                                                id={`question${index}Level`}
                                                value={
                                                    questionList[index].levelId
                                                }
                                                onChange={(e) =>
                                                    updateLevelEachQuestion(
                                                        index,
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value={1}>
                                                    Level 1
                                                </option>
                                                <option value={2}>
                                                    Level 2
                                                </option>
                                                <option value={3}>
                                                    Level 3
                                                </option>
                                            </select>
                                            <Button
                                                circle={true}
                                                className="ms-2"
                                                btn="secondary"
                                                onClick={() =>
                                                    deleteQuestion(index)
                                                }
                                            >
                                                <Icon
                                                    icon="trash"
                                                    color="#fff"
                                                    className="fs-4"
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <textarea
                                            value={question.questionContent}
                                            onChange={(e) =>
                                                addQuestionContentToQuestion(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            cols="73"
                                            rows="5"
                                        ></textarea>
                                        <div className="text-danger">
                                            {question.duplicatedQuestion}
                                        </div>
                                    </div>
                                    <div
                                        className={`${styles.answerOptionBlock}`}
                                    >
                                        {question.answers.map((ans, i) => {
                                            return (
                                                <>
                                                    <p>Your score barem</p>
                                                    <div
                                                        className={`${styles.answerOption} d-flex justify-content-between`}
                                                        key={i}
                                                    >
                                                        <textarea
                                                            value={
                                                                ans.answerContent
                                                            }
                                                            onChange={(e) => {
                                                                addAnswerContentToQuestion(
                                                                    index,
                                                                    i,
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                            cols="73"
                                                            rows="5"
                                                        ></textarea>
                                                    </div>
                                                </>
                                            );
                                        })}
                                    </div>
                                </div>
                                <hr />
                            </div>
                        );
                    }
                })}

                <div className="d-flex justify-content-center">
                    <button
                        className="btn btn-success"
                        onClick={addNewQuestion}
                    >
                        Add new question
                    </button>
                </div>
                <div className="d-flex justify-content-between mt-4">
                    <button
                        className="btn btn-warning"
                        onClick={() => fetchDataCheck()}
                        disabled={questionList.length === 0}
                    >
                        Check for duplicate
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            showModalConfirmSubmit();
                        }}
                        disabled={questionList.length === 0}
                    >
                        Send request
                        <Icon icon="angle-double-right" className="ms-3" />
                    </button>
                </div>
            </div>
        </Wrapper>
    );
}
export default AddQuestionRequest;
