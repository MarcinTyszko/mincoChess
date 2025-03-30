import { toPlainObject, cloneDeep } from "lodash";

/**
 * @description Deeply clones an object, and then strips all functions.
 */
export function serializeObject<T>(obj: T): T {
    return toPlainObject(cloneDeep(obj));
}