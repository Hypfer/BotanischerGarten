import {BinaryDataHash} from "./BinaryDataHash";
/**
 * Created by hypfer on 08.06.17.
 */
export class DocumentHash extends BinaryDataHash {
    protected getHashType(): string {
        return "DocumentHash";
    }
}