'use strict';

module.exports = app => {
    const { STRING, INTEGER } = app.Sequelize;
    const Model = app.model.define('account', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: '自增'
        },
        loginName: {
            type: STRING,
            allowNull: false,
            unique: true,
            comment: '登录名'
        },
        loginPass: {
            type: STRING,
            allowNull: false,
            comment: '登录密码'
        },
        salt: {
            type: STRING(6),
            comment: '盐'
        },
        role: {
            type: STRING,
            comment: '角色 root:超级管理员 frontend:前端开发 backend:后端开发 tester:测试人员 devOps:运维人员'
        }
    }, {
        comment: '账户表'
    });

    return Model;
};
