require("dotenv").config();
const { createEventAdapter } = require("@slack/events-api");
const Loader = require("./loader");
const Utils = require("./lib/utils");

// Read from environment variables
const debug = process.env.APP_DEBUG;
const secret = process.env.APP_SECRET;
const port = process.env.APP_PORT || 3000;

/**
 * Modules
 */
const config = new Loader(`${__dirname}/../config/app.json`);
const modulePath = `${__dirname}/modules`;

// Get enabled modules from config
const _modules = config.get("modules").enabled || [];
// Store loaded modules
let modules = [];

/**
 * Loop through modules from config and enable them
 */
for (const moduleName of _modules) {
    try {
        modules[
            moduleName
        ] = require(`${modulePath}/${moduleName}/${moduleName}.js`);
        modules[moduleName].enabled = true;
        console.log(`[${moduleName}] module loaded`);
    } catch (ex) {
        if (ex.code !== "MODULE_NOT_FOUND") {
            console.log(ex);
        } else {
            console.log(
                `Error: Module "${moduleName}.js" was not found in "${modulePath}/${moduleName}"`
            );
        }
    }
}

// Initialize Slack Event API
const slackEvents = createEventAdapter(secret);

/**
 * Listen for mentions
 */
slackEvents.on("app_mention", event => {
    // Parse mention
    const message = event.text.replace(/<@([WU].+?)>\s*/, "");
    // Get command from message
    const command = message.split(" ")[0].toLowerCase();
    // Get command arguments from message
    const args = message.split(" ").slice(1);

    // Pass on to modules
    for (const moduleName in modules) {
        const module = modules[moduleName];
        const isCommand = module.isCommand || true;
        if (
            typeof module.handle === "function" &&
            command === module.command &&
            isCommand &&
            module.enabled === true
        ) {
            try {
                module.handle(event, args);
            } catch (ex) {
                console.log(ex);
            }
        }
        // else {
        //     Utils.slack.postMessage(event.channel, "¯\\_(ツ)_/¯");
        // }
    }

    // Log message to console
    console.log(`[${event.channel}]<@${event.user}>: ${message}`);
});

/**
 * Run event server
 */
(async () => {
    const server = await slackEvents.start(port);
    console.log(`Listening for events on port ${server.address().port}`);
})();
