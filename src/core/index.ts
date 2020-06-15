import * as path from "path";
import Loader from "./loader";
import { CoreEvent } from "./event";
import { iModule } from "../modules/module";
import { ModuleNotFoundError, CommandNotFoundError, NoModulesEnabledError, NoModulesFoundError, ModuleNotLoadedError } from "../utils/error";

export default class Core extends CoreEvent {
    public modulePath: string;

    // Store loaded modules
    public modules: any[] = [];

    private debug: boolean = false;
    private config: any;
    // Get enabled modules from config
    private moduleQueue: string[];

    public constructor(debug?: boolean) {
        super();
        this.debug = debug || false;
        this.config = new Loader(
            path.join(__dirname, "/../../config/app.json")
        );
        this.modulePath = path.join(__dirname, "/../modules");
        this.moduleQueue = this.config.get("modules").enabled || [];
    }

    public registerModule(module: iModule, name: string): void {
        this.modules[name] = module;
    }

    public loadModule(file: string): iModule {
        let loadError = undefined;
        let module;

        try {
            module = require(file);
        } catch (error) {
            loadError = error;
            throw new ModuleNotLoadedError(`Unable to load file: ${file}`)
        }
        this.emit("moduleLoad", file, module, loadError);

        return module;
    }

    /**
     * Loop through modules from config and enable them
     */
    public loadModules(): void {
        if (!this.moduleQueue.length) throw new NoModulesEnabledError("No modules were enabled in config");

        for (const moduleName of this.moduleQueue) {
            let loadError = undefined;
            const currPath: string = path.join(
                this.modulePath,
                moduleName,
                `${moduleName}.ts`
            );

            try {
                const module = this.loadModule(currPath);
                this.registerModule(module, module.getCommand());
            } catch (error) {
                loadError = error;
                
                if (error.code === "MODULE_NOT_FOUND")
                    throw new ModuleNotFoundError(`Module "${moduleName}.ts" was not found in "${this.modulePath}"`);
            }

            this.emit("moduleLoaded", moduleName, this.modulePath, loadError);
        }
    }

    public getCommand(command: string): iModule {
        if (!this.modules[command])
            throw new CommandNotFoundError(`Invalid command: ${command}`);

        return this.modules[command];
    }

    async handleCommand(event: any, command: string, args: string[]) {
        try {
            const module = this.getCommand(command);

            if (
                !module ||
                typeof module.handle !== "function" ||
                !module.isEnabled() ||
                !module.isCommand() ||
                command !== module.getCommand()
            ) {
                return;
            }

            module.handle(event, args);
            this.emit("command", command, module);
        } catch (error) {
            this.emit("commandError", command, module, error);
            throw error;
        }
    }
};
