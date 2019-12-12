'use strict';

module.exports = app => {
    const { STRING, INTEGER } = app.Sequelize;
    const Model = app.model.define('service', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: '自增'
        },
        name: {
            type: STRING,
            allowNull: false,
            comment: '服务名称'
        },
        host: {
            type: STRING,
            allowNull: false,
            comment: 'ip'
        },
        port: {
            type: INTEGER,
            comment: '端口'
        },
        comment: {
            type: STRING,
            comment: '备注'
        },
        state: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '状态 0:不可用 1:可用'
        },
        socketId: {
            type: STRING,
            comment: 'socket id'
        }
    }, {
        indexes: [
            {
                using: 'BTREE',
                fields: ['name', 'host', 'port', 'state']
            }
        ],
        comment: '服务列表'
    });
    Model.associate = () => {
        Model.hasMany(app.model.TrafficPolicing, {
            foreignKey: 'sid',
            constraints: false
        });
    };

    return Model;
};
