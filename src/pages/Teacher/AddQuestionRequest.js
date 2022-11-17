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
import { useWindowSize } from "utilities/useWindowSize";
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
    const [imgQuestionList, setImgQuestionList] = useState([]);
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
            setImgQuestionList([]);
        },
        onError: (error) => {
            Swal.fire("Error", error.message, "error");
        }
    });
    const [fetchUploadImages, fetchUploadImagesResult] = useLazyFetch(
        `${API}/question/images`,
        {
            method: "POST"
        }
    );
    /* Use this function when click on add new question button,
         add a question with 2 blank answer (multiple choice) or 1 blank answer (text question)*/
    const addNewQuestion = () => {
        // if Question type is multiple choice
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
            // If question type is text question
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
    /* NOTE: All function about delete question, add answer, delete answer, update content... below is about
        update question list and then pass that question list to setQuestionList to update State  */

    // delete a question when clicking on trash button
    const deleteQuestion = (index) => {
        const updateList = questionList.filter((question, i) => index !== i);
        setQuestionList(updateList);

        // delete image of question if question is deleted
        const updateImgList = imgQuestionList.filter((imgQuestion, i) => {
            return imgQuestion.index !== index; // because question index start from 0, but question image index start from 1
        });
        setImgQuestionList(updateImgList);
    };
    // add new answer option in a question
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
    // delete an answer in a question
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
    // Update question content of question when user type in question textarea
    const addQuestionContentToQuestion = (index, value) => {
        const updateList = questionList.map((question, i) => {
            if (index === i) {
                question.questionContent = value;
            }
            return question;
        });
        setQuestionList(updateList);
    };

    // Update answer content of question when user type in answer textarea
    // must pass index of question and answer to find exactly that answer textarea
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
    // update module of all question when user choose in select option
    const updateModuleQuestion = (moduleId) => {
        moduleId = parseInt(moduleId); //phải parse thành int thì setModule mới set lại cái state là kiểu number
        setModule(moduleId);
        const updateList = questionList.map((question, i) => {
            question.moduleId = moduleId;
            return question;
        });
        setQuestionList(updateList);
    };
    // update level of each question when user choose in select option (param: question index)
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
    // user check on radio button to update which answer is true
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
    // return boolean if this answer is Correct
    const checkTrueAnswer = (idxQ, idxA) => {
        return questionList[idxQ].answers[idxA].isCorrect;
    };

    // User choose select option to change question type
    /* if there are question in multiple choice type but user want to change, 
        show a confirm dialog that all previous question will be deleted (Or vice versa). 
        Else if there is no question, change question type
     */
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
                    setImgQuestionList([]);
                }
            });
        } else {
            setQuestionType(questionTypeId);
        }
    };

    // Upload image to ImgBB and add image url to question, then call postQuestion to add request question to database
    const uploadImageAndSubmitData = () => {
        var formdata = new FormData();
        // submit image to ImgBB and get image url array
        for (let i = 0; i < imgQuestionList.length; i++) {
            formdata.append(`inputs`, imgQuestionList[i].image);
        }

        fetchUploadImages("", {
            body: formdata,
            onCompletes: (res) => {
                // res is array of image url
                res.map((imgUrl, i) => {
                    // add image url to question
                    const imgQuestion = {
                        index: imgQuestionList[i].index,
                        imgUrl: imgUrl
                    };
                    addImgUrlToQuestionList(
                        imgQuestion.index,
                        imgQuestion.imgUrl
                    );
                });
                // submit question to database after upload image
                postData();
            },
            onError: (err) => {
                Swal("Error", err, "error");
            }
        });
    };

    // add ImgUrl to each question in questionList
    const addImgUrlToQuestionList = (index, imgUrl) => {
        const updateList = questionList.map((question, i) => {
            if (index === i) {
                question.questionImageURL = imgUrl;
            }
            return question;
        });
        setQuestionList(updateList);
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
                if (imgQuestionList.length === 0) {
                    postData();
                } else {
                    uploadImageAndSubmitData();
                }
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

    useEffect(() => {
        //set question list state but add content to duplicatedQuestion field
        const updateList = questionList.map((question, i) => {
            question.duplicatedQuestion = fetchResultCheck.data?.results[i];
            return question;
        });
        setQuestionList(updateList);
    }, [fetchResultCheck.loading]);

    const { width, height } = useWindowSize();

    if (
        fetchModuleResult.loading ||
        postDataResult.loading ||
        fetchResultCheck.loading
    ) {
        return <Loading />;
    }
    if (width < 1400) {
        return (
            <Wrapper className="d-flex">
                <h2
                    className="m-auto font-weight-bolder text-center p-3"
                    style={{ fontFamily: "monospace" }}
                >
                    This page not support mobile device. Please switch to
                    computer to use this function!
                </h2>
            </Wrapper>
        );
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
                    {/* Question type select option*/}
                    <div className="text-center">
                        <label htmlFor="questionType">Question Type</label>
                        <select
                            className="w-30 form-select"
                            aria-label="Default select example"
                            id="questionType"
                            onChange={(e) =>
                                changeQuestionType(parseInt(e.target.value))
                            }
                            value={questionType}
                        >
                            <option value={1}>Multiple choice</option>
                            <option value={2}>Text</option>
                        </select>
                    </div>
                    {/* Module type select option */}
                    <div className="text-center">
                        <label htmlFor="questionModule">Module</label>
                        <select
                            className="w-35 form-select"
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
                    {/* Bank type select option */}
                    <div className="text-center">
                        <label htmlFor="bank">Bank</label>
                        <select
                            className="w-30 form-select"
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
                {/* Render array of question list */}
                {questionList.map((question, index) => {
                    if (questionType === 1)
                        return (
                            <div key={index}>
                                <div className={`${styles.questionBlock}`}>
                                    <div className="d-flex justify-content-between">
                                        <span className="fw-bold">
                                            Question {index + 1}
                                        </span>
                                        {/* Question level select option */}
                                        <div className="d-flex">
                                            <select
                                                className="w-13 form-select"
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

                                            {/* Delete question button */}
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
                                    <ImageUpload
                                        questionIndex={index}
                                        addImgToList={setImgQuestionList}
                                        listImg={imgQuestionList}
                                    />
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
                                        {/* <div className="text-danger mt-2">
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
                                        </div> */}
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
                                                            className="form-check-input"
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
                                        className="btn btn-secondary mt-3"
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
                                                className="w-13 form-select"
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
                                    <ImageUpload
                                        questionIndex={index}
                                        addImgToList={setImgQuestionList}
                                        listImg={imgQuestionList}
                                    />
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
                                            className="mt-2 p-3 fs-5"
                                        ></textarea>
                                        
                                    </div>
                                    <div
                                        className={`${styles.answerOptionBlock}`}
                                    >
                                        {question.answers.map((ans, i) => {
                                            return (
                                                <>
                                                    <div>Your score barem</div>
                                                    <div
                                                        className={`${styles.answerOption} d-flex justify-content-center`}
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
                                                            className="mt-2 p-3 fs-5"
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
                <div className="d-flex justify-content-end mt-4">
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

const ImageUpload = ({ questionIndex, listImg, addImgToList }) => {
    const [selectedImg, setSelectedImg] = useState();

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        // free memory when ever this component is unmounted
        return () => selectedImg && URL.revokeObjectURL(selectedImg.preview);
    }, [selectedImg]);

    const onSelectFile = (e) => {
        if (e.target.files.length !== 0) {
            const file = e.target.files[0];
            file.preview = URL.createObjectURL(file);
            setSelectedImg(file);
            addImgToList([...listImg, { index: questionIndex, image: file }]);
        }
    };

    return (
        <div className="">
            <input type="file" accept="image/*" onChange={onSelectFile} />
            {selectedImg && (
                <img
                    src={selectedImg.preview}
                    alt=""
                    className={styles.imgQuestion}
                />
            )}
        </div>
    );
};
export default AddQuestionRequest;
