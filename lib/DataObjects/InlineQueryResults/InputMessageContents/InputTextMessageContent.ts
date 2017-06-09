import {InputMessageContent} from "./InputMessageContent";
/**
 * Created by hypfer on 07.06.17.
 */
export class InputTextMessageContent extends InputMessageContent {
    message_text : string;
    parse_mode : "Markdown" | "HTML"; //not lowercase??
    disable_web_page_preview : boolean;
    constructor(message_text : string,
                parse_mode? : "Markdown" | "HTML",
                disable_web_page_preview?: boolean) {
        super();
        this.message_text = message_text;
        this.parse_mode = parse_mode;
        this.disable_web_page_preview = disable_web_page_preview;
    }
}