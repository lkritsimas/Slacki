import { CoreEvent } from "../core/event";
import { ModuleError } from "../utils/error";

export interface iModuleInfo {
    name: string;
    isCommand: boolean;
    command: string | null;
    description: string;
    config?: any;
}

export interface iModule {
    isEnabled(): boolean;
    isCommand(): boolean;
    getName(): string;
    getCommand(): string | null;
    getDescription(): string;
    getConfig(): any;
    handle(event: any, args?: string[]): Promise<any>;
}

export class Module extends CoreEvent implements iModule {
    private _name: string;
    private _isCommand: boolean;
    private _command: string | null;
    private _description: string;
    private _config?: any;
    private _enabled: boolean = false;

    public constructor(
        info: iModuleInfo,
        config?: any
    ) {
        super();
        this._name = info.name;
        this._isCommand = info.isCommand;
        this._command = info.command || null;
        this._description = info.description || "";
        this._config = config;
        this._enabled = true;
    }

    public isEnabled(): boolean {
        return this._enabled;
    }    

    public isCommand(): boolean {
        return this._isCommand;
    }

    public getName(): string {
        return this._name;
    }

    public getCommand(): string {
        return this._command;
    }

    public getDescription(): string {
        return this._description;
    }

    public getConfig(): any {
        return this._config;
    }

    public async handle(event: any, args?: string[]): Promise<any> {
        throw new ModuleError(`${this.constructor.name} is missing the handle() method`);
    }
}
