import {Module} from "./Module";
import {Helpers} from "../lib/Helpers";
import {OutgoingTextMessage} from "../lib/DataObjects/Messages/OutgoingMessages/OutgoingTextMessage";
import {InlineQueryResultArticle} from "../lib/DataObjects/InlineQueryResults/InlineQueryResultArticle";
import {InputTextMessageContent} from "../lib/DataObjects/InlineQueryResults/InputMessageContents/InputTextMessageContent";
import {IncomingMessage} from "../lib/DataObjects/Messages/IncomingMessage";
import uuid = require("uuid");
/**
 * Created by hypfer on 07.06.17.
 */
export class Fakt extends Module {
    Facts : any;
    FactSets : Array<string>;
    static Fallback = "Fakt ist: Es gibt keine Fakten.";

    protected registerMessageHandlers(MessageChain: any): void {
        const self = this;

        MessageChain.add(function fakt(msg : IncomingMessage, next) {
            if(!msg.Message.text || msg.Message.text.length === 0) {
                return next();
            }

            const command = Helpers.checkForCommand("fakt", msg.Message.text, true);
            if (command) {
                let answer = Fakt.Fallback;
                if(command.Args && command.Args.length > 0) {
                    if(command.Args[0] === "?") {
                        answer = "Kategorien: " + self.FactSets.join(", ");
                    } else {
                        if(self.Facts[command.Args[0]]) {
                            answer = Helpers.arrayRandom(self.Facts[command.Args[0]], false);
                        }
                    }
                } else {
                    if(self.FactSets && self.FactSets.length > 0) {
                        answer = Helpers.arrayRandom(self.Facts[Helpers.arrayRandom(self.FactSets, false)], false);
                    }
                }

                self.Bot.sendReply(new OutgoingTextMessage(answer), msg.Message.chat.id);
            } else {
                next();
            }
        });
    }

    protected registerInlineHandlers(InlineChain: any): void {
        const self = this;

        InlineChain.add(function emo(msg : IncomingMessage, next) {
            let query = msg.Message.query.toLowerCase();

            const command = Helpers.checkForCommand("fakt", query, false);
            if (command) {
                const offset = msg.Message.offset === "" ? 0 : parseInt(msg.Message.offset);
                let category;

                if (command.Args && command.Args.length > 0) {
                    if (self.Facts[command.Args[0]]) {
                        category = command.Args[0];
                    } else {
                        return;
                    }
                }

                let results = [];

                for (let i = 0; i <= 50; i++) {
                    let result;
                    if (category) {
                        result = Helpers.arrayRandom(self.Facts[category], false);
                    } else {
                        result = Helpers.arrayRandom(self.Facts[Helpers.arrayRandom(self.FactSets, false)], false);
                    }

                    results[i] = new InlineQueryResultArticle(
                                        uuid.v4(),
                                        "Fakt ist:",
                                        new InputTextMessageContent(result),
                                        undefined,
                                        undefined,
                                        undefined,
                                        result
                    );
                }


                results = Helpers.shuffleArray(results);

                self.Bot.answerInlineQuery(msg.Message.id, results, {
                    cache_time: 5, //Damit neue results zeitnah auftauchen
                    next_offset: offset+50
                });
            } else {
                next();
            }
        });
    }

    protected defineCommands(): Array<string> {
        return ["fakt"];
    }

    protected loadAssets(): void {
        this.Facts = require("../assets/fakten.json");
        this.FactSets = Object.keys(this.Facts);
    }

}