import Heading from "components/Heading";
import Icon from "components/Icon";
import React from "react";
import Wrapper from "../../components/Wrapper";
import Button from "../../components/Button";
import styles from "../../styles/CreateAccount.module.css";
import { useState } from "react";
import { API, EMAIL, REGEX, REQUIRED } from "utilities/constants";
import { useForm } from "utilities/useForm";
import { useLazyFetch } from "utilities/useFetch";
import InputBox from "components/InputBox";
import Swal from "sweetalert2";
import Loading from "pages/Loading";

const CreateAccount = () => {
    const [selectedRole, setSelectedRole] = useState(ADMINISTRATOR);
    const { values, errors, onChange, onSubmit, clearForm } = useForm(
        fields,
        handleSubmit
    );
    //values.tenTruong VD: values.fullname

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

    function handleSubmit() {
        fetchdata();
    }

    const [selectedFile, setSelectedFile] = useState();
    if (fetchResult.loading) {
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
                                <div className="d-flex justify-content-center mb-4">
                                    <div
                                        className={`${styles.selector} ${
                                            selectedRole === ADMINISTRATOR &&
                                            styles.selected
                                        }`}
                                        onClick={() =>
                                            setSelectedRole(ADMINISTRATOR)
                                        }
                                    >
                                        <Icon icon="cog" className="me-1" />
                                        Administrator
                                    </div>

                                    <div
                                        className={`${styles.selector} ${
                                            selectedRole === STUDENT &&
                                            styles.selected
                                        }`}
                                        onClick={() => setSelectedRole(STUDENT)}
                                    >
                                        <Icon
                                            icon="user-graduate"
                                            className="me-1"
                                        />
                                        Student
                                    </div>

                                    <div
                                        className={`${styles.selector} ${
                                            selectedRole ===
                                                ACADEMIC_DEPARTMENT &&
                                            styles.selected
                                        } me-0`}
                                        onClick={() =>
                                            setSelectedRole(ACADEMIC_DEPARTMENT)
                                        }
                                    >
                                        <Icon icon="school" className="me-1" />
                                        Academic Department
                                    </div>
                                </div>

                                <div className="d-flex justify-content-center">
                                    <div
                                        className={`${styles.selector} ${
                                            selectedRole === TEACHER &&
                                            styles.selected
                                        }`}
                                        onClick={() => setSelectedRole(TEACHER)}
                                    >
                                        <Icon
                                            icon="briefcase"
                                            className="me-1"
                                        />
                                        Teacher
                                    </div>

                                    <div
                                        className={`${styles.selector} ${
                                            selectedRole ===
                                                HEAD_OF_DEPARTMENT &&
                                            styles.selected
                                        }`}
                                        onClick={() =>
                                            setSelectedRole(HEAD_OF_DEPARTMENT)
                                        }
                                    >
                                        <Icon icon="gem" className="me-1" />
                                        Head of Department
                                    </div>
                                </div>
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
                                className={`btn btn-info mb-3 ${styles.btn_file}`}
                            >
                                <Icon icon="download" className="me-2" />
                                Download template
                            </button>
                            <label
                                className={`btn btn-success btn-file ${styles.btn_file}`}
                            >
                                <Icon icon="file-excel" className="me-2" />
                                Upload excel
                                <input
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                        setSelectedFile(e.target.files[0]);
                                    }}
                                    required
                                />
                            </label>
                        </div>
                        {/* If file is null, don't show anything (prevent null reference exception) */}
                        <p className="">{selectedFile && selectedFile.name}</p>
                    </div>
                </div>
            </div>
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
