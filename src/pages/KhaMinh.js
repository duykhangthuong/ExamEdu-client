import MultiStepFormProgressBar from "components/MultiStepFormProgressBar";
import Wrapper from "components/Wrapper";
import React from "react";
import { useState } from "react";
import Swal from "sweetalert2";
import { useLazyFetch } from "utilities/useFetch";
import Loading from "./Loading";
import RequestAddQuestionBank from "./Teacher/RequestAddQuestionBank";

const KhaMinh = () => {
    const steps = [
        {
            stepIcon: "trash-alt",
            stepName: "Basic Informationsssss"
        },
        {
            stepIcon: "folder-open",
            stepName: "asdasd"
        },
        {
            stepIcon: "user-circle",
            stepName: "Information"
        },
        {
            stepIcon: "trash-alt",
            stepName: "Basic"
        }
    ];
    const [fetchData, fetchResult] = useLazyFetch(
        "http://127.0.0.1:2022/check",
        {
            method: "post",
            body: {
                questions: [
                    "Android are bought by which company",
                    "Key component of Android Architecture are",
                    "Test khong trung"
                ]
            },
            onCompletes: () => {
                Swal.fire("Success", "thanh cong", "success");
            },
            onError: (error) => {
                Swal.fire("Error", error.message, "error");
            }
        }
    );
    const [fetchData1, fetchResult1] = useLazyFetch(
        "http://127.0.0.1:2022/add/question",
        {
            method: "post",
            body: {
                questions: ["hello world", "He he"]
            },
            onCompletes: () => {
                Swal.fire("Success", "thanh cong", "success");
            },
            onError: (error) => {
                Swal.fire("Error", error.message, "error");
            }
        }
    );

    return (
        <Wrapper>
            {/* <MultiStepFormProgressBar steps={steps} currentStep={4} /> */}
            {/* <RequestAddQuestionBank /> */}
            Hello worldsasd
            <button onClick={() => fetchData1()}>Click me</button>
            Hello worldsasd
            <div>{fetchResult.results}</div>
        </Wrapper>
    );
};

export default KhaMinh;
