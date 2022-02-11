import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

axios.defaults.withCredentials = true;

// Add a request interceptor
axios.interceptors.request.use(
    function (config) {
        var token = localStorage.getItem("accessToken");
        config.headers.Authorization = token ? `Bearer ${token}` : "";
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);
/**
 * Handle fetching data when a component is mounted
 *
 * @param {string} url an API endpoint to call from
 * @param {string} options.method the method of the call
 * @param {Object} options.body the body of the call
 * @param {Function} options.onCompletes a callback function that will be called when a call is successful
 * @param {Function} options.onError a callback function that will be called when a call failed
 * @returns {Object} data, loading, error
 */
export const useFetch = (url, options = {}) => {
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(undefined);

    let history = useHistory();

    useEffect(() => {
        if (!url) return;
        handleFetch(url, options, setData, setLoading, setError, history);
    }, []);

    return { data, loading, error };
};

/**
 * Handle lazy fetching. This hook gives you a fetch function that you can call anytime in your component
 *
 * @param {string} url an API endpoint to call from
 * @param {string} options.method the method of the call
 * @param {Object} options.body the body of the call
 * @param {Function} options.onCompletes a callback function that will be called when a call is successful
 * @param {Function} options.onError a callback function that will be called when a call failed
 * @returns {Object} [fetchData function, {data, loading, error}]
 */
export const useLazyFetch = (url, options = {}) => {
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);

    let history = useHistory();

    async function fetchData(urlParam = "", optionsParam = {}) {
        setLoading(true);
        //If there is a new URL and options, fetch that new URL and options
        const newOptions = {
            ...options,
            ...optionsParam,
        };

        const newUrl = urlParam || url;

        handleFetch(newUrl, newOptions, setData, setLoading, setError, history);
    }

    return [fetchData, { data, loading, error }];
};

async function handleFetch(
    url,
    options = {},
    setData,
    setLoading,
    setError,
    history
) {
    //Begin fetching
    try {
        const response = await axios(url, { ...options, data: options.body });
        setData(response.data);

        //When Fetching completes do something if specified
        options.onCompletes && options.onCompletes(response.data);
        setError(undefined);
        setLoading(false);

        options.finally && options.finally(response.data);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            try {
                // Refresh token
                await refreshToken(history);
                // Refetch
                await handleFetch(url, options, setData, setError, setLoading);
            } catch (err) {
                setError(error.response.data);
                setData(undefined);
                options.onError && options.onError(error.response.data);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        } else if (error.response) {
            //If some error happens, catch it
            setError(error.response.data);
            setData(undefined);
            //When error happens do something if specified
            options.onError && options.onError(error.response.data);
            setLoading(false);
        }
    }
}
async function refreshToken(history) {
    try {
        const res = await axios.post(
            "https://localhost:5001/api/token/refresh"
        );

        localStorage.setItem("accessToken", res.data.accessToken);
    } catch (error) {
        history.push({
            pathname: "/logout",
            state: {
                logout: "logout",
            },
        });
    }
}
