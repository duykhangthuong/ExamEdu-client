import React, { useEffect } from "react";
import { useRef } from "react";
import useOutsideClick from "utilities/useOutsideClick";
import styles from "../styles/OurModal.module.css";
/**
 * To continue the legacy of our forth fathers, whose has sacrificed their time and energy to allow us to use a better modal,
 * we shall dedicate this component to them.
 *  ЭТО НАШЕ, МОЙ товарищ. 
 *  НЕТ ОШИБКИ, ТОЛЬКО СЛАВА ВЬЕТНАМУ.
 *  ░░░░░░░░░░▀▀▀██████▄▄▄░░░░░░░░░░
    ░░░░░░░░░░░░░░░░░▀▀▀████▄░░░░░░░
    ░░░░░░░░░░▄███████▀░░░▀███▄░░░░░
    ░░░░░░░░▄███████▀░░░░░░░▀███▄░░░
    ░░░░░░▄████████░░░░░░░░░░░███▄░░
    ░░░░░██████████▄░░░░░░░░░░░███▌░
    ░░░░░▀█████▀░▀███▄░░░░░░░░░▐███░
    ░░░░░░░▀█▀░░░░░▀███▄░░░░░░░▐███░
    ░░░░░░░░░░░░░░░░░▀███▄░░░░░███▌░
    ░░░░▄██▄░░░░░░░░░░░▀███▄░░▐███░░
    ░░▄██████▄░░░░░░░░░░░▀███▄███░░░
    ░█████▀▀████▄▄░░░░░░░░▄█████░░░░
    ░████▀░░░▀▀█████▄▄▄▄█████████▄░░
    ░░▀▀░░░░░░░░░▀▀██████▀▀░░░▀▀██░░
    isClicked - isClicked taken from useOutsideClick
    setIsClicked - setIsClicked taken from useOutSideClick
    modalRef - modalRef taken from useRef(null)
    modalClassName - classes to style the modal
    children - the modal content
 * @returns
 */
const OurModal = ({
    isClicked,
    setIsClicked,
    modalRef,
    modalClassName,
    children,
}) => {
    //We shall pass in the setOutsideClick function to the component from it's parent.
    // The parent will be able to set isClicked to true or false.
    //isClicked shall be used to toggle the modal.

    return (
        <div
            className={`${isClicked ? "d-flex" : "d-none"} ${
                styles.back_drop
            } `}
        >
            <div
                className={`${styles.modal_container} ${modalClassName}`}
                ref={modalRef}
            >
                {children}
            </div>
        </div>
    );
};

export default OurModal;
