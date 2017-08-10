import {InlineQueryResult} from "./InlineQueryResult";
import {InputMessageContent} from "./InputMessageContents/InputMessageContent";
/**
 * Created by hypfer on 09.06.17.
 */
export class InlineQueryResultLocation extends InlineQueryResult {
    protected getType(): string {
        return "location";
    }

    latitude: number;
    longitude: number;
    title: string;
    reply_markup: any;
    input_message_content: InputMessageContent;
    thumb_url: string;
    thumb_width: number;
    thumb_height: number;

    constructor(id: string,
                latitude: number,
                longitude: number,
                title: string,
                reply_markup?: any,
                input_message_content?: InputMessageContent,
                thumb_url?: string,
                thumb_width?: number,
                thumb_height?: number) {
        super(id);
        this.latitude = latitude;
        this.longitude = longitude;
        this.title = title;
        this.reply_markup = reply_markup;
        this.input_message_content = input_message_content;
        this.thumb_url = thumb_url;
        this.thumb_width = thumb_width;
        this.thumb_height = thumb_height;
    }


}