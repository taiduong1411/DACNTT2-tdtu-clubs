import axios from "axios";

export const axiosCli = () => {
    // Create a new axios instance
    const api = axios.create({
        baseURL: "http://localhost:5162/api/",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        validateStatus: function (status) {
            return status <= 500; // Resolve only if the status code is less than 500
        }
    });

    // Add a request interceptor to add the JWT token to the authorization header
    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                config.headers.Authorization = token;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Add a response interceptor to refresh the JWT token if it's expired
    // api.interceptors.response.use(
    //     (response) => response,
    //     (error) => {
    //         console.log("Interceptor triggered");
    //         if (error.response) {
    //             const { status, data } = error.response;
    //             if (status === 401 && data === "NO_TOKEN") {
    //                 // No token, redirect to login
    //                 console.log("No token found, redirecting to login...");
    //                 // return window.location.href = "/login";
    //             } else if (status === 403 && data === "INVALID_ROLE") {
    //                 // Invalid role, redirect to login
    //                 console.log("Invalid role, redirecting to login...");
    //                 // return window.location.href = "/login";
    //             }
    //         }
    //         return Promise.reject(error);
    //     }
    // );

    const get = (path) => {
        return api.get(path).then((response) => response);
    };

    const post = (path, data) => {
        return api.post(path, data).then((response) => response);
    };

    const put = (path, data) => {
        return api.put(path, data).then((response) => response.data);
    };

    const del = (path) => {
        return api.delete(path).then((response) => response);
    };
    return {
        get,
        post,
        put,
        del,
    };
};