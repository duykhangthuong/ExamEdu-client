import Table from "components/Table";
import SearchBar from "components/SearchBar";
import Pill from "components/Pill";
import Wrapper from "components/Wrapper";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Icon from "components/Icon";
import { useLazyFetch } from "utilities/useFetch";
import { API } from "utilities/constants";
import Swal from "sweetalert2";
import Button from "components/Button";
import { useWindowSize } from "utilities/useWindowSize";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Pagination from "components/Pagination";
import Loading from "pages/Loading";
import OurModal from "components/OurModal";
import useOutsideClick from "utilities/useOutsideClick";
import styles from "../../styles/AccountList.module.css";
import * as Yup from "yup";
import { useFormik } from "formik";
const AccountList = () => {
    const history = useHistory();
    const size = useWindowSize();
    const [accounts, setAccounts] = useState();
    const modalRef = useRef(null);
    let { isClicked, setIsClicked } = useOutsideClick(modalRef);

    //Các cột trong bảng
    const columns = [
        "Full name",
        "Email",
        "Created Day",
        "Role",
        size.width > 768 ? "Action" : ""
    ];

    //Lưu các giá trị tìm kiếm
    const [searchName, setSearchName] = useState("");
    //Lưu giá trị page hiện tại
    const [currentPage, setcurrentPage] = useState(1);
    //Lưu số lượng hàng trong 1 page
    const pageSize = 5;

    //Fetch data của cái bảng
    const [fetchData, fetchResult] = useLazyFetch(
        `${API}/Account/list?pageNumber=${currentPage}&pageSize=${pageSize}&searchName=${searchName}`,
        {
            onCompletes: (data) => {
                setIsClicked(false);
            }
        }
    );

    //Fetch delete account
    const [requestDelete, requestResult] = useLazyFetch("", {
        method: "delete",
        //Khi fetch xong, status code  == 200
        onCompletes: (data) => {
            Swal.fire({
                titleText: "Account deleted",
                icon: "success",
                customClass: {
                    popup: "roundCorner"
                }
            });
            fetchData();
        },
        //Khi fetch ko được
        onError: (error) => {
            console.log(error);
            Swal.fire({
                titleText: "Operation failed!",
                text: "The account hasn't been deleted.",
                icon: "error",
                customClass: {
                    popup: "roundCorner"
                }
            });
        }
    });

    const formik = useFormik({
        initialValues: {
            fullName: accounts?.fullname,
            email: accounts?.email
        },
        validationSchema: Yup.object({
            fullName: Yup.string()
                .required("Full Name is required")
                .matches(/^(?!\s+$).*/, "Full name cannot be blank"),
            email: Yup.string().required("Email is required")
        }),
        enableReinitialize: true,
        onSubmit: () => {
            Swal.fire({
                title: "Are you Sure",
                text: "Press OK to continue",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3b5af1",
                cancelButtonColor: "#e76565",
                confirmButtonText: "OK"
            }).then((result) => {
                if (result.isConfirmed) {
                    fetchDataUpdate();
                }
            });
        }
    });
    const [fetchDataUpdate, fetchDataUpdateResult] = useLazyFetch(
        `${API}/Account/Update?roleId=${accounts?.roleID}&currentEmail=${accounts?.email}`,
        {
            method: "put",
            body: {
                email: formik.values.email,
                fullname: formik.values.fullName
            },

            onCompletes: (data) => {
                Swal.fire({
                    titleText: "Account successfully updated",
                    icon: "success",
                    customClass: {
                        popup: "roundCorner"
                    }
                });
                fetchData();
            },
            onError: (error) => {
                Swal.fire({
                    titleText: "Operation failed!",
                    text: error.message,
                    icon: "error",
                    customClass: {
                        popup: "roundCorner"
                    }
                });
            }
        }
    );
    //Gọi lại hàm Fetch khi nhập vô ô search
    function handleSubmit() {
        fetchData();
    }

    //hàm để hiện lên SweetAlert để hỏi lại khi nhấn xóa account
    function showModalDelete(deleteId, deleteRole) {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to delete this account?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#e76565",
            cancelButtonColor: "#363940",
            confirmButtonText: "Confirm",
            customClass: {
                popup: "roundCorner"
            }
        }).then((result) => {
            //nếu người dùng nhấn OK
            if (result.isConfirmed) {
                //Gọi hàm delete ở dòng 42
                requestDelete(`${API}/account/${deleteId}/${deleteRole}`);
            }
        });
    }
    //fetch data lần đầu và fetch data khi đổi page 2 3 4 5
    useEffect(() => {
        fetchData();
    }, [currentPage]);

    if (fetchResult.loading || fetchDataUpdateResult.loading)
        return <Loading />;
    return (
        //phải có cái Wrapper này để căn giữa
        <Wrapper>
            <SearchBar
                pageName="Account List"
                onSubmit={handleSubmit}
                keyWord={searchName}
                setKeyWord={setSearchName}
                // filterValue={roleFilter}
                // setFilterValue={setRoleFilter}
                // filterOptions={[{value:}]}
                onAddButtonClick={() =>
                    history.push("/administrator/accounts/create")
                }
            />

            <Table
                columns={columns}
                data={fetchResult.data?.payload.map((record) => ({
                    fullname: record.fullname,
                    email: record.email,
                    createdAt: moment(record.createdAt).format(
                        "DD/MM/YYYY , h:mm A"
                    ),
                    role: (
                        <Pill
                            content={record.roleName}
                            type={record.roleName}
                        />
                    ),
                    action: (
                        <div className="d-flex justify-content-center">
                            <Button
                                circle={true}
                                disabled={requestResult.loading}
                                btn="primary"
                                tooltipDirection="right"
                                titleTooltip="Edit this account"
                                className="me-2"
                                onClick={() => {
                                    setIsClicked(true);
                                    setAccounts(record);
                                }}
                            >
                                <Icon
                                    icon="pen"
                                    color="#fff"
                                    className="fs-4"
                                />
                            </Button>
                            <Button
                                circle={true}
                                disabled={requestResult.loading}
                                btn="secondary"
                                tooltipDirection="right"
                                titleTooltip="Delete this account"
                                onClick={() => {
                                    showModalDelete(record.id, record.roleID);
                                }}
                            >
                                <Icon
                                    icon="trash-alt"
                                    color="#fff"
                                    className="fs-4"
                                />
                            </Button>
                        </div>
                    )
                }))}
            />
            <Pagination
                totalRecords={fetchResult.data?.totalRecords}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={setcurrentPage}
            />
            {/* Modal Popup for Edit Account */}
            <OurModal
                modalRef={modalRef}
                isClicked={isClicked}
                setIsClicked={setIsClicked}
                style={{ height: "fit-content" }}
            >
                <header
                    className={`${styles.heading} d-flex justify-content-between`}
                >
                    <h4 className="fw-bold">Update Account Information</h4>
                    <b></b>
                    <Icon
                        icon="times"
                        className="me-2 fs-3"
                        onClick={() => setIsClicked(false)}
                        style={{ cursor: "pointer" }}
                    ></Icon>
                </header>
                <div className={styles.bodyModal}>
                    <form onSubmit={formik.handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label>Full name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formik.values.fullName}
                                onChange={formik.handleChange}
                            />
                        </div>
                        {formik.errors.fullName && formik.touched.fullName && (
                            <p className="text-danger ms-5 text-center">
                                {formik.errors.fullName}
                            </p>
                        )}
                        <div className={styles.inputGroup}>
                            <label>Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                            />
                        </div>
                        {formik.errors.email && formik.touched.email && (
                            <p className="text-danger ms-5 text-center">
                                {formik.errors.email}
                            </p>
                        )}
                        <Button className="ms-auto me-5 mt-4" type="submit">
                            Save Changes
                        </Button>
                    </form>
                </div>
            </OurModal>
        </Wrapper>
    );
};

export default AccountList;
