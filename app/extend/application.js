'use strict';

const crypto = require('crypto');

module.exports = {
    /**
     * 加密
     * @param {*} content 内容
     * @param {*} salt 盐
     * @param {*} algorithm 算法
     */
    hmac(content, salt, algorithm = 'sha1') {
        const hmac = crypto.createHmac(algorithm, salt);
        hmac.update(content);
        return hmac.digest('hex');
    }
};
