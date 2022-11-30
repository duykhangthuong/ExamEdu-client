import Heading from "components/Heading";
import Icon from "components/Icon";
import React from "react";
import * as XLSX from "xlsx";
import Wrapper from "../../components/Wrapper";
import Button from "../../components/Button";
import styles from "../../styles/CreateAccount.module.css";
import { useState, useRef } from "react";
import { API, EMAIL, REGEX, REQUIRED } from "utilities/constants";
import { useForm } from "utilities/useForm";
import { useLazyFetch } from "utilities/useFetch";
import useOutsideClick from "utilities/useOutsideClick";
import InputBox from "components/InputBox";
import Swal from "sweetalert2";
import Loading from "pages/Loading";
import OurModal from "components/OurModal";

const CreateAccount = () => {
    const [selectedRole, setSelectedRole] = useState(STUDENT);
    const { values, errors, onChange, onSubmit, clearForm } = useForm(
        fields,
        handleSubmit
    );
    //values.tenTruong VD: values.fullname
    const [selectedFile, setSelectedFile] = useState();
    const [fetchdata, fetchResult] = useLazyFetch(`${API}/Account`, {
        method: "POST",
        body: {
            email: values.email,
            fullname: values.fullname,
            roleID: selectedRole
        },
        onCompletes: () => {
            Swal.fire("Success", "Account created", "success");
        },
        onError: (error) => {
            Swal.fire("Error", error.message, "error");
        }
    });

    const modalRef = useRef(null);
    let { isClicked, setIsClicked } = useOutsideClick(modalRef);

    const [fetchExcel, fetchExcelResult] = useLazyFetch(`${API}/Account/excel`);
    const submitExcel = () => {
        const formData = new FormData();

        formData.append("excelFile", selectedFile);
        formData.append("roleId", selectedRole);
        fetchExcel("", {
            method: "POST",
            body: formData,
            onCompletes: () => {
                Swal.fire("Success", "Account created successfully", "success");
            },
            onError: (error) => {
                const listError = error.map((err) => {
                    return `${err.errorDetail} in row ${err.rowIndex} and column ${err.columnIndex}`;
                });
                console.log(listError);
                Swal.fire({
                    title: "Error",
                    html: listError.join("<br/>"),
                    icon: "error",
                    confirmButtonText: "OK",
                    width: "36rem",
                    allowOutsideClick: false
                });
            }
        });
    };

    function downloadTemplate() {
        const aoaData = [["Email", "Fullname"]];
        const workSheet = XLSX.utils.aoa_to_sheet(aoaData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet 1");
        XLSX.writeFile(workBook, "Template.xlsx");
    }
    function handleSubmit() {
        fetchdata();
    }
    function handleSubmitFile() {
        if (selectedFile == null) {
            Swal.fire("Error", "Please select a file", "error");
        } else if (
            selectedFile.type !==
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
            selectedFile.type !== "application/vnd.ms-excel"
        ) {
            Swal.fire("Error", "File type is not supported", "error");
        } else {
            submitExcel();
        }
    }

    if (fetchResult.loading || fetchExcelResult.loading) {
        return <Loading />;
    }

    return (
        <Wrapper className="d-md-flex justify-content-center overflow-auto">
            <div className={styles.page_container}>
                {/* Page title */}
                <Heading className="d-none d-md-block">Create Account</Heading>
                {/* Form */}
                <div className="d-flex">
                    <form
                        className="shadow-light b-radius-8 d-flex flex-column p-3 px-md-5 py-md-4 w-100"
                        onSubmit={onSubmit}
                    >
                        {/* Smaller title */}
                        <Heading size={2} className="d-md-none">
                            Create Account
                        </Heading>
                        {/* Select Role for Bigger screens*/}

                        <div
                            className={`d-none d-md-flex ${styles.select_container}`}
                        >
                            <label className="text-capitalize">
                                <b>Role</b>
                            </label>
                            <div className={styles.grid_container}>
                                {/* <div className="d-flex justify-content-evenly"> */}
                                {/* <div
                                        className={`${styles.selector} ${selectedRole === ADMINISTRATOR &&
                                            styles.selected
                                            }`}
                                        onClick={() =>
                                            setSelectedRole(ADMINISTRATOR)
                                        }
                                    >
                                        <Icon icon="cog" className="me-1" />
                                        Administrator
                                    </div> */}

                                <div
                                    className={`${styles.selector} ${
                                        selectedRole === STUDENT &&
                                        styles.selected
                                    }`}
                                    onClick={() => setSelectedRole(STUDENT)}
                                >
                                    <Icon
                                        icon="user-graduate"
                                        className="me-3"
                                    />
                                    Student
                                </div>

                                <div
                                    className={`${styles.selector} ${
                                        selectedRole === ACADEMIC_DEPARTMENT &&
                                        styles.selected
                                    } me-0`}
                                    onClick={() =>
                                        setSelectedRole(ACADEMIC_DEPARTMENT)
                                    }
                                >
                                    <Icon icon="school" className="me-3" />
                                    Academic Department
                                </div>
                                {/* </div> */}

                                {/* <div className="d-flex justify-content-evenly"> */}
                                <div
                                    className={`${styles.selector} ${
                                        selectedRole === TEACHER &&
                                        styles.selected
                                    }`}
                                    onClick={() => setSelectedRole(TEACHER)}
                                >
                                    <Icon icon="briefcase" className="me-3" />
                                    Teacher
                                </div>

                                <div
                                    className={`${styles.selector} ${
                                        selectedRole === HEAD_OF_DEPARTMENT &&
                                        styles.selected
                                    }`}
                                    onClick={() =>
                                        setSelectedRole(HEAD_OF_DEPARTMENT)
                                    }
                                >
                                    <Icon icon="gem" className="me-3" />
                                    Head of Department
                                </div>
                                {/* </div> */}
                            </div>
                        </div>

                        {/* Horizontal line */}
                        <div className={`${styles.horizontal_line} mb-4`}></div>
                        {/* Select Role */}
                        <select
                            className={`${styles.select} mb-3 d-md-none`}
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option value={ADMINISTRATOR}>Administrator</option>
                            <option value={STUDENT}>Student</option>
                            <option value={TEACHER}>Teacher</option>
                            <option value={ACADEMIC_DEPARTMENT}>
                                Academic Department
                            </option>
                            <option value={HEAD_OF_DEPARTMENT}>
                                Head of Department
                            </option>
                        </select>
                        {/* Full name */}
                        <InputBox
                            label="Full name"
                            name="fullname"
                            className="mb-3 mb-md-4"
                            value={values.fullname}
                            onChange={onChange}
                            errorMessage={errors.fullname}
                        />
                        {/* User name
                    <InputBox
                        label="User name"
                        className="mb-3 mb-md-4"
                        name="userName"
                        value={values.userName}
                        onChange={onChange}
                        errorMessage={errors.userName}
                    /> */}
                        {/* Email */}
                        <InputBox
                            label="Email"
                            name="email"
                            className="mb-4 mb-md-5"
                            value={values.email}
                            onChange={onChange}
                            errorMessage={errors.email}
                        />
                        {/* Submit button */}
                        <div
                            className={`d-none d-md-flex justify-content-end align-items-center`}
                        >
                            <Button
                                btn="secondary"
                                className="me-4"
                                style={{ width: "6.5rem", height: "2.25rem" }}
                                onClick={() => clearForm()}
                            >
                                Cancel
                            </Button>
                            <Button
                                style={{ width: "6.5rem", height: "2.25rem" }}
                                type="submit"
                            >
                                <Icon icon="chevron-right" />
                                <Icon icon="chevron-right" className="me-2" />
                                Submit
                            </Button>
                        </div>
                        <button
                            type="submit"
                            className={`d-md-none ${styles.btn_submit}`}
                        >
                            <Icon icon="chevron-right" />
                            <Icon icon="chevron-right" className="me-2" />
                            Submit
                        </button>
                    </form>
                    <div
                        className={`d-none d-xxl-block ${styles.button_block}`}
                    >
                        <div
                            className={`d-flex flex-column justify-content-center`}
                        >
                            <button
                                className={`mb-3 ${styles.btn_file}`}
                                onClick={downloadTemplate}
                            >
                                <Icon icon="file-download" className="me-2" />
                                <span>Download template</span>
                            </button>
                            <button
                                className={`btn btn-success mb-3 ${styles.btn_file}`}
                                onClick={() => {
                                    setIsClicked(true);
                                }}
                            >
                                <Icon icon="file-excel" className="me-2" />
                                <span>Create by excel</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <OurModal
                modalRef={modalRef}
                isClicked={isClicked}
                setIsClicked={setIsClicked}
                modalClassName="d-none d-xl-block w-25"
                style={{ height: "33%" }}
            >
                <div
                    className={`h-100 d-flex flex-column align-items-center justify-content-around`}
                >
                    <div className="text-center h-25">
                        <Heading size={2}>Upload File</Heading>
                        <label
                            className={`btn btn-success btn-file ${styles.btn_file}`}
                        >
                            Choose file
                            <input
                                type="file"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    setSelectedFile(e.target.files[0]);
                                }}
                                required
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            />
                        </label>
                        {/* If file is null, don't show anything (prevent null reference exception) */}
                        <p>
                            {selectedFile && selectedFile.name}{" "}
                            <span>
                                {selectedFile && (
                                    <Icon
                                        icon="times"
                                        className="fs-6"
                                        onClick={() => setSelectedFile()}
                                        style={{ cursor: "pointer" }}
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="right"
                                        title="Remove file"
                                    ></Icon>
                                )}
                            </span>
                        </p>
                    </div>
                    <footer>
                        <button
                            type="submit"
                            className={`btn btn-primary ${styles.btn_file}`}
                            onClick={handleSubmitFile}
                        >
                            <Icon icon="upload" className="me-2" />
                            Submit
                        </button>
                    </footer>
                </div>
            </OurModal>
        </Wrapper>
    );
};
export default CreateAccount;

// Roles
const ADMINISTRATOR = 4;
const STUDENT = 1;
const ACADEMIC_DEPARTMENT = 3;
const TEACHER = 2;
const HEAD_OF_DEPARTMENT = 5;

//Input fields
const fields = {
    fullname: {
        validate: REQUIRED,
        message: "Please input the account's fullname"
    },
    email: {
        validate: REGEX,
        regex: EMAIL,
        message: "Email must be in the correct format"
    }
    // userName: {
    //     validate: REQUIRED,
    //     message: "Please input the account's username",
    // },
};
