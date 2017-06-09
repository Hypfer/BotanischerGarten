import {InlineQueryResult} from "../InlineQueryResult";
import {InputMessageContent} from "../InputMessageContents/InputMessageContent";
/**
 * Created by hypfer on 09.06.17.
 */
export class InlineQueryResultCachedGif extends InlineQueryResult {
    protected getType(): string {
        return "gif";
    }
    gif_file_id : string;
    title : string;
    caption: string;
    input_message_content : InputMessageContent;
    reply_markup : any; //TODO
    constructor(
        id: string,
        gif_file_id : string,
        title? : string,
        caption?: string,
        input_message_content? : InputMessageContent,
        reply_markup? : any
    ) {
        super(id);
        this.gif_file_id = gif_file_id;
        this.title = title;
        this.caption = caption;
        this.input_message_content = input_message_content;
        this.reply_markup = reply_markup;
    }
}