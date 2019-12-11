'use strict';

class AppBootHook {
    constructor(app) {
        this.app = app;
    }

    async willReady() {
        const { app } = this;
        app.dio = app.io.of('/');
    }
}

module.exports = AppBootHook;
