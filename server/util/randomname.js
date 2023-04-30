import crypto from "crypto";

export const randomName = () => {
    return crypto.randomUUID().slice(30).toUpperCase()
}
