require("dotenv").config();
const { RTMClient } = require("@slack/rtm-api");
const Loader = require("./loader");

// Read from environment variables
const token = process.env.APP_TOKEN;
const name = process.env.APP_DEBUG;
const debug = process.env.APP_DEBUG;

/**
 * Modules
 */
const config = new Loader(`${__dirname}/../config/app.json`);
const modulePath = `${__dirname}/modules`;

// Get active modules
const _modules = config.get("modules").enabled || [];
let modules = [];

/**
 * Loop through modules from config and enable them
 */

console.log(_modules);
for (const moduleName of _modules) {
    try {
        modules[moduleName] = require(`${modulePath}/${moduleName}.js`);
        modules[moduleName].enabled = true;

        console.log(module);
    } catch (ex) {
        if (ex.code !== "MODULE_NOT_FOUND") console.log(ex);
        else {
            console.log(
                `Error: Module "${moduleName}.js" was not found in "${modulePath}"`
            );
        }
    }
}

if (!debug) {
    // Initialize
    const rtm = new RTMClient(token);

    (async () => {
        await rtm.start();
    })();
}
