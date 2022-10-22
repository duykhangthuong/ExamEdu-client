import Button from "components/Button";
import Heading from "components/Heading";
import Icon from "components/Icon";
import Table from "components/Table";
import Wrapper from "components/Wrapper";
import OurModal from "components/OurModal";
import SearchBar from "components/SearchBar";
import swal from "sweetalert2";
import { useFetch, useLazyFetch } from "utilities/useFetch";
import { API } from "utilities/constants";
import useOutsideClick from "utilities/useOutsideClick";
import styles from "../../styles/ClassModuleStudent.module.css";
import Loading from "pages/Loading";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

function ClassModuleStudent() {
    const param = useParams();
    const { data, loading } = useFetch(
        `${API}/ClassModule/student/${param.classId}/${param.moduleId}`
    );
    const [studentList, setStudentList] = useState([]);
    const [teacher, setTeacher] = useState();

    const [initialStudentList, setInitialStudentList] = useState([]);
    const [initialTeacher, setInitialTeacher] = useState();
    const column = ["Student ID", "Student Name", "Email", "Action"];

    const teacherList = useFetch(`${API}/Teacher/idName`);
    const [putData, putDataResult] = useLazyFetch(
        `${API}/ClassModule/${data?.classModuleId}`,
        {
            method: "PUT",
            body: {
                studentIds: studentList.map((student) => student.studentId),
                teacherId: teacher
            },
            onCompletes: () => {
                swal.fire("Success", "Update class successfully", "success");
                // fetchData();
            },
            onError: (error) => {
                swal.fire("Error", error.message, "error");
            }
        }
    );

    // useEffect to set StudentList after fetch API
    useEffect(() => {
        if (!loading) {
            setStudentList(data.students);
            setInitialStudentList(data.students);
            setTeacher(data.teacher.teacherId);
            setInitialTeacher(data.teacher.teacherId);
        }
    }, [loading]);

    // delete student in studentList by studentId
    const deleteStudent = (studentId) => {
        // sweet alert to confirm delete
        swal.fire({
            title: "Are you sure to remove this student from this class?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const newStudentList = studentList.filter(
                    (student) => student.studentId !== studentId
                );
                setStudentList(newStudentList);
            }
        });
    };

    function showModalConfirmSubmit() {
        swal.fire({
            title: "Are you sure?",
            text: "Do you really want to update the class?",
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
                putData();
                // fetchDataAdd();
            }
        });
    }
    //Using ourModal for create form
    const modalRef = useRef(null);
    const { isClicked, setIsClicked } = useOutsideClick(modalRef);

    if (loading || putDataResult.loading) return <Loading></Loading>;
    return (
        <>
            <AddStudentModal
                modalRef={modalRef}
                isClicked={isClicked}
                setIsClicked={setIsClicked}
                listStudentBeforeAdd={studentList}
                addStudentToList={setStudentList}
            />
            <Wrapper>
                <Heading>Module in class detail</Heading>
                {/* Class Name  */}
                <div className={styles.basicClassInfo}>
                    <h5>Class</h5>
                    <p>{data.class.className}</p>
                </div>
                {/* Class Module */}
                <div className={styles.basicClassInfo}>
                    <h5>Module</h5>
                    <p>
                        {data.module.moduleCode} - {data.module.moduleName}
                    </p>
                </div>
                {/* Class Teacher (trong select option để có gì thay đổi)*/}
                <div className={styles.basicClassInfo}>
                    <h5>Teacher</h5>
                    <select
                        className="form-select form-select-sm"
                        style={{ width: "50%" }}
                        value={teacher} //Chọn sẵn teacher đã có trong class
                        onChange={(e) => setTeacher(parseInt(e.target.value))}
                    >
                        {teacherList.data?.map((tc, index) => {
                            return (
                                <option value={tc.teacherId} key={index}>
                                    {tc.fullname}
                                </option>
                            );
                        })}
                    </select>
                </div>

                {/* Class Student table*/}
                <div className={styles.studentListDiv}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5>STUDENT LIST</h5>
                        {/*Button add student circle*/}
                        <div className="d-flex justify-content-end">
                            <button
                                className={`text-start shadow-light ${styles.buttonAddStudent}`}
                                onClick={() => {
                                    setIsClicked(true);
                                }}
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Add student to list"
                            >
                                <Icon color="fff" icon="user-plus"></Icon>
                            </button>
                        </div>
                    </div>
                    <hr />
                    <div className={styles.tableDiv}>
                        <Table
                            columns={column}
                            data={studentList.map((item) => ({
                                id: item.studentId,
                                name: item.fullname,
                                email: item.email,
                                option: (
                                    <div className="d-flex justify-content-center ">
                                        <Button
                                            circle={true}
                                            style={{
                                                backgroundColor: "red"
                                            }}
                                            onClick={() =>
                                                deleteStudent(item.studentId)
                                            }
                                        >
                                            <Icon
                                                color="fff"
                                                icon="trash-alt"
                                            ></Icon>
                                        </Button>
                                    </div>
                                )
                            }))}
                        />
                    </div>
                </div>
                <footer className="d-flex justify-content-end">
                    <button
                        className={`mt-4 ${styles.buttonConfirmAddStudent}`}
                        onClick={() => showModalConfirmSubmit()}
                        disabled={
                            teacher === initialTeacher &&
                            JSON.stringify(studentList) ===
                                JSON.stringify(initialStudentList)
                        } //disable button if studentList and teacher is same as initialStudentList and initialTeacher
                    >
                        <Icon
                            color="fff"
                            icon="check-circle"
                            className="me-2"
                        ></Icon>{" "}
                        Confirm Update
                    </button>
                </footer>
            </Wrapper>
        </>
    );
}

function AddStudentModal({
    modalRef,
    isClicked,
    setIsClicked,
    listStudentBeforeAdd,
    addStudentToList
}) {
    const [freeStudent, setFreeStudent] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState([]);
    // const [queryStudent, setQueryStudent] = useState("");
    const [classIdToFetch, setClassId] = useState();

    // const [fetchFreeStudent, fetchFreeStudentResult] = useLazyFetch(
    //     `${API}/Student/class/3/module/1/free?searchName=${queryStudent}`
    // );
    //fetch class list
    const [fetchClassList, classListResult] = useLazyFetch(`${API}/Class`);

    //fetch all student in class
    const [fetchStudentInClass, studentInClassResult] = useLazyFetch(
        `${API}/Class/students/${classIdToFetch}`
    );

    // use Effect to fetch freeStudent when isClicked == true
    useEffect(() => {
        if (isClicked) {
            // fetchFreeStudent();
            fetchClassList();
        }
    }, [isClicked]);

    useEffect(() => {
        fetchStudentInClass();
    }, [classIdToFetch]);

    // useEffect to set freeStudentList after fetch API
    useEffect(() => {
        // fetchFreeStudent();
        if (!studentInClassResult.loading) {
            const fitlerStudent1 = studentInClassResult.data?.payload.filter(
                (item) => {
                    return !selectedStudent.some((s) => {
                        return s.studentId === item.studentId;
                    });
                }
            ); //filter student đã có trong Select List

            const fitlerStudent2 = fitlerStudent1?.filter((item) => {
                return !listStudentBeforeAdd.some((s) => {
                    return s.studentId === item.studentId;
                });
            }); //filter student đã có trong Class List (listStudentBeforeAdd) (trường hợp đã thêm student vào class lần đầu)
            setFreeStudent(fitlerStudent2);
        }
    }, [studentInClassResult.loading]);

    // move student to selected list
    const moveStudentToSelectedList = (student) => {
        setSelectedStudent([...selectedStudent, student]);
        const frees = freeStudent.filter(
            (item) => item.studentId !== student.studentId
        );
        setFreeStudent(frees);
    };

    // function handleSearch() {
    //     fetchFreeStudent();
    // }
    // remove student from selected list and move back to free list
    const removeStudentFromSelectedList = (student) => {
        setFreeStudent([...freeStudent, student]);
        // setFreeStudent(freeStudent.sort((a, b) => a.studentId - b.studentId));
        setSelectedStudent(
            selectedStudent.filter(
                (item) => item.studentId !== student.studentId
            )
        );
    };

    // if (fetchFreeStudentResult.loading)
    //     return (
    //         <OurModal
    //             modalRef={modalRef}
    //             isClicked={isClicked}
    //             setIsClicked={setIsClicked}
    //             modalClassName={styles.modal}
    //         >
    //             <Heading>Add new student</Heading>
    //             <div className="d-flex justify-content-center">
    //                 <Loading></Loading>
    //             </div>
    //         </OurModal>
    //     );
    return (
        <OurModal
            modalRef={modalRef}
            isClicked={isClicked}
            setIsClicked={setIsClicked}
            modalClassName={styles.modal}
        >
            <Heading size={2}>Add new student</Heading>
            <div className="d-flex justify-content-evenly">
                <div className={styles.studentList}>
                    <h4 className="fw-bold">List student</h4>
                    {/* Select box chọn class */}
                    <select
                        name="class"
                        className="form-select form-select-sm"
                        style={{ width: "50%" }}
                        onChange={(e) => {
                            setClassId(parseInt(e.target.value));
                        }}
                    >
                        <option value={undefined} key={"undefined"}>
                            Please choose a class
                        </option>
                        {classListResult.data?.payload.map((cls, index) => {
                            return (
                                <option value={cls.classId} key={index}>
                                    {cls.className}
                                </option>
                            );
                        })}
                    </select>
                    {/* Bảng List học sinh */}
                    <table className={styles.table}>
                        <tbody>
                            {studentInClassResult.loading ? (
                                <div
                                    className="spinner-border mt-5"
                                    role="status"
                                >
                                    <span className="visually-hidden">
                                        Loading...
                                    </span>
                                </div>
                            ) : freeStudent?.length > 0 ? (
                                freeStudent
                                    ?.sort((a, b) => a.studentId - b.studentId)
                                    .map((item, index) => (
                                        <tr
                                            key={index}
                                            onClick={() =>
                                                moveStudentToSelectedList(item)
                                            }
                                        >
                                            <td>{item.studentId}</td>
                                            <td>{item.fullname} </td>
                                            <td>{item.email}</td>
                                        </tr>
                                    ))
                            ) : (
                                <div className="mt-5">
                                    <Icon
                                        icon="portrait"
                                        size="5x"
                                        className="mb-3"
                                    />
                                    <h3 className=" fs-4 fw-bold">
                                        No student
                                    </h3>
                                    <p className=" fs-6">
                                        This class doesn't have any student
                                        <br />
                                        Please choose another class
                                    </p>
                                </div>
                            )}
                        </tbody>
                    </table>

                    {/* <SearchBar
                        keyWord={queryStudent}
                        setKeyWord={setQueryStudent}
                        onSubmit={handleSearch}
                    ></SearchBar>
                    <table className={styles.table}>
                        <tbody>
                            {freeStudent
                                ?.sort((a, b) => a.studentId - b.studentId)
                                .map((item, index) => (
                                    <tr
                                        key={index}
                                        onClick={() =>
                                            moveStudentToSelectedList(item)
                                        }
                                    >
                                        <td>{item.studentId}</td>
                                        <td>{item.fullname} </td>
                                        <td>{item.email}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table> */}
                </div>
                <div className="align-self-center">
                    <Icon icon="angle-double-right" size="3x" color="#949494" />
                </div>
                <div className={styles.chosen_item_container}>
                    <h4 className="fw-bold">Selected student</h4>
                    <div className="w-100">
                        {selectedStudent?.map((item, index) => (
                            <div
                                className={styles.chosen_item}
                                key={index}
                                onClick={() =>
                                    removeStudentFromSelectedList(item)
                                }
                            >
                                <div>{item.studentId}</div>
                                <div>{item.fullname}</div>
                                <div>{item.email}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-end">
                <Button
                    className="mt-4 py-2"
                    onClick={() => {
                        addStudentToList([
                            ...listStudentBeforeAdd,
                            ...selectedStudent
                        ]);
                        setIsClicked(false);
                        setSelectedStudent([]);
                    }}
                >
                    <Icon icon="user-plus" className="me-2"></Icon>
                    Add student to the list
                </Button>
            </div>
        </OurModal>
    );
}
export default ClassModuleStudent;
