import {Service} from "./Service";
import {Hash} from "../DataObjects/Hashes/Hash";
import {TextHash} from "../DataObjects/Hashes/TextHash";
import {PhotoHash} from "../DataObjects/Hashes/PhotoHash";
import {VideoHash} from "../DataObjects/Hashes/VideoHash";
import {VideoMessageHash} from "../DataObjects/Hashes/VideoMessageHash";
import {AudioHash} from "../DataObjects/Hashes/AudioHash";
import {DocumentHash} from "../DataObjects/Hashes/DocumentHash";
import {StickerHash} from "../DataObjects/Hashes/StickerHash";
import {VoiceHash} from "../DataObjects/Hashes/VoiceHash";
import {LocationHash} from "../DataObjects/Hashes/LocationHash";
import {VenueHash} from "../DataObjects/Hashes/VenueHash";
import {ContactHash} from "../DataObjects/Hashes/ContactHash";
import {Thumbnail} from "../DataObjects/Hashes/Thumbnail";
/**
 * Created by hypfer on 08.06.17.
 */
type HashCallback = (hash: Hash) => any;
export class HashService extends Service {

    protected getCollection(): string {
        return "Hashes";
    }

    SaveHash(hash: Hash, callback: HashCallback) {
        delete hash["DbId"]; //Wow.
        super.Save(hash.ID, hash, callback);
    }

    GetHashById(id: string, callback: HashCallback) {
        super.GetById(id, function (hash) {
            callback(HashService.deserializeHash(hash));
        });
    }

    GetHashByDbId(id: string, callback: HashCallback) {
        super.GetByDbId(id, function (hash) {
            callback(HashService.deserializeHash(hash));
        });
    }

    GetPreviousAndNextByDbId(id: string, condition: any, callback: Function) {
        super.GetPreviousAndNextByDbId(id, condition, function (obj) {
            if (obj.prev) {
                obj.prev = HashService.deserializeHash(obj.prev);
            }
            if (obj.next) {
                obj.next = HashService.deserializeHash(obj.next);
            }
            callback(obj);
        })
    }

    //TODO: Refactor
    GetFirstAndLastId(condition: any, callback: Function) {
        super.GetFirstAndLastId(condition, function (obj) {
            if (obj.first) {
                obj.first = HashService.deserializeHash(obj.first);
            }
            if (obj.last) {
                obj.last = HashService.deserializeHash(obj.last);
            }
            callback(obj);
        })
    }

    DeleteHash(hash: Hash, callback: Function) {
        super.DeleteById(hash.ID, callback);
    }

    private static deserializeHash(hash) {
        if (hash) {
            //"deserialize"
            switch (hash.HashType) {
                case "TextHash":
                    return new TextHash(hash.ID, hash.OwnerID, hash._id, hash.Source, hash.Public, hash.Text);
                case "PhotoHash":
                    if(hash.Thumb) {
                        return new PhotoHash(hash.ID, hash.OwnerID, hash._id, hash.Source, hash.Public,
                            hash.DataStreamHex,
                            hash.DataStreamSize, hash.DataStreamMime,
                            hash.FileId, hash.DataStreamInternalID,
                            hash.Height, hash.Width,
                            new Thumbnail(
                                hash.Thumb.DataStreamHex,
                                hash.Thumb.DataStreamSize,
                                hash.Thumb.DataStreamMime,
                                hash.Thumb.Height,
                                hash.Thumb.Width
                            )
                        );
                    } else {
                        return new PhotoHash(hash.ID, hash.OwnerID, hash._id, hash.Source, hash.Public,
                            hash.DataStreamHex,
                            hash.DataStreamSize, hash.DataStreamMime,
                            hash.FileId, hash.DataStreamInternalID,
                            hash.Height, hash.Width
                        );
                    }
                case "VideoHash":
                    if(hash.Thumb) {
                        return new VideoHash(hash.ID, hash.OwnerID, hash._id, hash.Source, hash.Public,
                            hash.DataStreamHex,
                            hash.DataStreamSize, hash.DataStreamMime,
                            hash.FileId, hash.DataStreamInternalID,
                            hash.Height, hash.Width, hash.Duration,
                            new Thumbnail(
                                hash.Thumb.DataStreamHex,
                                hash.Thumb.DataStreamSize,
                                hash.Thumb.DataStreamMime,
                                hash.Thumb.Height,
                                hash.Thumb.Width
                            )
                        );
                    } else {
                        return new VideoHash(hash.ID, hash.OwnerID, hash._id, hash.Source, hash.Public,
                            hash.DataStreamHex,
                            hash.DataStreamSize, hash.DataStreamMime,
                            hash.FileId, hash.DataStreamInternalID,
                            hash.Height, hash.Width, hash.Duration);
                    }
                case "VideoMessageHash":
                    if(hash.Thumb) {
                        return new VideoMessageHash(hash.ID, hash.OwnerID, hash._id, hash.Source, hash.Public,
                            hash.DataStreamHex,
                            hash.DataStreamSize, hash.DataStreamMime,
                            hash.FileId, hash.DataStreamInternalID,
                            hash.Height, hash.Width, hash.Duration,
                            new Thumbnail(
                                hash.Thumb.DataStreamHex,
                                hash.Thumb.DataStreamSize,
                                hash.Thumb.DataStreamMime,
                                hash.Thumb.Height,
                                hash.Thumb.Width
                            )
                        );
                    } else {
                        return new VideoMessageHash(hash.ID, hash.OwnerID, hash._id, hash.Source, hash.Public,
                            hash.DataStreamHex,
                            hash.DataStreamSize, hash.DataStreamMime,
                            hash.FileId, hash.DataStreamInternalID,
                            hash.Height, hash.Width, hash.Duration);
                    }
                case "AudioHash":
                    return new AudioHash(hash.ID, hash.OwnerID, hash._id, hash.Source, hash.Public,
                        hash.DataStreamHex,
                        hash.DataStreamSize, hash.DataStreamMime,
                        hash.FileId, hash.DataStreamInternalID,
                        hash.Performer, hash.Title, hash.Duration);
                case "DocumentHash":
                    if(hash.Thumb) {
                        return new DocumentHash(hash.ID, hash.OwnerID, hash._id, hash.Source, hash.Public,
                            hash.DataStreamHex,
                            hash.DataStreamSize, hash.DataStreamMime, hash.FileId,
                            hash.DataStreamInternalID,
                            new Thumbnail(
                                hash.Thumb.DataStreamHex,
                                hash.Thumb.DataStreamSize,
                                hash.Thumb.DataStreamMime,
                                hash.Thumb.Height,
                                hash.Thumb.Width
                            )
                        );
                    } else {
                        return new DocumentHash(hash.ID, hash.OwnerID, hash._id, hash.Source, hash.Public,
                            hash.DataStreamHex,
                            hash.DataStreamSize, hash.DataStreamMime, hash.FileId,
                            hash.DataStreamInternalID);
                    }
                case "StickerHash":
                    if(hash.Thumb) {
                        return new StickerHash(hash.ID, hash.OwnerID, hash._id, hash.Source, hash.Public,
                            hash.DataStreamHex,
                            hash.DataStreamSize, hash.DataStreamMime, hash.FileId,
                            hash.DataStreamInternalID, hash.Width, hash.Height, hash.Emoji,
                            new Thumbnail(
                                hash.Thumb.DataStreamHex,
                                hash.Thumb.DataStreamSize,
                                hash.Thumb.DataStreamMime,
                                hash.Thumb.Height,
                                hash.Thumb.Width
                            )
                        );
                    } else {
                        return new StickerHash(hash.ID, hash.OwnerID, hash._id, hash.Source, hash.Public,
                            hash.DataStreamHex,
                            hash.DataStreamSize, hash.DataStreamMime, hash.FileId,
                            hash.DataStreamInternalID, hash.Width, hash.Height, hash.Emoji);
                    }
                case "VoiceHash":
                    return new VoiceHash(hash.ID, hash.OwnerID, hash._id, hash.Source, hash.Public,
                        hash.DataStreamHex,
                        hash.DataStreamSize, hash.DataStreamMime,
                        hash.FileId, hash.DataStreamInternalID, hash.Duration);
                case "LocationHash":
                    return new LocationHash(hash.ID, hash.OwnerID, hash._id, hash.Source, hash.Public,
                        hash.Latitude, hash.Longitude);
                case "VenueHash":
                    return new VenueHash(hash.ID, hash.OwnerID, hash._id, hash.Source, hash.Public,
                        hash.Latitude, hash.Longitude,
                        hash.Title, hash.Address, hash.Foursquare_id);
                case "ContactHash":
                    return new ContactHash(hash.ID, hash.OwnerID, hash._id, hash.Source, hash.Public,
                        hash.Phone_number, hash.First_name, hash.Last_name);
            }
        } else {
            return;
        }
    }

}