import Vue from 'vue';
import * as axios from 'axios';

const baseURL = 'http://127.0.0.1:6300/api/v1/';

Vue.prototype.baseURL = baseURL;
const apiV1NoAuth = axios.create({
    baseURL,
    timeout: 30000
});
apiV1NoAuth.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    const { data: res } = response;
    if (!res.success) {
        Vue.prototype.$Notice.error({
            title: 'Message',
            desc: res.message
        });
    }
    return res;
}, function (error) {
    // 对响应错误做点什么
    Vue.prototype.$Notice.error({
        title: 'Message',
        desc: '网络错误'
    });
});
Vue.prototype.apiV1NoAuth = apiV1NoAuth;