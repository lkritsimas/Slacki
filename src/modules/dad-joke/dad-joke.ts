import { Module } from "../module";
import Utils from "../../utils";

class DadJoke extends Module {
    public constructor(config?: any) {
        super({
            name: "Dad Joke", 
            isCommand: true, 
            command: "dadjoke",
            description: "Get a random dad joke"
        }, {
            dadJokesURL: "https://icanhazdadjoke.com/",
            ...config,
        });
    }

    public async handle(event: any) {
        const res = await this.fetchDadJoke();
        Utils.slack.postMessage(event.channel, res);
    }

    private async fetchDadJoke() {
        try {
            const { data } = await Utils.http.axios.get(
                this.getConfig().dadJokesURL,
                {
                    headers: {
                        accept: "application/json",
                    },
                }
            );
                
            return data.joke;
        } catch (error) {
            this.emit("moduleError", this, error);
            return "An error occured when fetching joke, try again later!";
        }
    }
}

module.exports = new DadJoke();
