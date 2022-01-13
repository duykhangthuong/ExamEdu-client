import axios from "axios";
import { useEffect, useState } from "react";

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(undefined);

    useEffect(() => {
        handleFetch(url, options, setData, setLoading, setError);
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

    async function fetchData() {
        handleFetch(url, options, setData, setLoading, setError);
    }

    return [fetchData, { data, loading, error }];
};

async function handleFetch(url, options = {}, setData, setLoading, setError) {
    setLoading(true);

    //Begin fetching
    try {
        const response = await axios(url, { ...options, data: options.body });
        setData(response.data);
        setError(undefined);

        //When Fetching completes do something if specified
        options.onCompletes && options.onCompletes(response.data);
    } catch (error) {
        //If some error happens, catch it
        setError(error.response.data);
        setData(undefined);

        //When error happens do something if specified
        options.onError && options.onError(error.response.data);
    } finally {
        setLoading(false);
    }
}
