import * as fs from "fs";
import { ConfigNotFoundError } from "../utils/error";
import Utils from '../utils';

/**
 * Loads and manages JSON files
 */
export default class Loader {
    private file: string;
    private data: any;
    
    constructor(file: string) {
        if (!fs.existsSync(file)) 
            throw new ConfigNotFoundError(`Error: The file ${file} does not exist`);

        this.file = file;
        this.refresh();
    }

    /**
     * Set a key/value pair
     * @param {string} key
     * @param {string} value
     */
    set(key: string, value: string): void {
        this.data[key] = value;
        this.save();
    }

    /**
     * Get a specific item by key
     * @param {string} key
     */
    get(key: string): string {
        return this.data[key];
    }

    /**
     * Refresh config data
     */
    refresh(): void {
        this.data = JSON.parse(fs.readFileSync(this.file, "utf8"));
    }

    /**
     * Save config file
     */
    save(): void {
        if (!this.file) throw new ConfigNotFoundError("Unable to save, no file provided");

        fs.writeFile(this.file, JSON.stringify(this.data), error => {
            if (error) throw error;

            Utils.logger.log("File saved");
        });
    }
}
