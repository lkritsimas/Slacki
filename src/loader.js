const fs = require("fs");

class Loader {
    constructor(file) {
        if (!fs.existsSync(file))
            return console.log(`Error: The file ${file} does not exist`);

        this.file = file;
        this.refresh();
    }

    set(key, value) {
        this.data[key] = value;
        this.save();
    }

    get(key) {
        return this.data[key];
    }

    refresh() {
        this.data = JSON.parse(fs.readFileSync(this.file, "utf8"));
    }

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
