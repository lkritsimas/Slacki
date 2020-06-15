import moment = require("moment");

export default abstract class Logger {
    static getTimeStamp() {
        return moment.utc().format("YYYY-MM-DD HH:mm:ss");
    }

    static log(...message) {
        console.log(`[${this.getTimeStamp()}]`, ...message);
    }

    static error(...message) {
        console.log(`[${this.getTimeStamp()}] [ERROR]`, ...message);
    }
    
    static warn(...message) {
        console.log(`[${this.getTimeStamp()}] [WARNING]`, ...message);
    }
};
