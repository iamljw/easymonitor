'use strict';

module.exports = app => {
    const { INTEGER, DATE } = app.Sequelize;
    const Model = app.model.define('service_conn_record', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: '自增'
        },
        sid: {
            type: INTEGER,
            allowNull: false,
            comment: '服务id'
        },
        conntime: {
            type: DATE,
            allowNull: false,
            comment: '连接时间'
        },
        disconntime: {
            type: DATE,
            comment: '断开时间'
        }
    }, {
        timestamps: false,
        comment: '服务连接记录表'
    });

    return Model;
};
