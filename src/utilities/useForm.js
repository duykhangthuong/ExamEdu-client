import { useState } from "react";
import { CALLBACK, CONFIRM, REGEX, REQUIRED, DATETIME_EXAM } from "./constants";
import moment from "moment";

/**
 * Handle Form State and Validation
 *
 * @param {Object} fields - Form configurations
 * @param {Function} handleSubmit - Callback function to submit form
 * @param {Function} onError - Callback function to handle error
 * @returns {Object} - { values, setValues, errors, onChange, onSubmit }
 */
export const useForm = (fields, handleSubmit, onError) => {
    // Form values
    const [values, setValues] = useState(getInitialValues(fields));
    // Form error messages after validated
    const [errors, setErrors] = useState({});

    // Handle change when user input values
    const onChange = (event) => {
        setValues({ ...values, [event.target.id]: event.target.value });
        setErrors({ ...errors, [event.target.id]: "" });
    };

    // Called when submit
    const onSubmit = (event) => {
        event.preventDefault();

        // Validate
        var newErrors = { ...errors };
        var isValid = true;

        for (let key in fields) {
            switch (fields[key].validate) {
                case REQUIRED: {
                    if (
                        typeof values[key] === "string" &&
                        values[key].trim() === ""
                    ) {
                        newErrors[key] = fields[key].message;
                        isValid = false;
                    } else if (!values[key]) {
                        newErrors[key] = fields[key].message;
                        isValid = false;
                    } else {
                        newErrors[key] = "";
                    }
                    break;
                }

                case REGEX: {
                    if (!fields[key].regex.test(values[key])) {
                        newErrors[key] = fields[key].message;
                        isValid = false;
                    } else {
                        newErrors[key] = "";
                    }
                    break;
                }

                case CONFIRM: {
                    if (values[key] !== values[fields[key].field]) {
                        newErrors[key] = fields[key].message;
                        isValid = false;
                    } else {
                        newErrors[key] = "";
                    }
                    break;
                }

                case CALLBACK: {
                    if (!fields[key].condition(values)) {
                        newErrors[key] = fields[key].message;
                        isValid = false;
                    } else {
                        newErrors[key] = "";
                    }
                    break;
                }

                // Modified by David Doan, specifically used for CreateExam page
                case DATETIME_EXAM: {
                    // Validate that the field is required
                    if (
                        typeof values[key] === "string" &&
                        values[key].trim() === ""
                    ) {
                        newErrors[key] = fields[key].message;
                        isValid = false;
                    } else if (!values[key]) {
                        newErrors[key] = fields[key].message;
                        isValid = false;
                    } else {
                        newErrors[key] = "";
                    }

                    // Validate that the field must have value greater than the current time minus 10 minutes

                    if (
                        moment(values[key]).isBefore(
                            moment().subtract(30, "minutes")
                        )
                    ) {
                        newErrors[key] =
                            "Date must be from 10 minutes from now";
                        isValid = false;
                    } else {
                        newErrors[key] = "";
                    }

                    break;
                }

                default: {
                    newErrors[key] = "";
                }
            }
        }

        if (!isValid) {
            setErrors(newErrors);

            if (onError) {
                onError(newErrors);
            }

            return false;
        }

        // If there is no error => submit form
        handleSubmit();
        return true;
    };

    const clearForm = () => {
        // Clear Form
        setValues(getInitialValues(fields));
    };

    return { values, setValues, errors, onChange, onSubmit, clearForm };
};

// Get initial values from form configuration
function getInitialValues(fields = {}) {
    var initialValue = {};

    for (let key in fields) {
        initialValue[key] = fields[key].initialValue || "";
    }

    return initialValue;
}
