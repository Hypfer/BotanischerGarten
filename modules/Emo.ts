import {Module} from "./Module";
import {Helpers} from "../lib/Helpers";
import {OutgoingTextMessage} from "../lib/DataObjects/Messages/OutgoingMessages/OutgoingTextMessage";
import {InlineQueryResultArticle} from "../lib/DataObjects/InlineQueryResults/InlineQueryResultArticle";
import {InputTextMessageContent} from "../lib/DataObjects/InlineQueryResults/InputMessageContents/InputTextMessageContent";
import {IncomingMessage} from "../lib/DataObjects/Messages/IncomingMessage";
/**
 * Created by hypfer on 07.06.17.
 */
export class Emo extends Module {
    Emotes : any;

    protected loadAssets(): void {
        this.Emotes = require("../assets/emotes.json");
    }

    protected registerMessageHandlers(MessageChain: any) {
        const self = this;

        MessageChain.add(function emo(msg : IncomingMessage, next){
            if(!msg.Message.text || msg.Message.text.length === 0) {
                return next();
            }

            if (Helpers.checkForCommand("emolist", msg.Message.text, true)) {
                self.Bot.sendReply(new OutgoingTextMessage(JSON.stringify(self.Emotes, null, 2)), msg.Message.chat.id); //könnte krachen. Try catch?
            } else {
                const command = Helpers.checkForCommand("emo", msg.Message.text, true);

                if (command) {
                    const emote = command.Args[0];

                    if(emote && self.Emotes[emote]) {
                        self.Bot.sendReply(new OutgoingTextMessage(self.Emotes[emote]), msg.Message.chat.id);
                    } else {
                        self.Bot.sendReply(new OutgoingTextMessage("Invalid emote."), msg.Message.chat.id);
                    }
                } else {
                    next();
                }
            }
        });
    }

    protected registerInlineHandlers(InlineChain: any) {
        const self = this;

        InlineChain.add(function emo(msg : IncomingMessage, next){
            let query = msg.Message.query.toLowerCase();

            let command = Helpers.checkForCommand("emo", query, false);

            if (command) {
                const offset = msg.Message.offset === "" ? 0 : parseInt(msg.Message.offset);

                query = command.Args[0];
                if(!query) {
                    query = "";
                }

                const emoteNames = Object.keys(self.Emotes);

                const resultNames = [];
                const results = [];

                emoteNames.forEach(function (name) {
                    if (name.toLowerCase().indexOf(query) !== -1) {
                        resultNames.push(name);
                    }
                });

                if(offset) {
                    resultNames.splice(0, offset);
                }

                resultNames.forEach(function (resultName) {
                    results.push(
                        new InlineQueryResultArticle(
                            resultName,
                            resultName,
                            new InputTextMessageContent(self.Emotes[resultName]),
                            undefined,
                            undefined,
                            undefined,
                            self.Emotes[resultName])
                    );
                });

                /*
                if (query === "") {
                    results = Helpers.shuffleArray(results);
                } */

                self.Bot.answerInlineQuery(msg.Message.id, results, {
                    cache_time: 5, //Damit neue results zeitnah auftauchen
                    next_offset: offset+50
                });
            } else {
                next();
            }
        })
    }

    protected defineCommands(): string[] {
        return ["emolist", "emo"];
    }

}