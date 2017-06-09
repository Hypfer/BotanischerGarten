import {InlineQueryResult} from "./InlineQueryResult";
import {InputMessageContent} from "./InputMessageContents/InputMessageContent";
/**
 * Created by hypfer on 09.06.17.
 */
export class InlineQueryResultContact extends InlineQueryResult {
    protected getType(): string {
        return "contact";
    }
    id : string;
    phone_number : string;
    first_name : string;
    last_name : string;
    reply_markup : any;
    input_message_content : InputMessageContent;
    thumb_url : string;
    thumb_width : number;
    thumb_height : number;
    constructor(
        id : string,
        phone_number : string,
        first_name : string,
        last_name? : string,
        reply_markup? : any,
        input_message_content? : InputMessageContent,
        thumb_url? : string,
        thumb_width? : number,
        thumb_height? : number
    ) {
        super(id);
        this.phone_number = phone_number;
        this.first_name = first_name;
        this.last_name = last_name;
        this.reply_markup = reply_markup;
        this.input_message_content = input_message_content;
        this.thumb_url = thumb_url;
        this.thumb_width = thumb_width;
        this.thumb_height = thumb_height;
    }

}