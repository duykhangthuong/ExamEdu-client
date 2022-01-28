import React from "react";

/**
 * Component to render Button
 * @param {any} props - button style configurations
 * @returns button element
 */
const Button = ({
    type = "button",
    onClick = () => {},
    btn = "primary",
    circle,
    className = "",
    style = {},
    children,
    disabled = false,
}) => {
    const btnStyle = circle
        ? {
              borderRadius: "50%",
              width: "2.5rem",
              height: "2.5rem",
              fontSize: "1.2rem",
          }
        : {
              borderRadius: "6px",
          };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`py-1 px-3 d-flex flex-row justify-content-center align-items-center shadow-light ${className}`}
            style={{
                border: "none",
                ...btnStyle,
                ...buttonOptions[btn],
                ...style,
                opacity: disabled ? "0.75" : "1",
                filter: disabled ? "brightness(0.9375)" : "",
            }}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;

// Options to change bg and text color
const buttonOptions = {
    primary: {
        backgroundColor: "var(--color-blue)",
        color: "var(--nav-bar)",
    },
    secondary: {
        backgroundColor: "var(--color-orange)",
        color: "var(--nav-bar)",
    },
    // tertiary: {
    //     backgroundColor: "var(--table-selected)",
    //     color: "var(--color-cyan)",
    // },
    // alert: {
    //     backgroundColor: "var(--color-pink)",
    //     color: "var(--bg)",
    // },
    // "alert-secondary": {
    //     backgroundColor: "var(--element-bg)",
    //     color: "var(--color-pink)",
    // },
    // dark: {
    //     backgroundColor: "var(--bg)",
    //     color: "var(--color-cyan)",
    // },
};
