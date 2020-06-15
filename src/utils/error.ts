// TODO: Improve this stuff

class AppError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class ConfigNotFoundError extends AppError {}
export class CommandNotFoundError extends AppError {}
export class ModuleError extends AppError {}
export class ModuleNotFoundError extends AppError {}
export class ModuleNotLoadedError extends AppError {}
export class ModuleDamagedError extends AppError {}
export class NoModulesEnabledError extends AppError {}
export class NoModulesFoundError extends AppError {}
