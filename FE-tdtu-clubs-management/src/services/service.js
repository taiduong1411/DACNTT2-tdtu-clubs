import { axiosCli } from "../interceptor/axios"

export const delDataByParams = async (url) => {
    const res = await axiosCli().del(url);
    return res
}
export const postDataByParams = async (url, data) => {
    const response = await axiosCli().post(url, data);
    return {
        status: response.status,
        data: response.data,
    };
};
export const getDataByParams = async (url) => {
    const res = await axiosCli().get(url);
    return res
};