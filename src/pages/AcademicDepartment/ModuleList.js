import Button from "components/Button";
import Icon from "components/Icon";
import Pagination from "components/Pagination";
import SearchBar from "components/SearchBar";
import Table from "components/Table";
import Wrapper from "components/Wrapper";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { API } from "utilities/constants";
import { useFetch, useLazyFetch } from "utilities/useFetch";
import { useWindowSize } from "utilities/useWindowSize";

const ModuleList = () => {
    const [keyword, setKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 2;
    const windowSize = useWindowSize();

    const [fetchData, fetchDataResult] = useLazyFetch(
        `${API}/module?pageNumber=${currentPage}&pageSize=${pageSize}&searchName=${keyword}`
    );

    function handleCreate() {}
    function handleSearch() {
        fetchData();
    }

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    const columns = [
        "ID",
        "Module Code",
        "Module Name",
        "Created At",
        windowSize.width > 768 ? "Actions" : "",
    ];

    if (fetchDataResult.loading) {
        return <Wrapper>Loading...</Wrapper>;
    }

    return (
        <Wrapper>
            <SearchBar
                pageName={"Module List"}
                keyWord={keyword}
                setKeyWord={setKeyword}
                onAddButtonClick={handleCreate}
                onSubmit={handleSearch}
            ></SearchBar>
            <Table
                columns={columns}
                data={fetchDataResult.data?.payload.map((module) => ({
                    id: module.moduleId,
                    moduleCode: module.moduleCode,
                    moduleName: module.moduleName,
                    createdAt: module.createdAt,
                    action: (
                        <div className="d-flex justify-content-end justify-content-lg-center align-items-center me-3 me-lg-0">
                            <Button
                                circle={true}
                                style={{
                                    backgroundColor: "var(--nav-bar)",
                                    color: "#00FF2B",
                                }}
                                className="me-2"
                            >
                                <Icon icon="edit" />
                            </Button>
                            <Button circle={true} btn="secondary">
                                <Icon icon="trash-alt" />
                            </Button>
                        </div>
                    ),
                }))}
            ></Table>
            <Pagination
                totalRecords={fetchDataResult.data?.totalRecords}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
            />
        </Wrapper>
    );
};

export default ModuleList;
