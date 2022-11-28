import Button from "components/Button";
import Heading from "components/Heading";
import Icon from "components/Icon";
import InputBox from "components/InputBox";
import MultiStepFormProgressBar from "components/MultiStepFormProgressBar";
import OurModal from "components/OurModal";
import Pagination from "components/Pagination";
import SearchBar from "components/SearchBar";
import Table from "components/Table";
import Wrapper from "components/Wrapper";
import moment from "moment";
import Loading from "pages/Loading";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Swal from "sweetalert2";
import { API, REQUIRED } from "utilities/constants";
import { useLazyFetch } from "utilities/useFetch";
import { useForm } from "utilities/useForm";
import useOutsideClick from "utilities/useOutsideClick";
import { useWindowSize } from "utilities/useWindowSize";
import styles from "../../styles/CreateClass.module.css";
import * as XLSX from "xlsx";

const CreateClass = () => {
    const [formStep, setFormStep] = useState(0);
    const { values, setValues, errors, onChange, onSubmit, clearForm } =
        useForm(fields, handleSubmit);
    const { width, height } = useWindowSize();

    //----------------------------------------------- Handles selecting students ------------------------------------------------

    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [fetchExcel, fetchExcelResult] = useLazyFetch(
        `${API}/Student/ConvertExcelToEmailList`
    );
    const submitExcel = () => {
        const formData = new FormData();

        formData.append("excelFile", selectedFile);

        fetchExcel("", {
            method: "POST",
            body: formData,
            onCompletes: (emailList) => {
                setSelectedStudents(emailList);
                setFormStep(formStep + 1);
            },
            onError: (error) => {
                if (error.status == 409) {
                    Swal.fire("Error", error.message, "error");
                }
                const listError = error.map((err) => {
                    return `${err.errorDetail} in row ${err.rowIndex} and column ${err.columnIndex}`;
                });
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
        const aoaData = [["Email"]];
        const workSheet = XLSX.utils.aoa_to_sheet(aoaData);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "Sheet 1");
        XLSX.writeFile(workBook, "Template.xlsx");
    }

    function handleSubmitFile() {
        if (selectedFile == null) {
            Swal.fire("Error", "Please select a file", "error");
        } else if (
            selectedFile.type !=
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
            selectedFile.type != "application/vnd.ms-excel"
        ) {
            Swal.fire("Error", "File type is not supported", "error");
        } else {
            submitExcel();
        }
    }

    // const [searchName, setSearchName] = useState("");
    // const [currentPage, setCurrentPage] = useState(1);
    // const pageSize = 8;
    // //Lazy fetch for students of a teacher in a module
    // const [fetchStudents, fetchStudentsResult] = useLazyFetch(
    //     `${API}/Student?pageNumber=${currentPage}&pageSize=${pageSize}&searchName=${searchName}`
    // );

    // //Fetch students in the background
    // useEffect(() => {
    //     fetchStudents();
    //     // setSelectedStudents([...selectedStudents]);
    // }, [currentPage, searchName]);

    //----------------------------------------------- END Handles selecting students ------------------------------------------------

    //----------------------------------------------- Handles selecting modules ------------------------------------------------
    const [selectedModules, setSelectedModules] = useState([]);
    const [searchModule, setSearchModule] = useState("");
    //Lazy fetch for students of a teacher in a module
    const [fetchModules, fetchModulesResult] = useLazyFetch();

    //Fetch students in the background
    useEffect(() => {
        fetchModules(
            `${API}/Module?pageNumber=1&pageSize=9999&searchName=${searchModule}`
        );
    }, [searchModule]);
    //----------------------------------------------- END Handles selecting modules ------------------------------------------------

    //----------------------------------------------- Handles selecting teacher ------------------------------------------------
    const [selectedTeacher, setSelectedTeacher] = useState([]);
    const [fetchTeachers, fetchTeachersResult] = useLazyFetch();

    useEffect(() => {
        fetchTeachers(`${API}/Teacher/idName`);
    }, []);

    //----------------------------------------------- END Handles selecting teacher ------------------------------------------------

    //----------------------------------------------- Handles posting class information ------------------------------------------------
    const [postClass, postClassResult] = useLazyFetch();
    const history = useHistory();

    function handleSubmit() {
        postClass(`${API}/Class/createClass`, {
            method: "POST",
            body: {
                className: values.className,
                startDay: values.startDate,
                endDay: values.endDate,
                moduleTeacherStudentIds: selectedTeacher.map((teacher) => {
                    return {
                        studentIds: selectedStudents.map(
                            (student) => student.studentId
                        ),
                        ...teacher
                    };
                })
            },
            onCompletes: (data) => {
                Swal.fire({
                    titleText: "Create class successfully",
                    icon: "success",
                    customClass: {
                        popup: "roundCorner"
                    }
                });
                history.push(`/AcademicDepartment/class`);
            },
            onError: (error) => {
                Swal.fire("Error", error.message, "error");
            }
        });
    }

    if (postClassResult.loading) {
        return <Loading />;
    }

    //----------------------------------------------- End Handles posting class information ------------------------------------------------
    if (width < 1400) {
        return (
            <Wrapper className="d-flex">
                <h2
                    className="m-auto font-weight-bolder text-center p-3"
                    style={{ fontFamily: "monospace" }}
                >
                    This page not support mobile device. Please switch to
                    computer to use this function!
                </h2>
            </Wrapper>
        );
    }
    return (
        <Wrapper className={styles.background}>
            {/* Title */}
            <Heading>Create Class</Heading>

            <div className={styles.form_container}>
                <MultiStepFormProgressBar
                    steps={[
                        {
                            stepIcon: ["fas", "info"],
                            stepName: "Basic information"
                        },
                        {
                            stepIcon: ["fas", "user-graduate"],
                            stepName: "Student"
                        },
                        {
                            stepIcon: ["fas", "book-open"],
                            stepName: "Module"
                        },
                        {
                            stepIcon: ["fas", "chalkboard-teacher"],
                            stepName: "Teacher"
                        }
                    ]}
                    currentStep={formStep}
                    className={`d-flex flex-column justify-content-center me-3 mt-5`}
                />
                {/* vertical line */}
                <div className={styles.vertical_line}></div>
                {/* Form content */}
                <form
                    className={styles.form_content_container}
                    onSubmit={onSubmit}
                >
                    {formStep === 0 && (
                        <ClassInforFormContent
                            formStep={formStep}
                            setFormStep={setFormStep}
                            values={values}
                            errors={errors}
                            onChange={onChange}
                        />
                    )}
                    {formStep === 1 && (
                        <StudentFormContent
                            formStep={formStep}
                            setFormStep={setFormStep}
                            selectedStudents={selectedStudents}
                            downloadTemplate={downloadTemplate}
                            selectedFile={selectedFile}
                            setSelectedFile={setSelectedFile}
                            handleSubmitFile={handleSubmitFile}
                            fetchExcelResult={fetchExcelResult}
                            // fetchStudents={fetchStudents}
                            // fetchStudentsResult={fetchStudentsResult}
                            // setSelectedStudents={setSelectedStudents}
                            // searchName={searchName}
                            // setSearchName={setSearchName}
                            // currentPage={currentPage}
                            // setCurrentPage={setCurrentPage}
                            // pageSize={pageSize}
                        />
                    )}
                    {formStep === 2 && (
                        <ModuleFormContent
                            formStep={formStep}
                            setFormStep={setFormStep}
                            fetchModulesResult={fetchModulesResult}
                            selectedModules={selectedModules}
                            setSelectedModules={setSelectedModules}
                        />
                    )}
                    {formStep === 3 && (
                        <TeacherFormContent
                            formStep={formStep}
                            setFormStep={setFormStep}
                            fetchTeachersResult={fetchTeachersResult}
                            selectedTeacher={selectedTeacher}
                            setSelectedTeacher={setSelectedTeacher}
                            selectedModules={selectedModules}
                        />
                    )}
                </form>
            </div>
        </Wrapper>
    );
};

export default CreateClass;

const ClassInforFormContent = ({
    formStep,
    setFormStep,
    values,
    errors,
    onChange
}) => {
    return (
        <div>
            {/* Heading */}
            <Heading size={2} style={{ color: "var(--color-blue)" }}>
                Class Information
            </Heading>
            {/* Horizontal line */}
            <div className={styles.horizontal_line}></div>

            <div className={styles.input_container}>
                <InputBox
                    label="Enter class name *"
                    orientation_vertical={true}
                    name="className"
                    value={values.className}
                    onChange={onChange}
                    errorMessage={errors.className}
                />
                <InputBox
                    label="Start date *"
                    orientation_vertical={true}
                    name="startDate"
                    type="datetime-local"
                    minValue={moment().format("YYYY-MM-DDTHH:MM")}
                    value={values.startDate}
                    onChange={onChange}
                    errorMessage={errors.startDate}
                />
                <InputBox
                    label="End date *"
                    orientation_vertical={true}
                    name="endDate"
                    type="datetime-local"
                    minValue={moment().format("YYYY-MM-DDTHH:MM")}
                    value={values.endDate}
                    onChange={onChange}
                    errorMessage={errors.endDate}
                />
            </div>

            <div className="d-flex justify-content-end align-items-center">
                <Button
                    className={styles.btn}
                    onClick={() => setFormStep(formStep + 1)}
                    {...((values.className &&
                        values.startDate &&
                        values.endDate) || { disabled: true })}
                >
                    <Icon icon="angle-double-right" className="me-2" />
                    Next
                </Button>
            </div>
        </div>
    );
};

const StudentFormContent = ({
    formStep,
    setFormStep,
    selectedStudents = [],
    downloadTemplate,
    selectedFile,
    setSelectedFile,
    handleSubmitFile,
    fetchExcelResult
    // fetchStudents,
    // fetchStudentsResult,
    // setSelectedStudents,
    // searchName,
    // setSearchName,
    // currentPage,
    // setCurrentPage,
    // pageSize
}) => {
    // if (fetchStudentsResult.loading) {
    //     return <Loading />;
    // }

    // const columns = ["Full name", "Email"];

    // function handleStudentSearch() {
    //     fetchStudents();
    // }

    if (fetchExcelResult.loading) {
        return <Loading className={`px-0 w-50`} />;
    }

    return (
        <div>
            {/* Heading */}
            <Heading size={2} style={{ color: "var(--color-blue)" }}>
                Student
            </Heading>

            {/* Horizontal line */}
            <div className={styles.horizontal_line}></div>

            {/* Upload file container */}
            <div className={` ${styles.tab_content_container}`}>
                <div className={` ${styles.chosen_item_container} col-6`}>
                    <button
                        className={`btn btn-info mb-2 ${styles.btn_file}`}
                        onClick={downloadTemplate}
                    >
                        <Icon icon="file-download" className="me-2" />
                        Download template
                    </button>
                </div>

                <div
                    className={` ${styles.chosen_item_container} col-6 flex-column pt-4`}
                >
                    <label
                        className={`btn btn-success btn-file mb-2 pt-5 ${styles.btn_file}`}
                    >
                        <Icon icon="file-excel" className="me-2" />
                        Upload Excel file
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
            </div>

            {/* Tab content container */}
            {/* <div className={` ${styles.tab_content_container}`}> */}
            {/* <div> */}
            {/* <SearchBar
                        onSubmit={handleStudentSearch}
                        keyWord={searchName}
                        setKeyWord={setSearchName}
                        placeholder="Search student by name"
                    ></SearchBar> */}
            {/* Select student container */}
            {/* <Table
                        isSelectable={true}
                        columns={columns}
                        data={fetchStudentsResult.data?.payload
                            .filter(
                                (student) => !selectedStudents.includes(student)
                            )
                            .map((student, index) => ({
                                Fullname: student.fullname,
                                Email: student.email
                            }))}
                        // onClick={() => {
                        //     setSelectedStudents([
                        //         ...selectedStudents,
                        //         fetchStudentsResult.data?.payload.find((s) => {
                        //             return (
                        //                 String(s.studentId) ===
                        //                 String(student.studentId)
                        //             );
                        //         })
                        //     ]);
                        //     styles = { backgroundColor: "red" };
                        // }}
                    /> */}
            {/* <Pagination
                        totalRecords={fetchStudentsResult.data?.totalRecords}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        pageSize={pageSize}
                    /> */}
            {/* </div> */}
            {/* </div> */}

            {/*  Button group */}
            <div className="d-flex justify-content-end align-items-center mt-3">
                <Button
                    className="me-3"
                    onClick={() => setFormStep(formStep - 1)}
                >
                    <Icon icon="angle-double-left" className="me-2" />
                    Back
                </Button>

                <Button
                    onClick={() => handleSubmitFile()}
                    {...(selectedFile == null ? { disabled: true } : {})}
                >
                    <Icon icon="angle-double-right" className="me-2" />
                    Next
                </Button>
            </div>
        </div>
    );
};

const ModuleFormContent = ({
    formStep,
    setFormStep,
    fetchModulesResult,
    selectedModules,
    setSelectedModules
}) => {
    if (fetchModulesResult.loading) {
        return <Loading />;
    }

    return (
        <div>
            {/* Heading */}
            <Heading size={2} style={{ color: "var(--color-blue)" }}>
                Module
            </Heading>
            {/* Horizontal line */}
            <div className={styles.horizontal_line}></div>

            {/* Tab content container */}
            <div
                className={`${styles.input_container_grid} ${styles.tab_content_container_module}`}
            >
                {/* Select student container */}
                <div
                    className={`px-3 pt-2 ${styles.chosen_item_container_module}`}
                >
                    {fetchModulesResult.data?.payload
                        .filter((module) => !selectedModules.includes(module))
                        .map((module, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`d-flex align-items-center px-2 ${styles.chosen_item}  ${styles.select_student}`}
                                    onClick={() => {
                                        setSelectedModules([
                                            ...selectedModules,
                                            fetchModulesResult.data?.payload.find(
                                                (s) => {
                                                    return (
                                                        String(s.moduleId) ===
                                                        String(module.moduleId)
                                                    );
                                                }
                                            )
                                        ]);
                                    }}
                                >
                                    {`${module.moduleCode} - ${module.moduleName}`}
                                </div>
                            );
                        })}
                </div>

                {/* Chosen item container */}
                <div
                    className={`px-3 pt-2 ${styles.chosen_item_container_module}`}
                >
                    {selectedModules.length > 0 &&
                    selectedModules !== undefined ? (
                        <>
                            <p
                                className="mb-0"
                                style={{ color: "var(--color-blue)" }}
                            >
                                Selected Modules
                            </p>
                            {selectedModules.map((module, index) => (
                                <div
                                    className={`d-flex align-items-center px-2 ${styles.chosen_item} ${styles.remove_student}`}
                                    onClick={() => {
                                        // On click remove module from selected modules
                                        setSelectedModules(
                                            selectedModules.filter(
                                                (s) =>
                                                    s.moduleId !==
                                                    module.moduleId
                                            )
                                        );
                                    }}
                                    key={index}
                                >
                                    {/* Play icon */}
                                    <span
                                        className={`me-2 ${styles.play_icon}`}
                                    >
                                        <Icon icon="caret-right" />
                                    </span>
                                    {`${module?.moduleCode} - ${module?.moduleName}`}
                                </div>
                            ))}
                        </>
                    ) : (
                        <div
                            className={`d-flex align-items-center px-2 ${styles.chosen_item}`}
                        >
                            No module selected
                        </div>
                    )}
                </div>
            </div>
            {/*  Button group */}
            <div className="d-flex justify-content-end align-items-center  mt-3">
                <Button
                    className="me-3"
                    onClick={() => setFormStep(formStep - 1)}
                >
                    <Icon icon="angle-double-left" className="me-2" />
                    Back
                </Button>

                <Button
                    onClick={() => setFormStep(formStep + 1)}
                    {...(selectedModules.length > 0 || { disabled: true })}
                >
                    <Icon icon="angle-double-right" className="me-2" />
                    Next
                </Button>
            </div>
        </div>
    );
};

const TeacherFormContent = ({
    formStep,
    setFormStep,
    fetchTeachersResult,
    selectedTeacher,
    setSelectedTeacher,
    selectedModules
}) => {
    if (fetchTeachersResult.loading) {
        return <Loading />;
    }

    return (
        <div>
            {/* Title */}
            <Heading size={2} style={{ color: "var(--color-blue)" }}>
                Teacher
            </Heading>
            {/* Horizontal line */}
            <div className={styles.horizontal_line}></div>

            {/* Container */}
            <div>
                {selectedModules?.map((selectedModule, index) => (
                    <div key={index} className="mt-3">
                        <p
                            className="mb-0"
                            style={{ color: "var(--color-blue)" }}
                        >
                            {`${selectedModule.moduleCode} - ${selectedModule.moduleName}`}
                        </p>
                        <select
                            className={styles.input_select}
                            onChange={(e) => {
                                if (e.target.value != -1) {
                                    setSelectedTeacher([
                                        ...selectedTeacher.filter(
                                            (t) =>
                                                t.moduleId !==
                                                selectedModule.moduleId
                                        ),
                                        {
                                            moduleId: selectedModule.moduleId,
                                            teacherId:
                                                fetchTeachersResult.data[
                                                    e.target.value
                                                ].teacherId
                                        }
                                    ]);
                                } else {
                                    setSelectedTeacher([
                                        ...selectedTeacher.filter(
                                            (t) =>
                                                t.moduleId !==
                                                selectedModule.moduleId
                                        )
                                    ]);
                                }
                            }}
                        >
                            <option value="-1">
                                Select teacher for this module
                            </option>
                            {fetchTeachersResult.data?.map((teacher, index) => {
                                return (
                                    <option value={index} key={index}>
                                        {`${teacher.fullname} - ${teacher.email}`}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                ))}
            </div>

            {/*  Button group */}
            <div className="d-flex justify-content-end align-items-center mt-3">
                <Button
                    className="me-3"
                    onClick={() => setFormStep(formStep - 1)}
                >
                    <Icon icon="angle-double-left" className="me-2" />
                    Back
                </Button>

                <Button
                    {...(selectedTeacher.length == selectedModules.length || {
                        disabled: true
                    })}
                    type="submit"
                >
                    <Icon icon="save" className="me-2" />
                    Save
                </Button>
            </div>
        </div>
    );
};

const fields = {
    className: {
        validate: REQUIRED,
        errorMessage: "Class name is required"
    },
    startDate: {
        validate: REQUIRED,
        errorMessage: "Start date is required"
    },
    endDate: {
        validate: REQUIRED,
        errorMessage: "End date is required"
    }
};
