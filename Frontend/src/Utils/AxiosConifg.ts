import axios from "axios";
import { baseURL } from "../baseURL";

type methodType = "get" | "post";

export const callApi = async ({ requestEndpoint, method, body }: { requestEndpoint: string, method: methodType, body?: any }) => {
    try {
        const token = localStorage.getItem('AccessToken')
        const headers = {
            contentType: 'application/json',
            authorization: token
        }
        const axiosInstance = axios.create({
            headers
        })
        const response = await axiosInstance[method](requestEndpoint, body)
        return response
    }
    catch (error: any) {
        console.log(error)
        if (error.response.data.authError) {
            const refreshToken = localStorage.getItem('RefreshToken')
            if (refreshToken) {
                const response = await axios.post(`${baseURL}user/refresh/${refreshToken}`)
                if (response.data.accessToken) {
                    const headers = {
                        contentType: 'application/json',
                        authorization: response.data.accessToken
                    }
                    const axiosInstance = axios.create({
                        headers
                    })
                    localStorage.setItem('AccessToken', response.data.accessToken);
                    const res = await axiosInstance[method](requestEndpoint, body);
                    return res
                }
                else {
                    localStorage.clear()
                }
            }
            else {
                localStorage.clear()
            }
        }
        return error
    }
}

