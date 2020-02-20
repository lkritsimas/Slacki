const { WebClient, ErrorCode } = require("@slack/web-api");

const token = process.env.APP_TOKEN;
const client = new WebClient(token);

/**
 * Send a simple message to a public channel, private channel, DM, or MPDM.
 * @param {string} channel
 * @param {string} text
 * @param {array} attachments
 */
const postMessage = async (channel, text, attachments = null) => {
    if (!channel.length || !text.length) return false;

    return client.chat.postMessage({
        channel: channel,
        text: text,
        attachments: attachments
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
