import {InlineQueryResult} from "../InlineQueryResult";
import {InputMessageContent} from "../InputMessageContents/InputMessageContent";
/**
 * Created by hypfer on 09.06.17.
 */
export class InlineQueryResultCachedMpeg4Gif extends InlineQueryResult {
    protected getType(): string {
        return "mpeg4_gif";
    }
    mpeg4_file_id : string;
    title : string;
    caption: string;
    input_message_content : InputMessageContent;
    reply_markup : any; //TODO
    constructor(
        id: string,
        mpeg4_file_id : string,
        title? : string,
        caption?: string,
        input_message_content? : InputMessageContent,
        reply_markup? : any
    ) {
        super(id);
        this.mpeg4_file_id = mpeg4_file_id;
        this.title = title;
        this.caption = caption;
        this.input_message_content = input_message_content;
        this.reply_markup = reply_markup;
    }
}