import {Bot} from "../bot";
/**
 * Created by hypfer on 07.06.17.
 */
export abstract class Module {
    Config : any;
    Bot : Bot;

    constructor(config : any, bot : Bot) {
        this.Config = config;
        this.Bot = bot;
        this.Bot.CommandManager.registerCommands(this.defineCommands());

        this.loadAssets();

        this.registerMessageHandlers(this.Bot.MessageChain);
        this.registerInlineHandlers(this.Bot.InlineChain);
    }
    protected abstract registerMessageHandlers(MessageChain : any) : void;
    protected abstract registerInlineHandlers(InlineChain : any) : void;
    protected abstract defineCommands() : Array<string>;
    protected abstract loadAssets() : void;
}