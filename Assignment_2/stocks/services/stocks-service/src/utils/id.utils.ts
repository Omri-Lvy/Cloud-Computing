import {v4 as uuidv4} from 'uuid';
import { addIdToUsedIdsList, isUsedId} from "../services/storage.service";

export const generateId = (): string => {
    const uuid = uuidv4();
    const shortId = uuid.replace(/-/g, '').split('').map(char => parseInt(char, 16).toString(36)).join('').slice(0,8)
    if (isUsedId(shortId)) {
        return generateId();
    }
    addIdToUsedIdsList(shortId);
    return shortId;
}
