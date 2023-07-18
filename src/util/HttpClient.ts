/* eslint-disable no-use-before-define */
import axios from 'axios';

class HttpClient {
    static {
        axios.defaults.withCredentials = true
    }

    public static getBaseUrl(): string {
        const env = import.meta.env
        if (env) {
            //return 'https://pdev.yonyougov.top';
            //return location.origin
            //return location.origin+"/wchatgpt-be"
            //return 'http://127.0.0.1:8080/wchatgpt-be';
            // return 'http://127.0.0.1:80';
            // return 'https://devopstest.yonyougov.top';
            return import.meta.env.VITE_BASE_URL || location.origin + "/wchatgpt-be"
            //return process.env.VITE_BASE_URL
        }

        // eslint-disable-next-line no-restricted-globals
        return location.origin
    }

    public static fetch(url: any
        , method: any,
                        config: any = {},
                        data: any): Promise<void | any> {
        let headers: any = {}
        if (config && config.headers) {
            headers = config.headers
        } else {
            headers['Content-Type'] = 'application/json'
        }
        if (!headers.token) {
            headers.token = window.localStorage.getItem("token") || ''
        }
        return axios.request({
            url: url,
            method: method,
            baseURL: HttpClient.getBaseUrl(),
            headers: headers,
            ...config,
            data: data
        }).then((result: any) => {
            if (result.data.success) {
                return Promise.resolve(result.data.data);
            } else {
                if (result.data.errorType === "Business") {
                    return Promise.reject(result.data.errorMsg);
                } else {
                    console.error(JSON.stringify(result.data))
                    return Promise.reject("内部错误，请联系管理员!");
                }
            }
        }).catch((reason) => {
            console.error(JSON.stringify(reason))
            if (reason.response) {
                if (reason.response.data && reason.response.data.errorType === "Business") {
                    return Promise.reject(reason.response.data.errorMsg);
                } else {
                    return Promise.reject("内部错误，请联系管理员!");
                }
            } else if (reason.message) {
                return Promise.reject(reason.message);
            } else {
                return Promise.reject(reason);
            }
        });
    }

    public static get(url: any): Promise<void | any> {
        return HttpClient.fetch(url, "GET", null, null)
    }

    public static delete(url: any): Promise<void | any> {
        return HttpClient.fetch(url, "DELETE", null, null)
    }

    public static post(url: any, data: any): Promise<void | any> {
        return HttpClient.fetch(url, "POST", null, data)
    }
}

export default HttpClient;
