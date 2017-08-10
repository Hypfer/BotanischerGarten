import {Module} from "./Module";
import {IncomingMessage} from "../lib/DataObjects/Messages/IncomingMessage";
import {Helpers} from "../lib/Helpers";
import {InlineQueryResultArticle} from "../lib/DataObjects/InlineQueryResults/InlineQueryResultArticle";
import {InputTextMessageContent} from "../lib/DataObjects/InlineQueryResults/InputMessageContents/InputTextMessageContent";
import {OutgoingTextMessage} from "../lib/DataObjects/Messages/OutgoingMessages/OutgoingTextMessage";
import * as uuid from "uuid";
/**
 * Created by hypfer on 09.06.17.
 */
export class Stoll extends Module {
    private StollAssets : any;
    protected registerMessageHandlers(MessageChain: any): void {
        const self = this;

        MessageChain.add(function stoll(msg: IncomingMessage, next : Function){
            if(!msg.Message.text || msg.Message.text.length === 0) {
                return next();
            }

            const command = Helpers.checkForCommand("stoll", msg.Message.text, true);
            if (command) {
                self.Bot.sendReply(new OutgoingTextMessage(self.getStoll()), msg.Message.chat.id);
            } else {
                next();
            }
        });
    }

    protected registerInlineHandlers(InlineChain: any): void {
        const self = this;

        InlineChain.add(function stoll(msg: IncomingMessage, next : Function){
            const query = msg.Message.query.toLowerCase();

            const command = Helpers.checkForCommand("stoll", query, false);
            if (command) {
                const offset = msg.Message.offset === "" ? 0 : parseInt(msg.Message.offset);

                const results = [];

                for (let i = 0; i <= 10; i++) {
                    const stoll = self.getStoll();

                    results[i] = new InlineQueryResultArticle(
                        uuid.v4(),
                        "Axel Stoll sagt:",
                        new InputTextMessageContent(stoll),
                        undefined,
                        undefined,
                        undefined,
                        stoll
                    );
                }
                self.Bot.answerInlineQuery(msg.Message.id, results, {
                    cache_time: 5, //Damit neue results zeitnah auftauchen
                    next_offset: offset+10
                });
            } else {
                next();
            }
        });
    }

    protected defineCommands(): Array<string> {
        return ["stoll"];
    }

    protected loadAssets(): void {
        this.StollAssets = require("../assets/stoll.json");
    }

    private getStoll(): string {
        return Helpers.arrayRandom(this.StollAssets.teil1, false) + " " +
               Helpers.arrayRandom(this.StollAssets.teil2, false) + " " +
               Helpers.arrayRandom(this.StollAssets.teil3, false);
    }

}