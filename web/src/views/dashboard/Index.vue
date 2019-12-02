<template>
<div>
    <div class="top-w">
        <div class="logo-v-w">
            <img src="../../assets/easymonitor_logo.png" alt="logo" width="240px"/>
            <span class="tag">B 1.0.0</span>
            <span class="tag">S 1.0.0</span>
        </div>
        <div class="top-r-w">
            <div>
                Refreshed 2019-12-02 17:30:41
                <Select v-model="refreshInterval" style="width:100px;">
                    <Option value="5">每5秒刷新</Option>
                    <Option value="10">每10秒刷新</Option>
                    <Option value="30">每30秒刷新</Option>
                </Select>
            </div>
            <div>
                User <strong>root</strong> 超级管理员<a id="logout" @click="logout">退出</a>
            </div>
        </div>
    </div>
</div>
</template>
<script>
export default {
    name: 'Index',
    data () {
        return {
            refreshInterval: '5'
        }
    },
    methods: {
        logout() {

        }
    }
}
</script>
<style scoped lang="scss">
.top-w {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .logo-v-w {
        display: flex;
        align-items: center;
        padding-left: 24px;
        .tag {
            background-color: #f0f0f0;
            border-radius: 5px;
            margin-left: 8px;
            padding: 3px 5px;
            font: 12px Verdana, sans-serif;
        }
    }
    .top-r-w {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        margin-right: 48px;
        & > div {
            margin-bottom: 8px;
        }
    }
}
#logout {
    background-color: #666;
    color: #fff;
    border-radius: 5px;
    margin-left: 8px;
    padding: 3px 7px;
    font: 12px Verdana, sans-serif;
    &:hover {
        background-color: #ff9900;
    }
}
</style>