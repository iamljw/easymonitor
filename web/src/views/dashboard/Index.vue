<template>
<div>
    <div class="top-w">
        <div class="logo-v-w">
            <img src="../../assets/easymonitor_logo.png" alt="logo" width="240px"/>
            <span class="tag">B 1.0.0</span>
            <span class="tag" style="marginLeft: 12px;">S 1.0.0</span>
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
    <Tabs class="tabs">
        <!-- 
            1.总流量 折线
                最近24小时
                最近1个月
                最近1年

                总请求次数
                错误请求次数
                超时响应次数

                按服务区分
            2. 服务流量统计 饼
            3. 平均响应
            4. 正常 异常服务数量
            5. 请求记录
            -->
        <TabPane label="概览">
            <div class="traffic-policing-title-w">
                <span>Overview</span>
            </div>
            <Collapse v-model="panel1">
                <Panel name="traffic">
                    Totals
                    <Row slot="content">
                        <Col span="12" id="line-chart-col">
                            <div class="selector-w">
                                流量统计
                                <a id="period-a" @click="logout" style="marginRight:8px;">最近24小时</a>
                                平均响应时长<span style="fontSize:12px;marginLeft:4px;color:#19be6b">32ms</span>
                            </div>
                            <ve-line
                                :data="lineChartData"
                                :extend="lineExtend"
                                :settings="lineChartSettings"
                            />
                        </Col>
                        <Col span="12">
                            <div class="services-stat-w">
                                <!-- <Tag class="tag">
                                    运行服务 <strong style="fontSize:14px;color:#2db7f5">7</strong>
                                </Tag>
                                <Tag class="tag">
                                    正常 <strong style="fontSize:14px;color:#19be6b">6</strong>
                                </Tag>
                                <Tag class="tag">
                                    异常 <strong style="fontSize:14px;color:#ed4014">1</strong>
                                </Tag> -->
                                <div>
                                    运行服务 <strong style="fontSize:14px;color:#2db7f5">7</strong>
                                </div>
                                <div>
                                    正常 <strong style="fontSize:14px;color:#19be6b">6</strong>
                                </div>
                                <div>
                                    异常 <strong style="fontSize:14px;color:#ed4014">1</strong>
                                </div>
                            </div>
                            <ve-pie
                                :data="pieChartData"
                                :settings="pieChartSettings"
                            />
                        </Col>
                    </Row>
                </Panel>
            </Collapse>
        </TabPane>
        <TabPane label="服务">标签二的内容</TabPane>
        <TabPane label="日志">标签三的内容</TabPane>
        <TabPane label="管理">标签三的内容</TabPane>
    </Tabs>
</div>
</template>
<script>
export default {
    name: 'Index',
    data () {
        this.lineExtend = {
            'xAxis.0.axisLabel.rotate': 45
        }
        this.lineChartSettings = {
            labelMap: {
                total: '总请求次数',
                timeout: '超时响应次数',
                error: '错误请求次数'
            }
        },
        this.pieChartSettings = {
            // labelMap: {
            //     serviceName: '服务名称',
            //     count: '累计请求'
            // }
        }
        return {
            refreshInterval: '5',
            panel1: 'traffic',
            lineChartData: {
                columns: ['dt', 'total', 'timeout', 'error'],
                rows: [
                    { 'dt': '1/1', 'total': 13, 'timeout': 0, 'error': 0 },
                    { 'dt': '1/2', 'total': 35, 'timeout': 1, 'error': 0 },
                    { 'dt': '1/3', 'total': 29, 'timeout': 14, 'error': 0 },
                    { 'dt': '1/4', 'total': 17, 'timeout': 3, 'error': 0 },
                    { 'dt': '1/5', 'total': 37, 'timeout': 0, 'error': 8 },
                    { 'dt': '1/6', 'total': 45, 'timeout': 2, 'error': 0 }
                ]
            },
            pieChartData: {
                columns: ['serviceName', 'count'],
                rows: [
                    { 'serviceName': 'api-account', 'count': 1393 },
                    { 'serviceName': 'api-integral', 'count': 3530 },
                    { 'serviceName': 'api-wallet', 'count': 2923 },
                    { 'serviceName': 'api-market', 'count': 723 },
                    { 'serviceName': 'api-pyramid', 'count': 3792 },
                    { 'serviceName': 'api-blockchain', 'count': 4593 },
                    { 'serviceName': 'api-msg', 'count': 459 }
                ]
            }
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
#logout,#period-a {
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
.tabs {
    margin: 0 32px;
    .traffic-policing-title-w {
        text-align: left;
        font-size: 1.6em;
        color: #484848;
        line-height: 32px;
    }
}
#line-chart-col {
    .selector-w {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 48px;
    }
}
.services-stat-w {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 40px;
    margin-left: 16px;
    font-size: 16px;
    div {
        margin-right: 16px;
    }
}
</style>