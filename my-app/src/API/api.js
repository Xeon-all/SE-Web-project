import axios from "axios";
import { urls } from "../API/urls";

export const request = async (method, url, params, otherDevURL) => {
  let data = method.toLocaleLowerCase() === 'get' ? 'params' : 'data';
  const token = localStorage.getItem("token");
  switch (otherDevURL === undefined) {

    case true:
      try {
        const response = await axios({
          method: method,
          baseURL: urls.baseUrl,
          url: url,
          [data]: params,
        });
        return response;
      } catch (reason) {
        if (reason.response) {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          return reason.response;
        } else {
          // Something happened in setting up the request that triggered an Error
          return reason;
        }
      }

    case false:
      try {
        const response = await axios({
          method: method,
          baseURL: otherDevURL,
          url: url,
          headers: {
            Authorization: "Bearer " + token,
          },
          [data]: params,
        });
        return response;
      } catch (reason) {
        if (reason.response) {
          // 请求已发出，但服务器响应的状态码不在 2xx 范围内
          return reason.response;
        } else {
          // Something happened in setting up the request that triggered an Error
          return reason;
        }
      }
  }
};
