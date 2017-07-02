import {Module} from "./Module";
import {Helpers} from "../lib/Helpers";
import {IncomingMessage} from "../lib/DataObjects/Messages/IncomingMessage";
import {OutgoingTextMessage} from "../lib/DataObjects/Messages/OutgoingMessages/OutgoingTextMessage";
import {InlineQueryResultArticle} from "../lib/DataObjects/InlineQueryResults/InlineQueryResultArticle";
import uuid = require("uuid");
import {InputTextMessageContent} from "../lib/DataObjects/InlineQueryResults/InputMessageContents/InputTextMessageContent";
/**
 * Created by hypfer on 09.06.17.
 */
export class Unicode extends Module {
    UnicodeRanges : Array<Array<number>>;
    protected registerMessageHandlers(MessageChain: any): void {
        const self = this;

        MessageChain.add(function unicode(msg : IncomingMessage, next : Function){
            if(!msg.Message.text || msg.Message.text.length === 0) {
                return next();
            }

            const command = Helpers.checkForCommand("unicode", msg.Message.text, true);
            if(command) {
                let result = "";
                if(command.Args && command.Args.length > 0 && Number.isInteger(Number.parseInt(command.Args[0]))) {
                    for (let i = 0; i <= Number.parseInt(command.Args[0]); i++) {
                        result += self.getSymbol();
                    }
                } else {
                    result = self.getSymbol();
                }
                self.Bot.sendReply(new OutgoingTextMessage(result), msg.Message.chat.id);
            } else {
                next();
            }
        })
    }

    protected registerInlineHandlers(InlineChain: any): void {
        const self = this;
        InlineChain.add(function unicode(msg : IncomingMessage, next : Function){
            let query = msg.Message.query.toLowerCase();

            const command = Helpers.checkForCommand("unicode", query, false);

            if (command) {
                const offset = msg.Message.offset === "" ? 0 : parseInt(msg.Message.offset);
                const results = [];
                let count = (command.Args && command.Args.length > 0 &&
                                Number.isInteger(Number.parseInt(command.Args[0]))) ? Number.parseInt(command.Args[0]) : 0;

                count = count > 128 ? 128 : count;

                for(let i = 0; i <= 10; i++) {
                    let result = "";

                    for (let j = 0; j <= count; j++) {
                        result += self.getSymbol();
                    }

                    results.push(new InlineQueryResultArticle(
                        uuid.v4(),
                        "Unicode",
                        new InputTextMessageContent(result),
                        undefined,
                        undefined,
                        undefined,
                        result
                    ));
                }

                self.Bot.answerInlineQuery(msg.Message.id, results, {
                    cache_time: 5, //Damit neue results zeitnah auftauchen
                    next_offset: offset+10
                });
            } else {
                next();
            }
        })
    }

    protected defineCommands(): string[] {
        return ["unicode"];
    }

    protected loadAssets(): void {
        //Dies sind nur die Unicode ranges, welche mir interessant vorkamen
        this.UnicodeRanges = [
            [0x1F700,0x1173F], //Alchemical Symbols
            [0x1D200,0x1D24F], //Ancient Greek Musical Notation
            [0x2190,0x21FF], //Arrows
            [0x2580,0x259F], //Block Elements
            [0x2500,0x257F], //Box Drawing
            [0x2800,0x28FF], //Braille Patterns
            [0x2400,0x243F], //Control Pictures
            [0x3000,0x303F], //CJK Symbols and Punctuation
            [0x2700,0x27BF], //Dingbats
            [0x1F030,0x1F09F], //Domino Tiles
            [0x1F600,0x1F64F], //Emoticons
            [0x2460,0x24FF], //Enclosed Alphanumerics
            [0x2000,0x206F], //General Punctuation
            [0x25A0,0x25FF], //Geometric Shapes
            [0x2FF0,0x2FFF], //Ideographic Description Characters
            [0x2100,0x214F], //Letterlike Symbols
            [0x1F000,0x1F02F], //Mahjong Tiles
            [0x2200,0x22FF], //Mathematical Operators
            [0x27C0,0x27EF], //Miscellaneous Mathematical Symbols-A
            [0x2980,0x29FF], //Miscellaneous Mathematical Symbols-B
            [0x2600,0x26FF], //Miscellaneous Symbols
            [0x2B00,0x2BFF], //Miscellaneous Symbols and Arrows
            [0x1F300,0x1F5FF], //Miscellaneous Symbols And Pictographs (Emoji)
            [0x2300,0x23FF], //Miscellaneous Technical
            [0x1D100,0x1D1FF], //Musical Symbols
            [0x2150,0x218F], //Number Forms
            [0x2440,0x245F], //Optical Character Recognition
            [0x1F0A0,0x1F0FF], //Playing Cards
            [0x27F0,0x27FF], //Supplemental Arrows-A
            [0x2900,0x297F], //Supplemental Arrows-B
            [0x2A00,0x2AFF], //Supplemental Mathematical Operators
            [0x2E00,0x2E7F], //Supplemental Punctuation
            [0x1F680,0x1F6FF] //Transport and Map Symbols
        ];
    }

    private getSymbol() : string {
        const range = Helpers.arrayRandom(this.UnicodeRanges, false);
        return String.fromCodePoint(Helpers.randomIntFromInterval(range[0],range[1]));
    }

}