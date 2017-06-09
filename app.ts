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

const config = require("./config.json");
const _Repository = new MongoRepository(config, function(){
    const _Bot = new Bot(config, _Repository);

    const Modules = [
        new Emo(config, _Bot),
        new Dice(config, _Bot),
        new Fakt(config, _Bot),
        new Bullshit(config, _Bot),
        new Dawa(config, _Bot),
        new Stoll(config, _Bot),
        new Unicode(config, _Bot),

        new Hashes(config, _Bot)
    ];
});




