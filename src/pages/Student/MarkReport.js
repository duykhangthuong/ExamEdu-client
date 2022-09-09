import Icon from "components/Icon";
import Wrapper from "components/Wrapper";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import style from "styles/MarkReport.module.css";
import { useFetch } from "utilities/useFetch";
import { API } from "utilities/constants";
import moment from "moment";
import Heading from "components/Heading";
import Loading from "pages/Loading";
import Table from "./../../components/Table";

const MarkReport = () => {
    const user = useSelector((state) => state.user.accountId);
    const param = useParams();

    const columns = ["Module Code", "Exam name", "Date", "Mark"];

    const { data, loading, error } = useFetch(
        `${API}/Student/markReport/${user}/${param.moduleID}`
    );

    if (loading) {
        return <Loading />;
    }

    if (error?.status === 404) {
        return (
            <Wrapper>
                <div className="d-flex flex-column justify-content-center mt-5 ">
                    <Icon
                        icon="folder-open"
                        size="5x"
                        color="#3b5af1"
                        className="align-self-center mb-3"
                    />

                    <h2 className="align-self-center">Empty Data</h2>
                    <p className="align-self-center fs-5">
                        You don't have any Result yet!!
                    </p>
                </div>
            </Wrapper>
        );
    }
    return (
        <Wrapper>
            <Heading>Mark Report</Heading>
            <Table
                columns={columns}
                data={data?.map((record) => ({
                    moduleCode: record.moduleCode,
                    examName: record.examName,
                    examDate: moment(record.examDate).format(
                        "DD/MM/YYYY , h:mm A"
                    ),
                    role: (
                        <span
                            className={`${style.mark} ${
                                record.mark >= 5
                                    ? style["markPillPassed"]
                                    : style["markPillNotPassed"]
                            }`}
                        >
                            {record.mark}
                        </span>
                    )
                }))}
            />
            {/* {data?.map((mark, index) => (
                <div
                    className={`${style.frame} d-flex flex-column flex-md-row justify-content-md-between mb-4`}
                    key={index}
                >
                    <div className={`d-flex ${style.nameDateAndExamName}`}>
                        <div
                            className={`${style.nameAndDate} align-self-center`}
                        >
                            <h6 className={style.moduleName}>
                                {mark?.moduleName}
                            </h6>
                            <div>
                                <Icon icon="calendar-day" className="me-2" />
                                {moment(mark?.examDate).format(
                                    "DD/MM/YYYY , h:mm A"
                                )}
                            </div>
                        </div>
                        <b className={`align-self-center ${style.testName}`}>
                            {mark?.examName}
                        </b>
                    </div>
                    <div className={style.markAndProgress}>
                        <div className="d-flex justify-content-between">
                            <span>{mark?.comment}</span>
                            <span
                                className={`${style.mark} ${
                                    mark?.mark >= 5
                                        ? style["markPillPassed"]
                                        : style["markPillNotPassed"]
                                }`}
                            >
                                {mark?.mark}
                            </span>
                        </div>
                        <div>
                            <progress
                                className={`${style.progressbar} align-self-center `}
                                value={mark?.mark}
                                max="10"
                            ></progress>
                        </div>
                    </div>
                </div>
            ))} */}
        </Wrapper>
    );
};
export default MarkReport;
