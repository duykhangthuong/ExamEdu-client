import Button from "components/Button";
import Icon from "components/Icon";
import Wrapper from "components/Wrapper";
import { useFormik } from "formik";
import Loading from "pages/Loading";
import React from "react";
import { API } from "utilities/constants";
import { useFetch, useLazyFetch } from "utilities/useFetch";
import InputBox from "../../components/InputBox";
import Swal from "sweetalert2";
import styles from "../../styles/UpdateExam.module.css";
import moment from "moment";
import { useParams } from "react-router-dom";
import Heading from "components/Heading";

const UpdateExam = ({ isFinalExam }) => {
    //Get id from url
    const param = useParams();

    //Load exam information
    const { data, loading, error } = useFetch(
        `${API}/Exam/update-exam-info/${param.examId}`
    );

    //Load teacher list
    const teacherFetchResult = useFetch(`${API}/Teacher/idName`);

    //Load Academic Deparment member list
    const academicFetchResult = useFetch(`${API}/AcademicDepartment/list`);

    //Load module list
    const moduleFetchResult = useFetch(`${API}/Module`);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            examName: data?.examName,
            password: data?.password,
            date: data?.examDay,
            duration: data?.durationInMinute,
            room: data?.room,
            description: data?.description,
            moduleId: data?.moduleId,
            proctorId: data?.proctorId,
            supervisorId: data?.supervisorId
        },
        validate,
        onSubmit: () => {
            handleSubmit();
        }
    });

    //Post data to server
    const [updateExam, updateExamResult] = useLazyFetch(
        `${API}/Exam/update-exam-info/`,
        {
            method: "PUT",
            body: {
                examId: data?.examId,
                examName: formik.values.examName,
                password: formik.values.password,
                examDay: formik.values.date,
                durationInMinute: formik.values.duration,
                room: formik.values.room,
                description: formik.values.description,
                moduleId: formik.values.moduleId,
                proctorId: formik.values.proctorId,
                supervisorId: formik.values.supervisorId,
                isFinalExam: isFinalExam,
                studentIds: [0]
            },
            onCompletes: () => {
                Swal.fire("Update exam successfully!", "", "success");
            },
            onError: (error) => {
                Swal.fire("Update exam failed!", error.message, "error");
            }
        }
    );

    function handleSubmit() {
        updateExam();
    }

    if (
        loading ||
        teacherFetchResult.loading ||
        moduleFetchResult.loading ||
        updateExamResult.loading ||
        academicFetchResult.loading
    ) {
        return <Loading></Loading>;
    }

    console.log(formik.values);

    return (
        <Wrapper>
            {/* Title */}
            <Heading size={2} className="mb-3">
                Update Exam Basic Information
            </Heading>

            {/* Form */}
            <form onSubmit={formik.handleSubmit}>
                {/* Form container */}
                <div className={styles.update_form}>
                    {/* Left column */}
                    <div className={`${styles.column} ${styles.column_left}`}>
                        <InputBox
                            name={"examName"}
                            label={"Exam name"}
                            value={formik.values.examName}
                            errorMessage={formik.errors.examName}
                            onChange={formik.handleChange}
                        />
                        <InputBox
                            name="password"
                            label={"Password"}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                        />
                        <InputBox
                            name="date"
                            label={"Date"}
                            value={formik.values.date}
                            type={"datetime-local"}
                            onChange={formik.handleChange}
                        />
                        <InputBox
                            name="duration"
                            label={"Duration"}
                            value={formik.values.duration}
                            errorMessage={formik.errors.duration}
                            type="number"
                            onChange={formik.handleChange}
                        />
                        <InputBox
                            name="room"
                            label={"Room"}
                            value={formik.values.room}
                            errorMessage={formik.errors.room}
                            onChange={formik.handleChange}
                        />
                        <InputBox
                            name="description"
                            label={"Description"}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                        />
                    </div>
                    {/* Right column */}
                    <div className={`${styles.column} ${styles.column_right}`}>
                        {/* Select Module for the exam */}
                        <div className={styles.input_select_container}>
                            <label className={styles.input_label}>Module</label>
                            <select
                                name="moduleId"
                                className={`${styles.input_select} `}
                                value={formik.values.moduleId}
                                onChange={formik.handleChange}
                            >
                                {moduleFetchResult.data.payload.map(
                                    (module) => {
                                        return (
                                            <option
                                                key={module.moduleId}
                                                value={module.moduleId}
                                            >
                                                {module.moduleCode}
                                            </option>
                                        );
                                    }
                                )}
                            </select>
                        </div>

                        {isFinalExam && (
                            <>
                                <div className={styles.input_select_container}>
                                    <label className={styles.input_label}>
                                        Proctor
                                    </label>
                                    <select
                                        name="proctorId"
                                        value={formik.values.proctorId}
                                        onChange={formik.handleChange}
                                        className={`${styles.input_select} `}
                                    >
                                        {teacherFetchResult.data.map(
                                            (teacher) => {
                                                return (
                                                    <option
                                                        key={teacher.teacherId}
                                                        value={
                                                            teacher.teacherId
                                                        }
                                                    >
                                                        {teacher.fullname}
                                                    </option>
                                                );
                                            }
                                        )}
                                    </select>
                                </div>

                                <div className={styles.input_select_container}>
                                    <label className={styles.input_label}>
                                        Supervisor
                                    </label>
                                    <select
                                        name="supervisorId"
                                        value={formik.values.supervisorId}
                                        onChange={formik.handleChange}
                                        className={`${styles.input_select} `}
                                    >
                                        {academicFetchResult.data.map((aca) => {
                                            return (
                                                <option
                                                    key={aca.id}
                                                    value={aca.id}
                                                >
                                                    {aca.email}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {/* Submit button */}
                <div className="d-flex justify-content-md-center">
                    <Button className={"mt-3"} type="submit">
                        Save
                        <Icon icon="save" className="ms-1" />
                    </Button>
                </div>
            </form>
        </Wrapper>
    );
};

export default UpdateExam;

const validate = (values) => {
    const errors = {};
    //Exam name validation
    if (!values.examName) {
        errors.examName = "Exam name is required";
    }

    //Duration validation
    if (!values.duration) {
        errors.duration = "Duration is required";
    } else if (values.duration <= 0) {
        errors.duration = "Duration must be greater than 0";
    }

    //Room validation
    if (!values.room) {
        errors.room = "Room is required";
    }

    return errors;
};
