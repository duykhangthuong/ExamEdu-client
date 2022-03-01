import { API, REGEX, REQUIRED, FLOATNUMBER } from "utilities/constants";
import useOutsideClick from "utilities/useOutsideClick";
import { useRef, useEffect, useState } from "react";
import { useForm } from "utilities/useForm";
import { useLazyFetch, useFetch } from "utilities/useFetch";

import InputBox from "components/InputBox";
import Wrapper from "components/Wrapper";
import styleTA from "../../styles/TextAnswer.module.css";
import Icon from "components/Icon";
import OurModal from "components/OurModal";
import Loading from "pages/Loading";
import Button from "components/Button";

function TextAnswer({ studentId, examId, disabled }) {
    studentId = 8;
    examId = 6;
    const [fetchDataTA, fetchDataResultTA] = useLazyFetch(
        `${API}/Answer/TextAnswer?studentId=${studentId}&examId=${examId}`
    );
    const fields = useRef({});
    //use to set field for form base on number of element when fetch API
    useEffect(() => {
        for (let i = 0; i < fetchDataResultTA.data?.length; i++) {
            let a = `textAnswerScore${i}`;
            fields.current = {
                ...fields.current,
                [a]: {
                    validate: REGEX,
                    regex: FLOATNUMBER,
                    message: "Score must be float number",
                },
            };
        }
    }, [fetchDataResultTA.loading]);

    const updateScore = useForm(fields.current);
    const modalRef = useRef(null);
    let { isClicked, setIsClicked } = useOutsideClick(modalRef);
    if (fetchDataResultTA.loading) {
        return (
            <OurModal
                modalRef={modalRef}
                isClicked={true}
                setIsClicked={setIsClicked}
                modalClassName={`${styleTA.modal}`}
            >
                <header
                    className={`${styleTA.heading} d-flex justify-content-between`}
                >
                    <b>Grade Text Question</b>
                    <Icon
                        icon="times"
                        className="me-2 fs-3"
                        onClick={() => setIsClicked(false)}
                    ></Icon>
                </header>
                <Loading />
            </OurModal>
        );
    }
    return (
        <>
            <div
                className="d-flex justify-content-center"
                onClick={() => {
                    setIsClicked(true);
                    fetchDataTA();
                }}
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="Grade Text Question"
            >
                <Button circle={true} disabled={disabled}>
                    <Icon icon="pencil-ruler" color="#fff" className="fs-4" />
                </Button>
            </div>
            <OurModal
                modalRef={modalRef}
                isClicked={isClicked}
                setIsClicked={setIsClicked}
                modalClassName={`${styleTA.modal}`}
            >
                <header
                    className={`${styleTA.heading} d-flex justify-content-between`}
                >
                    <b>Grade Text Question</b>
                    <Icon
                        icon="times"
                        className="me-2 fs-3"
                        onClick={() => setIsClicked(false)}
                    ></Icon>
                </header>
                <form>
                    <div className={`${styleTA.questionWrapper}`}>
                        {fetchDataResultTA.data?.map((ans, index) => {
                            return (
                                <div
                                    className={`${styleTA.questionItem}`}
                                    key={index}
                                >
                                    {ans.questionContent}
                                    <div className={`${styleTA.studentAnswer}`}>
                                        {ans.studentAnswer}
                                    </div>
                                    <div>
                                        <i>
                                            Max score for this quesition is{" "}
                                            {ans.questionMark}
                                        </i>
                                        <InputBox
                                            label="Score"
                                            name={`textAnswerScore${index}`}
                                            // value={}
                                            // onChange={updateForm.onChange}
                                            // errorMessage={updateForm.errors.moduleName}
                                            className={`mb-3 mb-md-2 ${styleTA.input_box}`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="d-flex justify-content-center align-items-center mt-2">
                        <button
                            type="submit"
                            className={`btn ${styleTA.btn_submit}`}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </OurModal>
        </>
    );
}
export default TextAnswer;
// const data = [
//     {
//         studentId: 8,
//         questionContent: "C# long answer question 1 level 1",
//         questionImageURL: null,
//         studentAnswer: "My answer",
//         questionMark: 2,
//     },
//     {
//         studentId: 8,
//         questionContent: "C# long answer question 2 level 1",
//         questionImageURL: null,
//         studentAnswer: "My answer 2",
//         questionMark: 2,
//     },
// ];
