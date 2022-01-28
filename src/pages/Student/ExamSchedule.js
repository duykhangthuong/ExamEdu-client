import Heading from "components/Heading";
import Icon from "components/Icon";
import Wrapper from "components/Wrapper";
import moment from "moment";
import React from "react";

//Styles
import styles from "../../styles/ExamSchedule.module.css";

const ExamSchedule = () => {
    return (
        <Wrapper>
            {/* Date */}
            <div className="txt-blue">
                {moment(moment().toDate()).format("dddd, D MMMM yyyy")}
            </div>

            {/* Title */}
            <Heading className="txt-blue">Your upcoming exam</Heading>

            {/* Schedule container */}
            {mockData.map((data, index) => {
                return (
                    <Schedule
                        date={data.date}
                        time={data.time}
                        name={data.name}
                        desc={data.desc}
                        subjectName={data.subjectName}
                        alottedTime={data.alottedTime}
                        key={index}
                    />
                );
            })}
        </Wrapper>
    );
};
export default ExamSchedule;

const Schedule = ({ date, time, name, desc, subjectName, alottedTime }) => {
    return (
        <>
            {/* Schedule container */}
            <div className="mb-4">
                {/* Test Date */}
                <p className="txt-blue mb-0">{date}</p>
                {/* Test information */}
                <div
                    className={`d-flex align-items-center justify-content-between txt-blue shadow-center-medium b-radius-8 overflow-hidden ${styles.schedule_container}`}
                >
                    {/* Bell and time container*/}

                    <div className={`${styles.container_bell_time}`}>
                        <Icon icon="bell"></Icon>
                        <p className="mb-0">{time}</p>
                    </div>

                    {/* Bigger container */}
                    <div className={styles.schedule_container_sub}>
                        {/* Test name and description container*/}
                        <div className={styles.container_testname}>
                            {/* Test name */}
                            <div style={{ fontSize: "1.75rem" }}>{name}</div>
                            {/* Test description */}
                            <p className="mb-0 mt-2">{desc}</p>
                        </div>
                        {/* Vertical separation line */}
                        <div className={styles.line}></div>
                        {/* Module name, allotted time container */}
                        <div>
                            <Heading size="3">{subjectName}</Heading>
                            <div style={{ fontSize: "1.75rem" }}>
                                {alottedTime}
                            </div>
                        </div>
                        {/* Start button container */}
                        <div>
                            <button
                                className={`shadow-light ${styles.btn_start}`}
                            >
                                <Icon icon="play" className="me-2"></Icon>
                                Start
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const mockData = [
    {
        date: "24, April",
        time: "07:00",
        name: "Progress Test 3",
        desc: "This is the description",
        subjectName: "PRN211",
        alottedTime: "45 minutes",
    },
    {
        date: "24, April",
        time: "07:00",
        name: "Progress Test 3",
        desc: "This is the description",
        subjectName: "PRN211",
        alottedTime: "45 minutes",
    },
    {
        date: "24, April",
        time: "07:00",
        name: "Progress Test 3",
        desc: "This is the description",
        subjectName: "PRN211",
        alottedTime: "45 minutes",
    },
    {
        date: "24, April",
        time: "07:00",
        name: "Progress Test 3",
        desc: "This is the description",
        subjectName: "PRN211",
        alottedTime: "45 minutes",
    },
    {
        date: "24, April",
        time: "07:00",
        name: "Progress Test 3",
        desc: "This is the description",
        subjectName: "PRN211",
        alottedTime: "45 minutes",
    },
    {
        date: "24, April",
        time: "07:00",
        name: "Progress Test 3",
        desc: "This is the description",
        subjectName: "PRN211",
        alottedTime: "45 minutes",
    },
];
