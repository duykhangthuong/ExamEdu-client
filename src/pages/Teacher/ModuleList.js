import Heading from "components/Heading";
import Icon from "components/Icon";
import SearchBar from "components/SearchBar";
import Wrapper from "components/Wrapper";
import React from "react";
import { useState } from "react";
import styles from "../../styles/TeacherModuleList.module.css";
import { useSelector } from "react-redux";
import { useFetch } from "../../utilities/useFetch";
import { API } from "../../utilities/constants";
import { useHistory } from "react-router-dom";
import Pagination from "../../components/Pagination";
import Loading from "pages/Loading";

const ModuleList = () => {
    const teacher = useSelector((store) => store.user);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const { data, loading } = useFetch(
        `${API}/Teacher/ClassModule/${teacher.accountId}`
    );

    if (loading) {
        return <Loading />;
    }

    return (
        <Wrapper>
            {/* Title */}
            <SearchBar pageName={"Module List"} />
            {/* Module card container */}
            <section className={styles.module_card_container}>
                {/* Module cards */}
                {data.payload.map((module) => {
                    return (
                        <ModuleCard
                            moduleName={module.moduleCode}
                            classes={module.classModules}
                            key={module.moduleCode}
                        />
                    );
                })}
            </section>
            <Pagination
                totalRecords={data?.totalRecords}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
            />
        </Wrapper>
    );
};

export default ModuleList;

const ModuleCard = ({ moduleName, classes }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    //Hook to send to Teacher's classmodule
    const history = useHistory();
    function goToExamList(classModuleId) {
        history.push(`/teacher/class/progress_exam/${classModuleId}`);
    }
    return (
        <article className={styles.module_card}>
            {/* Module name */}
            <div
                className="d-flex justify-content-between align-items-center"
                style={{ cursor: "pointer" }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <Heading size={2} style={{ color: "var(--color-blue)" }}>
                    {moduleName}
                </Heading>
                <Icon
                    icon="chevron-down"
                    className={`txt-blue ${styles.chevron} ${
                        isExpanded && styles.chevron_active
                    }`}
                    onClick={() => setIsExpanded(!isExpanded)}
                />
            </div>

            <div
                className={`${styles.class_container} ${
                    isExpanded && styles.class_container_active
                }`}
            >
                {/* Horizontal line */}
                <div className={`mb-2 ${styles.horizontal_line}`}></div>
                {/* Note */}
                <div className="txt-gray mb-2">Classes of this module</div>
                {/* Classes of this module */}
                <div className={styles.class_grid_container}>
                    {/* Classes */}
                    {classes.map((classModule) => {
                        return (
                            <div
                                className={`mb-2 ${styles.class}`}
                                onClick={() =>
                                    goToExamList(classModule.classModuleId)
                                }
                                key={classModule.classModuleId}
                            >
                                <b>{classModule.class.className}</b>
                            </div>
                        );
                    })}
                </div>
            </div>
        </article>
    );
};
