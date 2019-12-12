'use strict';

module.exports = {
    common: [
        '/api/v1/account/list',
        '/api/v1/logs/dir',
        '/api/v1/overview/version',
        '/api/v1/overview/chart',
        '/api/v1/overview/reqList',
        '/api/v1/services/list',
        '/api/v1/services/accessLog',
        '/api/v1/account/self'
    ],
    root: ['*'],
    frontend: [
        '/api/v1/overview/mark'
    ],
    backend: [
        '/api/v1/admin/instructions/send',
        '/api/v1/logs/readLog',
        '/api/v1/overview/mark'
    ],
    tester: [
        '/api/v1/overview/mark'
    ],
    devOps: [
        '/api/v1/admin/instructions/send',
        '/api/v1/logs/readLog'
    ]
};
