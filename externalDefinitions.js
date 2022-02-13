"use strict";
class DefinitionManager {
    constructor(definitions) {
        this.definitions = definitions;
    }
    filterMessage(message) {
        let definitionsArray = this.definitions.split("\n");
        let valid = true;
        for (let i = 0; i < definitionsArray.length; i++) {
            if (message.includes(definitionsArray[i])) {
                valid = false;
            }
        }
        return valid;
    }
}

module.exports = { DefinitionManager }