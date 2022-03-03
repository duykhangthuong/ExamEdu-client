import Icon from "components/Icon";
import Wrapper from "components/Wrapper";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import style from "styles/MarkReport.module.css";
import { useFetch } from "utilities/useFetch";
import { API } from "utilities/constants";
import moment from "moment";

const MarkReport = () => {
    const user = useSelector((state) => state.user.accountId);
    const param = useParams();
    console.log(param);

    const { data, loading, error } = useFetch(
        `${API}/Student/markReport/${user}/${param.moduleID}`
    );

    return (
        <Wrapper>
            {data.map((mark) => (
                <div
                    className={`${style.frame} d-flex flex-column flex-md-row justify-content-md-between mb-3`}
                >
                    <div className="d-flex">
                        <div
                            className={`${style.nameAndDate} align-self-center`}
                        >
                            <h3 className={style.moduleName}>
                                {mark?.moduleName}
                            </h3>
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
                            <span className={style.mark}>{mark?.mark}</span>
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
            ))}
        </Wrapper>
    );
};
export default MarkReport;
