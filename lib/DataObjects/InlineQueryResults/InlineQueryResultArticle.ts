import {InlineQueryResult} from "./InlineQueryResult";
import {InputMessageContent} from "./InputMessageContents/InputMessageContent";
/**
 * Created by hypfer on 07.06.17.
 */
export class InlineQueryResultArticle extends InlineQueryResult {
    title: string;
    input_message_content: InputMessageContent;
    reply_markup: any; //TODO
    url: string;
    hide_url: string;
    description: string;
    thumb_url: string;
    thumb_width: number;
    thumb_height: number;

    constructor(id: string,
                title: string,
                input_message_content: InputMessageContent,
                reply_markup?: any, //TODO
                url?: string,
                hide_url?: string,
                description?: string,
                thumb_url?: string,
                thumb_width?: number,
                thumb_height?: number) {
        super(id);
        this.title = title;
        this.input_message_content = input_message_content;
        this.reply_markup = reply_markup;
        this.url = url;
        this.hide_url = hide_url;
        this.description = description;
        this.thumb_url = thumb_url;
        this.thumb_height = thumb_height;
        this.thumb_width = thumb_width;
    }

    protected getType(): string {
        return "article";
    }
}