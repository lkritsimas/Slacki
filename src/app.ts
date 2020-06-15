require("dotenv").config();
import { createEventAdapter } from "@slack/events-api";
import Utils from "./utils";
import Core from "./core";

const debug: boolean = !!process.env.APP_DEBUG;
const secret: string = process.env.APP_SECRET;
const port: string | number = process.env.APP_PORT || 3000;
const core = new Core(debug);
const slackEvents: any = createEventAdapter(secret);

// TODO: Implement proper debugging
if (debug) Utils.logger.log("Debug mode");

core.on("moduleLoad", (file: string, module: any, error: any) => {
    if (!error) {
        Utils.logger.log(`loading module: ${file}`);
        return;
    }

    Utils.logger.error(error);
});

core.on("moduleLoaded", (name: string, path: string, error: any) => {
    if (!error) {
        Utils.logger.log(`[${name}] module loaded`);
        return;
    }
    
    Utils.logger.error(error);
});

core.on("command", (command: string, module: any) => {
    Utils.logger.log(command);
});

core.on("commandError", (command: string, module: any, error: any) => {
    Utils.logger.error(error);
});

core.on("moduleError", (module: any, error: any) => {
    Utils.logger.error(error);
});

// Load modules
core.loadModules();

/**
 * Listen for mentions
 */
slackEvents.on("app_mention", async (event: any) => {
    // Parse mention
    const message: string = event.text.replace(/<@([WU].+?)>\s*/, "");
    // Get command from message
    const command: string = message.split(" ")[0].toLowerCase();
    // Get command arguments from message
    const args: string[] = message.split(" ").slice(1);

    try {
        // TODO: Promisify commands
        await core.handleCommand(event, command, args);
    } catch (error) {
        Utils.slack.postMessage(event.channel, "¯\\_(ツ)_/¯");
    }

    console.log(`[${event.channel}]<@${event.user}>: ${message}`);
});

/**
 * Run Slack event server
 */
(async () => {
    const server: any = await slackEvents.start(port);
    console.log(`Listening for events on port ${server.address().port}`);
})();
