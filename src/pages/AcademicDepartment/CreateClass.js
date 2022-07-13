import Button from "components/Button";
import Heading from "components/Heading";
import Icon from "components/Icon";
import InputBox from "components/InputBox";
import MultiStepFormProgressBar from "components/MultiStepFormProgressBar";
import SearchBar from "components/SearchBar";
import Wrapper from "components/Wrapper";
import moment from "moment";
import Loading from "pages/Loading";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Swal from "sweetalert2";
import { API, REQUIRED } from "utilities/constants";
import { useLazyFetch } from "utilities/useFetch";
import { useForm } from "utilities/useForm";
import { useWindowSize } from "utilities/useWindowSize";
import styles from "../../styles/CreateClass.module.css";

const CreateClass = () => {
    const [formStep, setFormStep] = useState(0);
    const { values, setValues, errors, onChange, onSubmit, clearForm } =
        useForm(fields, handleSubmit);
    const { width, height } = useWindowSize();

    //----------------------------------------------- Handles selecting students ------------------------------------------------
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [searchName, setSearchName] = useState("");
    //Lazy fetch for students of a teacher in a module
    const [fetchStudents, fetchStudentsResult] = useLazyFetch();

    //Fetch students in the background
    useEffect(() => {
        fetchStudents(
            `${API}/Student?pageNumber=1&pageSize=99999&searchName=${searchName}`
        );
        // setSelectedStudents([...selectedStudents]);
    }, [searchName]);
    //----------------------------------------------- END Handles selecting students ------------------------------------------------

    //----------------------------------------------- Handles selecting modules ------------------------------------------------
    const [selectedModules, setSelectedModules] = useState([]);
    const [searchModule, setSearchModule] = useState("");
    //Lazy fetch for students of a teacher in a module
    const [fetchModules, fetchModulesResult] = useLazyFetch();

    //Fetch students in the background
    useEffect(() => {
        fetchModules(
            `${API}/Module?pageNumber=1&pageSize=99999&searchName=${searchModule}`
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
                {formStep === 1 && (
                    <StudentFormContent
                        formStep={formStep}
                        setFormStep={setFormStep}
                        fetchStudents={fetchStudents}
                        fetchStudentsResult={fetchStudentsResult}
                        selectedStudents={selectedStudents}
                        setSelectedStudents={setSelectedStudents}
                        searchName={searchName}
                        setSearchName={setSearchName}
                    />
                )}
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
                    label="Enter class name"
                    orientation_vertical={true}
                    name="className"
                    value={values.className}
                    onChange={onChange}
                />
                <InputBox
                    label="Start date"
                    orientation_vertical={true}
                    name="startDate"
                    type="datetime-local"
                    minValue={moment().format("YYYY-MM-DDTHH:MM")}
                    value={values.startDate}
                    onChange={onChange}
                />
                <InputBox
                    label="End date"
                    orientation_vertical={true}
                    name="endDate"
                    type="datetime-local"
                    minValue={moment().format("YYYY-MM-DDTHH:MM")}
                    value={values.endDate}
                    onChange={onChange}
                />
            </div>

            <div className="d-flex justify-content-end align-items-center">
                <Button
                    className={styles.btn}
                    onClick={() => setFormStep(formStep + 1)}
                    {...(values.className || { disabled: true })}
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
    fetchStudents,
    fetchStudentsResult,
    selectedStudents = [],
    setSelectedStudents,
    searchName,
    setSearchName
}) => {
    // if (fetchStudentsResult.loading) {
    //     return <Loading />;
    // }

    return (
        <div>
            {/* Heading */}
            <Heading size={2} style={{ color: "var(--color-blue)" }}>
                Student
            </Heading>
            {/* Horizontal line */}
            <div className={styles.horizontal_line}></div>

            {/* Tab content container */}
            <div
                className={`${styles.input_container_grid} ${styles.tab_content_container}`}
            >
                <div>
                    <SearchBar
                        onSubmit={() => fetchStudents}
                        keyWord={searchName}
                        setKeyWord={setSearchName}
                    />
                    {/* Select student container */}
                    <div
                        className={`px-3 py-1 ${styles.chosen_item_container}`}
                    >
                        {fetchStudentsResult.data?.payload
                            .filter(
                                (student) => !selectedStudents.includes(student)
                            )
                            .map((student, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`d-flex align-items-center px-2 ${styles.chosen_item}  ${styles.select_student}`}
                                        onClick={() => {
                                            setSelectedStudents([
                                                ...selectedStudents,
                                                fetchStudentsResult.data?.payload.find(
                                                    (s) => {
                                                        return (
                                                            String(
                                                                s.studentId
                                                            ) ===
                                                            String(
                                                                student.studentId
                                                            )
                                                        );
                                                    }
                                                )
                                            ]);
                                        }}
                                    >
                                        {`${student.fullname} - ${student.email}`}
                                    </div>
                                );
                            })}
                    </div>
                </div>

                {/* Chosen item container */}
                <div className={`px-3 pt-2 ${styles.chosen_item_container}`}>
                    {selectedStudents.length > 0 &&
                    selectedStudents !== undefined ? (
                        <>
                            <p
                                className="mb-0"
                                style={{ color: "var(--color-blue)" }}
                            >
                                Selected Students
                            </p>
                            {selectedStudents.map((student, index) => (
                                <div
                                    className={`d-flex align-items-center px-2 ${styles.chosen_item} ${styles.remove_student}`}
                                    onClick={() => {
                                        // On click remove student from selected students
                                        setSelectedStudents(
                                            selectedStudents.filter(
                                                (s) =>
                                                    s.studentId !==
                                                    student.studentId
                                            )
                                        );
                                    }}
                                    key={index}
                                >
                                    {/* Icon */}
                                    <span className={`me-2`}>
                                        <Icon icon="user" />
                                    </span>
                                    {`${student?.fullname} - ${student?.email}`}
                                </div>
                            ))}
                        </>
                    ) : (
                        <div
                            className={`d-flex align-items-center px-2 ${styles.chosen_item}`}
                        >
                            No students selected
                        </div>
                    )}
                </div>
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
                    onClick={() => setFormStep(formStep + 1)}
                    {...(selectedStudents.length > 0 || { disabled: true })}
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
                className={`${styles.input_container_grid} ${styles.tab_content_container}`}
            >
                {/* Select student container */}
                <div className={`px-3 pt-2 ${styles.chosen_item_container}`}>
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
                <div className={`px-3 pt-2 ${styles.chosen_item_container}`}>
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
                                        ...selectedTeacher,
                                        {
                                            moduleId: selectedModule.moduleId,
                                            teacherId:
                                                fetchTeachersResult.data[
                                                    e.target.value
                                                ].teacherId
                                        }
                                    ]);
                                } else {
                                    setSelectedTeacher([]);
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
