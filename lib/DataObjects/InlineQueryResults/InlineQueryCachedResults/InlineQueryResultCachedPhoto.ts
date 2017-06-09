import {InlineQueryResult} from "../InlineQueryResult";
import {InputMessageContent} from "../InputMessageContents/InputMessageContent";
/**
 * Created by hypfer on 09.06.17.
 */
export class InlineQueryResultCachedPhoto extends InlineQueryResult {
    protected getType(): string {
        return "photo";
    }
    photo_file_id : string;
    title : string;
    description : string;
    caption : string;
    input_message_content : InputMessageContent;
    reply_markup : any; //TODO
    constructor(
        id : string,
        photo_file_id : string,
        title? : string,
        description? : string,
        caption? : string,
        reply_markup? :any,
        input_message_content? : InputMessageContent
    ) {
        super(id);
        this.photo_file_id = photo_file_id;
        this.title = title;
        this.description = description;
        this.caption = caption;
        this.input_message_content = input_message_content;
        this.reply_markup = reply_markup;
    }
}