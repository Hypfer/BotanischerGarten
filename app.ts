/**
 * Created by hypfer on 06.06.17.
 */
//external dependencies
import TelegramBot = require("node-telegram-bot-api");
//Own stuff
import {Bot} from "./bot";
import {Emo} from "./modules/Emo";
import {Dice} from "./modules/Dice";
import {Fakt} from "./modules/Fakt";
import {Hashes} from "./modules/Hashes";
import {MongoRepository} from "./lib/Repositories/MongoRepository";
import {Bullshit} from "./modules/Bullshit";
import {Dawa} from "./modules/Dawa";
import {Stoll} from "./modules/Stoll";
import {Unicode} from "./modules/Unicode";
import * as express from "express";

const config = require("./config.json");
const _Repository = new MongoRepository(config, function(){
    const _Bot = new Bot(config, _Repository);
    const _App = express();

    const Modules = [
        new Emo(config, _Bot, _App),
        new Dice(config, _Bot, _App),
        new Fakt(config, _Bot, _App),
        new Bullshit(config, _Bot, _App),
        new Dawa(config, _Bot, _App),
        new Stoll(config, _Bot, _App),
        new Unicode(config, _Bot, _App),

        new Hashes(config, _Bot, _App)
    ];

    _App.listen(3000);
});




