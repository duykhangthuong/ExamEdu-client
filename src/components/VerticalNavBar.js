import React, { useRef } from "react";
import style from "../styles/VerticalNavBar.module.css";
import Icon from "components/Icon";
import { Link } from "react-router-dom";
import useOutsideClick from "utilities/useOutsideClick";

function VerticalNavBar({ VerticalNavbarData }) {
    const boxRef = useRef(null);
    const { isClicked, setIsClicked } = useOutsideClick(boxRef);
    return (
        <div ref={boxRef} style={{ position: "absolute" }}>
            <input
                type="checkbox"
                id={style.check}
                checked={isClicked}
                readOnly
            />
            <label htmlFor={style.check}>
                <Icon
                    id={style.menu}
                    icon="bars"
                    onClick={() => setIsClicked(true)}
                />
                <Icon
                    id={style.cancel}
                    icon="times"
                    onClick={() => setIsClicked(false)}
                />
            </label>

            <div className={style.sidebar}>
                <div className={style.wrapperLogo}>
                    <Link to={VerticalNavbarData[0].link}>
                        <img
                            alt="logo_ExamEdu"
                            src="https://cdn.discordapp.com/attachments/856440942856372275/933529227490381864/logo-ExamEdu.png"
                            className={style.imgLogo}
                        />
                    </Link>
                </div>

                <ul>
                    {VerticalNavbarData.map((item, index) => {
                        return (
                            <li key={index}>
                                <div>{item.link}</div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default VerticalNavBar;
