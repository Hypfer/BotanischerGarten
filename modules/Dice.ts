import {Module} from "./Module";
import {Helpers} from "../lib/Helpers";
import {OutgoingTextMessage} from "../lib/DataObjects/Messages/OutgoingMessages/OutgoingTextMessage";
import {InlineQueryResultArticle} from "../lib/DataObjects/InlineQueryResults/InlineQueryResultArticle";
import {InputTextMessageContent} from "../lib/DataObjects/InlineQueryResults/InputMessageContents/InputTextMessageContent";
import {IncomingMessage} from "../lib/DataObjects/Messages/IncomingMessage";
/**
 * Created by hypfer on 07.06.17.
 */
export class Dice extends Module {
    protected registerMessageHandlers(MessageChain: any): void {
        const self = this;

        MessageChain.add(function w20(msg : IncomingMessage, next) {
            if(!msg.Message.text || msg.Message.text.length === 0) {
                return next();
            }

            if (Helpers.checkForCommand("w20", msg.Message.text, true)) {
                self.Bot.sendReply(new OutgoingTextMessage(Dice.w(20).toString()), msg.Message.chat.id);
            } else {
                next();
            }
        });

        MessageChain.add(function w6(msg : IncomingMessage, next) {
            if(!msg.Message.text || msg.Message.text.length === 0) {
                return next();
            }

            if (Helpers.checkForCommand("w6", msg.Message.text, true)) {
                self.Bot.sendReply(new OutgoingTextMessage(Dice.w(6).toString()), msg.Message.chat.id);
            } else {
                next();
            }
        });
    }

    protected registerInlineHandlers(InlineChain: any): void {
        const self = this;

        InlineChain.add(function w20(msg : IncomingMessage, next){
            const query = msg.Message.query.toLowerCase();
            const command = Helpers.checkForCommand("w20", query, false);

            if (command) {
                const roll = Dice.w(20).toString();

                const results = [new InlineQueryResultArticle(
                    "w20:"+roll,
                    "Dice: W20",
                    new InputTextMessageContent("W20: " +roll),
                    undefined,
                    undefined,
                    undefined,
                    "Roll!")
                ];

                self.Bot.answerInlineQuery(msg.Message.id, results, {
                    cache_time: 1, //Jede Sekunde eine neue Zahl
                    is_personal: true
                });
            } else {
                next();
            }
        });

        InlineChain.add(function w6(msg : IncomingMessage, next){
            const query = msg.Message.query.toLowerCase();
            const command = Helpers.checkForCommand("w6", query, false);

            if (command) {
                const roll = Dice.w(6).toString();

                var results = [new InlineQueryResultArticle(
                    "w6:"+roll,
                    "Dice: W6",
                    new InputTextMessageContent("W6: " +roll),
                    undefined,
                    undefined,
                    undefined,
                    "Roll!")
                ];

                self.Bot.answerInlineQuery(msg.Message.id, results, {
                    cache_time: 1, //Jede Sekunde eine neue Zahl
                    is_personal: true
                });
            } else {
                next();
            }
        });
    }

    protected defineCommands(): string[] {
        return ["w20", "w6"];
    }

    protected loadAssets(): void {
        return;
    }

    private static w(n : number) : number{
        return Math.floor(Math.random() * (n)) + 1;
    }

}