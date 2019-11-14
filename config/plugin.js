'use strict';

/** @type Egg.EggPlugin */
module.exports = {
    // had enabled by egg
    // static: {
    //   enable: true,
    // }
    response: {
        enable: true,
        package: 'egg-response'
    },
    errorHandler: {
        enable: true,
        package: 'egg-error-handler'
    },
    sequelize: {
        enable: true,
        package: 'egg-sequelize'
    },
    routerPlus: {
        enable: true,
        package: 'egg-router-plus'
    },
    io: {
        enable: true,
        package: 'egg-socket.io'
    }
};
