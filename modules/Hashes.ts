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
import * as uuid from "uuid";
import {BinaryDataHash} from "../lib/DataObjects/Hashes/BinaryDataHash";
import {LoginTokenService} from "../lib/Services/LoginTokenService";
import {Thumbnail} from "../lib/DataObjects/Hashes/Thumbnail";
import * as path from "path";
/**
 * Created by hypfer on 08.06.17.
 */
type DownloadedFileCallback = (err: any, data?: BinaryData) => any;
export class Hashes extends Module {
    private HashService: HashService;
    private LoginTokenService: LoginTokenService;

    constructor(config: any, bot: Bot, app: any) {
        super(config, bot, app);
        this.HashService = new HashService(this.Bot.Repository);
        this.LoginTokenService = new LoginTokenService(this.Bot.Repository);
    }

    //TODO: Remove redundant code (not gonna happen)

    protected registerMessageHandlers(MessageChain: any): void {
        const self = this;

        MessageChain.add(function getLoginToken(msg: IncomingMessage, next) {
            if (msg.From.hasRole("user") && msg.Message.text === "/token") {
                self.LoginTokenService.createToken(function (token) {
                    let tokenMsg = token;

                    if(self.Config.domain) {
                        tokenMsg +=  "\n\n";
                        tokenMsg += self.Config.domain + "/login?token="
                    }
                    tokenMsg += token;

                    self.Bot.sendReply(new OutgoingTextMessage(tokenMsg), msg.Message.chat.id);
                });
            } else {
                next();
            }
        });

        MessageChain.add(function migrateOldHashes(msg : IncomingMessage, next) {
            if(msg.From.hasRole("admin") && msg.Message.text &&
                msg.Message.chat.type === "private" && msg.Message.text === "migrateHashes") {

                self.HashService.GetAllIds(function (ids) {
                    async.eachSeries(ids, function(hashId : string, done) {
                        console.info("Migrating " + hashId);

                        self.HashService.GetHashById(hashId, function(hash){
                            self.sendHash(hash, msg.Message.chat.id);

                            setTimeout(function() {
                                done();
                            }, 1500);
                        });
                    });
                });
            } else {
                next();
            }
        });

        MessageChain.add(function undefineHash(msg: IncomingMessage, next) {
            if (msg.Message.text) {
                const command = Helpers.checkForCommand("undefine", msg.Message.text, true);
                if (command) {
                    if (command.Args[0] && command.Args[0] !== "") {
                        self.HashService.GetHashById(command.Args[0], function (hash) {
                            if (hash) {
                                if (hash.OwnerID === msg.From.ID || msg.From.hasRole("admin")) {
                                    self.HashService.DeleteHash(hash, function () {
                                        self.Bot.sendReply(new OutgoingTextMessage("Undefined " + hash.ID), msg.Message.chat.id);
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

        MessageChain.add(function defineHash(msg: IncomingMessage, next) {
            //TODO: Save Hash As Type
            //TODO: If hash is url of image try to get and save image
            let commandContainingString;
            if (msg.Message.text) {
                commandContainingString = msg.Message.text;
            } else if (msg.Message.caption) {
                commandContainingString = msg.Message.caption;
            }

            const command = Helpers.checkForCommand("define", commandContainingString, true);
            if (command) {
                if (command.Args[0] && command.Args[0] !== "") {
                    let newCommand = command.Args[0].toLowerCase();

                    if (newCommand.indexOf("#") === 0) {
                        newCommand = newCommand.substring(1); //Handle DAU
                    }

                    if (msg.Message.reply_to_message || msg.Message.caption) {
                        self.checkCommandExists(newCommand, function (exists) {
                            if (exists) {
                                self.Bot.sendReply(new OutgoingTextMessage("Hash " + newCommand + " already exists."), msg.Message.chat.id);
                            } else {
                                self.saveNewHash(newCommand, msg, true);
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

        //TODO: Refactor.
        MessageChain.add(function defineHash(msg: IncomingMessage, next) {
            //TODO: Save Hash As Type
            //TODO: If hash is url of image try to get and save image
            let commandContainingString;
            if (msg.Message.text) {
                commandContainingString = msg.Message.text;
            } else if (msg.Message.caption) {
                commandContainingString = msg.Message.caption;
            }

            const command = Helpers.checkForCommand("priv", commandContainingString, true);
            if (command) {
                if (command.Args[0] && command.Args[0] !== "") {
                    let newCommand = command.Args[0].toLowerCase();

                    if (newCommand.indexOf("#") === 0) {
                        newCommand = newCommand.substring(1); //Handle DAU
                    }

                    if (msg.Message.reply_to_message || msg.Message.caption) {
                        self.checkCommandExists(newCommand, function (exists) {
                            if (exists) {
                                self.Bot.sendReply(new OutgoingTextMessage("Hash " + newCommand + " already exists."), msg.Message.chat.id);
                            } else {
                                self.saveNewHash(newCommand, msg, false);
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

        MessageChain.add(function getHashes(msg: IncomingMessage, next) {
            if (msg.Message.text) {
                const command = Helpers.checkForCommand("hashes", msg.Message.text, true);
                if (command) {
                    self.HashService.GetAllIds(function (ids) {
                        self.Bot.sendReply(new OutgoingTextMessage(JSON.stringify(ids, null, 2)), msg.Message.chat.id);
                    });
                } else {
                    next();
                }
            } else {
                next();
            }

        });

        MessageChain.add(function getHash(msg: IncomingMessage, next) {
            let commandContainingString;
            if (msg.Message.text) {
                commandContainingString = msg.Message.text;
            } else if (msg.Message.caption) {
                commandContainingString = msg.Message.caption;
            }

            const command = /#([\S]+)/.exec(commandContainingString);

            if (command && command.length >= 2) {
                self.handleHash(command[1].toLowerCase(), msg.Message.chat.id, msg.From);
            }
        });
    }

    private handleHash(command: string, chatID: number, user: User) {
        const self = this;

        this.HashService.GetHashById(command, function (hash) {
            if (hash) {
                if ((hash.Public === true) || (hash.Source === chatID)) {
                    self.sendHash(hash, chatID);
                } else {
                    if (hash.Source) {
                        self.Bot.GroupService.FindGroupById(hash.Source, function (group) {
                            if (group && group.isMember(user.ID)) {
                                self.sendHash(hash, chatID);
                            }
                        })
                    }

                }
            }
        });
    }

    private sendHash(hash: Hash, chatID: number) {
        const self = this;

        if (hash instanceof TextHash) {
            this.Bot.sendReply(new OutgoingTextMessage(hash.Text), chatID, function (err) {
                if (err) {
                    console.error(err);
                }
            });
        } else if (hash instanceof PhotoHash) {
            this.Bot.sendReply(new OutgoingPhotoMessage(hash.DataStreamHex, hash.FileId,
                hash.Height, hash.Width, hash.DataStreamInternalID), chatID,
                function (msg) {
                    if (msg) {
                        hash.FileId = msg.photo[msg.photo.length - 1].file_id;
                        if(msg.photo[0] && !(hash.Thumb)) {
                            self.downloadFile(msg.photo[0].file_id, function(err, thumbData){
                                if(err) {
                                    console.error("Failed to get Thumbnail");
                                    console.error(err);
                                } else {
                                    hash.Thumb = new Thumbnail(
                                        thumbData.DataStreamHex,
                                        thumbData.DataStreamSize,
                                        thumbData.DataStreamMime,
                                        msg.photo[0].height,
                                        msg.photo[0].width
                                    )
                                }
                                self.HashService.SaveHash(hash, function () {
                                    console.info("Updated fileID with valid one.")
                                });
                            });
                        } else {
                            self.HashService.SaveHash(hash, function () {
                                console.info("Updated fileID with valid one.")
                            });
                        }
                    }
                });
        } else if (hash instanceof VideoHash) {
            this.Bot.sendReply(new OutgoingVideoMessage(hash.DataStreamHex, hash.FileId,
                hash.Height, hash.Width, hash.Duration, hash.DataStreamInternalID), chatID,
                function (msg) {
                    if (msg) {
                        hash.FileId = msg.video.file_id;
                        if(msg.video.thumb && !(hash.Thumb)) {
                            self.downloadFile(msg.video.thumb.file_id, function(err, thumbData){
                                if(err) {
                                    console.error("Failed to get Thumbnail");
                                    console.error(err);
                                } else {
                                    hash.Thumb = new Thumbnail(
                                        thumbData.DataStreamHex,
                                        thumbData.DataStreamSize,
                                        thumbData.DataStreamMime,
                                        msg.video.thumb.height,
                                        msg.video.thumb.width
                                    )
                                }
                                self.HashService.SaveHash(hash, function () {
                                    console.info("Updated fileID with valid one.")
                                });
                            });
                        } else {
                            self.HashService.SaveHash(hash, function () {
                                console.info("Updated fileID with valid one.")
                            });
                        }
                    }
                });
        } else if (hash instanceof VideoMessageHash) {
            this.Bot.sendReply(new OutgoingVideoMessageMessage(hash.DataStreamHex, hash.FileId,
                hash.Height, hash.Width, hash.Duration, hash.DataStreamInternalID), chatID,
                function (msg) {
                    if (msg) {
                        hash.FileId = msg.video_note.file_id;
                        if(msg.video_note.thumb && !(hash.Thumb)) {
                            self.downloadFile(msg.video_note.thumb.file_id, function(err, thumbData){
                                if(err) {
                                    console.error("Failed to get Thumbnail");
                                    console.error(err);
                                } else {
                                    hash.Thumb = new Thumbnail(
                                        thumbData.DataStreamHex,
                                        thumbData.DataStreamSize,
                                        thumbData.DataStreamMime,
                                        msg.video_note.thumb.height,
                                        msg.video_note.thumb.width
                                    )
                                }
                                self.HashService.SaveHash(hash, function () {
                                    console.info("Updated fileID with valid one.")
                                });
                            });
                        } else {
                            self.HashService.SaveHash(hash, function () {
                                console.info("Updated fileID with valid one.")
                            });
                        }
                    }
                });
        } else if (hash instanceof AudioHash) {
            this.Bot.sendReply(new OutgoingAudioMessage(hash.DataStreamHex, hash.FileId,
                hash.Performer, hash.Title, hash.Duration, hash.DataStreamInternalID), chatID,
                function (msg) {
                    if (msg) {
                        hash.FileId = msg.audio.file_id;
                        self.HashService.SaveHash(hash, function () {
                            console.info("Updated fileID with valid one.")
                        });
                    }
                });
        } else if (hash instanceof DocumentHash) {
            this.Bot.sendReply(new OutgoingDocumentMessage(hash.DataStreamHex,
                hash.FileId, hash.DataStreamInternalID), chatID,
                function (msg) {
                    if (msg) {
                        if (msg.audio && hash.DataStreamMime === "audio/mpeg") {
                            hash.FileId = msg.audio.file_id;
                        } else {
                            hash.FileId = msg.document.file_id;
                        }
                        if(msg.document && msg.document.thumb && !(hash.Thumb)) {
                            self.downloadFile(msg.document.thumb.file_id, function(err, thumbData){
                                if(err) {
                                    console.error("Failed to get Thumbnail");
                                    console.error(err);
                                } else {
                                    hash.Thumb = new Thumbnail(
                                        thumbData.DataStreamHex,
                                        thumbData.DataStreamSize,
                                        thumbData.DataStreamMime,
                                        msg.document.thumb.height,
                                        msg.document.thumb.width
                                    )
                                }
                                self.HashService.SaveHash(hash, function () {
                                    console.info("Updated fileID with valid one.")
                                });
                            });
                        } else {
                            self.HashService.SaveHash(hash, function () {
                                console.info("Updated fileID with valid one.")
                            });
                        }
                    }
                });
        } else if (hash instanceof StickerHash) {
            this.Bot.sendReply(new OutgoingStickerMessage(hash.DataStreamHex, hash.FileId,
                hash.Height, hash.Width, hash.Emoji, hash.DataStreamInternalID), chatID,
                function (msg) {
                    if (msg) {
                        hash.FileId = msg.sticker.file_id;
                        if(msg.sticker.thumb && !(hash.Thumb)) {
                            self.downloadFile(msg.sticker.thumb.file_id, function(err, thumbData){
                                if(err) {
                                    console.error("Failed to get Thumbnail");
                                    console.error(err);
                                } else {
                                    hash.Thumb = new Thumbnail(
                                        thumbData.DataStreamHex,
                                        thumbData.DataStreamSize,
                                        thumbData.DataStreamMime,
                                        msg.sticker.thumb.height,
                                        msg.sticker.thumb.width
                                    )
                                }
                                self.HashService.SaveHash(hash, function () {
                                    console.info("Updated fileID with valid one.")
                                });
                            });
                        } else {
                            self.HashService.SaveHash(hash, function () {
                                console.info("Updated fileID with valid one.")
                            });
                        }
                    }
                });
        } else if (hash instanceof VoiceHash) {
            this.Bot.sendReply(new OutgoingVoiceMessage(hash.DataStreamHex, hash.FileId,
                hash.Duration, hash.DataStreamInternalID), chatID,
                function (msg) {
                    if (msg) {
                        hash.FileId = msg.voice.file_id;
                        self.HashService.SaveHash(hash, function () {
                            console.info("Updated fileID with valid one.")
                        });
                    }
                });
        } else if (hash instanceof LocationHash) {
            if (hash instanceof VenueHash) {
                this.Bot.sendReply(new OutgoingVenueMessage(hash.Latitude, hash.Longitude,
                    hash.Title, hash.Address, hash.Foursquare_id), chatID, function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
            } else {
                this.Bot.sendReply(new OutgoingLocationMessage(hash.Latitude, hash.Longitude), chatID, function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        } else if (hash instanceof ContactHash) {
            this.Bot.sendReply(new OutgoingContactMessage(hash.Phone_number,
                hash.First_name, hash.Last_name), chatID, function (err) {
                if (err) {
                    console.error(err);
                }
            });
        }
    }

    private saveNewHash(command: string, msg: IncomingMessage, Public: Boolean) {
        const self = this;

        if (command.indexOf("type:") !== -1) {
            return this.Bot.sendReply(new OutgoingTextMessage("Command must not contain 'type:'"), msg.Message.chat.id);
        }

        if (msg.Message.reply_to_message) {
            //TextHash
            if (msg.Message.reply_to_message.text) {
                return this.HashService.SaveHash(
                    new TextHash(command, msg.From.ID, "", msg.Message.chat.id, Public, msg.Message.reply_to_message.text),
                    function () {
                        self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as TextHash"), msg.Message.chat.id);
                    });
            } else if (msg.Message.reply_to_message.photo) {
                return this.savePhotoByFileId(command,
                    msg.Message.reply_to_message.photo[msg.Message.reply_to_message.photo.length - 1].file_id,
                    msg.Message.reply_to_message.photo[msg.Message.reply_to_message.photo.length - 1].height,
                    msg.Message.reply_to_message.photo[msg.Message.reply_to_message.photo.length - 1].width,
                    msg, Public,
                    msg.Message.reply_to_message.photo[0].file_id,
                    msg.Message.reply_to_message.photo[0].height,
                    msg.Message.reply_to_message.photo[0].width
                );
            } else if (msg.Message.reply_to_message.video) {
                return this.saveVideoByFileId(command,
                    msg.Message.reply_to_message.video.file_id,
                    msg.Message.reply_to_message.video.height,
                    msg.Message.reply_to_message.video.width,
                    msg.Message.reply_to_message.video.duration,
                    msg, Public,
                    msg.Message.reply_to_message.video.thumb.file_id,
                    msg.Message.reply_to_message.video.thumb.height,
                    msg.Message.reply_to_message.video.thumb.width
                );
            } else if (msg.Message.reply_to_message.video_note) {
                return this.downloadFile(msg.Message.reply_to_message.video_note.file_id,
                    function (err: any, data: BinaryData) {
                        if (err) {
                            self.sendSaveFailed(err, msg.Message.chat.id);
                        } else {
                            self.downloadFile(msg.Message.reply_to_message.video_note.thumb.file_id, function(err, thumbData){
                                if(err) {
                                    self.sendSaveFailed(err, msg.Message.chat.id);
                                } else {
                                    return self.HashService.SaveHash(
                                        new VideoMessageHash(
                                            command,
                                            msg.From.ID,
                                            "",
                                            msg.Message.chat.id, Public,
                                            data.DataStreamHex,
                                            data.DataStreamSize,
                                            data.DataStreamMime,
                                            msg.Message.reply_to_message.video_note.file_id,
                                            "UNKNOWN",
                                            msg.Message.reply_to_message.video_note.length,
                                            msg.Message.reply_to_message.video_note.length,
                                            msg.Message.reply_to_message.video_note.duration,
                                            new Thumbnail(
                                                thumbData.DataStreamHex,
                                                thumbData.DataStreamSize,
                                                thumbData.DataStreamMime,
                                                msg.Message.reply_to_message.video_note.thumb.height,
                                                msg.Message.reply_to_message.video_note.thumb.width
                                            )
                                        ), function () {
                                            self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as VideoMessageHash"), msg.Message.chat.id);
                                        });
                                }
                            });
                        }
                    });
            } else if (msg.Message.reply_to_message.audio) {
                return this.downloadFile(msg.Message.reply_to_message.audio.file_id,
                    function (err: any, data: BinaryData) {
                        if (err) {
                            self.sendSaveFailed(err, msg.Message.chat.id);
                        } else {
                            let hash: Hash;
                            if (msg.Message.reply_to_message.audio.title && msg.Message.reply_to_message.audio.mime_type === "audio/mpeg") {
                                hash = new AudioHash(
                                    command,
                                    msg.From.ID,
                                    "",
                                    msg.Message.chat.id, Public,
                                    data.DataStreamHex,
                                    data.DataStreamSize,
                                    data.DataStreamMime,
                                    msg.Message.reply_to_message.audio.file_id,
                                    "UNKNOWN",
                                    msg.Message.reply_to_message.audio.performer || "Unknown",
                                    msg.Message.reply_to_message.audio.title || command,
                                    msg.Message.reply_to_message.audio.duration
                                )
                            } else if (msg.Message.reply_to_message.audio.mime_type === "audio/x-opus+ogg") {
                                hash = new VoiceHash(
                                    command,
                                    msg.From.ID,
                                    "",
                                    msg.Message.chat.id, Public,
                                    data.DataStreamHex,
                                    data.DataStreamSize,
                                    data.DataStreamMime,
                                    msg.Message.reply_to_message.audio.file_id,
                                    "UNKNOWN",
                                    undefined
                                )
                            } else {
                                hash = new DocumentHash(
                                    command,
                                    msg.From.ID,
                                    "",
                                    msg.Message.chat.id, Public,
                                    data.DataStreamHex,
                                    data.DataStreamSize,
                                    data.DataStreamMime,
                                    msg.Message.reply_to_message.audio.file_id,
                                    "UNKNOWN"
                                )
                            }
                            return self.HashService.SaveHash(hash, function () {
                                self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as " + hash.HashType), msg.Message.chat.id);
                            });
                        }
                    });
            } else if (msg.Message.reply_to_message.document) {
                return this.downloadFile(msg.Message.reply_to_message.document.file_id,
                    function (err: any, data: BinaryData) {
                        if (err) {
                            self.sendSaveFailed(err, msg.Message.chat.id);
                        } else {
                            if (msg.Message.reply_to_message.document.mime_type === "audio/x-opus+ogg") {
                                saveIt(new VoiceHash(
                                    command,
                                    msg.From.ID,
                                    "",
                                    msg.Message.chat.id, Public,
                                    data.DataStreamHex,
                                    data.DataStreamSize,
                                    data.DataStreamMime,
                                    msg.Message.reply_to_message.document.file_id,
                                    "UNKNOWN",
                                    undefined
                                ));
                            } else {
                                if(msg.Message.reply_to_message.document.thumb) {
                                    self.downloadFile(msg.Message.reply_to_message.document.thumb.file_id, function(err,thumbData){
                                        if(err) {
                                            self.sendSaveFailed(err, msg.Message.chat.id);
                                        } else {
                                            saveIt(new DocumentHash(
                                                command,
                                                msg.From.ID,
                                                "",
                                                msg.Message.chat.id, Public,
                                                data.DataStreamHex,
                                                data.DataStreamSize,
                                                data.DataStreamMime,
                                                msg.Message.reply_to_message.document.file_id,
                                                "UNKNOWN",
                                                new Thumbnail(
                                                    thumbData.DataStreamHex,
                                                    thumbData.DataStreamSize,
                                                    thumbData.DataStreamMime,
                                                    msg.Message.reply_to_message.document.thumb.height,
                                                    msg.Message.reply_to_message.document.thumb.width
                                                )
                                            ));
                                        }
                                    });
                                } else {
                                    saveIt(new DocumentHash(
                                        command,
                                        msg.From.ID,
                                        "",
                                        msg.Message.chat.id, Public,
                                        data.DataStreamHex,
                                        data.DataStreamSize,
                                        data.DataStreamMime,
                                        msg.Message.reply_to_message.document.file_id,
                                        "UNKNOWN"
                                    ));
                                }
                            }
                        }
                        function saveIt(hashToSave : Hash) {
                            return self.HashService.SaveHash(hashToSave, function () {
                                self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as " + hashToSave.HashType), msg.Message.chat.id);
                            });
                        }
                    });
            } else if (msg.Message.reply_to_message.sticker) {
                return this.downloadFile(msg.Message.reply_to_message.sticker.file_id,
                    function (err: any, data: BinaryData) {
                        if (err) {
                            self.sendSaveFailed(err, msg.Message.chat.id);
                        } else {
                            self.downloadFile(msg.Message.reply_to_message.sticker.thumb.file_id, function(err, thumbData){
                                if(err) {
                                    self.sendSaveFailed(err, msg.Message.chat.id);
                                } else {
                                    return self.HashService.SaveHash(
                                        new StickerHash(
                                            command,
                                            msg.From.ID,
                                            "",
                                            msg.Message.chat.id, Public,
                                            data.DataStreamHex,
                                            data.DataStreamSize,
                                            data.DataStreamMime,
                                            msg.Message.reply_to_message.sticker.file_id,
                                            "UNKNOWN",
                                            msg.Message.reply_to_message.sticker.width,
                                            msg.Message.reply_to_message.sticker.height,
                                            msg.Message.reply_to_message.sticker.emoji,
                                            new Thumbnail(
                                                thumbData.DataStreamHex,
                                                thumbData.DataStreamSize,
                                                thumbData.DataStreamMime,
                                                msg.Message.reply_to_message.sticker.thumb.height,
                                                msg.Message.reply_to_message.sticker.thumb.width
                                            )
                                        ), function () {
                                            self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as StickerHash"), msg.Message.chat.id);
                                        });
                                }
                            });
                        }
                    });
            } else if (msg.Message.reply_to_message.voice) {
                return this.downloadFile(msg.Message.reply_to_message.voice.file_id,
                    function (err: any, data: BinaryData) {
                        if (err) {
                            self.sendSaveFailed(err, msg.Message.chat.id);
                        } else {
                            return self.HashService.SaveHash(
                                new VoiceHash(
                                    command,
                                    msg.From.ID,
                                    "",
                                    msg.Message.chat.id, Public,
                                    data.DataStreamHex,
                                    data.DataStreamSize,
                                    data.DataStreamMime,
                                    msg.Message.reply_to_message.voice.file_id,
                                    "UNKNOWN",
                                    msg.Message.reply_to_message.voice.duration
                                ), function () {
                                    self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as VoiceHash"), msg.Message.chat.id);
                                });
                        }
                    });
            } else if (msg.Message.reply_to_message.location) {
                if (msg.Message.reply_to_message.venue) {
                    return this.HashService.SaveHash(
                        new VenueHash(command, msg.From.ID, "", msg.Message.chat.id, Public,
                            msg.Message.reply_to_message.location.latitude,
                            msg.Message.reply_to_message.location.longitude,
                            msg.Message.reply_to_message.venue.title,
                            msg.Message.reply_to_message.venue.address,
                            msg.Message.reply_to_message.venue.foursquare_id),
                        function () {
                            self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as VenueHash"), msg.Message.chat.id);
                        });
                } else {
                    return this.HashService.SaveHash(
                        new LocationHash(command, msg.From.ID, "", msg.Message.chat.id, Public,
                            msg.Message.reply_to_message.location.latitude,
                            msg.Message.reply_to_message.location.longitude),
                        function () {
                            self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as LocationHash"), msg.Message.chat.id);
                        });
                }
            } else if (msg.Message.reply_to_message.contact) {
                return this.HashService.SaveHash(
                    new ContactHash(command, msg.From.ID, "", msg.Message.chat.id, Public,
                        msg.Message.reply_to_message.contact.phone_number,
                        msg.Message.reply_to_message.contact.first_name,
                        msg.Message.reply_to_message.contact.last_name),
                    function () {
                        self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as ContactHash"), msg.Message.chat.id);
                    });
            }
        } else {
            //These things can have captions

            if (msg.Message.photo) {
                return this.savePhotoByFileId(command,
                    msg.Message.photo[msg.Message.photo.length - 1].file_id,
                    msg.Message.photo[msg.Message.photo.length - 1].height,
                    msg.Message.photo[msg.Message.photo.length - 1].width,
                    msg, Public,
                    msg.Message.photo[0].file_id,
                    msg.Message.photo[0].height,
                    msg.Message.photo[0].width
                );
            } else if (msg.Message.video) {
                return this.saveVideoByFileId(command,
                    msg.Message.video.file_id,
                    msg.Message.video.height,
                    msg.Message.video.width,
                    msg.Message.video.duration,
                    msg, Public,
                    msg.Message.video.thumb.file_id,
                    msg.Message.video.thumb.height,
                    msg.Message.video.thumb.width
                );
            } else if (msg.Message.document) {
                return this.downloadFile(msg.Message.document.file_id,
                    function (err: any, data: BinaryData) {
                        if (err) {
                            self.sendSaveFailed(err, msg.Message.chat.id);
                        } else {
                            return self.HashService.SaveHash(
                                new DocumentHash(
                                    command,
                                    msg.From.ID, "", msg.Message.chat.id, Public,
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

        InlineChain.add(function hashesInlineHandler(msg: IncomingMessage, next: Function) {
            const offset = msg.Message.offset === "" ? 0 : parseInt(msg.Message.offset);
            let query = msg.Message.query.toLowerCase();

            if (query === "") {
                self.HashService.GetRandomIds(50, {"Public": true}, function (IDs) {
                    const fetchFunctions = [];
                    const fetchedHashes = [];
                    IDs.forEach(function (id) {
                        fetchFunctions.push(function (callback) {
                            self.HashService.GetHashById(id, function (hash: Hash) {
                                if (hash.Source) {
                                    self.Bot.GroupService.FindGroupById(hash.Source, function (group) {
                                        if (group) {
                                            fetchedHashes.push({hash: hash, source: group});
                                            callback();
                                        } else {
                                            fetchedHashes.push({hash: hash});
                                            callback();
                                        }
                                    })
                                } else {
                                    fetchedHashes.push({hash: hash});
                                    callback();
                                }
                            });
                        });
                    });

                    async.waterfall(fetchFunctions, function () {
                        self.Bot.answerInlineQuery(msg.Message.id,
                            self.createInlineQueryResultsFromHashes(fetchedHashes, true, msg.From),
                            {
                                cache_time: 5, //Damit neue results zeitnah auftauchen
                                next_offset: offset + 50
                            }
                        );
                    })
                });
            } else {
                self.HashService.GetIdsLikeSearchWithLimitAndSkip(query, 50, offset, function (IDs) {
                    const fetchFunctions = [];
                    const fetchedHashes = [];
                    IDs.forEach(function (id) {
                        fetchFunctions.push(function (callback) {
                            self.HashService.GetHashById(id, function (hash: Hash) {
                                if (hash.Source) {
                                    self.Bot.GroupService.FindGroupById(hash.Source, function (group) {
                                        if (group) {
                                            fetchedHashes.push({hash: hash, source: group});
                                            callback();
                                        } else {
                                            fetchedHashes.push({hash: hash});
                                            callback();
                                        }
                                    })
                                } else {
                                    fetchedHashes.push({hash: hash});
                                    callback();
                                }
                            });
                        });
                    });

                    async.waterfall(fetchFunctions, function () {
                        self.Bot.answerInlineQuery(msg.Message.id,
                            self.createInlineQueryResultsFromHashes(fetchedHashes, false, msg.From),
                            {
                                cache_time: 5, //Damit neue results zeitnah auftauchen
                                next_offset: offset + 50
                            }
                        );
                    })
                });
            }
        });
    }

    private createInlineQueryResultsFromHashes(hashes: Array<any>, random: boolean, user: User): Array<InlineQueryResult> {
        const results = [];

        hashes.forEach(function (tuple) {
            const hash: Hash = tuple.hash;
            if (hash.Public === true || (tuple.source && tuple.source.isMember(user.ID))) {
                if (hash instanceof PhotoHash) {
                    results.push(new InlineQueryResultCachedPhoto(
                        random ? uuid.v4() : hash.ID,
                        hash.FileId,
                        hash.ID
                    ));
                } else if (hash instanceof DocumentHash) {
                    if (hash.DataStreamMime === "video/mp4") {
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
                } else if (hash instanceof StickerHash) {
                    results.push(new InlineQueryResultCachedSticker(
                        random ? uuid.v4() : hash.ID,
                        hash.FileId
                    ));
                } else if (hash instanceof VideoHash) {
                    results.push(new InlineQueryResultCachedVideo(
                        random ? uuid.v4() : hash.ID,
                        hash.FileId,
                        hash.ID
                    ));
                } else if (hash instanceof VoiceHash) {
                    results.push(new InlineQueryResultCachedVoice(
                        random ? uuid.v4() : hash.ID,
                        hash.FileId,
                        hash.ID
                    ));
                } else if (hash instanceof AudioHash) {
                    results.push(new InlineQueryResultCachedAudio(
                        random ? uuid.v4() : hash.ID,
                        hash.FileId,
                        hash.ID
                    ));
                } else if (hash instanceof TextHash) {
                    results.push(new InlineQueryResultArticle(
                        random ? uuid.v4() : hash.ID,
                        hash.ID,
                        new InputTextMessageContent(hash.Text),
                        undefined,
                        undefined,
                        undefined,
                        hash.Text
                    ))
                } else if (hash instanceof LocationHash) {
                    if (hash instanceof VenueHash) {
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
                } else if (hash instanceof ContactHash) {
                    results.push(new InlineQueryResultContact(
                        random ? uuid.v4() : hash.ID,
                        hash.Phone_number,
                        hash.First_name,
                        hash.Last_name || undefined
                    ));
                }
            }

        });

        return results;
    }

    protected defineCommands(): Array<string> {
        return ["define", "undefine", "hashes", "priv", "tsbanner",
            "/tsbanner", "/tsbanner/", "/tsbanner/current", "/login", "/token"];
    }

    protected loadAssets(): void {
    }

    protected registerRoutes() {
        const self = this;

        //TSBANNER
        const currentTSBannerStorage = {
            date: undefined,
            hash: undefined
        };

        this.App.get('/tsbanner/', function (req, res) { //cache for 60 seconds
            if (currentTSBannerStorage.date && (new Date().getTime() - currentTSBannerStorage.date <= 60000)) {
                res.end(Buffer.from(currentTSBannerStorage.hash.DataStreamHex, "hex"), 'binary');
            } else {
                self.getRandomPhotoHash(function (hash: PhotoHash) {
                    if (!hash) {
                        return res.status(404).send('No Images.')
                    }

                    self.Bot.Repository.GetData(hash.DataStreamInternalID, function (data) {
                        hash.DataStreamHex = data;
                        currentTSBannerStorage.date = new Date();
                        currentTSBannerStorage.hash = hash;

                        res.end(Buffer.from(data, "hex"), 'binary');
                    });
                });
            }
        });

        this.App.get('/tsbanner/current', function (req, res, next) {
            if (currentTSBannerStorage.hash) {
                res.redirect("/hash/" + currentTSBannerStorage.hash.ID);
            } else {
                next();
            }
        });


        this.App.get('/', function (req, res, next) {
            if (!req.session.authenticated) {
                res.redirect("/login");
            } else {
                self.HashService.GetHashesForOverviewWebpage(function(docs){
                    let hashes = [];
                    docs.forEach(function (doc){
                        hashes.push({
                            _id : doc._id.toString(),
                            ID: doc.ID,
                            DataStreamMime: doc.DataStreamMime,
                            VoiceHash : doc.HashType === "VoiceHash",
                            AudioHash : doc.HashType === "AudioHash",
                            DocumentHash : doc.HashType === "DocumentHash",
                            TextHash: doc.HashType === "TextHash",
                            HasThumb : !!doc.Thumb
                        })
                    });
                    res.render('overview', {
                        bot_username: self.Bot.About.username,
                        bot_friendly_name: self.Bot.About.first_name,
                        hashes : hashes
                    })
                });
            }
        });

        this.App.get("/login", function(req,res){
            if(req.session.authenticated) {
                res.redirect("/");
            } else {
                res.render('login', {
                    bot_username: self.Bot.About.username,
                    bot_friendly_name: self.Bot.About.first_name,
                    token: req.query && req.query.token ? req.query.token : ""
                });
            }
        });

        this.App.get('/random', function(req, res, next){
            self.HashService.GetRandomIds(1, {"Public": true}, function (ids) {
                if (ids.length > 0) {
                    self.HashService.GetHashById(ids[0], function (hash: Hash) {
                        res.redirect("/hash/" + hash.ID);
                    });
                } else {
                    next();
                }
            });
        });

        this.App.post('/login', function (req, res, next) {
            if (req.body && req.body.token) {
               self.login(req.body.token, req, res);
            } else {
                res.redirect("/");
            }
        });

        this.App.get('/b/:id', function (req, res, next) {
            if (!req.session.authenticated && !req.isTelegramIP) {
                res.redirect("/login");
            } else {
                if(Helpers.isValidObjectId(req.params.id)) {
                    self.HashService.GetHashByDbId(req.params.id, function (hash: Hash) {
                        if (hash) {
                            if (hash instanceof BinaryDataHash) {
                                self.Bot.Repository.GetData(hash.DataStreamInternalID, function (data) {
                                    res.type(hash.DataStreamMime);
                                    res.sendSeekable(Buffer.from(data, "hex"));
                                })
                            } else {
                                //venue und so n scheiss
                                res.error(500);
                            }
                        } else {
                            next();
                        }
                    });
                } else {
                    next();
                }
            }
        });

        this.App.get('/t/:id', function (req, res, next) {
            if (!req.session.authenticated && !req.isTelegramIP) {
                res.redirect("/login");
            } else {
                if(Helpers.isValidObjectId(req.params.id)) {
                    self.HashService.GetHashByDbId(req.params.id, function (hash : Hash) {
                        if (hash) {
                            if(hash instanceof DocumentHash ||
                                hash instanceof PhotoHash ||
                                hash instanceof StickerHash ||
                                hash instanceof VideoHash ||
                                hash instanceof VideoMessageHash) {
                                if (hash.Thumb) {
                                    res.type(hash.Thumb.DataStreamMime);
                                    res.sendSeekable(Buffer.from(hash.Thumb.DataStreamHex, "hex"));
                                    //TODO: Is this a good idea?
                                } else {
                                    if (hash instanceof DocumentHash) {
                                        res.redirect("/s/file_thumb.png");
                                    } else {
                                        res.redirect("/s/404_thumb.png");
                                    }
                                }
                            } else if (hash instanceof AudioHash) {
                                res.redirect("/s/audio_thumb.png");
                            } else if (hash instanceof VoiceHash) {
                                res.redirect("/s/voice_thumb.png");
                            } else if (hash instanceof TextHash) {
                                res.redirect("/s/text_thumb.png");
                            } else {
                                res.redirect("/s/404_thumb.png");
                            }
                        } else {
                            res.redirect("/s/404_thumb.png");
                        }
                    });
                } else {
                    res.redirect("/s/404_thumb.png");
                }
            }
        });

        this.App.get('/hash/:hash(*)', function (req, res, next) {
            if (!req.session.authenticated && !req.isTelegramIP) {
                res.redirect("/login");
            } else {
                //this hack allows hashes with questionmarks
                const hash_name = decodeURIComponent(req.url.replace("/hash/", ""));
                let templateContent = {
                    hash_name: hash_name,
                    bot_username: self.Bot.About.username,
                    bot_friendly_name: self.Bot.About.first_name,
                    domain: self.Config.domain
                };
                self.HashService.GetHashById(hash_name, function (hash: Hash) {
                    if (hash && hash.Public === true) {
                        templateContent["hash_db_id"] = hash.DbId;
                        templateContent["timestamp"] = Helpers.dateFromObjectId(hash.DbId.toString()).toString();


                        if (hash instanceof BinaryDataHash) {
                            templateContent["mime"] = hash.DataStreamMime;
                            templateContent["size"] = hash.DataStreamSize;

                            if (hash instanceof PhotoHash || hash instanceof StickerHash ||
                                (hash instanceof DocumentHash && hash.DataStreamMime === "image/gif")) {
                                if (hash instanceof PhotoHash || hash instanceof StickerHash) {
                                    if (hash.Height && hash.Width) {
                                        const dimensions = Hashes.calculateDimensionsForHash(hash.Height, hash.Width);
                                        templateContent["height"] = dimensions.height;
                                        templateContent["width"] = dimensions.width;
                                    } else {
                                        templateContent["autoSize"] = true;
                                    }
                                } else {
                                    templateContent["autoSize"] = true;
                                }
                                templateContent["image"] = true;
                            } else if (hash instanceof DocumentHash && hash.DataStreamMime === "video/mp4") {
                                templateContent["gif"] = true;
                            } else if ((hash instanceof DocumentHash && hash.DataStreamMime === "audio/mpeg") ||
                                (hash instanceof DocumentHash && hash.DataStreamMime === "audio/ogg") ||
                                hash instanceof AudioHash ||
                                hash instanceof VoiceHash) {
                                templateContent["audio"] = true;
                            } else if (hash instanceof VideoHash) {
                                if (hash.Height && hash.Width) {
                                    const dimensions = Hashes.calculateDimensionsForHash(hash.Height, hash.Width);
                                    templateContent["height"] = dimensions.height;
                                    templateContent["width"] = dimensions.width;
                                } else {
                                    templateContent["autoSize"] = true;
                                }

                                templateContent["video"] = true;
                            } else if (hash instanceof VideoMessageHash) {
                                if (hash.Height && hash.Width) {
                                    const dimensions = Hashes.calculateDimensionsForHash(hash.Height, hash.Width);
                                    templateContent["height"] = dimensions.height;
                                    templateContent["width"] = dimensions.width;
                                } else {
                                    templateContent["autoSize"] = true;
                                }
                                templateContent["video"] = true;
                            } else if (hash instanceof DocumentHash) {
                                templateContent["file"] = true;

                            } else {
                                //TODO
                                templateContent["text"] = "Unsupported Hash :-)";
                            }
                        } else if (hash instanceof TextHash) {
                            templateContent["text"] = hash.Text;
                        } else {
                            //TODO
                            templateContent["text"] = "Unsupported Hash :-)";
                        }


                        self.Bot.UserService.FindUserById(hash.OwnerID, function (user) {
                            if (user) {
                                if (user.Username) {
                                    templateContent["user_nickname"] = user.Username;
                                } else {
                                    templateContent["user_name"] = user.FirstName;
                                }
                            } else {
                                templateContent["user_name"] = "Anonymous";
                            }

                            self.HashService.GetPreviousAndNextByDbId(hash.DbId, {"Public": true}, function (obj) {
                                if (obj.prev) {
                                    templateContent["prev_id"] = obj.prev.ID;
                                }
                                if (obj.next) {
                                    templateContent["next_id"] = obj.next.ID;
                                }

                                self.HashService.GetFirstAndLastId({"Public" : true}, function (obj) {
                                    if (obj.first) {
                                        templateContent["first_id"] = obj.first.ID;
                                    }
                                    if (obj.last) {
                                        templateContent["last_id"] = obj.last.ID;
                                    }

                                    res.render('hash', templateContent);
                                })
                            });
                        });
                    } else {
                        //gibt keinen Hash
                        next();
                    }
                });
            }
        });
    }

    private login(token, req, res) {
        this.LoginTokenService.consumeToken(token, function (result) {
            if (result === true) {
                req.session.authenticated = true;
            }
            res.redirect("/");
        })
    }

    private static calculateDimensionsForHash(height : number, width : number) : any {
        //maximum 640px width
        if(width <= 640) {
            return {height: height, width: width}
        } else {
            const factor = height/width;
            return {height: factor*640, width: 640}
        }
    }

    private getRandomPhotoHash(callback) {
        const self = this;

        this.HashService.GetRandomIds(1, {"Public": true, "HashType": "PhotoHash"}, function (IDs) {
            if (IDs.length > 0) {
                self.HashService.GetHashById(IDs[0], function (hash: Hash) {
                    if (hash) {
                        callback(hash);
                    } else {
                        callback()
                    }
                });
            } else {
                callback();
            }

        });
    }

    private saveVideoByFileId(command: string, file_id: string, height: number,
                              width: number, duration: number, msg: any, Public: Boolean,
                              thumb_id : string, thumb_height : number, thumb_width: number) {
        const self = this;

        this.downloadFile(file_id,
            function (err: any, data: BinaryData) {
                if (err) {
                    self.sendSaveFailed(err, msg.Message.chat.id);
                } else {
                    self.downloadFile(thumb_id, function(err, thumbData){
                        if(err){
                            self.sendSaveFailed(err, msg.Message.chat.id);
                        } else {
                            self.HashService.SaveHash(
                                new VideoHash(
                                    command,
                                    msg.From.ID,
                                    "",
                                    msg.Message.chat.id, Public,
                                    data.DataStreamHex,
                                    data.DataStreamSize,
                                    data.DataStreamMime,
                                    file_id,
                                    "UNKNOWN",
                                    height,
                                    width,
                                    duration,
                                    new Thumbnail(
                                        thumbData.DataStreamHex,
                                        thumbData.DataStreamSize,
                                        thumbData.DataStreamMime,
                                        thumb_height,
                                        thumb_width
                                    )
                                ), function () {
                                    self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as VideoHash"), msg.Message.chat.id);
                                });
                        }
                    });
                }
            });
    }

    private savePhotoByFileId(command: string, file_id: string, height: number,
                              width: number, msg: any, Public: Boolean,
                              thumb_id : string, thumb_height : number, thumb_width: number) {
        const self = this;

        this.downloadFile(file_id,
            function (err: any, data: BinaryData) {
                if (err) {
                    self.sendSaveFailed(err, msg.Message.chat.id);
                } else {
                    self.downloadFile(thumb_id, function(err, thumbData){
                        if(err) {
                            self.sendSaveFailed(err, msg.Message.chat.id);
                        } else {
                            self.HashService.SaveHash(
                                new PhotoHash(
                                    command,
                                    msg.From.ID,
                                    "",
                                    msg.Message.chat.id, Public,
                                    data.DataStreamHex,
                                    data.DataStreamSize,
                                    data.DataStreamMime,
                                    file_id,
                                    "UNKNOWN",
                                    height,
                                    width,
                                    new Thumbnail(
                                        thumbData.DataStreamHex,
                                        thumbData.DataStreamSize,
                                        thumbData.DataStreamMime,
                                        thumb_height,
                                        thumb_width
                                    )
                                ), function () {
                                    self.Bot.sendReply(new OutgoingTextMessage("Saved " + command + " as PhotoHash"), msg.Message.chat.id);
                                });
                        }
                    });
                }
            });
    }

    private downloadFile(file_id: string, callback: DownloadedFileCallback) {
        const self = this;
        this.Bot.TgBot.getFileLink(file_id).then(function (url) {
            request({method: 'GET', url: url, encoding: null}, function (err, response, body) {
                if (err) {
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
        }).catch(function (e) {
            if (e.code === "ETELEGRAM" && e.response && e.response.body && e.response.body.description) {
                callback(e.response.body.description);
            } else {
                callback(e);
            }

        });
    }

    private sendSaveFailed(err, chat_id) {
        this.Bot.sendReply(new OutgoingTextMessage("Error while saving Hash: " + JSON.stringify(err)), chat_id);
    }

    private checkCommandExists(command: string, callback) {
        let result = this.Bot.CommandManager.isRegistered(command);

        this.HashService.GetHashById(command, function (hash) {
            if (hash) {
                result = true;
            }

            callback(result);
        })
    }

}