import {InlineQueryResult} from "../InlineQueryResult";
import {InputMessageContent} from "../InputMessageContents/InputMessageContent";
/**
 * Created by hypfer on 09.06.17.
 */
export class InlineQueryResultCachedVoice extends InlineQueryResult {
    protected getType(): string {
        return "voice";
    }
    voice_file_id : string;
    title : string;
    caption : string;
    input_message_content : InputMessageContent;
    reply_markup : any; //TODO
    constructor(
        id : string,
        voice_file_id : string,
        title : string,
        caption? : string,
        reply_markup? :any,
        input_message_content? : InputMessageContent
    ) {
        super(id);
        this.voice_file_id = voice_file_id;
        this.title = title;
        this.caption = caption;
        this.input_message_content = input_message_content;
        this.reply_markup = reply_markup;
    }

}