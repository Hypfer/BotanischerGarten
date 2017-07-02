import {Module} from "./Module";
import {IncomingMessage} from "../lib/DataObjects/Messages/IncomingMessage";
import {Helpers} from "../lib/Helpers";
import {OutgoingTextMessage} from "../lib/DataObjects/Messages/OutgoingMessages/OutgoingTextMessage";
import uuid = require("uuid");
import {InputTextMessageContent} from "../lib/DataObjects/InlineQueryResults/InputMessageContents/InputTextMessageContent";
import {InlineQueryResultArticle} from "../lib/DataObjects/InlineQueryResults/InlineQueryResultArticle";
/**
 * Created by hypfer on 09.06.17.
 */
export class Bullshit extends Module {
    private BullshitAssets : any;
    protected registerMessageHandlers(MessageChain: any): void {
        const self = this;

        MessageChain.add(function bullshit(msg: IncomingMessage, next : Function){
            if(!msg.Message.text || msg.Message.text.length === 0) {
                return next();
            }

            const command = Helpers.checkForCommand("bullshit", msg.Message.text, true);
            if (command) {
                self.Bot.sendReply(new OutgoingTextMessage(self.getBullshit()), msg.Message.chat.id);
            } else {
                next();
            }
        });
    }

    protected registerInlineHandlers(InlineChain: any): void {
        const self = this;

        InlineChain.add(function bullshit(msg: IncomingMessage, next : Function){
            const query = msg.Message.query.toLowerCase();

            const command = Helpers.checkForCommand("bullshit", query, false);
            if (command) {
                const offset = msg.Message.offset === "" ? 0 : parseInt(msg.Message.offset);

                const results = [];

                for (let i = 0; i <= 10; i++) {
                    const bullshit = self.getBullshit();

                    results[i] = new InlineQueryResultArticle(
                        uuid.v4(),
                        "Der BWL Student sagt:",
                        new InputTextMessageContent(bullshit),
                        undefined,
                        undefined,
                        undefined,
                        bullshit
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
        return ["bullshit"];
    }

    protected loadAssets(): void {
        this.BullshitAssets = require("../assets/bullshit.json");
    }

    private getBullshit() : string{
        const bullshitAssets = JSON.parse(JSON.stringify(this.BullshitAssets)); //Clone

        const saetze = [
            function() {
                const substantiv01 = Helpers.arrayRandom(bullshitAssets.substantiv, true);
                const substantiv02 = Helpers.arrayRandom(bullshitAssets.substantiv, true);
                const substantiv03 = Helpers.arrayRandom(bullshitAssets.substantiv, true);

                let satz = "";
                satz += Helpers.arrayRandom(bullshitAssets.wenn, true) + ", dass ";
                satz += bullshitAssets.artikel_bestimmt_fall_1[substantiv01[4]] + " ";
                satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + " ";
                satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + "e ";
                satz += substantiv01[0] +  " ";
                satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + " ";
                satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + " ";
                satz += Helpers.arrayRandom(bullshitAssets.predikat[0], true) + ", ";
                satz += Helpers.arrayRandom(bullshitAssets.dann, true) + ", dass " + bullshitAssets.artikel_bestimmt_fall_1[substantiv02[4]] + " ";
                satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + " ";
                satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + "e ";
                satz += substantiv02[0] + " ";
                satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + " ";
                satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + " ";
                satz += Helpers.arrayRandom(bullshitAssets.predikat[0], true) + ", ";
                satz += Helpers.arrayRandom(bullshitAssets.weil, true) + " ";
                satz += bullshitAssets.artikel_bestimmt_fall_1[substantiv03[4]] + " ";
                satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + " ";
                satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + "e ";
                satz += substantiv03[0] + " ";
                satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + " ";
                satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + " ";
                satz += Helpers.arrayRandom(bullshitAssets.predikat[0], true) + ".";

                return satz;
            },
            function() {
                const substantiv01 = Helpers.arrayRandom(bullshitAssets.substantiv, true);
                const substantiv02 = Helpers.arrayRandom(bullshitAssets.substantiv, true);
                const substantiv03 = Helpers.arrayRandom(bullshitAssets.substantiv, true);
                const substantiv04 = Helpers.arrayRandom(bullshitAssets.substantiv, true);
                const substantiv05 = Helpers.arrayRandom(bullshitAssets.substantiv, true);
                const substantiv06 = Helpers.arrayRandom(bullshitAssets.substantiv, true);
                const substantiv07 = Helpers.arrayRandom(bullshitAssets.substantiv, true);

                let satz = "";
                satz += Helpers.arrayRandom(bullshitAssets.anfang, true) + " ";
                satz += Helpers.arrayRandom(bullshitAssets.predikat[1], true) + " ";
                satz += bullshitAssets.artikel_bestimmt_fall_1[substantiv01[4]] + " ";
                switch(Math.floor(Math.random() * 3)) {
                    case 0:
                        satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + " ";
                        satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + "e ";
                        break;
                    case 1:
                        satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + "e ";
                        break;
                }
                satz += substantiv01[0] + " ";
                satz += bullshitAssets.artikel_bestimmt_fall_2[substantiv02[4]] + " ";
                satz += substantiv02[0] + " ";
                satz += bullshitAssets.artikel_unbestimmt_fall_4[substantiv03[4]] + " ";
                switch(Math.floor(Math.random() * 3)) {
                    case 0:
                        satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + " ";
                        satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + bullshitAssets.adjektiv_endung_unbest_fall_4[substantiv03[4]] + " ";
                        break;
                    case 1:
                        satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + bullshitAssets.adjektiv_endung_unbest_fall_4[substantiv03[4]] + " ";
                        break;
                }
                satz += substantiv03[0] + " ";
                satz += bullshitAssets.artikel_bestimmt_fall_2[substantiv04[4]] + " ";
                switch(Math.floor(Math.random() * 3)) {
                    case 0:
                        satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + " ";
                        satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + "en ";
                        break;
                    case 1:
                        satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + "en ";
                        break;
                }
                satz += substantiv04[0] + " und ";
                satz += Helpers.arrayRandom(bullshitAssets.predikat[1], true) + " ";
                satz += Helpers.arrayRandom(bullshitAssets.dadurch, true)+ " ";
                satz += bullshitAssets.artikel_unbestimmt_fall_4[substantiv05[4]] + " ";
                switch(Math.floor(Math.random() * 3)) {
                    case 0:
                        satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + " ";
                        satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + " ";
                        break;
                    case 1:
                        satz += Helpers.arrayRandom(bullshitAssets.adjektiv, true) + " ";
                        break;
                }
                satz += substantiv05[0] + " ";
                satz += Helpers.arrayRandom(bullshitAssets.lokation, true)[bullshitAssets.lokationIndex[substantiv06[4]]] +  " ";
                satz += substantiv06[0] + " ";
                satz += bullshitAssets.artikel_bestimmt_fall_2[substantiv07[4]] + " ";
                satz += substantiv07[0] + ".";

                return satz;
            }
        ];

        return Helpers.arrayRandom(saetze, false)();
    }
}