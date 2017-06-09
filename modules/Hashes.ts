import * as async from "async";
import {Module} from "./Module";
import {HashService} from "../lib/Services/HashService";
import {Bot} from "../bot";
import {Helpers} from "../lib/Helpers";
import {IncomingMessage} from "../lib/DataObjects/Messages/IncomingMessage";
import {OutgoingTextMessage} from "../lib/DataObjects/Messages/OutgoingMessages/OutgoingTextMessage";
import {TextHash} from "../lib/DataObjects/Hashes/TextHash";
import {Hash} from "../lib/DataObjects/Hashes/Hash";
import {PhotoHash} from "../lib/DataObjects/Hashes/PhotoHash";
import * as request from "request";
import * as fileType from "file-type";
import {BinaryData} from "../lib/DataObjects/Hashes/BinaryData";
import {OutgoingPhotoMessage} from "../lib/DataObjects/Messages/OutgoingMessages/OutgoingPhotoMessage";
import {VideoHash} from "../lib/DataObjects/Hashes/VideoHash";
import {OutgoingVideoMessage} from "../lib/DataObjects/Messages/OutgoingMessages/OutgoingVideoMessage";
import {VideoMessageHash} from "../lib/DataObjects/Hashes/VideoMessageHash";
import {OutgoingVideoMessageMessage} from "../lib/DataObjects/Messages/OutgoingMessages/OutgoingVideoMessageMessage";
import {AudioHash} from "../lib/DataObjects/Hashes/AudioHash";
import {OutgoingAudioMessage} from "../lib/DataObjects/Messages/OutgoingMessages/OutgoingAudioMessage";
import {DocumentHash} from "../lib/DataObjects/Hashes/DocumentHash";
import {OutgoingDocumentMessage} from "../lib/DataObjects/Messages/OutgoingMessages/OutgoingDocumentMessage";
import {StickerHash} from "../lib/DataObjects/Hashes/StickerHash";
import {OutgoingStickerMessage} from "../lib/DataObjects/Messages/OutgoingMessages/OutgoingStickerMessage";
import {VoiceHash} from "../lib/DataObjects/Hashes/VoiceHash";
import {OutgoingVoiceMessage} from "../lib/DataObjects/Messages/OutgoingMessages/OutgoingVoiceMessage";
import {LocationHash} from "../lib/DataObjects/Hashes/LocationHash";
import {OutgoingLocationMessage} from "../lib/DataObjects/Messages/OutgoingMessages/OutgoingLocationMessage";
import {VenueHash} from "../lib/DataObjects/Hashes/VenueHash";
import {OutgoingVenueMessage} from "../lib/DataObjects/Messages/OutgoingMessages/OutgoingVenueMessage";
import {ContactHash} from "../lib/DataObjects/Hashes/ContactHash";
import {OutgoingContactMessage} from "../lib/DataObjects/Messages/OutgoingMessages/OutgoingContactMessage";
import {InlineQueryResultCachedPhoto} from "../lib/DataObjects/InlineQueryResults/InlineQueryCachedResults/InlineQueryResultCachedPhoto";
import {InlineQueryResultCachedMpeg4Gif} from "../lib/DataObjects/InlineQueryResults/InlineQueryCachedResults/InlineQueryResultCachedMpeg4Gif";
import {InlineQueryResultCachedDocument} from "../lib/DataObjects/InlineQueryResults/InlineQueryCachedResults/InlineQueryResultCachedDocument";
import {InlineQueryResultCachedSticker} from "../lib/DataObjects/InlineQueryResults/InlineQueryCachedResults/InlineQueryResultCachedSticker";
import {InlineQueryResultCachedVideo} from "../lib/DataObjects/InlineQueryResults/InlineQueryCachedResults/InlineQueryResultCachedVideo";
import {InlineQueryResultCachedVoice} from "../lib/DataObjects/InlineQueryResults/InlineQueryCachedResults/InlineQueryResultCachedVoice";
import {InlineQueryResultCachedAudio} from "../lib/DataObjects/InlineQueryResults/InlineQueryCachedResults/InlineQueryResultCachedAudio";
import {InlineQueryResultArticle} from "../lib/DataObjects/InlineQueryResults/InlineQueryResultArticle";
import {InputTextMessageContent} from "../lib/DataObjects/InlineQueryResults/InputMessageContents/InputTextMessageContent";
import {InlineQueryResultLocation} from "../lib/DataObjects/InlineQueryResults/InlineQueryResultLocation";
import {InlineQueryResultVenue} from "../lib/DataObjects/InlineQueryResults/InlineQueryResultVenue";
import {InlineQueryResultContact} from "../lib/DataObjects/InlineQueryResults/InlineQueryResultContact";
import {InlineQueryResult} from "../lib/DataObjects/InlineQueryResults/InlineQueryResult";
import {User} from "../lib/DataObjects/User";
import uuid = require("uuid");
/**
 * Created by hypfer on 08.06.17.
 */
type DownloadedFileCallback = (err : any, data? : BinaryData) => any;
export class Hashes extends Module {
    private HashService : HashService;
    constructor(config : any, bot : Bot) {
        super(config, bot);
        this.HashService = new HashService(this.Bot.Repository);
    }

    //TODO: Remove redundant code (not gonna happen)

    private migrationMessageBuilder(oldhash : any, migratorChat : string) : IncomingMessage {
        var replyToMessage;

        switch(oldhash.type) {
            case "text":
                replyToMessage = {
                                    "text" : oldhash.text
                                 };
                break;
            case "photo":
                replyToMessage = {
                    "photo" : [{file_id : oldhash.file_id}]
                };
                break;
            case "voice":
                replyToMessage = {
                    "voice" : {file_id : oldhash.file_id}
                };
                break;
            case "document":
                replyToMessage = {
                    "document" : {
                        file_id : oldhash.file_id,
                        mime_type : oldhash.mime_type
                    }
                };
                break;
            case "audio":
                replyToMessage = {
                    "audio" : {
                        file_id : oldhash.file_id
                    }
                };
                break;
            case "video":
                replyToMessage = {
                    "video" : {
                        file_id : oldhash.file_id
                    }
                };
                break;
            case "sticker":
                replyToMessage = {
                    "sticker" : {
                        file_id : oldhash.file_id
                    }
                };
                break;
        }

        return new IncomingMessage(
            new User("-1", "System", ["system"]),
            {
                "chat" : {
                    "id" : migratorChat
                },
                reply_to_message : replyToMessage
            }
        )
    }

    protected registerMessageHandlers(MessageChain: any): void {
        const self = this;

        MessageChain.add(function migrateOldHashes(msg : IncomingMessage, next) {
            if(msg.From.hasRole("admin") && msg.Message.text &&
                msg.Message.chat.type === "private" && msg.Message.text === "migrateHashes") {
                const oldHashes = require("../commands.json");
                const oldHashKeys = Object.keys(oldHashes);
                var timeout = 0;
                oldHashKeys.forEach(function(hashKey){
                    self.checkCommandExists(hashKey, function(exists){
                        if(exists === false) {
                            const migrationMessage = self.migrationMessageBuilder(oldHashes[hashKey], msg.From.ID);
                            if(migrationMessage) {
                                setTimeout(function() {
                                    self.saveNewHash(hashKey, migrationMessage);
                                }, timeout);

                                timeout = timeout+5000;
                            }
                        }
                    });

                });
            } else {
                next();
            }
        });

        MessageChain.add(function undefineHash(msg : IncomingMessage, next){
            if(msg.Message.text) {
                const command = Helpers.checkForCommand("undefine", msg.Message.text, true);
                if(command) {
                    if(command.Args[0] && command.Args[0] !== "") {
                        self.HashService.GetHashById(command.Args[0], function(hash) {
                            if(hash) {
                                if(hash.OwnerID === msg.From.ID || msg.From.hasRole("admin")) {
                                    self.HashService.DeleteHash(hash, function(){
                                        self.Bot.sendReply(new OutgoingTextMessage("Undefined "+ hash.ID), msg.Message.chat.id);
                                    });
                                }
                            }
                        })
                    }
                } else {
                    next();
                }
            } else {
                next();
            }

        });

        MessageChain.add(function defineHash(msg : IncomingMessage, next){
            //TODO: Save Hash As Type
            //TODO: If hash is url of image try to get and save image
            var commandContainingString;
            if(msg.Message.text) {
                commandContainingString = msg.Message.text;
            } else if (msg.Message.caption) {
                commandContainingString = msg.Message.caption;
            }

            const command = Helpers.checkForCommand("define", commandContainingString, true);
            if(command) {
                if(command.Args[0] && command.Args[0] !== "") {
                    const newCommand = command.Args[0].toLowerCase();

                    if(msg.Message.reply_to_message || msg.Message.caption) {
                        self.checkCommandExists(newCommand, function(exists){
                            if(exists) {
                                self.Bot.sendReply(new OutgoingTextMessage("Hash "+ newCommand + " already exists."), msg.Message.chat.id);
                            } else {
                                self.saveNewHash(newCommand, msg);
                            }
                        });
                    } else {
                        self.Bot.sendReply(new OutgoingTextMessage("Define command must either be in a reply or in a caption."),
                                           msg.Message.chat.id);
                    }
                }
            } else {
                next();
            }
        });

        MessageChain.add(function getHashes(msg : IncomingMessage, next){
            if(msg.Message.text) {
                const command = Helpers.checkForCommand("hashes", msg.Message.text, true);
                if(command) {
                    self.HashService.GetAllIds(function(ids) {
                        self.Bot.sendReply(new OutgoingTextMessage(JSON.stringify(ids, null, 2)), msg.Message.chat.id);
                    });
                } else {
                    next();
                }
            } else {
                next();
            }

        });

        MessageChain.add(function getHash(msg : IncomingMessage, next){
            var commandContainingString;
            if(msg.Message.text) {
                commandContainingString = msg.Message.text;
            } else if (msg.Message.caption) {
                commandContainingString = msg.Message.caption;
            }

            const command = /#([\S]+)/.exec(commandContainingString);

            if(command && command.length >= 2) {
                self.handleHash(command[1].toLowerCase(), msg.Message.chat.id);
            }
        });
    }

    private handleHash(command : string, chatID : number) {
        const self = this;

        this.HashService.GetHashById(command, function(hash){
            if(hash) {
                self.sendHash(hash, chatID);
            }
        });
    }

    private sendHash(hash : Hash, chatID : number) {
        const self = this;

        if(hash instanceof TextHash) {
            this.Bot.sendReply(new OutgoingTextMessage(hash.Text), chatID, function(err){
                if(err) {
                    console.error(err);
                }
            });
        } else if(hash instanceof PhotoHash) {
            this.Bot.sendReply(new OutgoingPhotoMessage(hash.DataStreamHex, hash.FileId,
                hash.Height, hash.Width, hash.DataStreamInternalID), chatID,
                function(msg){
                    if(msg) {
                        hash.FileId = msg.photo[msg.photo.length-1].file_id;
                        self.HashService.SaveHash(hash, function(){
                            console.info("Updated fileID with valid one.")
                        });
                }
            });
        } else if(hash instanceof VideoHash) {
            this.Bot.sendReply(new OutgoingVideoMessage(hash.DataStreamHex, hash.FileId,
                hash.Height, hash.Width, hash.Duration, hash.DataStreamInternalID), chatID,
                function(msg){
                    if(msg) {
                        hash.FileId = msg.video.file_id;
                        self.HashService.SaveHash(hash, function(){
                            console.info("Updated fileID with valid one.")
                        });
                    }
                });
        } else if(hash instanceof VideoMessageHash) {
            this.Bot.sendReply(new OutgoingVideoMessageMessage(hash.DataStreamHex, hash.FileId,
                hash.Height, hash.Width, hash.Duration, hash.DataStreamInternalID), chatID,
                function(msg){
                    if(msg) {
                        hash.FileId = msg.video_note.file_id;
                        self.HashService.SaveHash(hash, function(){
                            console.info("Updated fileID with valid one.")
                        });
                    }
                });
        } else if(hash instanceof AudioHash) {
            this.Bot.sendReply(new OutgoingAudioMessage(hash.DataStreamHex, hash.FileId,
                hash.Performer, hash.Title, hash.Duration, hash.DataStreamInternalID), chatID,
                function(msg){
                    if(msg) {
                        hash.FileId = msg.audio.file_id;
                        self.HashService.SaveHash(hash, function(){
                            console.info("Updated fileID with valid one.")
                        });
                    }
                });
        } else if(hash instanceof DocumentHash) {
            this.Bot.sendReply(new OutgoingDocumentMessage(hash.DataStreamHex,
                hash.FileId, hash.DataStreamInternalID), chatID,
                function(msg) {
                    if(msg) {
                        hash.FileId = msg.document.file_id;
                        self.HashService.SaveHash(hash, function(){
                            console.info("Updated fileID with valid one.")
                        });
                    }
            });
        } else if(hash instanceof StickerHash) {
            this.Bot.sendReply(new OutgoingStickerMessage(hash.DataStreamHex, hash.FileId,
                hash.Height, hash.Width, hash.Emoji, hash.DataStreamInternalID), chatID,
                function(msg) {
                    if(msg) {
                        hash.FileId = msg.sticker.file_id;
                        self.HashService.SaveHash(hash, function(){
                            console.info("Updated fileID with valid one.")
                        });
                    }
                });
        } else if(hash instanceof VoiceHash) {
            this.Bot.sendReply(new OutgoingVoiceMessage(hash.DataStreamHex, hash.FileId,
                hash.Duration, hash.DataStreamInternalID), chatID,
                function(msg) {
                    if(msg) {
                        hash.FileId = msg.voice.file_id;
                        self.HashService.SaveHash(hash, function(){
                            console.info("Updated fileID with valid one.")
                        });
                    }
                });
        } else if(hash instanceof LocationHash) {
            if(hash instanceof VenueHash) {
                this.Bot.sendReply(new OutgoingVenueMessage(hash.Latitude, hash.Longitude,
                    hash.Title, hash.Address, hash.Foursquare_id), chatID, function(err){
                    if(err) {
                        console.error(err);
                    }
                });
            } else {
                this.Bot.sendReply(new OutgoingLocationMessage(hash.Latitude, hash.Longitude), chatID, function(err){
                    if(err) {
                        console.error(err);
                    }
                });
            }
        } else if(hash instanceof ContactHash) {
            this.Bot.sendReply(new OutgoingContactMessage(hash.Phone_number,
                hash.First_name, hash.Last_name), chatID, function(err){
                if(err) {
                    console.error(err);
                }
            });
        }
    }
    private saveNewHash(command : string, msg : IncomingMessage) {
        const self = this;

        if(command.indexOf("#") === 0) {
            command = command.substring(1); //Handle DAU
        }
        if(command.indexOf("type:") !== -1) {
            return this.Bot.sendReply(new OutgoingTextMessage("Command must not contain 'type:'"), msg.Message.chat.id);
        }

        if(msg.Message.reply_to_message) {
            //TextHash
            if(msg.Message.reply_to_message.text) {
                return this.HashService.SaveHash(
                    new TextHash(command, msg.From.ID, msg.Message.reply_to_message.text),
                    function(){
                        self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as TextHash"), msg.Message.chat.id);
                    });
            } else if(msg.Message.reply_to_message.photo) {
                return this.savePhotoByFileId(command,
                    msg.Message.reply_to_message.photo[msg.Message.reply_to_message.photo.length-1].file_id,
                    msg.Message.reply_to_message.photo[msg.Message.reply_to_message.photo.length-1].height,
                    msg.Message.reply_to_message.photo[msg.Message.reply_to_message.photo.length-1].width,
                    msg);
            } else if(msg.Message.reply_to_message.video) {
                return this.saveVideoByFileId(command,
                    msg.Message.reply_to_message.video.file_id,
                    msg.Message.reply_to_message.video.height,
                    msg.Message.reply_to_message.video.width,
                    msg.Message.reply_to_message.video.duration,
                    msg);
            } else if(msg.Message.reply_to_message.video_note) {
                return this.downloadFile(msg.Message.reply_to_message.video_note.file_id,
                    function(err : any, data : BinaryData) {
                        if(err) {
                            self.Bot.sendReply(new OutgoingTextMessage("Error while saving Hash: "+ JSON.stringify(err)), msg.Message.chat.id);
                        } else {
                            return self.HashService.SaveHash(
                                new VideoMessageHash(
                                    command,
                                    msg.From.ID,
                                    data.DataStreamHex,
                                    data.DataStreamSize,
                                    data.DataStreamMime,
                                    msg.Message.reply_to_message.video_note.file_id,
                                    "UNKNOWN",
                                    msg.Message.reply_to_message.video_note.length,
                                    msg.Message.reply_to_message.video_note.length,
                                    msg.Message.reply_to_message.video_note.duration
                                ), function() {
                                    self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as VideoMessageHash"), msg.Message.chat.id);
                                });
                        }
                    });
            } else if(msg.Message.reply_to_message.audio) {
                return this.downloadFile(msg.Message.reply_to_message.audio.file_id,
                    function(err : any, data : BinaryData) {
                        if(err) {
                            self.Bot.sendReply(new OutgoingTextMessage("Error while saving Hash: "+ JSON.stringify(err)), msg.Message.chat.id);
                        } else {
                            var hash : Hash;
                            if(msg.Message.reply_to_message.audio.title && msg.Message.reply_to_message.audio.mime_type === "audio/mpeg") {
                                hash = new AudioHash(
                                    command,
                                    msg.From.ID,
                                    data.DataStreamHex,
                                    data.DataStreamSize,
                                    data.DataStreamMime,
                                    msg.Message.reply_to_message.audio.file_id,
                                    "UNKNOWN",
                                    msg.Message.reply_to_message.audio.performer || "Unknown",
                                    msg.Message.reply_to_message.audio.title || command,
                                    msg.Message.reply_to_message.audio.duration
                                )
                            } else {
                                hash = new DocumentHash(
                                    command,
                                    msg.From.ID,
                                    data.DataStreamHex,
                                    data.DataStreamSize,
                                    data.DataStreamMime,
                                    msg.Message.reply_to_message.audio.file_id,
                                    "UNKNOWN"
                                )
                            }
                            return self.HashService.SaveHash(hash, function() {
                                    self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as "+ hash.HashType), msg.Message.chat.id);
                                });
                        }
                    });
            } else if(msg.Message.reply_to_message.document) {
                return this.downloadFile(msg.Message.reply_to_message.document.file_id,
                    function(err : any, data : BinaryData) {
                        if(err) {
                            self.Bot.sendReply(new OutgoingTextMessage("Error while saving Hash: "+ JSON.stringify(err)), msg.Message.chat.id);
                        } else {
                            return self.HashService.SaveHash(
                                new DocumentHash(
                                    command,
                                    msg.From.ID,
                                    data.DataStreamHex,
                                    data.DataStreamSize,
                                    data.DataStreamMime,
                                    msg.Message.reply_to_message.document.file_id,
                                    "UNKNOWN"
                                ), function() {
                                    self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as DocumentHash"), msg.Message.chat.id);
                                });
                        }
                    });
            } else if(msg.Message.reply_to_message.sticker) {
                return this.downloadFile(msg.Message.reply_to_message.sticker.file_id,
                    function(err : any, data : BinaryData) {
                        if(err) {
                            self.Bot.sendReply(new OutgoingTextMessage("Error while saving Hash: "+ JSON.stringify(err)), msg.Message.chat.id);
                        } else {
                            return self.HashService.SaveHash(
                                new StickerHash(
                                    command,
                                    msg.From.ID,
                                    data.DataStreamHex,
                                    data.DataStreamSize,
                                    data.DataStreamMime,
                                    msg.Message.reply_to_message.sticker.file_id,
                                    "UNKNOWN",
                                    msg.Message.reply_to_message.sticker.width,
                                    msg.Message.reply_to_message.sticker.height,
                                    msg.Message.reply_to_message.sticker.emoji
                                ), function() {
                                    self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as StickerHash"), msg.Message.chat.id);
                                });
                        }
                    });
            } else if(msg.Message.reply_to_message.voice) {
                return this.downloadFile(msg.Message.reply_to_message.voice.file_id,
                    function(err : any, data : BinaryData) {
                        if(err) {
                            self.Bot.sendReply(new OutgoingTextMessage("Error while saving Hash: "+ JSON.stringify(err)), msg.Message.chat.id);
                        } else {
                            return self.HashService.SaveHash(
                                new VoiceHash(
                                    command,
                                    msg.From.ID,
                                    data.DataStreamHex,
                                    data.DataStreamSize,
                                    data.DataStreamMime,
                                    msg.Message.reply_to_message.voice.file_id,
                                    "UNKNOWN",
                                    msg.Message.reply_to_message.voice.duration
                                ), function() {
                                    self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as VoiceHash"), msg.Message.chat.id);
                                });
                        }
                    });
            } else if (msg.Message.reply_to_message.location) {
                if(msg.Message.reply_to_message.venue) {
                    return this.HashService.SaveHash(
                        new VenueHash(command, msg.From.ID,
                            msg.Message.reply_to_message.location.latitude,
                            msg.Message.reply_to_message.location.longitude,
                            msg.Message.reply_to_message.venue.title,
                            msg.Message.reply_to_message.venue.address,
                            msg.Message.reply_to_message.venue.foursquare_id),
                        function(){
                            self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as VenueHash"), msg.Message.chat.id);
                        });
                } else {
                    return this.HashService.SaveHash(
                        new LocationHash(command, msg.From.ID,
                            msg.Message.reply_to_message.location.latitude,
                            msg.Message.reply_to_message.location.longitude),
                        function(){
                            self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as LocationHash"), msg.Message.chat.id);
                        });
                }
            } else if (msg.Message.reply_to_message.contact) {
                return this.HashService.SaveHash(
                    new ContactHash(command, msg.From.ID,
                        msg.Message.reply_to_message.contact.phone_number,
                        msg.Message.reply_to_message.contact.first_name,
                        msg.Message.reply_to_message.contact.last_name),
                    function () {
                        self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as ContactHash"), msg.Message.chat.id);
                    });
            }
        } else {
            //These things can have captions

            if(msg.Message.photo) {
                return this.savePhotoByFileId(command,
                    msg.Message.photo[msg.Message.photo.length-1].file_id,
                    msg.Message.photo[msg.Message.photo.length-1].height,
                    msg.Message.photo[msg.Message.photo.length-1].width,
                    msg);
            } else if(msg.Message.video) {
                return this.saveVideoByFileId(command,
                    msg.Message.video.file_id,
                    msg.Message.video.height,
                    msg.Message.video.width,
                    msg.Message.video.duration,
                    msg);
            } else if(msg.Message.document) {
                return this.downloadFile(msg.Message.document.file_id,
                    function (err: any, data: BinaryData) {
                        if (err) {
                            self.Bot.sendReply(new OutgoingTextMessage("Error while saving Hash: " + JSON.stringify(err)), msg.Message.chat.id);
                        } else {
                            return self.HashService.SaveHash(
                                new DocumentHash(
                                    command,
                                    msg.From.ID,
                                    data.DataStreamHex,
                                    data.DataStreamSize,
                                    data.DataStreamMime,
                                    msg.Message.document.file_id,
                                    "UNKNOWN"
                                ), function () {
                                    self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as DocumentHash"), msg.Message.chat.id);
                                });
                        }
                    });
            }
        }


    }

    protected registerInlineHandlers(InlineChain: any): void {
        const self = this;

        InlineChain.add(function hashesInlineHandler(msg : IncomingMessage, next : Function) {
            const offset = msg.Message.offset === "" ? 0 : parseInt(msg.Message.offset);
            var query = msg.Message.query.toLowerCase();

            if(query === "") {
                self.HashService.GetRandomIds(50, function(IDs){
                    const fetchFunctions = [];
                    const fetchedHashes = [];
                    IDs.forEach(function(id){
                        fetchFunctions.push(function(callback){
                            self.HashService.GetHashById(id, function(hash :Hash){
                                fetchedHashes.push(hash);
                                callback();
                            })
                        });
                    });

                    async.waterfall(fetchFunctions, function(){
                        self.Bot.answerInlineQuery(msg.Message.id, self.createInlineQueryResultsFromHashes(fetchedHashes, true), {
                            cache_time: 5, //Damit neue results zeitnah auftauchen
                            next_offset: offset+50
                        });
                    })
                });
            } else {
                self.HashService.GetIdsLikeSearchWithLimitAndSkip(query, 50, offset, function(IDs){
                    const fetchFunctions = [];
                    const fetchedHashes = [];
                    IDs.forEach(function(id){
                        fetchFunctions.push(function(callback){
                            self.HashService.GetHashById(id, function(hash :Hash){
                                fetchedHashes.push(hash);
                                callback();
                            })
                        });
                    });

                    async.waterfall(fetchFunctions, function(){
                        self.Bot.answerInlineQuery(msg.Message.id, self.createInlineQueryResultsFromHashes(fetchedHashes, false), {
                            cache_time: 5, //Damit neue results zeitnah auftauchen
                            next_offset: offset+50
                        });
                    })
                });
            }
        });
    }

    private createInlineQueryResultsFromHashes(hashes : Array<Hash>, random : boolean) : Array<InlineQueryResult> {
        const results = [];

        hashes.forEach(function(hash){
            if(hash instanceof PhotoHash) {
                results.push(new InlineQueryResultCachedPhoto(
                    random ? uuid.v4() : hash.ID,
                    hash.FileId,
                    hash.ID
                ));
            } else if(hash instanceof DocumentHash) {
                if(hash.DataStreamMime === "video/mp4") {
                    results.push(new InlineQueryResultCachedMpeg4Gif(
                        random ? uuid.v4() : hash.ID,
                        hash.FileId,
                        hash.ID
                    ));
                } else {
                    results.push(new InlineQueryResultCachedDocument(
                        random ? uuid.v4() : hash.ID,
                        hash.FileId,
                        hash.ID
                    ));
                }
            } else if(hash instanceof StickerHash) {
                results.push(new InlineQueryResultCachedSticker(
                    random ? uuid.v4() : hash.ID,
                    hash.FileId
                ));
            } else if(hash instanceof VideoHash) {
                results.push(new InlineQueryResultCachedVideo(
                    random ? uuid.v4() : hash.ID,
                    hash.FileId,
                    hash.ID
                ));
            } else if(hash instanceof VoiceHash) {
                results.push(new InlineQueryResultCachedVoice(
                    random ? uuid.v4() : hash.ID,
                    hash.FileId,
                    hash.ID
                ));
            } else if(hash instanceof AudioHash) {
                results.push(new InlineQueryResultCachedAudio(
                    random ? uuid.v4() : hash.ID,
                    hash.FileId,
                    hash.ID
                ));
            } else if(hash instanceof TextHash) {
                results.push(new InlineQueryResultArticle(
                    random ? uuid.v4() : hash.ID,
                    hash.ID,
                    new InputTextMessageContent(hash.Text),
                    undefined,
                    undefined,
                    undefined,
                    hash.Text
                ))
            } else if(hash instanceof LocationHash) {
                if(hash instanceof VenueHash) {
                    results.push(new InlineQueryResultVenue(
                        random ? uuid.v4() : hash.ID,
                        hash.Latitude,
                        hash.Longitude,
                        hash.Title || hash.ID,
                        hash.Address || "Somewhere"
                    ))
                } else {
                    results.push(new InlineQueryResultLocation(
                        random ? uuid.v4() : hash.ID,
                        hash.Latitude,
                        hash.Longitude,
                        hash.ID
                    ));
                }
            } else if(hash instanceof ContactHash) {
                results.push(new InlineQueryResultContact(
                    random ? uuid.v4() : hash.ID,
                    hash.Phone_number,
                    hash.First_name,
                    hash.Last_name || undefined
                ));
            }
        });

        return results;
    }

    protected defineCommands(): Array<string> {
        return ["define", "undefine", "hashes"];
    }

    protected loadAssets(): void {
    }


    private saveVideoByFileId(command : string, file_id : string, height : number,
                              width: number, duration: number, msg : any) {
        const self = this;

        this.downloadFile(file_id,
            function(err : any, data : BinaryData) {
                if(err) {
                    self.Bot.sendReply(new OutgoingTextMessage("Error while saving Hash: "+ JSON.stringify(err)), msg.Message.chat.id);
                } else {
                    return self.HashService.SaveHash(
                        new VideoHash(
                            command,
                            msg.From.ID,
                            data.DataStreamHex,
                            data.DataStreamSize,
                            data.DataStreamMime,
                            file_id,
                            "UNKNOWN",
                            height,
                            width,
                            duration
                        ), function() {
                            self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as VideoHash"), msg.Message.chat.id);
                        });
                }
            });
    }

    private savePhotoByFileId(command : string, file_id : string, height : number,
                              width: number, msg : any) {
        const self = this;

        this.downloadFile(file_id,
            function(err : any, data : BinaryData) {
                if(err) {
                    self.Bot.sendReply(new OutgoingTextMessage("Error while saving Hash: "+ JSON.stringify(err)), msg.Message.chat.id);
                } else {
                    return self.HashService.SaveHash(
                        new PhotoHash(
                            command,
                            msg.From.ID,
                            data.DataStreamHex,
                            data.DataStreamSize,
                            data.DataStreamMime,
                            file_id,
                            "UNKNOWN",
                            height,
                            width
                        ), function() {
                            self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as PhotoHash"), msg.Message.chat.id);
                        });
                }
            });
    }

    private downloadFile(file_id : string, callback: DownloadedFileCallback) {
        const self = this;
        this.Bot.TgBot.getFileLink(file_id).then(function(url){
            request({method: 'GET', url: url, encoding: null}, function(err, response, body) {
                if(err) {
                    callback(err, null);
                } else {
                    const filetype = fileType(body);
                    callback(null, new BinaryData(
                        body.toString('hex'),
                        body.length,
                        (filetype && filetype.mime) ? filetype.mime : "application/octet-stream"
                    ))
                }
            })
        }).catch(function(e){
            if(e.code === "ETELEGRAM" && e.response && e.response.body && e.response.body.description) {
                callback(e.response.body.description);
            } else {
                callback(e);
            }

        });
    }

    private checkCommandExists(command : string, callback) {
        var result = this.Bot.CommandManager.isRegistered(command);

        this.HashService.GetHashById(command,function(hash) {
            if(hash) {
                result = true;
            }

            callback(result);
        })
    }

}