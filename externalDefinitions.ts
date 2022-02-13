const fs = require('fs');

class ExtDefMgr {
    definitions: string;
    definitionsArr;
    flags: string | null;

    constructor(definitions: string, flags: string | null) {
        this.definitions = definitions;
        this.definitionsArr = fs.readFileSync(this.definitions).split("\n");
        this.flags = flags;
    }

    checkMessage(message: string) {
        let valid = true;
        if (this.flags === "hasLink") {
            for (let i = 0; i < this.definitionsArr.length; i++) {
                if (message.includes(this.definitionsArr[i]) && message.includes("://")) {
                    valid = false;
                }
            }
            return valid;
        } else {
            for (let i = 0; i < this.definitionsArr.length; i++) {
                if (message.includes(this.definitionsArr[i])) {
                    valid = false;
                }
            }
            return valid;
        }
    }
}

let mgr = new ExtDefMgr("./definitions.txt", "none");
mgr.checkMessage("nitro no cost");