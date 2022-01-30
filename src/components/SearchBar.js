import React from "react";
import Heading from "./Heading";
import styles from "../styles/SearchBar.module.css";
import Icon from "./Icon";

/**
 *
 * param {string} pageName This is the name of the page that will be displayed as a heading
 * param {CallBackFunction} onSubmit A function to call when the user finished entering the search query
 * param {string} keyword A string value passed from the parent to be inserted into the search field
 * param {Function} setKeyWord A function passed from the parent to set the state of the keyword
 * param {string} filterValue A string value passed from the parent to control the select field
 * param {Function} setFilterValue A function passed from the parent to control the select field
 * param {array[{value:,label:}]} filterOption An array containing the Value and Name for the select options, e.g. [{value: "1", label:"admin"}]
 *                        IMPORTANT: The first value within the array will be the default value
 * param {CallBackFunction} onAddButtonClick A function to call when the add button is clicked. The Add button will only be enabled when this parameter is filled
 * returns
 */
const SearchBar = ({
    pageName,
    onSubmit,
    keyWord,
    setKeyWord,
    filterValue,
    setFilterValue,
    filterOptions,
    onAddButtonClick,
}) => {
    return (
        <div className="mb-2">
            {/* Page Name and Add button container */}
            <div className="d-flex justify-content-center align-items-center justify-content-md-between">
                {/* Page Name */}
                <Heading>{pageName}</Heading>
                {/* Add button */}
                {onAddButtonClick && (
                    <button
                        className={`d-none d-md-block shadow-light ${styles.btn_add}`}
                        onClick={onAddButtonClick}
                    >
                        <Icon icon="plus"></Icon>
                    </button>
                )}
            </div>
            {/* Search bar and filter container */}
            <form
                className="d-flex justify-content-between align-items-center"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
            >
                {/* Search account */}
                {setKeyWord && (
                    <>
                        <input
                            type="text"
                            id="search"
                            value={keyWord}
                            onChange={(event) => setKeyWord(event.target.value)}
                            className={`flex-grow-1 shadow-light me-2 me-md-3 ${styles.input}`}
                            placeholder={`Search account`}
                        ></input>
                        {/* The search Icon */}
                        <Icon
                            icon="search"
                            style={{
                                color: "var(--color-gray)",
                                cursor: "pointer",
                            }}
                            className={styles.search_icon}
                            onClick={(e) => {
                                e.preventDefault();
                                onSubmit();
                            }}
                        />{" "}
                    </>
                )}
                {/* Filter */}
                {setFilterValue && (
                    <select
                        className={`shadow-light ${styles.input} ${styles.select}`}
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        defaultValue={{
                            label: filterOptions[0].label,
                            value: filterOptions[0].value,
                        }}
                    >
                        {filterOptions.map((filterOption) => {
                            return (
                                <option
                                    value={filterOption.value}
                                    key={filterOption.value}
                                >
                                    {filterOption.label}
                                </option>
                            );
                        })}
                    </select>
                )}
            </form>
        </div>
    );
};
export default SearchBar;
