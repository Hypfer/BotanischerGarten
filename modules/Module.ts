import {Bot} from "../bot";
/**
 * Created by hypfer on 07.06.17.
 */
export abstract class Module {
    Config : any;
    Bot : Bot;
    App : any;

    constructor(config : any, bot : Bot, app : any) {
        this.Config = config;
        this.Bot = bot;
        this.Bot.CommandManager.registerCommands(this.defineCommands());
        this.App = app;

        this.loadAssets();
        this.registerRoutes();

        this.registerMessageHandlers(this.Bot.MessageChain);
        this.registerInlineHandlers(this.Bot.InlineChain);
    }
    protected abstract registerMessageHandlers(MessageChain : any) : void;
    protected abstract registerInlineHandlers(InlineChain : any) : void;
    protected abstract defineCommands() : Array<string>;
    protected abstract loadAssets() : void;
    protected registerRoutes() : void {

    }
}