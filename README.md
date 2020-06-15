# Slacki
_This is a hobby project, it may or may not get continued support. You may not want to use this bot in a production environment as it is still in its infancy._

Slacki is a simple modular TypeScript Slack bot made in Node.js, using the Slack Web and Events API.

## Planned features
- Promisification
- Functional tests
- Persistent logs
- More commands!

## Installation
1. Clone the repo
2. `npm install`

## Usage

### Create a Slack app
https://api.slack.com/authentication/basics#creating

https://api.slack.com/events-api#subscriptions

### Configuration
1. Rename `app.example.json` located in `./config` to `app.json`.
2. Rename `.env.example` to `.env`, add signing secret and OAuth token.

### Using commands
Slacki uses mentions instead of slash commands (this may be subject to change).
```
@Slacki <command>
```

## Creating modules
Hello, world! example:
```ts
// modules/hello-world/hello-world.ts
import { Module } from "../module";

class HelloWorld extends Module {
    constructor() {
        super({
            name: "Hello, world!", 
            isCommand: true, 
            command: "helloworld",
            description: "You already know what this command does"
        });
    }

    async handle(event: any, args?: string[]) {
        await Utils.slack.postMessage(event.channel, "Hello, world!");
    }
}

module.exports = new HelloWorld();
```

After creating the module, enable it in `app.json`:
```json
{
    "modules": {
        "enabled": ["cat-fact", "cat-image", "dad-joke", "hello-world"]
    }
}
```
