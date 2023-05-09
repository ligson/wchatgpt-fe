/* eslint-disable no-use-before-define */
import axios from 'axios';

class HttpClient {
    static {
        axios.defaults.withCredentials = true
    }

    private static getBaseUrl(): string {
        const env = import.meta.env
        if (env) {
            //return 'https://pdev.yonyougov.top';
            //return location.origin
            return location.origin+"/wchatgpt-be"
            //return 'http://127.0.0.1:8080/wchatgpt-be';
            // return 'http://127.0.0.1:80';
            // return 'https://devopstest.yonyougov.top';
        }

        // eslint-disable-next-line no-restricted-globals
        return location.origin
    }

    public static fetch(url: any
        , method: any,
                        config: any = {},
                        data: any): Promise<void | any> {
        return axios.request({
            url: url,
            method: method,
            baseURL: HttpClient.getBaseUrl(),
            headers: {
                'token': window.localStorage.getItem("token") || '',
                'Content-Type': 'application/json'
            },
            ...config,
            data: data
        }).then((result: any) => {
            if (result.data.success) {
                return Promise.resolve(result.data.data);
            } else {
                return Promise.reject(result.data.errorMsg);
            }
        }).catch((reason) => {
            console.error(reason)
            if (reason.response) {
                return Promise.reject(reason?.response?.data?.errorMsg);
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