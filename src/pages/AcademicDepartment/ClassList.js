import { useParams, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFetch, useLazyFetch } from "utilities/useFetch";
import { API } from "utilities/constants";
import Heading from "components/Heading";
import Wrapper from "components/Wrapper";
import SearchBar from "components/SearchBar";
import styles from "../../styles/ClassList.module.css";
import Icon from "components/Icon";
import Pagination from "components/Pagination";
import Loading from "pages/Loading";

function ClassList() {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;
    //Get parameters from history
    const param = useParams();
    const history = useHistory();

    const [fetchData, fetchResult] = useLazyFetch(
        `${API}/Class?pageNumber=${currentPage}&pageSize=${pageSize}`
    );

    function onAddButtonClick() {
        history.push("/");
    }
    useEffect(() => {
        fetchData();
    }, [currentPage]);

    if (fetchResult.loading) return <Loading />;

    return (
        <Wrapper>
            <SearchBar
                pageName={"Class List"}
                onAddButtonClick={onAddButtonClick}
            />
            <div className={styles.class_card_container}>
                {fetchResult.data?.payload.map((classes, index) => {
                    return (
                        <ClassCard
                            key={index}
                            className={classes.className}
                            classId={classes.classId}
                        />
                    );
                })}
            </div>
            <Pagination
                totalRecords={fetchResult.data?.totalRecords}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
            />
        </Wrapper>
    );
}

function ClassCard({ className, classId }) {
    const history = useHistory();
    return (
        <div className="d-flex justify-content-center">
            <article className={`${styles.class_card} txt-blue`}>
                <div className={`h3 m-3 txt-blue`}>
                    <b>{className}</b>
                </div>
                <div
                    className={`m-3 ${styles.go_to_class}`}
                    onClick={() => history.push(`class/${classId}`)}
                    
                >
                    Go to class detail
                    <Icon icon="arrow-right" className="ms-2" />
                </div>
            </article>
        </div>
    );
}
export default ClassList;
