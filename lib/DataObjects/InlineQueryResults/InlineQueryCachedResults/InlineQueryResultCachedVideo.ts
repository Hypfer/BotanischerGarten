import {InlineQueryResult} from "../InlineQueryResult";
import {InputMessageContent} from "../InputMessageContents/InputMessageContent";
/**
 * Created by hypfer on 09.06.17.
 */
export class InlineQueryResultCachedVideo extends InlineQueryResult {
    protected getType(): string {
        return "video"
    }

    video_file_id : string;
    title : string;
    description : string;
    caption : string;
    input_message_content : InputMessageContent;
    reply_markup : any; //TODO
    constructor(
        id : string,
        video_file_id : string,
        title? : string,
        description? : string,
        caption? : string,
        reply_markup? :any,
        input_message_content? : InputMessageContent
    ) {
        super(id);
        this.video_file_id = video_file_id;
        this.title = title;
        this.description = description;
        this.caption = caption;
        this.input_message_content = input_message_content;
        this.reply_markup = reply_markup;
    }

}