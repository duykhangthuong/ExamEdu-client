import Heading from "components/Heading";
import Wrapper from "components/Wrapper";
import styles from "../../styles/ApproveRequests.module.css";
import React, { useState } from "react";
import Button from "components/Button";
import Icon from "components/Icon";
import { useFetch, useLazyFetch } from "utilities/useFetch";
import { API } from "utilities/constants";
import { useParams } from "react-router-dom";
import Loading from "pages/Loading";
import Swal from "sweetalert2";

export default function ApproveRequests() {
    // id 130
    const [approvedQuestions, setApprovedQuestions] = useState([]);

    //Get id url
    const params = useParams();

    //--------- Handle fetch questions from request ----------
    const { data, loading, error } = useFetch(
        `${API}/Question/request/${params.requestId}`,
        {
            onCompletes: (data) => {
                setApprovedQuestions(
                    data.questions.map((question) => {
                        return {
                            questionId: question.questionId,
                            isApproved: false,
                            comment: "",
                            isFinalExamBank: data.isFinalExamBank
                        };
                    })
                );
            }
        }
    );

    //--------- Handle post approved questions ----------
    const [postApprovedQuestions, postApprovedQuestionsResult] = useLazyFetch();
    function onClickSubmit() {
        postApprovedQuestions(`${API}/Question/approveRequest`, {
            method: "PUT",
            body: approvedQuestions,
            onCompletes: () => Swal.fire("Success", "", "success"),
            onError: (error) => Swal.fire("Error", error.message, "error")
        });
    }

    if (loading || postApprovedQuestionsResult.loading) {
        return <Loading />;
    }

    return (
        <Wrapper>
            <section className="d-flex flex-column align-items-center align-items-md-start mb-4">
                {/* Heading */}
                <Heading className="text-center mb-3">
                    Approve Queued Questions
                </Heading>
                {/* Request information container */}
                <div className="txt-dark-blue mb-3 text-center d-md-flex">
                    {/* Module Code */}
                    <div className="me-md-3 text-capitalize">
                        <b>Module: </b>
                        {data?.moduleName}
                    </div>
                    {/* Bank name */}
                    <div>
                        <b>Bank: </b>
                        {data?.isFinalExamBank ? "Final Exam" : "Regular Exam"}
                    </div>
                </div>
                {/* horizontal line */}
                <div className={styles.horizontal_line}></div>
            </section>

            {/* Question cards container */}
            <section className="mb-2">
                {/* Question card */}
                {data?.questions.map((question) => {
                    return (
                        <QuestionCard
                            key={question.questionId}
                            questionId={question.questionId}
                            questionContent={question.questionContent}
                            answers={question.answers}
                            level={question.levelName}
                            approvedQuestions={approvedQuestions}
                            setApprovedQuestions={setApprovedQuestions}
                        />
                    );
                })}
            </section>
            {/* Submit button */}
            <div className="d-flex justify-content-center justify-content-md-end">
                <Button onClick={onClickSubmit}>
                    Submit
                    <Icon className="ms-2" icon="arrow-right"></Icon>
                </Button>
            </div>
        </Wrapper>
    );
}

const QuestionCard = ({
    questionId,
    questionContent,
    answers = [],
    approvedQuestions = [],
    level = "",
    setApprovedQuestions
}) => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <div className={styles.question_card}>
            {/* Question level */}
            <div className={styles.level}>Difficulty Level: {level}</div>
            {/* Question */}
            <div className="mb-2 align-self-stretch txt-dark-blue">
                {questionContent}
            </div>
            {/* Answer container */}
            <div className={`${styles.answer_container} mb-2 txt-dark-blue`}>
                {/* Answers */}
                {answers.map((answer, index) => (
                    <div
                        key={index}
                        className={answer.isCorrect ? "fw-bold" : ""}
                    >
                        {(index + 10).toString(36).toUpperCase()}
                        {". "}
                        {answer.answerContent}
                    </div>
                ))}
            </div>
            <span
                className={`${styles.checkbox} ${
                    approvedQuestions.find(
                        (question) => question.questionId === questionId
                    ).isApproved && styles.checked
                }`}
                onClick={() => {
                    setApprovedQuestions(
                        approvedQuestions.map((question) => {
                            if (question.questionId === questionId) {
                                question.isApproved = !question.isApproved;
                            }

                            return question;
                        })
                    );
                }}
            >
                <div className={styles.checkmark}></div>
            </span>
        </div>
    );
};
