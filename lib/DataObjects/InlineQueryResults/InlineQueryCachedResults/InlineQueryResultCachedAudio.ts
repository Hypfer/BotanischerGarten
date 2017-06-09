import {InlineQueryResult} from "../InlineQueryResult";
import {InputMessageContent} from "../InputMessageContents/InputMessageContent";
/**
 * Created by hypfer on 09.06.17.
 */
export class InlineQueryResultCachedAudio extends InlineQueryResult {
    protected getType(): string {
        return "audio";
    }
    audio_file_id : string;
    caption : string;
    input_message_content : InputMessageContent;
    reply_markup : any; //TODO
    constructor(
        id : string,
        audio_file_id : string,
        caption? : string,
        reply_markup? :any,
        input_message_content? : InputMessageContent
    ) {
        super(id);
        this.audio_file_id = audio_file_id;
        this.caption = caption;
        this.input_message_content = input_message_content;
        this.reply_markup = reply_markup;
    }

}