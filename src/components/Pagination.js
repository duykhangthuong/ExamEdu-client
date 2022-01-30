import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePagination } from "../utilities/usePagination";
import style from "../styles/Pagination.module.css";

/**
 * Handle pagination for a certain data set
 * @param {*} totalRecords The total amount of records of a data set
 * @param {*} currentPage The current page
 * @param {*} pageSize The amount of data to display per page
 * @param {*} onPageChange A function to tell the pagination component what to do when the user clicks on the pagination button
 * @returns
 */
const Pagination = ({ totalRecords, currentPage, pageSize, onPageChange }) => {
    const [totalPage, paginationRange] = usePagination({
        totalRecords,
        currentPage,
        pageSize,
    });

    if (totalRecords === undefined || totalRecords === 0 || totalPage === 1) {
        return <></>;
    }

    return (
        <>
            <div className="d-flex justify-content-center align-items-center">
                <nav
                    className={`b-radius-6 ${style.pagination_Container}`}
                    style={{
                        backgroundColor: "var(--element-bg)",
                    }}
                >
                    {/* Go to first page and go to previous page buttons */}
                    {currentPage !== 1 && (
                        <>
                            <button
                                onClick={() => onPageChange(1)}
                                className={style.pagination_Button}
                            >
                                <FontAwesomeIcon icon="angle-double-left" />
                            </button>
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                className={style.pagination_Button}
                            >
                                <FontAwesomeIcon icon="angle-left" />
                            </button>
                        </>
                    )}
                    {/* Page number buttons */}
                    {paginationRange.map((pageNumber) => {
                        if (pageNumber === 1 && currentPage === 1) {
                            return (
                                <button
                                    className={
                                        currentPage === pageNumber
                                            ? style.pagination_Button +
                                              " " +
                                              style.pagination_Button_Active
                                            : style.pagination_Button
                                    }
                                    style={{ marginLeft: "0.5rem" }}
                                    onClick={() => onPageChange(pageNumber)}
                                    key={pageNumber}
                                >
                                    {pageNumber}
                                </button>
                            );
                        }
                        if (
                            pageNumber === totalPage &&
                            currentPage === totalPage
                        ) {
                            return (
                                <button
                                    className={
                                        currentPage === pageNumber
                                            ? style.pagination_Button +
                                              " " +
                                              style.pagination_Button_Active
                                            : style.pagination_Button
                                    }
                                    style={{ marginRight: "0.5rem" }}
                                    onClick={() => onPageChange(pageNumber)}
                                    key={pageNumber}
                                >
                                    {pageNumber}
                                </button>
                            );
                        }
                        return (
                            <button
                                className={
                                    currentPage === pageNumber
                                        ? style.pagination_Button +
                                          " " +
                                          style.pagination_Button_Active
                                        : style.pagination_Button
                                }
                                onClick={() => onPageChange(pageNumber)}
                                key={pageNumber}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}
                    {/* Go to next page and last page buttons */}
                    {currentPage !== totalPage && (
                        <>
                            <button
                                onClick={() => onPageChange(currentPage + 1)}
                                className={style.pagination_Button}
                            >
                                <FontAwesomeIcon icon="angle-right" />
                            </button>
                            <button
                                onClick={() => onPageChange(totalPage)}
                                className={style.pagination_Button}
                            >
                                <FontAwesomeIcon icon="angle-double-right" />
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </>
    );
};

export default Pagination;
