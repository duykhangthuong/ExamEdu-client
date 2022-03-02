import Icon from "components/Icon";
import Wrapper from "components/Wrapper";
import React from "react";
import style from "styles/MarkReport.module.css";
const MarkReport = () => {
    return (
        <Wrapper>
            <div
                className={`${style.frame} d-flex flex-column flex-md-row justify-content-md-between`}
            >
                <div className="d-flex">
                    <div className={`${style.nameAndDate} align-self-center`}>
                        <h3 className={style.moduleName}>SWD319</h3>
                        <div>
                            <Icon icon="calendar-day" className="me-2" />
                            31/12/2022
                        </div>
                    </div>
                    <b className={`align-self-center ${style.testName}`}>
                        Progress test 3
                    </b>
                </div>
                <div className={style.markAndProgress}>
                    <div className="d-flex justify-content-between">
                        <span>Comment of this test</span>
                        <span className={style.mark}>8.0</span>
                    </div>
                    <div>
                        <progress
                            className={`${style.progressbar} align-self-center `}
                            value="8"
                            max="10"
                        ></progress>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};
export default MarkReport;
