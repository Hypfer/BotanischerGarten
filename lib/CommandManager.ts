import {Helpers} from "./Helpers";
/**
 * Created by hypfer on 06.06.17.
 */
export class CommandManager {
    Commands : object;
    constructor() {
        this.Commands = {};
    }

    isRegistered(command: string) {
        return !!(this.Commands[command] || this.Commands[(Helpers.commandPrefix + command)]);
    }
    registerCommands(commands : Array<string>) {
        const self = this;

        commands.forEach(function(command: string){
            if(self.isRegistered(command)) {
                throw new Error("Command " + command + " is already registered!");
            } else {
                self.Commands[command] = true;
            }
        });

    }
}