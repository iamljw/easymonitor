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
                    <Option value="-1">不刷新</Option>
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
        <TabPane label="概览" class="overview-pane">
            <div class="traffic-policing-title-w">
                <span>Overview</span>
            </div>
            <Collapse v-model="panel1">
                <Panel name="traffic">
                    Charts
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
            <!-- :row-class-name="rowClassName" -->
            <Table
                :columns="columns"
                :data="requestData"
            >
                <template slot-scope="{ row }" slot="method">
                    <div
                        :class="['req-method', row.method]"
                    >
                        {{row.method.toUpperCase()}}
                    </div>
                </template>
                <template slot-scope="{ row }" slot="status">
                    <Badge :status="reqStatus[row.status].key" />
                    {{reqStatus[row.status].text}}
                </template>
                <template slot-scope="{ row }" slot="costTime">
                    <span
                        :style="{fontSize:'12px',color:row.costTime <= 1000 ? '#19be6b':'#ff9900'}"
                    >{{row.costTime}}ms</span>
                </template>
                <template slot-scope="{ row }" slot="action">
                    <Button type="primary" size="small" style="margin-right: 5px">{{row.zz}}重试</Button>
                    <Button type="warning" size="small">标记</Button>
                </template>
            </Table>
            <BackTop/>
        </TabPane>
        <TabPane label="服务">
            服务
        </TabPane>
        <TabPane label="日志">标签三的内容</TabPane>
        <TabPane label="管理">标签三的内容</TabPane>
    </Tabs>
</div>
</template>
<script>
import ReqDetails from '@/components/ReqDetails'
export default {
    name: 'Index',
    components: {
        ReqDetails
    },
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
        this.pieChartSettings = {}
        return {
            refreshInterval: '5',
            panel1: 'traffic',
            reqStatus: {
                '-1': {
                    key: 'error',
                    text: 'bug'
                },
                '0': {
                    key: 'processing',
                    text: '处理中'
                },
                '1': {
                    key: 'warning',
                    text: '超时'
                },
                '2': {
                    key: 'success',
                    text: '成功'
                }
            },
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
            },
            columns: [
                {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(ReqDetails, {
                            props: {
                                row: params.row
                            }
                        })
                    }
                },
                {
                    title: 'ID',
                    key: 'id',
                    width: 90
                },
                {
                    title: 'SID',
                    key: 'sid',
                    width: 60
                },
                {
                    title: '服务名称',
                    key: 'sname',
                    width: 100,
                    tooltip: true
                },
                {
                    title: '请求方式',
                    slot: 'method',
                    width: 100
                },
                {
                    title: '接口路径',
                    key: 'path',
                    width: 250,
                    tooltip: true,
                    className: 'url'
                },
                {
                    title: '请求头',
                    key: 'headers',
                    tooltip: true
                },
                {
                    title: '字符串参数',
                    key: 'queryStrParams',
                    tooltip: true
                },
                {
                    title: '请求体参数',
                    key: 'requestBody',
                    tooltip: true
                },
                {
                    title: '响应体',
                    key: 'responseBody',
                    tooltip: true
                },
                {
                    title: '响应状态',
                    slot: 'status',
                    width: 100
                },
                {
                    title: '响应时长',
                    slot: 'costTime',
                    width: 70
                },
                {
                    title: 'Action',
                    slot: 'action',
                    fixed: 'right',
                    width: 150
                }
            ],
            requestData: new Array(10).fill(0).map(() => {
                return {
                    id: 423982,
                    sid: 1,
                    sname: '积分',
                    method: 'get',
                    path: '/api/v1/market/eth/price/test/asd/dddd',
                    headers: '{Authorization:sadkh123kj1223zzkxj}',
                    queryStrParams: '{}',
                    requestBody: '{}',
                    status: 2,
                    responseBody: '{}',
                    costTime: 32
                };
            })
        }
    },
    methods: {
        logout() {

        },
        rowClassName (row, index) {
            if (index % 2 === 0) {
                return 'table-blue-row';
            } else {
                return '';
            }
        }
    }
}
</script>
<style lang="scss">
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
    margin: 0 32px 48px 32px;
    .overview-pane {
        .traffic-policing-title-w {
            text-align: left;
            font-size: 1.6em;
            color: #484848;
            line-height: 32px;
        }
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
.ivu-table .table-blue-row td{
    background-color: #5cadff;
    color: #fff;
}
.ivu-table .table-green-row td{
    background-color: #19be6b;
    color: #fff;
}
.ivu-table td.url{
    cursor: pointer;
    color: #2b85e4;
}
.req-method {
    display: inline-block;
    padding: 0 5px;
    border-radius: 4px;
    text-align: center;
    font-size: 10px;
}
.get {
    background-color: #cfefdf;
    color: #00A854;
}
.post {
    background-color: #D2EAFB;
    color: #108EE9;
}
.put {
    background-color: #FFF3CF;
    color: #FFBF00;
}
.delete {
    background-color: #FCDBD9;
    color: #F04134;
}
</style>