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
// import * as axios from 'axios';
// const axiosY = axios.create({
//     baseURL: 'http://127.0.0.1:9102/api/v1/account',
//     timeout: 30000,
//     headers: {'Authorization': localStorage.getItem('token')}
// });
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
                { type: 'string', min: 6, message: '密码不能小于6位', trigger: 'blur' }
            ]
        },
        logLoading: false
    }
  },
  mounted(){
    //   if (localStorage.getItem('token')) {
    //       axiosY({
    //         method: 'get',
    //         url: '/loginData'
    //     })
    //     .then(response => {
    //         const { success, data, message } = response.data;
    //         if (!success) {
    //             this.$Message.error(message);
    //         } else {
    //             this.$store.commit('login', data);
    //             this.$router.replace('/admin');
    //         }
    //     })
    //     .catch(error => this.$Message.error(error));
    //   }
  },
  methods: {
      // 登录
      login(name) {
          this.$refs[name].validate((valid) => {
              if (valid) {
                this.logLoading = true;
                // axiosY({
                //     method: 'post',
                //     url: '/login',
                //     data: this.account
                // })
                // .then(response => {
                //     const { success, data, message } = response.data;
                //     if (!success) {
                //         this.$Message.error(message);
                //     } else {
                //         const { token } = data;
                //         localStorage.setItem('token', token);
                //         this.$store.commit('login', data);
                //         this.$Message.success('登录成功！');
                //         this.$router.replace('egovernment');
                //     }
                // })
                // .catch(error => this.$Message.error(error))
                // .finally(() => this.logLoading = false);
                setTimeout(() => {
                    this.$store.commit('login', {
                        loginName: 'root',
                        role: 'root'
                    });
                    this.$Message.success('登录成功！');
                    this.$router.replace('/');
                    this.logLoading = false;
                }, 1000);
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
