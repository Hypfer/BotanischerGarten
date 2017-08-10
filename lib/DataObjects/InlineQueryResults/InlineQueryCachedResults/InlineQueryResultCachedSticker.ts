import {InlineQueryResult} from "../InlineQueryResult";
import {InputMessageContent} from "../InputMessageContents/InputMessageContent";
/**
 * Created by hypfer on 09.06.17.
 */
export class InlineQueryResultCachedSticker extends InlineQueryResult {
    protected getType(): string {
        return "sticker";
    }

    sticker_file_id: string;
    input_message_content: InputMessageContent;
    reply_markup: any; //TODO
    constructor(id: string,
                sticker_file_id: string,
                input_message_content?: InputMessageContent,
                reply_markup?: any) {
        super(id);
        this.sticker_file_id = sticker_file_id;
        this.input_message_content = input_message_content;
        this.reply_markup = reply_markup;
    }

}