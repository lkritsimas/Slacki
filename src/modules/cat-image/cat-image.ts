import { Module } from "../module";
import Utils from "../../utils";

class CatImage extends Module {
    public constructor(config?: any) {
        super({
            name: "Cat Image",
            isCommand: true,
            command: "cat",
            description: "Get a random cat image",
        }, {
            imageURLs: [
                "https://some-random-api.ml/img/cat",
                "http://aws.random.cat/meow",
                "https://cataas.com/cat",
            ],
            ...config,
        });
    }

    public async handle(event: any) {
        const image: any = await this.fetchImage();
        
        if (!image.data) {
            Utils.slack.postMessage(
                event.channel,
                "An error occured, try again later!"
            );
        }
        else { 
            // Upload file to Slack channel
            Utils.slack.postFile(event.channel, {
                title: "Cat",
                file: image.data,
                filename: `cat.${image.filetype}`
            });
        }
    }

    // Get file type from MIME type
    private getFileType(mimeType: string): string {
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
     * Get a random cat image
     */
    private async fetchImage(): Promise<object | string> {
        let response: any = null;

        // Loop through image URLs and pick one that responds
        for (const imageURL of this.getConfig().imageURLs) {
            try {
                // Should probably make the following parts into methods
                response = await Utils.http.axios.get(imageURL, {
                    responseType: "arraybuffer"
                });
            
                if (!('data' in response)) continue;
                if (response.headers["content-type"].includes("application/json")) {
                    response.data = JSON.parse(response.data);
                }                

                if (response.data.file || response.data.link) {
                    const newImageURL = response.data.file || response.data.link;
                    response = await Utils.http.axios.get(newImageURL, {
                        responseType: "arraybuffer"
                    });
                }

                response = {
                    data: response.data,
                    filetype: this.getFileType(response.headers["content-type"]),
                };
                break;
            } catch(error) {
                this.emit("moduleError", this, error);
                continue;
            }
        }

        return response;
    }
}

module.exports = new CatImage();
