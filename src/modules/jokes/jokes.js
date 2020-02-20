const Utils = require("../../lib/utils");

/**
 * Module: Jokes
 * Command: joke
 * Arguments:
 *  joke  - Gets a random dad joke
 */
class Jokes {
    constructor(config) {
        this.isCommand = true;
        this.command = "joke";

        this.config = {
            dadJokesURL: "https://icanhazdadjoke.com/",
            ...config
        };
    }

    /**
     * Module handler
     * @param {Object} event
     * @param {Array} args
     */
    handle(event, args) {
        return this.fetchDadJoke().then(data => {
            Utils.slack.postMessage(event.channel, data.joke);
        });
    }

    async fetchDadJoke() {
        const response = await Utils.http.axios.get(this.config.dadJokesURL, {
            headers: {
                accept: "application/json"
            }
        });

        if (!response.data && response)
            return "An error occured when fetching joke, try again later!";

        return response.data;
    }
}

module.exports = new Jokes();
