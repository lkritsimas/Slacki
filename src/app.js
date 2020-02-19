const { RTMClient } = require("@slack/rtm-api");

// Read from environment variables
const token = process.env.APP_TOKEN;
const name = process.env.APP_DEBUG;
const debug = process.env.APP_DEBUG;

// Initialize
const rtm = new RTMClient(token);

(async () => {
    await rtm.start();
})();
