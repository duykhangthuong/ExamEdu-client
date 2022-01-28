import Heading from "components/Heading";
import Icon from "components/Icon";
import React from "react";
import Wrapper from "../../components/Wrapper";
import Button from "../../components/Button";
import styles from "../../styles/CreateAccount.module.css";
import { useState } from "react";
import { EMAIL, FULLNAME, REGEX, REQUIRED } from "utilities/constants";
import { useForm } from "utilities/useForm";
import InputBox from "components/InputBox";

const CreateAccount = () => {
    const [selectedRole, setSelectedRole] = useState(ADMINISTRATOR);
    const { values, setValues, errors, onChange, onSubmit, clearForm } =
        useForm(fields, handleSubmit);

    function handleSubmit() {}

    return (
        <Wrapper className="d-md-flex justify-content-center overflow-auto">
            <div className={styles.page_container}>
                {/* Page title */}
                <Heading className="d-none d-md-block">Create Account</Heading>
                {/* Form */}
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
                                        selectedRole === ACADEMIC_DEPARTMENT &&
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
                                    <Icon icon="briefcase" className="me-1" />
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
                    {/* User name */}
                    <InputBox
                        label="User name"
                        className="mb-3 mb-md-4"
                        name="userName"
                        value={values.userName}
                        onChange={onChange}
                        errorMessage={errors.userName}
                    />
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
                            type="Submit"
                        >
                            <Icon icon="chevron-right" />
                            <Icon icon="chevron-right" className="me-2" />
                            Submit
                        </Button>
                    </div>
                    <button className={`d-md-none ${styles.btn_submit}`}>
                        <Icon icon="chevron-right" />
                        <Icon icon="chevron-right" className="me-2" />
                        Submit
                    </button>
                </form>
            </div>
        </Wrapper>
    );
};
export default CreateAccount;

// Roles
const ADMINISTRATOR = 1;
const STUDENT = 2;
const ACADEMIC_DEPARTMENT = 3;
const TEACHER = 4;
const HEAD_OF_DEPARTMENT = 5;

//Input fields
const fields = {
    fullname: {
        validate: REQUIRED,
        message: "Please input the account's fullname",
    },
    email: {
        validate: REGEX,
        regex: EMAIL,
        message: "Email must be in the correct format",
    },
    userName: {
        validate: REQUIRED,
        message: "Please input the account's username",
    },
};
