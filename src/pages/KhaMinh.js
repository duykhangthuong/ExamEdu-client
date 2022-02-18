import MultiStepFormProgressBar from "components/MultiStepFormProgressBar";
import React from "react";
import { useState } from "react";

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
        <div>
            <MultiStepFormProgressBar steps={steps} currentStep={1} />
        </div>
    );
};

export default KhaMinh;
