import MultiStepFormProgressBar from "components/MultiStepFormProgressBar";
import Wrapper from "components/Wrapper";
import React from "react";
import { useState } from "react";
import Loading from "./Loading";

const KhaMinh = () => {
    const steps = [
        {
            stepIcon: "trash-alt",
            stepName: "Basic Informationsssss",
        },
        {
            stepIcon: "trash-alt",
            stepName: "asdasd",
        },
        {
            stepIcon: "trash-alt",
            stepName: "Information",
        },
        {
            stepIcon: "trash-alt",
            stepName: "Basic",
        },
    ];
    return (
        <Wrapper>
            <MultiStepFormProgressBar steps={steps} currentStep={1} />
        </Wrapper>
    );
};

export default KhaMinh;
