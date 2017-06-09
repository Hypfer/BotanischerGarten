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
/**
 * Created by hypfer on 08.06.17.
 */
type HashCallback = (hash : Hash) => any;
export class HashService extends Service {

    protected getCollection(): string {
        return "Hashes";
    }
    SaveHash(hash:Hash, callback : HashCallback) {
        super.Save(hash.ID, hash, callback);
    }
    GetHashById(id: string, callback : HashCallback) {
        super.GetById(id, function(hash) {
            if(hash) {
                //"deserialize"
                switch(hash.HashType) {
                    case "TextHash":
                        callback(new TextHash(hash.ID, hash.OwnerID, hash.Text));
                        break;
                    case "PhotoHash":
                        callback(new PhotoHash(hash.ID, hash.OwnerID, hash.DataStreamHex,
                                               hash.DataStreamSize, hash.DataStreamMime,
                                               hash.FileId, hash.DataStreamInternalID,
                                               hash.Height, hash.Width));
                        break;
                    case "VideoHash":
                        callback(new VideoHash(hash.ID, hash.OwnerID, hash.DataStreamHex,
                                               hash.DataStreamSize, hash.DataStreamMime,
                                               hash.FileId, hash.DataStreamInternalID,
                                               hash.Height, hash.Width, hash.Duration));
                        break;
                    case "VideoMessageHash":
                        callback(new VideoMessageHash(hash.ID, hash.OwnerID, hash.DataStreamHex,
                            hash.DataStreamSize, hash.DataStreamMime,
                            hash.FileId, hash.DataStreamInternalID,
                            hash.Height, hash.Width, hash.Duration));
                        break;
                    case "AudioHash":
                        callback(new AudioHash(hash.ID, hash.OwnerID, hash.DataStreamHex,
                            hash.DataStreamSize, hash.DataStreamMime,
                            hash.FileId, hash.DataStreamInternalID,
                            hash.Performer, hash.Title, hash.Duration));
                        break;
                    case "DocumentHash":
                        callback(new DocumentHash(hash.ID, hash.OwnerID, hash.DataStreamHex,
                            hash.DataStreamSize, hash.DataStreamMime, hash.FileId,
                            hash.DataStreamInternalID));
                        break;
                    case "StickerHash":
                        callback(new StickerHash(hash.ID, hash.OwnerID, hash.DataStreamHex,
                            hash.DataStreamSize, hash.DataStreamMime, hash.FileId,
                            hash.DataStreamInternalID, hash.Width, hash.Height, hash.Emoji));
                        break;
                    case "VoiceHash":
                        callback(new VoiceHash(hash.ID, hash.OwnerID, hash.DataStreamHex,
                            hash.DataStreamSize, hash.DataStreamMime,
                            hash.FileId, hash.DataStreamInternalID, hash.Duration));
                        break;
                    case "LocationHash":
                        callback(new LocationHash(hash.ID, hash.OwnerID, hash.Latitude, hash.Longitude));
                        break;
                    case "VenueHash":
                        callback(new VenueHash(hash.ID, hash.OwnerID, hash.Latitude, hash.Longitude,
                        hash.Title, hash.Address, hash.Foursquare_id));
                        break;
                    case "ContactHash":
                        callback(new ContactHash(hash.ID, hash.OwnerID, hash.Phone_number,
                        hash.First_name, hash.Last_name));
                }
            } else {
                callback(undefined);
            }

        });
    }
    DeleteHash(hash:Hash, callback : Function) {
        super.DeleteById(hash.ID, callback);
    }

}