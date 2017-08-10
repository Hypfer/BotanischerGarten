import {InlineQueryResult} from "../InlineQueryResult";
import {InputMessageContent} from "../InputMessageContents/InputMessageContent";
/**
 * Created by hypfer on 09.06.17.
 */
export class InlineQueryResultCachedDocument extends InlineQueryResult {
    protected getType(): string {
        return "document";
    }

    document_file_id: string;
    title: string;
    description: string;
    caption: string;
    input_message_content: InputMessageContent;
    reply_markup: any; //TODO
    constructor(id: string,
                document_file_id: string,
                title: string,
                description?: string,
                caption?: string,
                input_message_content?: InputMessageContent,
                reply_markup?: any) {
        super(id);
        this.document_file_id = document_file_id;
        this.title = title;
        this.description = description;
        this.caption = caption;
        this.input_message_content = input_message_content;
        this.reply_markup = reply_markup;
    }

}