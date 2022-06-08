import Wrapper from "components/Wrapper";
import MultiStepFormProgressBar from "../../components/MultiStepFormProgressBar";
import styles from "../../styles/CreateExam.module.css";
import React, { useEffect } from "react";
import Heading from "components/Heading";
import InputBox from "components/InputBox";
import Button from "components/Button";
import Icon from "components/Icon";
import { API, REQUIRED } from "../../utilities/constants";
import { useState } from "react";
import { useForm } from "utilities/useForm";
import moment from "moment";
import { useLazyFetch, useFetch } from "utilities/useFetch";
import { useSelector } from "react-redux";
import Loading from "pages/Loading";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const CreateExam = ({ isFinalExam = false }) => {
    const [formStep, setFormStep] = useState(0);
    const { values, setValues, errors, onChange, onSubmit, clearForm } =
        useForm(fields, handleSubmit);

    const teacher = useSelector((state) => state.user);

    //----------------------------------------------- Handles selecting module ------------------------------------------------
    const [selectedModule, setSelectedModule] = useState(null);

    //Lazy fetch for teacher's modules
    const [fetchModules, fetchModulesResult] = useLazyFetch(
        `${API}/Module/teacher/${teacher.accountId}`
    );

    // Lazy fetch for all modules (ONLY FOR FINAL EXAMS)
    const [fetchAllModules, fetchAllModulesResult] = useLazyFetch(
        `${API}/Module`
    );

    //Fetch modules in background
    useEffect(() => {
        isFinalExam ? fetchAllModules() : fetchModules();
    }, []);
    //----------------------------------------------- End Handles selecting module ------------------------------------------------

    //----------------------------------------------- Handles selecting class ------------------------------------------------
    const [selectedClass, setSelectedClass] = useState(null);
    //Lazy fetch for teacher's classes of chosen module
    const [fetchClasses, fetchClassesResult] = useLazyFetch();

    //Fetch classes in background
    useEffect(() => {
        //In case of resetting module to no value
        if (selectedModule === null || selectedModule === undefined) {
            return;
        }

        //Fetch all classes of chosen module if is creating final exam
        //else
        //Fetch only the classes of the chosen module that belongs to the teacher creating the exam
        isFinalExam
            ? fetchClasses(`${API}/ClassModule/list/${selectedModule.moduleId}`)
            : fetchClasses(
                  `${API}/ClassModule/${teacher.accountId}/${selectedModule.moduleId}`
              );
        setSelectedClass(null);
    }, [selectedModule]);

    //----------------------------------------------- End Handles selecting class ------------------------------------------------

    //----------------------------------------------- Handles selecting students ------------------------------------------------
    const [selectedStudents, setSelectedStudents] = useState([]);
    //Lazy fetch for students of a teacher in a module
    const [fetchStudents, fetchStudentsResult] = useLazyFetch();

    //Fetch students in the background
    useEffect(() => {
        if (selectedModule === null || selectedModule === undefined) {
            return;
        }
        //Fetch students to be selected
        //Fetch all students of chosen module if is creating final exam
        //else
        //Fetch only the students of the chosen module that belongs to the teacher creating the exam

        isFinalExam
            ? fetchStudents(`${API}/Student/list/${selectedModule.moduleId}`)
            : fetchStudents(
                  `${API}/Student/${teacher.accountId}/${selectedModule.moduleId}`
              );
        setSelectedStudents([]);
    }, [selectedModule]);
    //----------------------------------------------- END Handles selecting students ------------------------------------------------

    //----------------------------------------------- Handles Tabbing for assign class and students ------------------------------------------------
    const [toggleClassStudent, setToggleClassStudent] = useState(true);
    //----------------------------------------------- END Handles Tabbing for assign class and students ------------------------------------------------

    //----------------------------------------------- Handles selecting Proctor, Supervisor, Grader ------------------------------------------------
    const [selectedProctor, setSelectedProctor] = useState(null);
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);
    const [selectedGrader, setSelectedGrader] = useState(null);

    //Why the hell am I using lazy fetch? I could just use useFetch
    //Fetch for teacher
    const fetchTeacherResult = useFetch(`${API}/Teacher/idName`, {
        onCompletes: (data) => {
            setSelectedProctor(data[0].teacherId);
            setSelectedGrader(data[0].teacherId);
        }
    });

    //Fetch academic department members
    const fetchAcaDeptMembersResult = useFetch(
        `${API}/AcademicDepartment/list`,
        { onCompletes: (data) => setSelectedSupervisor(data[0].id) }
    );

    // ----------------------------------------------- END Handles selecting Proctor, Supervisor, Grader ------------------------------------------------

    //----------------------------------------------- Handles posting exam information ------------------------------------------------
    const [postExam, postExamResult] = useLazyFetch();

    const [examStudents, setExamStudents] = useState([]);
    const [fetchClassStudents, fetchClassStudentsResult] = useLazyFetch();
    //Whenever a class is selected, fetch students of that class. If students are selected, then set them to examStudents instead
    useEffect(() => {
        if (selectedClass !== null && selectedClass !== undefined) {
            //Fetch students of a classModule and set them to state
            fetchClassStudents(
                `${API}/Student/${selectedClass.classModuleId}`,
                {
                    onCompletes: (data) => setExamStudents(data.payload)
                }
            );
            return;
        } else if (selectedStudents.length > 0) {
            //Set selected students to Exam student
            setExamStudents(selectedStudents);
        }
    }, [selectedClass, selectedStudents]);

    const history = useHistory();

    function handleSubmit() {
        postExam(`${API}/Exam/createExamInfo`, {
            method: "POST",
            body: {
                examName: values.examName,
                description: values.description,
                durationInMinute: values.duration,
                examDay: values.examDate,
                room: values.room,
                password: values.password,
                isFinalExam: isFinalExam,
                studentIds: examStudents.map((student) => student.studentId),
                moduleId: selectedModule.moduleId,
                proctorId: isFinalExam ? selectedProctor : teacher.accountId,
                supervisorId: isFinalExam
                    ? selectedSupervisor
                    : teacher.accountId,
                graderId: isFinalExam ? selectedGrader : teacher.accountId
            },
            onCompletes: (data) => {
                Swal.fire({
                    title: "Success",
                    text: "Please begin selecting questions for this exam",
                    icon: "success",
                    confirmButtonText: "Yes"
                });

                isFinalExam
                    ? history.push(
                          `/AcademicDepartment/exam/create/question/${
                              data.examId
                          }/${selectedModule.moduleId}/${false}`
                      )
                    : history.push(
                          `/teacher/exam/create/question/${data.examId}/${
                              selectedModule.moduleId
                          }/${false}`
                      );
            },
            onError: (error) => {
                Swal.fire("Error", error.message, "error");
            }
        });
    }

    //----------------------------------------------- End Handles posting exam information ------------------------------------------------

    if (postExamResult.loading) {
        return <Loading />;
    }

    return (
        <Wrapper className={styles.background}>
            {/* Title */}
            <Heading>Create Exam</Heading>

            {/* Form container */}
            <div className={styles.form_container}>
                {/* Multi step form progress bar */}
                <MultiStepFormProgressBar
                    steps={[
                        {
                            stepIcon: ["fas", "info"],
                            stepName: "Basic information"
                        },
                        {
                            stepIcon: ["fas", "book-open"],
                            stepName: "Module"
                        },
                        {
                            stepIcon: ["fas", "user-graduate"],
                            stepName: "Assign Class & Students"
                        },
                        isFinalExam && {
                            stepIcon: ["fas", "chalkboard-teacher"],
                            stepName: "Assign Administration"
                        }
                    ]}
                    currentStep={formStep}
                    className={`d-flex flex-column justify-content-center me-3 mt-5`}
                />
                {/* vertical line */}
                <div className={styles.vertical_line}></div>
                {/* Form content*/}
                <form
                    className={styles.form_content_container}
                    onSubmit={onSubmit}
                >
                    {/* Change content of form based on step */}
                    {formStep === 0 && (
                        <ExamInformationFormContent
                            formStep={formStep}
                            setFormStep={setFormStep}
                            values={values}
                            errors={errors}
                            onChange={onChange}
                        />
                    )}
                    {formStep === 1 && (
                        <ModuleFormContent
                            formStep={formStep}
                            setFormStep={setFormStep}
                            fetchModulesResult={
                                isFinalExam
                                    ? fetchAllModulesResult
                                    : fetchModulesResult
                            }
                            selectedModule={selectedModule}
                            setSelectedModule={setSelectedModule}
                        />
                    )}
                    {formStep === 2 && (
                        <ClassAndTraineeFormContent
                            formStep={formStep}
                            setFormStep={setFormStep}
                            fetchClassesResult={fetchClassesResult}
                            fetchStudentsResult={fetchStudentsResult}
                            selectedClass={selectedClass}
                            setSelectedClass={setSelectedClass}
                            selectedStudents={selectedStudents}
                            setSelectedStudents={setSelectedStudents}
                            toggleClassStudent={toggleClassStudent}
                            setToggleClassStudent={setToggleClassStudent}
                            isFinalExam={isFinalExam}
                        />
                    )}
                    {formStep === 3 && (
                        <ProctorSupervisorGraderFormContent
                            formStep={formStep}
                            setFormStep={setFormStep}
                            teacherList={fetchTeacherResult.data}
                            acaDeptMemberList={fetchAcaDeptMembersResult.data}
                            selectedGrader={selectedGrader}
                            setSelectedGrader={setSelectedGrader}
                            selectedProctor={selectedProctor}
                            setSelectedProctor={setSelectedProctor}
                            selectedSupervisor={selectedSupervisor}
                            setSelectedSupervisor={setSelectedSupervisor}
                        />
                    )}
                </form>
            </div>
        </Wrapper>
    );
};

export default CreateExam;

// Exam information form content
const ExamInformationFormContent = ({
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
                Exam Information
            </Heading>
            {/* Horizontal line */}
            <div className={styles.horizontal_line}></div>
            {/* input container */}
            <div className={styles.input_container_grid}>
                {/* Input fields */}
                <InputBox
                    label="Exam name *"
                    orientation_vertical={true}
                    name="examName"
                    value={values.examName}
                    onChange={onChange}
                />
                <InputBox
                    label="Description"
                    orientation_vertical={true}
                    name="description"
                    value={values.description}
                    onChange={onChange}
                />
                <InputBox
                    label="Duration *"
                    orientation_vertical={true}
                    name="duration"
                    type="number"
                    minValue={1}
                    value={values.duration}
                    onChange={onChange}
                />
                {/* minvalue format: YYYY-MM-DDTHH:MM */}
                <InputBox
                    label="Date *"
                    orientation_vertical={true}
                    name="examDate"
                    type="datetime-local"
                    minValue={moment().format("YYYY-MM-DDTHH:MM")}
                    value={values.examDate}
                    onChange={onChange}
                />
                <InputBox
                    label="Room"
                    orientation_vertical={true}
                    name="room"
                    value={values.room}
                    onChange={onChange}
                />
                <InputBox
                    label="Password"
                    orientation_vertical={true}
                    name="password"
                    value={values.password}
                    onChange={onChange}
                />
            </div>

            <div className="d-flex justify-content-end align-items-center">
                <Button
                    className={styles.btn}
                    onClick={() => setFormStep(formStep + 1)}
                    {...((values.examName &&
                        values.duration &&
                        values.examDate) || { disabled: true })}
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
    selectedModule,
    setSelectedModule
}) => {
    return (
        <div>
            {/* Title */}
            <Heading size={2} style={{ color: "var(--color-blue)" }}>
                Module
            </Heading>
            {/* Horizontal line */}
            <div className={styles.horizontal_line}></div>
            {/* input container */}
            <div className={styles.input_container_grid}>
                {/* Select input */}
                <select
                    className={styles.input_select}
                    onChange={(e) => {
                        if (e.target.value !== -1) {
                            setSelectedModule(
                                fetchModulesResult.data.payload[e.target.value]
                            );
                        } else {
                            setSelectedModule(null);
                        }
                    }}
                >
                    <option value="-1">Select module</option>
                    {fetchModulesResult.data.payload.map((module, index) => {
                        return (
                            <option value={index} key={index}>
                                {module.moduleCode}
                            </option>
                        );
                    })}
                </select>
                {/* Chosen item container */}
                <div className={`px-3 ${styles.chosen_item_container}`}>
                    {/* Item category */}
                    <Heading
                        size={5}
                        style={{ color: "var(--color-blue)" }}
                        className="text-center"
                    >
                        Chosen Module
                    </Heading>
                    {/* Chosen items */}
                    {selectedModule ? (
                        <div
                            className={`d-flex align-items-center px-2 ${styles.chosen_item}`}
                        >
                            {/* Play icon */}
                            <span className={`me-2 ${styles.play_icon}`}>
                                <Icon icon="caret-right" />
                            </span>
                            {`${selectedModule.moduleCode} - ${selectedModule.moduleName}`}
                        </div>
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
            <div className="d-flex justify-content-end align-items-center">
                <Button
                    className="me-3"
                    onClick={() => setFormStep(formStep - 1)}
                >
                    <Icon icon="angle-double-left" className="me-2" />
                    Back
                </Button>
                <Button
                    onClick={() => setFormStep(formStep + 1)}
                    {...(selectedModule || { disabled: true })}
                >
                    <Icon icon="angle-double-right" className="me-2" />
                    Next
                </Button>
            </div>
        </div>
    );
};

const ClassAndTraineeFormContent = ({
    formStep,
    setFormStep,
    fetchClassesResult,
    fetchStudentsResult,
    selectedClass,
    setSelectedClass,
    selectedStudents = [],
    setSelectedStudents,
    toggleClassStudent,
    setToggleClassStudent,
    isFinalExam
}) => {
    //Toggle between class and student select form
    //true for Class, false for Student
    return (
        <div>
            {/* Title */}
            <Heading size={2} style={{ color: "var(--color-blue)" }}>
                Assign Class or Students
            </Heading>
            {/* Horizontal line */}
            <div className={styles.horizontal_line}></div>
            {/* Tab container */}
            <div className={styles.tab_container}>
                {/* Tabs name container*/}
                <div
                    className="d-flex align-items-center ms-4 mt-2"
                    style={{ color: "var(--color-blue)" }}
                >
                    {/* Class tab */}
                    <div
                        className={`me-4 ${styles.tab_name} ${
                            toggleClassStudent && styles.tab_name_active
                        } ${
                            selectedStudents.length > 0 &&
                            styles.tab_name_disabled
                        }`}
                        onClick={() =>
                            selectedStudents.length > 0 ||
                            setToggleClassStudent(true)
                        }
                    >
                        <Icon icon="home" className="me-1" />
                        Class
                    </div>
                    {/* Student tab */}
                    <div
                        className={`${styles.tab_name} ${
                            toggleClassStudent || styles.tab_name_active
                        } ${selectedClass && styles.tab_name_disabled}`}
                        onClick={() => {
                            selectedClass || setToggleClassStudent(false);
                        }}
                    >
                        <Icon icon="user-graduate" className="me-1" />
                        Student
                    </div>
                </div>
                {/* Tab content container */}
                <div
                    className={`${styles.input_container_grid} ${styles.tab_content_container}`}
                >
                    {/* Input content (tab content) */}
                    {/* Select input */}

                    {toggleClassStudent ? (
                        //Class select
                        <select
                            className={styles.input_select}
                            onChange={(e) => {
                                if (e.target.value !== -1) {
                                    setSelectedClass(
                                        fetchClassesResult.data.payload[
                                            e.target.value
                                        ]
                                    );
                                } else {
                                    setSelectedClass(null);
                                }
                            }}
                        >
                            <option value={-1}>Select class</option>
                            {fetchClassesResult.data?.payload.map(
                                (classModule, index) => {
                                    return (
                                        <option value={index} key={index}>
                                            {classModule.class.className}
                                        </option>
                                    );
                                }
                            )}
                        </select>
                    ) : (
                        //Student select
                        // <select
                        //     className={styles.input_select}
                        //     onChange={(e) => {
                        //         if (e.target.value !== "-1") {
                        //             setSelectedStudents([
                        //                 ...selectedStudents,
                        //                 fetchStudentsResult.data?.payload.find(
                        //                     (student) => {
                        //                         return (
                        //                             // student.studentId is of type number, so we need to convert it to string to compare it with e.target.value
                        //                             String(
                        //                                 student.studentId
                        //                             ) === e.target.value
                        //                         );
                        //                     }
                        //                 )
                        //             ]);
                        //         } else {
                        //             setSelectedStudents([]);
                        //         }
                        //     }}
                        // >
                        //     <option value={"-1"}>Select Student</option>
                        //     {/* Make sure to filter out before mapping */}
                        //     {fetchStudentsResult.data?.payload
                        //         .filter(
                        //             (student) =>
                        //                 !selectedStudents.includes(student)
                        //         )
                        //         .map((student, index) => {
                        //             return (
                        //                 <option
                        //                     value={student.studentId}
                        //                     key={index}
                        //                 >
                        //                     {student.fullname}
                        //                 </option>
                        //             );
                        //         })}
                        // </select>
                        // Select student container
                        <div
                            className={`px-3 pt-2 ${styles.chosen_item_container}`}
                        >
                            {fetchStudentsResult.data?.payload
                                .filter(
                                    (student) =>
                                        !selectedStudents.includes(student)
                                )
                                .map((student, index) => {
                                    return (
                                        <div
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
                                            key={index}
                                        >
                                            {student.fullname}
                                        </div>
                                    );
                                })}
                        </div>
                    )}

                    {/* Chosen item container */}
                    <div
                        className={`px-3 pt-2 ${styles.chosen_item_container}`}
                    >
                        {/* Chosen items */}
                        {toggleClassStudent ? (
                            selectedClass ? (
                                <div
                                    className={`d-flex align-items-center px-2 ${styles.chosen_item}`}
                                >
                                    {/* Play icon */}
                                    <span
                                        className={`me-2 ${styles.play_icon}`}
                                    >
                                        <Icon icon="caret-right" />
                                    </span>
                                    {selectedClass.class.className}
                                </div>
                            ) : (
                                <div
                                    className={`d-flex align-items-center px-2 ${styles.chosen_item}`}
                                >
                                    No classes selected
                                </div>
                            )
                        ) : selectedStudents.length > 0 &&
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
                                        {/* Play icon */}
                                        <span
                                            className={`me-2 ${styles.play_icon}`}
                                        >
                                            <Icon icon="caret-right" />
                                        </span>
                                        {student?.fullname}
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
            </div>
            {/*  Button group */}
            <div className="d-flex justify-content-end align-items-center">
                <Button
                    className="me-3"
                    onClick={() => setFormStep(formStep - 1)}
                >
                    <Icon icon="angle-double-left" className="me-2" />
                    Back
                </Button>
                {isFinalExam ? (
                    <Button
                        onClick={() => setFormStep(formStep + 1)}
                        {...(selectedClass ||
                            selectedStudents.length > 0 || { disabled: true })}
                    >
                        <Icon icon="angle-double-right" className="me-2" />
                        Next
                    </Button>
                ) : (
                    <Button
                        {...(selectedClass ||
                            selectedStudents.length > 0 || { disabled: true })}
                        type="submit"
                    >
                        <Icon icon="save" className="me-2" />
                        Save
                    </Button>
                )}
            </div>
        </div>
    );
};

const ProctorSupervisorGraderFormContent = ({
    teacherList,
    acaDeptMemberList,
    formStep,
    setFormStep,
    selectedProctor,
    setSelectedProctor,
    selectedGrader,
    setSelectedGrader,
    selectedSupervisor,
    setSelectedSupervisor
}) => {
    return (
        <div>
            {/* Heading */}
            <Heading size={2} style={{ color: "var(--color-blue)" }}>
                Exam Administration
            </Heading>
            {/* Horizontal line */}
            <div className={styles.horizontal_line}></div>
            {/* Input container */}
            <div className={styles.input_container_grid}>
                {/* Proctor selector (Teachers)*/}
                <div>
                    <label className="fw-bold txt-blue">Proctor</label>
                    <select
                        className={styles.input_select}
                        onChange={(e) => {
                            //Set the selected Proctor's id
                            setSelectedProctor(e.target.value);
                        }}
                        value={selectedProctor}
                    >
                        {teacherList.map((teacher) => (
                            <option
                                key={teacher.teacherId}
                                value={teacher.teacherId}
                            >
                                {teacher.fullname}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Supervisor selector (Academic Department Member) */}
                <div>
                    <label className="fw-bold txt-blue">Supervisor</label>
                    <select
                        className={styles.input_select}
                        onChange={(e) => {
                            setSelectedSupervisor(e.target.value);
                        }}
                        value={selectedSupervisor}
                    >
                        {acaDeptMemberList.map((member) => (
                            <option key={member.id} value={member.id}>
                                {member.email}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Grader selector (Teacher) */}
                <div>
                    <label className="fw-bold txt-blue">Grader</label>
                    <select
                        className={styles.input_select}
                        onChange={(e) => {
                            setSelectedGrader(e.target.value);
                        }}
                        value={selectedGrader}
                    >
                        {teacherList.map((teacher) => (
                            <option
                                key={teacher.teacherId}
                                value={teacher.teacherId}
                            >
                                {teacher.fullname}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {/* Button group for navigating back and forth */}
            <div className="d-flex justify-content-end align-items-center">
                <Button
                    className="me-3"
                    onClick={() => setFormStep(formStep - 1)}
                >
                    <Icon icon="angle-double-left" className="me-2" />
                    Back
                </Button>
                <Button type="submit">
                    <Icon icon="save" className="me-2" />
                    Save
                </Button>
            </div>
        </div>
    );
};

const fields = {
    examName: {
        validate: REQUIRED,
        errorMessage: "Exam name is required"
    },
    description: {},
    duration: {
        validate: REQUIRED,
        errorMessage: "Duration is required"
    },
    examDate: {
        validate: REQUIRED,
        errorMessage: "Exam date is required"
    },
    room: {},
    password: {}
};
