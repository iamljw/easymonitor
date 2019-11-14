'use strict';

module.exports = app => {
    const { STRING, INTEGER, TEXT } = app.Sequelize;
    const Model = app.model.define('traffic_policing', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: '自增'
        },
        customId: {
            type: STRING,
            allowNull: false,
            comment: '自定义id'
        },
        sid: {
            type: INTEGER,
            allowNull: false,
            comment: '服务id'
        },
        sname: {
            type: STRING,
            allowNull: false,
            comment: '服务名称'
        },
        method: {
            type: STRING(10),
            allowNull: false,
            comment: '请求方式'
        },
        path: {
            type: STRING,
            allowNull: false,
            comment: '接口路径'
        },
        headers: {
            type: TEXT,
            allowNull: false,
            comment: '请求头'
        },
        queryStrParams: {
            type: TEXT,
            comment: '字符串参数'
        },
        requestBody: {
            type: TEXT,
            comment: '请求体参数'
        },
        status: {
            type: INTEGER,
            comment: '响应状态 -1:bug 0:警告 1:成功'
        },
        responseBody: {
            type: TEXT,
            comment: '响应体'
        },
        costTime: {
            type: INTEGER,
            comment: '响应时长(单位:毫秒)'
        }
    }, {
        indexes: [
            {
                using: 'BTREE',
                fields: ['sid', 'sname', 'method', 'path', 'status', 'costTime']
            }
        ],
        comment: '流量监控表'
    });

    Model.associate = () => {
        Model.belongsTo(app.model.Service, {
            foreignKey: 'sid',
            constraints: false
        });
    };

    return Model;
};
