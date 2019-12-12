'use strict';

module.exports = {
    register: {
        loginName: 'string',
        loginPass: {
            type: 'string',
            trim: true,
            min: 8,
            max: 18,
            format: /^[a-zA-Z0-9_.]{8,}$/
        },
        role: ['frontend', 'backend', 'tester', 'devOps']
    },
    login: {
        loginName: 'string',
        loginPass: 'string'
    }
};
