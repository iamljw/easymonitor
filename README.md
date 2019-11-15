# easymonitor

专为 NodeJS 服务提供可靠的监控管理服务和可视化界面

## 客户端连接
需携带参数:
    - serviceName(string): 服务名
    - host(string): ip
    - port(int): 端口
    - comment(string): 备注
## v1 TODO
1. 流量
    - 请求方式
    - 接口路径
    - 请求头
    - 路径参数
    - 请求体参数
    - 时间戳
2. 日志
3. 统计数据

## some featrue
- 接口重试
- 接口状态变更
- monitor pull(需要权限)
- service push
- 管理服务，向指定服务发送命令(需要权限)
- 服务状态变更记录
- 后台登录
- 日志归档