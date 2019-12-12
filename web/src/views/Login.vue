<template>
  <div class="login">
    <Row class="form-w">
        <Col class="box" span="6" offset="16">
            <div class="title">
                <span style="fontSize:26px;color:#2790fb">EasyMonitor</span>
            </div>
            <Form ref="account" :model="account" :rules="ruleInline">
              <FormItem prop="loginName" style="margin-bottom: 26px;">
                  <Input type="text" v-model="account.loginName" clearable placeholder="登录名">
                      <Icon type="ios-person-outline" slot="prepend"></Icon>
                  </Input>
              </FormItem>
              <FormItem prop="loginPass" style="margin-bottom: 26px;">
                  <Input type="password" v-model="account.loginPass" clearable placeholder="密码">
                      <Icon type="ios-lock-outline" slot="prepend"></Icon>
                  </Input>
              </FormItem>
              <FormItem>
                  <Button type="success" long @click="login('account')" :loading="logLoading">sign in</Button>
              </FormItem>
            </Form>
        </Col>
    </Row>
  </div>
</template>

<script>
import Vue from 'vue';
import * as axios from 'axios';

export default {
  name: 'Login',
  data () {
    return {
        account: {
            loginName: '',
            loginPass: ''
        },
        ruleInline: {
            loginName: [
                { required: true, message: '请输入你的登录账号', trigger: 'blur' }
            ],
            loginPass: [
                { required: true, message: '请输入你的密码.', trigger: 'blur' },
                { type: 'string', min: 8, message: '密码不能小于8位', trigger: 'blur' }
            ]
        },
        logLoading: false
    }
  },
  async mounted() {
    const token = localStorage.getItem('token');
    if (token) {
        const apiV1 = axios.create({
            baseURL: this.baseURL,
            headers: {'Authorization': token},
            timeout: 30000
        });
        Vue.prototype.apiV1 = apiV1;
        apiV1.interceptors.response.use(function (response) {
            // 对响应数据做点什么
            const { data: res } = response;
            if (!res.success) {
                this.$Notice.error({
                    title: 'Message',
                    desc: res.message
                });
                if (res.code === 1004) {
                    Vue.prototype.apiV1 = null;
                    localStorage.removeItem('token');
                }
            }
            return res;
        }, function (error) {
            // 对响应错误做点什么
            this.$Notice.error({
                title: 'Message',
                desc: '网络错误'
            });
        });
        const res = await apiV1('/account/self');
        if (res.success) {
            const { loginName, role } = res.data;
            this.$store.commit('login', {
                loginName,
                role
            });
            this.$Message.success('登录成功！');
            this.$router.replace('/');
        }
    } else {
        this.$Message.info('请登录！');
    }
  },
  methods: {
      // 登录
      login(name) {
          this.$refs[name].validate(async valid => {
              if (valid) {
                this.logLoading = true;
                const { loginName, loginPass } = this.account;
                const res = await this.apiV1NoAuth.post('/account/login', {
                    loginName,
                    loginPass
                });
                if (res.success) {
                    const { role, token } = res.data;
                    localStorage.setItem('token', token);
                    const apiV1 = axios.create({
                        baseURL: this.baseURL,
                        headers: {'Authorization': token},
                        timeout: 30000
                    });
                    Vue.prototype.apiV1 = apiV1;
                    apiV1.interceptors.response.use(response => {
                        // 对响应数据做点什么
                        const { data: res } = response;
                        if (!res.success) {
                            this.$Notice.error({
                                title: 'Message',
                                desc: res.message
                            });
                            if (res.code === 1004) {
                                Vue.prototype.apiV1 = null;
                                localStorage.removeItem('token');
                            }
                        }
                        return res;
                    },  error => {
                        // 对响应错误做点什么
                        this.$Notice.error({
                            title: 'Message',
                            desc: '网络错误'
                        });
                    });
                    this.$store.commit('login', {
                        loginName,
                        role
                    });
                    this.$Message.success('登录成功！');
                    this.$router.replace('/');
                }
                this.logLoading = false;
              } else {
                  this.$Message.error('输入有误!');
              }
          })
      }
  }
}
</script>
<style lang="scss">
  .login {
    position: absolute;
    bottom: 0;
    top: 0;
    right: 0;
    left: 0;
    background: url('../assets/water-1330252_1920.jpg') no-repeat;
    background-size: cover;
    .form-w {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 85%;
        .box {
            border-radius: 5px;
            padding: 15px 30px 15px 30px;
            background: rgba($color: #ffffff, $alpha: 0.8);
            .title {
                height: 60px;display: flex;justify-content: center;align-items: center;
            }
        }
    }
}
</style>
