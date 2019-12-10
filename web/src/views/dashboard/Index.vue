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
                User <strong>root</strong> 超级管理员<a id="logout" class="by-btn" @click="logout">退出</a>
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
            <div class="top-title-w">
                <span>Overview</span>
            </div>
            <Collapse v-model="panel1">
                <Panel name="traffic">
                    Charts
                    <Row slot="content">
                        <Col span="12" id="line-chart-col">
                            <div class="selector-w">
                                流量统计
                                <a class="by-btn" @click="drawerVisible = true" style="marginRight:8px;">
                                    {{periodMap[period]}}
                                </a>
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
            <Drawer
                title="选择时段"
                placement="left"
                :closable="true"
                v-model="drawerVisible">
                <RadioGroup v-model="period" vertical>
                    <Radio label="24hour">
                        <!-- <Icon type="social-apple"></Icon> -->
                        <span>最近24小时</span>
                    </Radio>
                    <Radio label="lastMonth">
                        <!-- <Icon type="social-android"></Icon> -->
                        <span>最近一个月</span>
                    </Radio>
                    <Radio label="halfYear">
                        <!-- <Icon type="social-windows"></Icon> -->
                        <span>最近半年</span>
                    </Radio>
                </RadioGroup>
            </Drawer>
            <!-- :row-class-name="rowClassName" -->
            <!-- 搜索栏 id、服务、接口、响应状态 -->
            <div class="search-con" style="marginTop:0;">
                精准搜索：
                <Input @on-change="logout" clearable placeholder="输入请求ID" style="width:150px;marginRight:8px;" v-model="searchFields.id"/>
                选择服务：
                <Select v-model="searchFields.service" class="search-col" style="width:100px;marginRight:8px;">
                    <Option value="all">全部</Option>
                    <Option v-for="val of services.rows" :value="val.id" :key="val.id">{{ val.comment || val.name }}</Option>
                </Select>
                接口路径：
                <Input @on-change="logout" clearable placeholder="输入接口路径片段" style="width:150px;marginRight:8px;" v-model="searchFields.path"/>
                响应状态：
                <Select v-model="searchFields.status" class="search-col" style="width:100px;marginRight:8px;">
                    <Option value="all">全部</Option>
                    <Option v-for="(val,key) in reqStatus" :value="Number(key)" :key="`search-col-${key}`">
                        {{ val.text }}
                    </Option>
                </Select>
                <Button @click="logout" class="search-btn" type="primary"><Icon type="md-search" />&nbsp;&nbsp;搜索</Button>
                <Button @click="resetSearch" class="search-btn" type="primary" style="marginLeft:8px;">重置</Button>
            </div>
            <Table
                :columns="columns"
                :data="requestData.rows">
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
                    <Button type="warning" size="small" @click="onMarkClick(row)">标记</Button>
                </template>
            </Table>
            <!-- 分页 -->
            <Page :total="requestData.count" @on-change="pageChange" show-elevator show-total style="marginTop:10px;text-align:center;"/>
            <!-- 标记编辑框 -->
            <Modal
                v-model="markVisible"
                :title="`标记请求(ID:${tmpReq.id})`"
                @on-ok="markVisible = false"
                @on-cancel="markVisible = false">
                响应状态:
                <Select v-model="tmpStatus" style="width:100px;">
                    <Option v-for="(val,key) in reqStatus" :value="Number(key)" :key="`search-col-${key}`">
                        {{ val.text }}
                    </Option>
                </Select>
                <div style="marginTop:24px;display:flex;alignItem:center;">
                    备注:
                    <Input
                        type="textarea"
                        maxlength="255"
                        :autosize="{minRows: 4,maxRows: 8}"
                        show-word-limit
                        v-model="reqComment"
                        placeholder="input something"
                        style="marginLeft:4px;width: 400px"
                    />
                </div>
            </Modal>
            <BackTop/>
        </TabPane>
        <TabPane label="服务">
            <div class="top-title-w">
                <span>Services</span>
            </div>
            <!-- 
                0. id
                1. socket
                2. name
                3. state
                4. comment
                5. access log
             -->
            <div class="collapse-header" @click="servicesFilter = !servicesFilter">
                <Icon v-if="!servicesFilter" type="md-arrow-dropright" size="22" color="#808695"/>
                <Icon v-else type="md-arrow-dropdown" size="22" color="#808695"/>
                All services ({{services.count}})
            </div>
            <div class="services-filter-content" v-if="servicesFilter">
                Filter: <input placeholder="ID/name" />
                <button>查找</button>
            </div>
            <div class="diy-table" style="float: left;">
                <Row class="row">
                    <Col span="20" class="diy-table-td" >Overview</Col>
                    <Col span="4" class="diy-table-td" >Action</Col>
                </Row>
                <Row class="row">
                    <Col span="4" class="diy-table-td" ><strong>ID</strong></Col>
                    <Col span="4" class="diy-table-td" ><strong>Socket</strong></Col>
                    <Col span="4" class="diy-table-td" ><strong>Name</strong></Col>
                    <Col span="4" class="diy-table-td" ><strong>State</strong></Col>
                    <Col span="4" class="diy-table-td" ><strong>Comment</strong></Col>
                    <Col span="4" class="diy-table-td" ><strong>Access log</strong></Col>
                </Row>
                <Row class="row data-item" v-for="row of services.rows" :key="row.id">
                    <Col span="4" class="diy-table-td" >{{row.id}}</Col>
                    <Col span="4" class="diy-table-td" ><strong>{{row.host}}:{{row.port}}</strong></Col>
                    <Col span="4" class="diy-table-td" >{{row.name}}</Col>
                    <Col span="4" class="diy-table-td" >
                        <Badge :status="row.state ? 'success':'error'" />
                        {{row.state ? '正常':'断开'}}
                    </Col>
                    <Col span="4" class="diy-table-td" >{{row.comment}}</Col>
                    <Col span="4" class="diy-table-td" >
                        <a class="by-btn" @click="logout">访问记录</a>
                    </Col>
                </Row>
            </div>
            <Card class="conn-records" dis-hover>
                <p slot="title">
                    <Icon type="md-checkbox-outline" />
                    访问记录(ID: 1001)
                    <Button shape="circle" size="small" icon="md-close" />
                </p>
                <div style="float:left;">
                    <Timeline pending>
                        <TimelineItem color="green">
                            <p class="time">12-06 14:03:29</p>
                            <p class="content">连接成功√</p>
                        </TimelineItem>
                        <TimelineItem color="red">
                            <p class="time">12-06 13:02:07</p>
                            <p class="content">连接断开×</p>
                        </TimelineItem>
                        <TimelineItem color="green">
                            <p class="time">12-05 02:43:40</p>
                            <p class="content">连接成功√</p>
                        </TimelineItem>
                        <TimelineItem color="red">
                            <p class="time">12-04 19:11:55</p>
                            <p class="content">连接断开×</p>
                        </TimelineItem>
                        <TimelineItem color="green">
                            <p class="time">12-04 10:01:30</p>
                            <p class="content">连接成功√</p>
                        </TimelineItem>
                        <TimelineItem><a href="#">查看更多...</a></TimelineItem>
                    </Timeline>
                </div>
            </Card>
        </TabPane>
        <TabPane label="日志" style="background-color:#C7EDCC">
            <div class="top-title-w">
                <span>Logs</span>
            </div>
            <div style="display:flex;justify-content:flex-start;position:relative;">
                <Tree
                    :data="treeData"
                    :render="renderContent"
                />
                <div style="text-align:right;">
                    一键导出:
                    <Button
                        style="margin:0 8px 12px 0;"
                        icon="md-download"
                        type="primary"
                        ghost
                        shape="circle"/>
                    全屏:
                    <Icon
                        type="ios-expand"
                        color="#515a6e"
                        size="32"
                        class="logs-expand"
                        @click="logsFullScreen"
                    />
                    <div id="logsContainer" class="logs-output" v-html="logs1"/>
                </div>
                <Modal
                    v-model="logsFullScreenVisible"
                    fullscreen
                    footer-hide
                    title="account.log.2019-12-10">
                    <div id="logsContainer" class="logs-output" v-html="logs1"/>
                </Modal>
            </div>
        </TabPane>
        <TabPane label="管理">
            <div class="top-title-w">
                <span>{{ullist[0].class === 'selected' ? 'Users':'Instructions'}}</span>
            </div>
            <div class="admin-cw">
                <!-- 左 -->
                <div v-if="ullist[0].class === 'selected'">
                    <div class="collapse-header" @click="allUserVisible = !allUserVisible">
                        <Icon v-if="!allUserVisible" type="md-arrow-dropright" size="22" color="#808695"/>
                        <Icon v-else type="md-arrow-dropdown" size="22" color="#808695"/>
                        All users
                    </div>
                    <div class="diy-table" style="width:480px;" v-if="allUserVisible">
                        <Row class="row">
                            <Col span="6" class="diy-table-td" ><strong>ID</strong></Col>
                            <Col span="6" class="diy-table-td" ><strong>LoginName</strong></Col>
                            <Col span="6" class="diy-table-td" ><strong>Role</strong></Col>
                            <Col span="6" class="diy-table-td" ><strong>Action</strong></Col>
                        </Row>
                        <Row class="row data-item2" v-for="row of users.rows" :key="row.id">
                            <Col span="6" class="diy-table-td" >{{row.id}}</Col>
                            <Col span="6" class="diy-table-td" ><strong>{{row.loginName}}</strong></Col>
                            <Col span="6" class="diy-table-td" >{{roleDict[row.role]}}</Col>
                            <Col span="6" class="diy-table-td" >
                                <a class="by-btn" @click="logout">操作记录</a>
                            </Col>
                        </Row>
                    </div>
                    <div class="collapse-header" @click="addUserVisible = !addUserVisible">
                        <Icon v-if="!addUserVisible" type="md-arrow-dropright" size="22" color="#808695"/>
                        <Icon v-else type="md-arrow-dropdown" size="22" color="#808695"/>
                        Add a user
                    </div>
                    <form v-if="addUserVisible">
                        <strong class="form-label">LoginName:</strong>
                        <input v-model="addUserForm.loginName"/><br/><br/>
                        <strong class="form-label">Password:</strong>
                        <input v-model="addUserForm.loginPass"/><br/><br/>
                        <strong class="form-label">Role:</strong>
                            <Select v-model="addUserForm.role" style="width:100px;">
                                <Option v-for="(disp,role) in roleDict" :value="role" :key="role">{{disp}}</Option>
                            </Select>
                        <br/><br/>
                        <a class="by-btn" @click="addUser">添加</a>
                    </form>
                </div>
                <div v-else>
                    <Alert show-icon style="margin-left:40px;">当采用分布式部署服务，会从相同服务中随机选取执行指令</Alert>
                    <form>
                        <strong class="form-label">选择服务:</strong>
                        <Select v-model="execInstructionForm.service" style="width:100px;">
                            <Option value="all">全部</Option>
                            <Option v-for="val of services.rows" :value="val.id" :key="val.id">{{ val.comment || val.name }}</Option>
                        </Select>
                        <br/><br/>
                        <div style="display:flex;align-items:flex-start;">
                            <strong class="form-label">执行指令:</strong>
                            <textarea
                                v-model="execInstructionForm.instructions"
                                style="width:400px;height:100px;"
                                placeholder="多指令间以英文 “,” 分隔，如:pullTime,schedule，按序执行"
                                />
                        </div>
                        <br/><br/>
                        <a class="by-btn" style="margin-left:40px;" @click="sendInstructions">发送</a>
                    </form>
                    <Tabs class="tabs" style="margin-top:8px;">
                        <TabPane label="Response" style="min-height:100px;background-color:#f4f4f4;">
                            暂无数据
                        </TabPane>
                    </Tabs>
                </div>
                <!-- 右 -->
                <ul class="admin-ul">
                    <li v-for="item of ullist" :class="item.class" :key="item.id" @click="clickulli(item.id)">{{item.id}}</li>
                </ul>
            </div>
        </TabPane>
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
            period: '24hour',
            periodMap: {
                '24hour': '最近24小时',
                'lastMonth': '最近一个月',
                'halfYear': '最近半年'
            },
            panel1: 'traffic',
            servicesFilter: false,
            drawerVisible: false,
            searchFields: {
                service: 'all',
                status: 'all'
            },
            markVisible: false,
            tmpReq: {},
            tmpStatus: 2,
            reqComment: '',
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
                    text: '正常'
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
            requestData: {
                count: 213,
                rows: new Array(10).fill(0).map(() => {
                    return {
                        id: 423982,
                        sid: 1,
                        sname: '积分',
                        method: 'get',
                        path: '/api/v1/market/eth/price/test/asd/dddd',
                        headers: `{
                            "Authorization":"sadkh123kj1223zzkxj",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.84 Safari/537.36"
                        }`,
                        queryStrParams: '{"page":1,"size":10}',
                        requestBody: '{"name":"张三","age":23}',
                        status: 2,
                        responseBody: `{
                            "success":true,
                            "code": 200,
                            "data":{
                                "count":0,
                                "rows":[]
                            }
                        }`,
                        costTime: 32
                    };
                })
            },
            services: {
                count: 7,
                rows: new Array(7).fill(0).map(() => {
                    return {
                        id: Math.round(Math.random() * 10000),
                        name: 'account',
                        host: '127.0.0.1',
                        port: 7001,
                        state: Math.round(Math.random()),
                        comment: '账户'
                    }
                })
            },
            treeData: [
                {
                    title: 'logs(${baseDir}/app/logs)',
                    expand: true,
                    render: (h, { root, node, data }) => {
                        return h('span', {
                            style: {
                                display: 'inline-block',
                                width: '100%',
                                fontSize: '16px'
                            }
                        }, [
                            h('span', [
                                h('Icon', {
                                    props: {
                                        type: 'ios-folder'
                                    },
                                    style: {
                                        marginRight: '8px'
                                    }
                                }),
                                h('span', data.title)
                            ]),
                        ]);
                    },
                    children: [
                        {
                            title: 'account',
                            expand: true,
                            children: [
                                {
                                    title: 'common',
                                    expand: true,
                                    children: [
                                        {
                                            title: 'account.log.2019-12-10',
                                            isFile: true
                                        }
                                    ]
                                },
                                {
                                    title: 'error',
                                    expand: true,
                                    children: [
                                        {
                                            title: 'errors.log.2019-12-10',
                                            isFile: true
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            title: 'integral',
                            expand: true,
                            children: [
                                {
                                    title: 'common'
                                },
                                {
                                    title: 'error'
                                }
                            ]
                        }
                    ]
                }
            ],
            selectedNode: 3,
            logsFullScreenVisible: false,
            logs1: `2019-10-28 15:34:00,716 INFO 30872 [egg-sequelize](2ms) Executed (default): SELECT 1+1 AS result
2019-10-28 15:34:00,772 INFO 30872 [egg-sequelize](8ms) Executed (default): CREATE TABLE IF NOT EXISTS \`account\` (\`id\` INTEGER auto_increment  COMMENT '自增(用户ID)', \`nickname\` VARCHAR(11) NOT NULL COMMENT '昵称', \`avatar\` VARCHAR(255) NOT NULL DEFAULT 'https://img2.woyaogexing.com/2019/09/15/2be507f526f641e1b1651a4b5cbe5fc7!400x400.jpeg' COMMENT '头像url', \`phone\` VARCHAR(11) NOT NULL COMMENT '手机号', \`email\` VARCHAR(255) COMMENT '邮箱', \`loginPass\` VARCHAR(255) NOT NULL COMMENT '登录密码', \`payPass\` VARCHAR(6) COMMENT '支付密码', \`salt\` VARCHAR(6) NOT NULL COMMENT '盐', \`inviter\` INTEGER COMMENT '邀请人(上级节点id)', \`inviteCode\` VARCHAR(6) NOT NULL COMMENT '邀请码', \`createdAt\` DATETIME NOT NULL, \`updatedAt\` DATETIME NOT NULL, \`deletedAt\` DATETIME, PRIMARY KEY (\`id\`)) ENGINE=InnoDB COMMENT '账户表' DEFAULT CHARSET=utf8 AUTO_INCREMENT=100000;\n2019-10-28 15:34:00,779 INFO 30872 [egg-sequelize](4ms) Executed (default): SHOW INDEX FROM \`account\` FROM \`paddy-server\`\n2019-10-28 15:47:39,551 ERROR 30872 [-/127.0.0.1/-/11ms GET /api/v1/checkBind/17305927834]
            `.repeat(8).replace(/\n|\r\n/g,"<br/><br/>"),
            allUserVisible: false,
            addUserVisible: false,
            users: {
                count: 5,
                rows: [
                    {
                        id: Math.round(Math.random() * 100),
                        loginName: 'root',
                        role: 'root'
                    },
                    {
                        id: Math.round(Math.random() * 100),
                        loginName: 'frontend',
                        role: 'frontend'
                    },
                    {
                        id: Math.round(Math.random() * 100),
                        loginName: 'backend',
                        role: 'backend'
                    },
                    {
                        id: Math.round(Math.random() * 100),
                        loginName: 'tester',
                        role: 'tester'
                    },
                    {
                        id: Math.round(Math.random() * 100),
                        loginName: 'devOps',
                        role: 'devOps'
                    }
                ]
            },
            roleDict: {
                root: '超级管理员',
                frontend: '前端开发人员',
                backend: '后端开发人员',
                tester: '测试人员',
                devOps: '运维人员'
            },
            addUserForm: {
                role: 'devOps'
            },
            ullist: [
                {
                    id: 'Users',
                    class: 'selected'
                },
                {
                    id: 'Instructions',
                    class: 'unselected'
                }
            ],
            execInstructionForm: {
                service: 'all'
            }
        }
    },
    mounted() {
    },
    methods: {
        logout() {

        },
        addUser() {
            console.log(this.addUserForm);
        },
        rowClassName (row, index) {
            if (index % 2 === 0) {
                return 'table-blue-row';
            } else {
                return '';
            }
        },
        onMarkClick(row) {
            this.tmpReq = row;
            this.markVisible = true;
        },
        pageChange() {

        },
        resetSearch() {
            this.searchFields = {
                service: 'all',
                status: 'all'
            };
        },
        renderContent (h, { root, node, data }) {
            return h('span', {
                style: {
                    display: 'inline-block',
                    width: '100%',
                    fontSize: '16px'
                }
            }, [
                h(data.isFile ? 'a':'span', {
                    style: {
                        padding: '0 4px',
                        borderRadius: '3px',
                        backgroundColor: data.title === this.selectedNode ? '#2F4F4F':'transparent'
                    },
                    on: {
                        click: () => this.onTreeNodeClick(data)
                    }
                }, [
                    h('Icon', {
                        props: {
                            type: data.isFile ? 'ios-paper-outline':'ios-folder-outline'
                        },
                        style: {
                            marginRight: '8px'
                        }
                    }),
                    h('span', data.title)
                ])
            ]);
        },
        onTreeNodeClick(data) {
            if (data.isFile) {
                this.selectedNode = data.title;
                const logsContainer = this.$el.querySelector("#logsContainer");
                logsContainer.scrollTop = logsContainer.scrollHeight;
            }
        },
        logsFullScreen() {
            this.logsFullScreenVisible = true;
        },
        clickulli(id) {
            this.ullist.forEach(item => {
                if (item.id === id) {
                    item.class = 'selected';
                } else if (item.class === 'selected') {
                    item.class = 'unselected';
                }
            });
        },
        sendInstructions() {
            console.log(this.execInstructionForm);
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
.tabs {
    margin: 0 32px 48px 32px;
    .top-title-w {
        text-align: left;
        font-size: 1.6em;
        color: #484848;
        line-height: 32px;
    }
    .collapse-header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 48px;
        cursor: pointer;
        text-align: left;
    }
    .services-filter-content {
        display: flex;
        height: 48px;
        margin-left: 32px;
        justify-content: flex-start;
        align-items: center;
        input {
            margin-left: 8px;
        }
        button {
            font-size: 12px;
            padding: 1.5px 6px;
            margin-left: 8px;
        }
    }
    .diy-table {
        width: 640px;
        text-align: center;
        border-left: 1px solid #ccc;
        border-top: 1px solid #ccc;
        .row {
            height: 32px;
            .diy-table-td {
                height: 32px;
                line-height: 32px;
                border-bottom: 1px solid #ccc;
                border-right: 1px solid #ccc;
            }
        }
        .data-item:nth-of-type(odd) {
            background-color: #f0f0f0;
            background: linear-gradient(rgba($color: #f0f0f0, $alpha: 0.4), #e0e0e0);
        }
        .data-item2:nth-of-type(even) {
            background-color: #f0f0f0;
            background: linear-gradient(rgba($color: #f0f0f0, $alpha: 0.4), #e0e0e0);
        }
    }
    .conn-records {
        float:left;
        width: 300px;
        margin: 0px 0 0 200px;
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
.logs-output {
    flex: 1;
    min-height: 300px;
    max-height: 100vh;
    margin-left: 32px;
    padding: 32px 8px 8px 8px;
    border-radius: 3px;
    background-color: #300924;
    color: #f8f8f9;
    overflow: scroll;
    text-align: left;
}
.logs-expand {
    cursor: pointer;
    margin-right: 16px;
}
.admin-cw {
    display: flex;
    justify-content: space-between;
    .form-label {
        display: inline-block;
        font-size:12px;
        width: 96px;
        text-align: right;
        margin-right: 8px;
    }
    .admin-ul {
        list-style: none;
        width: 200px;
        & li {
            border-radius: 8px 0 0 8px;
            padding: 0.7em;
            font: 12px Verdana, sans-serif;
            font-weight: bold;
            line-height: 16px;
            cursor: pointer;
            margin-bottom: 8px;
        }
        & li.selected {
            color: #fff;
            background-color: #666;
        }
        & li.unselected {
            color: #444;
            background-color: #fff;
            &:hover {
                color: #fff;
                background-color: #ff9900;
            }
        }
    }
}
.by-btn {
    background-color: #666;
    color: #fff;
    border-radius: 5px;
    margin-left: 8px;
    padding: 3px 7px;
    font: 12px Verdana, sans-serif;
    &:hover {
        color: #fff;
        background-color: #ff9900;
    }
}
</style>