import {v4 as uuidv4} from 'uuid';

const usedIds = new Set<string>();

export const generateId = (): string => {
    const uuid = uuidv4();
    const shortId = uuid.replace(/-/g, '').split('').map(char => parseInt(char, 16).toString(36)).join('').slice(0,8)
    if (usedIds.has(shortId)) {
        return generateId();
    }
    usedIds.add(shortId);
    return shortId;
}
