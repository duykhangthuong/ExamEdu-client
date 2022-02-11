import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { EMAIL, REGEX, REQUIRED } from "utilities/constants";
import { useForm } from "utilities/useForm";
import Swal from "sweetalert2";
import ValidateMessage from "components/ValidateMessage";
import { useLazyFetch } from "utilities/useFetch";
import { login } from "store/action";
import background from "static/background-login-page.jpg";
import style from "styles/login.module.css";
import logo from "static/logo-ExamEdu.png";

const Login = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { values, onChange, onSubmit, errors } = useForm(form, handleSubmit);

    const [fetchData, { loading }] = useLazyFetch(
        "https://localhost:5001/api/Authentication/login",
        {
            method: "post",
            body: {
                email: values.email,
                password: values.password,
            },
            // Dispatch user to redux store
            onCompletes: (result) => {
                dispatch(login(result));
            },
            onError: (error) => {
                Swal.fire("Login failed!", error.message, "error");
            },
            // Redirect to home page
            finally: (result) => {
                history.push(`/${result.role.toLowerCase()}`);
            },
        }
    );
    function handleSubmit() {
        fetchData();
    }
    return (
        <div
            style={{
                backgroundImage: `url("${background}")`,
                height: "100vh",
                minHeight: "100%",
                backgroundSize: "cover",
            }}
        >
            <div className="text-center mt-5 mb-4">
                <img src={logo} className={`img-fluid ${style.logos}`} />
            </div>
            <form onSubmit={onSubmit}>
                <div className={style.mainDiv}>
                    <h1 className={style.loginText}>Login</h1>
                    <div className={style.inputSection}>
                        <label className={style.labelLogin}>Email</label>
                        <input
                            className={style.inputLogin}
                            type={"text"}
                            value={values.email}
                            onChange={onChange}
                            id="email"
                        />
                        {errors.email && (
                            <ValidateMessage message={errors.email} />
                        )}
                    </div>

                    <div className={style.inputSection}>
                        <label className={style.labelLogin}>Password</label>
                        <input
                            className={style.inputLogin}
                            type={"password"}
                            value={values.password}
                            onChange={onChange}
                            id="password"
                        />
                        {errors.password && (
                            <ValidateMessage message={errors.password} />
                        )}
                    </div>
                    <button className={style.buttonLogin}>LOGIN</button>
                    <a href="#" className="mb-3">
                        Forgot Password?
                    </a>
                </div>
            </form>
        </div>
    );
};

export default Login;
const form = {
    email: {
        validate: REGEX,
        regex: EMAIL,
        message: "Please input proper email format!",
    },
    password: {
        validate: REQUIRED,
        message: "Password is required!",
    },
};