import React, { useEffect, useState } from "react";
import styles from "styles/Pill.module.css";

function Pill({
    content = "",
    defaultColor = "",
    type = "",
    style = {},
    onClick=()=>{},
    className = ""
}) {
    const [color, setColor] = useState(defaultColor);

    useEffect(() => {
        switch (type.toLowerCase()) {
            case "admin":
                setColor("green");
                break;
            case "student":
                setColor("orange");
                break;
            case "teacher":
                setColor("blue");
                break;
            case "academicdepartment":
                setColor("red");
                break;
            case "headofdepartment":
                setColor("purple");
                break;
            default:
                break;
        }
    }, [type]);

    return (
        <span
            style={style}
            className={`${className} ${styles.pill} ${styles[color]}`}
            onClick={onClick}
        >
            {content}
        </span>
    );
}

export default Pill;
