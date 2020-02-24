const { WebClient, ErrorCode } = require("@slack/web-api");

const token = process.env.APP_TOKEN;
const client = new WebClient(token);

/**
 * Send a simple message to a public channel, private channel, DM, or MPDM.
 * @param {string} channel
 * @param {string} text
 * @param {Array} attachments
 */
const postMessage = async (channel, text, title, args = null) => {
    if (!channel.length || !text.length) return false;

    title = title ? `${title}\n` : "";

    return client.chat.postMessage({
        channel: channel,
        text: `${title}${text}`,
        ...args
    });
};

/**
 * Send a file to a public channel, private channel, DM, or MPDM.
 * @param {string} channels -
 * @param {string} data
 */
const postFile = async (channels, data) => {
    if (!channels.length || !Object.keys(data).length) return false;

    return client.files.upload({
        channels: channels,
        ...data
    });
};

module.exports = {
    postMessage,
    postFile
};
