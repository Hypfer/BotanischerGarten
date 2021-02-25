import {Module} from "./Module";
import {IncomingMessage} from "../lib/DataObjects/Messages/IncomingMessage";
import {Helpers} from "../lib/Helpers";
import {InlineQueryResultArticle} from "../lib/DataObjects/InlineQueryResults/InlineQueryResultArticle";
import {InputTextMessageContent} from "../lib/DataObjects/InlineQueryResults/InputMessageContents/InputTextMessageContent";
import {OutgoingTextMessage} from "../lib/DataObjects/Messages/OutgoingMessages/OutgoingTextMessage";
import * as uuid from "uuid";
import * as fs from "fs";
import * as path from "path";
/**
 * Created by hypfer on 09.06.17.
 */
export class BOFH extends Module {
    private BofhAssets: any;

    protected registerMessageHandlers(MessageChain: any): void {
        const self = this;

        MessageChain.add(function bofh(msg: IncomingMessage, next: Function) {
            if (!msg.Message.text || msg.Message.text.length === 0) {
                return next();
            }

            const command = Helpers.checkForCommand("bofh", msg.Message.text, true);
            if (command) {
                self.Bot.sendReply(new OutgoingTextMessage(self.getBofh()), msg.Message.chat.id);
            } else {
                next();
            }
        });
    }

    protected registerInlineHandlers(InlineChain: any): void {
        const self = this;

        InlineChain.add(function bofh(msg: IncomingMessage, next: Function) {
            const query = msg.Message.query.toLowerCase();

            const command = Helpers.checkForCommand("bofh", query, false);
            if (command) {
                const offset = msg.Message.offset === "" ? 0 : parseInt(msg.Message.offset);

                const results = [];

                for (let i = 0; i <= 15; i++) {
                    const bofh = self.getBofh();

                    results[i] = new InlineQueryResultArticle(
                        uuid.v4(),
                        "The cause of the problem is:",
                        new InputTextMessageContent(bofh),
                        undefined,
                        undefined,
                        undefined,
                        bofh
                    );
                }
                self.Bot.answerInlineQuery(msg.Message.id, results, {
                    cache_time: 5, //Damit neue results zeitnah auftauchen
                    next_offset: offset + 10
                });
            } else {
                next();
            }
        });
    }

    protected defineCommands(): Array<string> {
        return ["bofh"];
    }

    protected loadAssets(): void {
        this.BofhAssets = fs.readFileSync(path.join(__dirname, "../assets/bofh.txt")).toString().replace(/(\r\n|\r)/gm, "\n").split("\n").filter(e => e !== "");
    }

    private getBofh(): string {
        return Helpers.arrayRandom(this.BofhAssets, false);
    }

}
