import { Module } from "../module";
import Utils from "../../utils";

class CatFact extends Module {
    private title: string;

    public constructor(config?: any) {
        super({
            name: "Cat fact",
            isCommand: true,
            command: "catfact",
            description: "Get a random cat fact",
        },
        {
            factURLs: [
                "https://cat-fact.herokuapp.com/facts/random",
                "https://catfact.ninja/fact",
            ],
            ...config,
        });

        this.title = ":cat: *Cat fact*";
    }

    public async handle(event: any) {
        this.fetchFact().then((data: string) =>
            Utils.slack.postMessage(event.channel, data, this.title)
        );
    }

    /**
     * Get a random cat fact
     */
    private async fetchFact(): Promise<string> {
        let fact: string;

        for (const factURL of this.getConfig().factURLs) {
            try {
                const { data } = await Utils.http.axios.get(factURL);

                fact = data.fact || data.text;
                break;
            } catch (error) {
                this.emit("moduleError", this, error);
                continue;
            }
        }

        if (!fact) {
            return "An error occured when fetching fact, try again later!";
        }

        return fact;
    }
}

module.exports = new CatFact();
