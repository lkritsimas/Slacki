import { WebClient, ErrorCode } from "@slack/web-api";
const token = process.env.APP_TOKEN;
const client = new WebClient(token);

/**
* Send a message to a public channel, private channel, DM, or MPDM.
* @param {string} channel
* @param {string} text
* @param {string} title
* @param {any[]} args
*/
export const postMessage = async (channel: string, text: string, title?: string, args?: any[]) => {
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
 * @param {any} data
 */
export const postFile = async (channels: string, data: any) => {
    if (!channels.length || !Object.keys(data).length) return false;

    return client.files.upload({
        channels: channels,
        ...data
    });
};
