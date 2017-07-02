import {Module} from "./Module";
import {IncomingMessage} from "../lib/DataObjects/Messages/IncomingMessage";
import {Helpers} from "../lib/Helpers";
import {OutgoingTextMessage} from "../lib/DataObjects/Messages/OutgoingMessages/OutgoingTextMessage";
import {InlineQueryResultArticle} from "../lib/DataObjects/InlineQueryResults/InlineQueryResultArticle";
import uuid = require("uuid");
import {InputTextMessageContent} from "../lib/DataObjects/InlineQueryResults/InputMessageContents/InputTextMessageContent";
/**
 * Created by hypfer on 09.06.17.
 */
export class Dawa extends Module {
    protected registerMessageHandlers(MessageChain: any): void {
        const self = this;

        MessageChain.add(function dawa(msg : IncomingMessage, next : Function){
            if(!msg.Message.text || msg.Message.text.length === 0) {
                return next();
            }

            const command = Helpers.checkForCommand("dawa", msg.Message.text, true);
            if(command) {
                if(command.Args && command.Args.length > 0) {
                    self.Bot.sendReply(new OutgoingTextMessage(Dawa.dawa(command.Args[0])), msg.Message.chat.id);
                } else {
                    self.Bot.sendReply(new OutgoingTextMessage(Dawa.dawa()), msg.Message.chat.id);
                }
            } else {
                next();
            }
        });
    }

    protected registerInlineHandlers(InlineChain: any): void {
        const self = this;
        InlineChain.add(function dawa(msg : IncomingMessage, next : Function){
            let query = msg.Message.query.toLowerCase();

            const command = Helpers.checkForCommand("dawa", query, false);

            if (command) {
                let entity;

                if (command.Args && command.Args.length > 0) {
                    entity = command.Args.join(" ");
                }
                const dawa = Dawa.dawa(entity);

                const result =[new InlineQueryResultArticle(
                        uuid.v4(),
                        "Pierre Vogel:",
                        new InputTextMessageContent(dawa),
                        undefined,
                        undefined,
                        undefined,
                        dawa
                    )];

                self.Bot.answerInlineQuery(msg.Message.id, result, {});
            } else {
                next();
            }
        })
    }

    protected defineCommands(): string[] {
        return ["dawa"]
    }

    protected loadAssets(): void {

    }

    private static dawa(entity? : string) {
        entity = entity ? entity.toUpperCase() : "DA'WA";

        return "WIR MÜSSEN " + entity + " AUF DIE STRASSE BRINGEN\n" +
        "WIR MÜSSEN " + entity + " ÜBERALL HINBRINGEN\n" +
        "WIR KÖNNEN KEINE BLOCKHÜTTE IM WALD BAUEN\n" +
        "WO WIR " + entity + " DRAUF SCHREIBEN\n" +
        "UND DANN WARTEN BIS IRGENDEINER SICH VERLÄUFT";
    }

}