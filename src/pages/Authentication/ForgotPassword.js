import ValidateMessage from "components/ValidateMessage";
import React from "react";
import { useHistory } from "react-router-dom";
import background from "static/background-login-page.jpg";
import logo from "static/logo-ExamEdu.png";
import style from "styles/ForgotPassword.module.css";
import Swal from "sweetalert2";
import { API, EMAIL, REGEX } from "utilities/constants";
import { useLazyFetch } from "utilities/useFetch";
import { useForm } from "utilities/useForm";

const ForgotPassword = () => {
    const history = useHistory();
    const { values, onChange, onSubmit, errors } = useForm(form, handleSubmit);

    const [fetchData, { loading }] = useLazyFetch(
        `${API}/Authentication/forgot-password`,
        {
            headers: { "Content-Type": "application/json" },
            method: "PUT",
            body: JSON.stringify(values.email),
            // Dispatch user to redux store
            onCompletes: (complete) => {
                Swal.fire(
                    "Reset password success!",
                    complete.message,
                    "success"
                );
            },
            onError: (error) => {
                Swal.fire("Reset password failed!", error.message, "error");
            },
            // Redirect to login page
            finally: (result) => {
                history.push(`/`);
            }
        }
    );

    function handleSubmit() {
        fetchData();
    }

    function goToLogin() {
        history.push(`/`);
    }

    return (
        <div
            style={{
                backgroundImage: `url("${background}")`,
                height: "100vh",
                minHeight: "100%",
                backgroundSize: "cover"
            }}
        >
            <div className="text-center mt-5 mb-4">
                <img src={logo} className={`img-fluid ${style.logos}`} />
            </div>
            <form onSubmit={onSubmit}>
                <div className={style.mainDiv}>
                    <h2 className={style.forgotPasswordText}>Forgot Password</h2>
                    <div className={style.inputSection}>
                        <div className="text-center ">
                            <b>
                                Please enter your email address. You will
                                receive an email message with new password.
                            </b>
                        </div>
                        <label className={style.labelLogin}>Email</label>
                        <input
                            className={style.inputLogin}
                            type={"text"}
                            value={values.email}
                            onChange={onChange}
                            id="email"
                            autoFocus
                        />
                        {errors.email && (
                            <ValidateMessage message={errors.email} />
                        )}
                    </div>

                    <button
                        className={`${style.buttonLogin} mb-5`}
                        disable={loading}
                        style={{
                            opacity: loading ? "0.75" : "1",
                            filter: loading ? "brightness(0.9375)" : "",
                            cursor: loading ? "default" : "pointer"
                        }}
                        type="submit"
                    >
                        {loading && (
                            <div
                                className="spinner-border text-light"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>
                        )}
                        {/* {loading && <span className="mt-0"></span>} */}
                        {!loading && <span>Get New Password</span>}
                    </button>
                    <p>
                        Already have an account?{" "}
                        <span
                            onClick={() => {
                                goToLogin();
                            }}
                            className={`${style.loginText} mb-3`}
                        >
                            Login
                        </span>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;
const form = {
    email: {
        validate: REGEX,
        regex: EMAIL,
        message: "Please input proper email format!"
    }
};
