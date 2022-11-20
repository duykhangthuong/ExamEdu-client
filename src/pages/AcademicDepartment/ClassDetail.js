import Button from "components/Button";
import Heading from "components/Heading";
import Icon from "components/Icon";
import Wrapper from "components/Wrapper";
import React, { useRef } from "react";
import styles from "../../styles/ClassDetail.module.css";
import { useLazyFetch } from "utilities/useFetch";
import { useEffect } from "react";
import { API } from "utilities/constants";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useHistory } from "react-router-dom";
import OurModal from "components/OurModal";
import useOutsideClick from "utilities/useOutsideClick";
import * as Yup from "yup";
import { useFormik } from "formik";
import Loading from "pages/Loading";
import Swal from "sweetalert2";
const ClassDetail = () => {
    //Get parameters from history
    const param = useParams();
    const history = useHistory();
    const modalRef = useRef(null);
    let { isClicked, setIsClicked } = useOutsideClick(modalRef);

    const [fetchData, fetchDataResult] = useLazyFetch(
        `${API}/class/${param.classId}`
    );
    const formik = useFormik({
        initialValues: {
            className: fetchDataResult.data?.className,
            startDay: moment(fetchDataResult.data?.startDay).format(
                "YYYY-MM-DD"
            ),
            endDay: moment(fetchDataResult.data?.endDay).format("YYYY-MM-DD")
        },
        validationSchema: Yup.object({
            className: Yup.string()
                .required("Class name is required")
                .matches(/^(?!\s+$).*/, "Class name cannot be blank"),
            startDay: Yup.date().required("Start date is required"),
            endDay: Yup.date()
                .required("End day is required")
                .min(Yup.ref("startDay"), "End date must be after start date")
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
    const [fetchDataUpdate, { loading }] = useLazyFetch(
        `${API}/class/update/basic_infor`,
        {
            method: "put",
            body: {
                classId: param.classId,
                className: formik.values.className,
                startDay: formik.values.startDay,
                endDay: formik.values.endDay
            },
            onCompletes: () => {
                Swal.fire({
                    title: "Update Successfully",
                    text: "Press OK to continue",
                    icon: "success",
                    confirmButtonText: "Yes"
                });
                setIsClicked(false);
                fetchData();
            }
        }
    );

    useEffect(() => {
        fetchData();
    }, []);
    if (fetchDataResult.loading || loading) return <Loading />;
    return (
        <Wrapper>
            <Heading>Class Detail</Heading>
            <div className="d-flex ">
                <div className={styles.basicDiv}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="ms-3">BASIC INFORMATION</h5>
                        <Button
                            onClick={() => {
                                setIsClicked(true);
                            }}
                            circle={true}
                            titleTooltip="Update Basic Information"
                        >
                            <Icon icon="pen" />
                            {/* <p className="mb-0 text-start">
                                Update <br />
                                Information
                            </p> */}
                        </Button>
                    </div>
                    <hr />
                    <div className={styles.content}>
                        <div className={styles.column1}>
                            <p>Class Name</p>
                            <p>Start Date</p>
                            <p>End Date</p>
                            <p>Creation Date</p>
                        </div>
                        <div className={styles.column2}>
                            <p>{fetchDataResult.data?.className}</p>
                            <p>
                                {moment(fetchDataResult.data?.startDay).format(
                                    "DD/MM/YYYY"
                                )}
                            </p>
                            <p>
                                {moment(fetchDataResult.data?.endDay).format(
                                    "DD/MM/YYYY"
                                )}
                            </p>
                            <p>
                                {moment(fetchDataResult.data?.createdAt).format(
                                    "H:MM A DD/MM/YYYY"
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <OurModal
                    modalRef={modalRef}
                    isClicked={isClicked}
                    setIsClicked={setIsClicked}
                    style={{ height: "fit-content" }}
                >
                    <header
                        className={`${styles.heading} d-flex justify-content-between`}
                    >
                        <h4 className="fw-bold">Update Basic Information</h4>
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
                                <div className="d-flex justify-content-between">
                                    <label>Class name</label>
                                    <input
                                        type="text"
                                        id="className"
                                        name="className"
                                        value={formik.values.className}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                                {formik.errors.className &&
                                    formik.touched.className && (
                                        <p className="text-danger mb-0 text-end">
                                            {formik.errors.className}
                                        </p>
                                    )}
                            </div>
                            <div className={styles.inputGroup}>
                                <div className="d-flex justify-content-between">
                                    <label>Start Day</label>
                                    <input
                                        type="date"
                                        id="startDay"
                                        name="startDay"
                                        value={formik.values.startDay}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                                {formik.errors.startDay &&
                                    formik.touched.startDay && (
                                        <p className="text-danger mb-0 text-end">
                                            {formik.errors.startDay}
                                        </p>
                                    )}
                            </div>
                            <div className={styles.inputGroup}>
                                <div className="d-flex justify-content-between">
                                    <label>End Day</label>
                                    <input
                                        type="date"
                                        id="endDay"
                                        name="endDay"
                                        value={formik.values.endDay}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                                {formik.errors.endDay &&
                                    formik.touched.endDay && (
                                        <p className="text-danger mb-0 text-end">
                                            {formik.errors.endDay}
                                        </p>
                                    )}
                            </div>
                            <Button className="ms-auto me-5 mt-4" type="submit">
                                Save Changes
                            </Button>
                        </form>
                    </div>
                </OurModal>
            </div>
            <div className={styles.moduleDiv}>
                <h4>MODULE IN THIS CLASS</h4>
                <div className={styles.moduleContainer}>
                    {fetchDataResult.data?.classModules.map((module, index) => (
                        <Module
                            key={index}
                            codeModule={module.moduleCode}
                            nameModule={module.moduleName}
                            teacherName={module.teacherName}
                            onClick={() => {
                                history.push(
                                    `${fetchDataResult.data?.classId}/module/${module.moduleId}`
                                );
                            }}
                        />
                    ))}
                </div>
            </div>
        </Wrapper>
    );
};

export default ClassDetail;

const Module = ({ codeModule, nameModule, teacherName, onClick }) => {
    return (
        <div className={styles.moduleWrap}>
            <h3>{codeModule}</h3>
            <p className={styles.description}>{nameModule}</p>
            <p className={styles.teacherName}>
                <Icon
                    icon="user-tie"
                    className="me-1"
                    color="var(--color-dark-blue)"
                />
                {teacherName}
            </p>
            <Button className="m-auto mt-auto" onClick={onClick}>
                <Icon icon="pen" className="me-2" />
                Update
            </Button>
        </div>
    );
};
