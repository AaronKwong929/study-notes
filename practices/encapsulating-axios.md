# 封装 Axios 的实践

> 二次封装 Axios 可以大量减少重复代码的编写（毕竟懒才是第一生产力）

## 基础配置

## 拦截器

### 请求拦截

#### 拦截重复请求

#### 重新发送请求

### 响应拦截

#### 错误处理

## 导出

## 挂载

## 完整代码

注意此处error.status错误逻辑处理需要配合后端Nginx转发正确的错误代码进行处理，详见另一篇[传送门](work/nginx-correct-http-status)

```js
import axios from "axios";
import { Message } from "element-ui";
import router from "@/router";
import { getToken } from "@/utils/cookie";
const baseURL = process.env.VUE_APP_API;

const instance = axios.create({ timeout: 1000 * 30, baseURL });
instance.defaults.headers.post[
    `Content-Type`
] = `application/json;charset=UTF-8`;

instance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (!token) {
            window.location = `https://auc.4399houtai.com/`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response) => {
        if (response.data && response.data.code === 1) {
            return response.data;
        } else {
            Message({ type: `warning`, message: response.data.msg });
            return Promise.reject(response);
        }
    },

    (err) => {
        if (err && err.response) {
            switch (err.response.status) {
                case 400:
                    Message({
                        type: "error",
                        message: `请求体错误 `,
                        duration: 3000,
                    });
                    break;

                case 401:
                    Message({
                        type: "error",
                        message: `身份认证失败`,
                        duration: 3000,
                    });
                    // 此处可以加入业务操作
                    break;

                case 403:
                    Message({
                        type: "error",
                        message: `用户没有权限`,
                        duration: 3000,
                    });
                    router.push(`/overview`);
                    break;

                case 404:
                    Message({
                        type: "error",
                        message: `接口不存在`,
                        duration: 3000,
                    });
                    break;

                case 500:
                    Message({
                        type: "error",
                        message: "服务器错误",
                        duration: 3000,
                    });
                    break;

                case 502:
                    Message({
                        type: "error",
                        message: "服务器维护中",
                        duration: 3000,
                    });
                    break;

                case 503:
                    Message({
                        type: "error",
                        message: "服务不可用",
                        duration: 3000,
                    });
                    break;
            }
        }
        return Promise.reject(err);
    }
);

export const GET = async (url, params = {}, header = {}) => {
    const headers = {
        ...header,
    };
    return await instance.get(url, { params, headers });
};

export const POST = async (url, data = {}, header = {}) => {
    const headers = {
        ...header,
    };
    return await instance.post(url, data, { headers });
};

export const PUT = async (url, data = {}, header = {}) => {
    const headers = {
        ...header,
    };
    return await instance.put(url, data, { headers });
};

export const DELETE = async (url, params = {}, header = {}) => {
    const headers = {
        ...header,
    };
    return await instance.delete(url, { params, headers });
};
```

## 可以优化的地方

1. switch 改成策略模式更佳
