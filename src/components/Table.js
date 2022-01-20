import React from "react";
import "../styles/Table.css";

const Table = ({
    className = "",
    style = {},
    columns = [],
    data = [],
    onClick = () => {},
    isSelectable = false,
    isVeryLong = false,
}) => {
    // Generating unique keys
    const generateKey = (pre) => {
        return `${pre}_${new Date().getTime()}`;
    };
    // Freezing the table when there are more than 5 cols
    const isFreeze = columns.length > 5 ? true : false;
    // Append more styles to the outer most div when Freezing the table
    const defaultOverflow = { overflowX: "scroll" };
    return (
        <div
            className={`${className} `}
            style={isFreeze ? { ...defaultOverflow, ...style } : { ...style }}
        >
            <table
                /* Add class sticky-col when the table is freezing cols*/
                className={`datatable w-100 h-100 text-center ${
                    isFreeze
                        ? "sticky-col"
                        : `${isVeryLong ? "sticky-head" : ""}`
                } `}
            >
                <thead>
                    {data.length > 0 && (
                        <tr>
                            {columns.map((col, colIndex) => (
                                <th key={generateKey(col)}>{col}</th>
                            ))}
                        </tr>
                    )}
                </thead>
                <tbody>
                    {data.length > 0 &&
                        data.map((obj, objIndex) => (
                            <tr
                                key={objIndex + "tr"}
                                onClick={() => onClick(objIndex)}
                                className={isSelectable ? "selectable" : ""}
                            >
                                {Object.keys(obj).map((key, keyIndex) => (
                                    <td key={generateKey(key) + obj[key]}>
                                        <span
                                            className="mobile"
                                            key={
                                                generateKey(key) +
                                                "spantitle" +
                                                obj[key]
                                            }
                                        >
                                            {columns[keyIndex] === ""
                                                ? ""
                                                : columns[keyIndex] + " : "}
                                        </span>
                                        <span
                                            key={
                                                generateKey(key) +
                                                "spanvalue" +
                                                obj[key]
                                            }
                                        >
                                            {obj[key]}
                                        </span>
                                    </td>
                                ))}
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
