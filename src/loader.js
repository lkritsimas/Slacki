const fs = require("fs");

/**
 * Loads and manages JSON files
 */
class Loader {
    constructor(file) {
        if (!fs.existsSync(file))
            return console.log(`Error: The file ${file} does not exist`);

        this.file = file;
        this.refresh();
    }

    /**
     * Set a key/value pair
     * @param {string} key
     * @param {string} value
     */
    set(key, value) {
        this.data[key] = value;
        this.save();
    }

    /**
     * Get a specific item by key
     * @param {string} key
     */
    get(key) {
        return this.data[key];
    }

    /**
     * Refresh config data
     */
    refresh() {
        this.data = JSON.parse(fs.readFileSync(this.file, "utf8"));
    }

    /**
     * Save config file
     */
    save() {
        if (!this.file) console.log("Error: Unable to save, no file provided");

        fs.writeFile(this.file, JSON.stringify(this.data), error => {
            if (error) {
                console.log(error);
            } else {
                console.log("File saved");
            }
        });
    }
}

module.exports = Loader;
