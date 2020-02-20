const Utils = require("../../lib/utils");
/**
 * Module: Cat
 * Command: cat
 * Arguments:
 *  fact                 - Gets a random cat fact
 *  [img|image|picture]  - Gets a random cat image
 */
class Cat {
    constructor(config) {
        this.isCommand = true;
        this.command = "cat";

        this.config = {
            factURL: "https://catfact.ninja/fact",
            imageURLs: ["https://cataas.com/cat", "http://aws.random.cat/meow"],
            ...config
        };
    }

    /**
     * Module handler
     * @param {object} event
     * @param {array} args
     */
    handle(event, args) {
        if (!args.length) return false;
        const command = args[0];

        switch (command) {
            case "fact":
                return this.fetchFact().then(data =>
                    Utils.slack.postMessage(event.channel, data)
                );

            case "img":
            case "image":
            case "picture":
                return this.fetchImage().then(image => {
                    if (!image.data)
                        Utils.slack.postMessage(
                            event.channel,
                            "An error occured, try again later!"
                        );

                    // Upload file to Slack channel
                    Utils.slack.postFile(event.channel, {
                        title: "Cat",
                        file: image.data,
                        filename: `cat.${image.filetype}`
                    });
                });

            default:
                return Utils.slack.postMessage(
                    event.channel,
                    "How about trying a command that actually exists?"
                );
        }
    }

    // Get file type from MIME type
    getFileType(mimeType) {
        switch (mimeType) {
            default:
            case "image/jpeg":
                return "jpg";
            case "image/png":
                return "png";
            case "image/gif":
                return "gif";
            case "video/webm":
                return "webm";
        }
    }

    /**
     * Get a random cat fact
     */
    async fetchFact() {
        const response = await Utils.http.axios.get(this.config.factURL);
        if ((!response.data || !response.data.fact) && response)
            return "An error occured when fetching fact, try again later!";

        return response.data.fact;
    }

    /**
     * Get a random cat image
     */
    async fetchImage() {
        let response;

        // Loop through image URLs and pick one that responds
        for (const imageURL of this.config.imageURLs) {
            response = await Utils.http.axios.get(imageURL, {
                responseType: "arraybuffer"
            });

            if (!response.data && response) continue;
            else break;
        }

        if (!response.data)
            return "An error occured when fetching image, try again later!";

        return {
            data: response.data,
            filetype: this.getFileType(response.headers["content-type"])
        };
    }
}

module.exports = new Cat();
