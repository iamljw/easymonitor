import Vue from 'vue';
import * as axios from 'axios';

Vue.prototype.apiV1NoAuth = axios.create({
    baseURL: 'http://127.0.0.1:6300/api/v1/',
    timeout: 30000
});