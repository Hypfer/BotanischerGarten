import {Command} from "./Command";
/**
 * Created by hypfer on 07.06.17.
 */
export class Helpers {
    static commandPrefix = "#";


    static arrayRandom(arr : Array<any>, remove : boolean) : any {
        if(remove) {
            return arr.splice(Math.floor(Math.random() * arr.length), 1 )[0];
        } else {
            return arr[Math.floor(Math.random() * arr.length)];
        }
    }

    static shuffleArray (arr : Array<any>) : Array<any> {
        var i = 0
            , j = 0
            , temp = null;

        for (i = arr.length - 1; i > 0; i -= 1) {
            j = Math.floor(Math.random() * (i + 1));
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp
        }

        return arr;
    }

    static randomIntFromInterval(min : number, max : number) : number {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    static checkForCommand(command : string, msg : string, usePrefix : boolean) : Command {
        msg = msg? msg : "";
        msg = msg.toLowerCase();
        command = command.toLowerCase();
        command = usePrefix ? Helpers.commandPrefix+command : command;

        if(msg.indexOf(command) === 0) {
            const splitMsg = msg.split(" ");
            if(splitMsg[0] === command) {
                return new Command(splitMsg.slice(1));
            }
        }
    }
}