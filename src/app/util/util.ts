export class Util {

    public static getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }

    public static possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890,./;'[]\=-)(*&^%$#@!~`";
    public static getRandomText(size: number, possible: string): string {
        let text = "";
        for (let i = 0; i < size; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    public static getRandomBoolean(): boolean { return Math.random() < 0.5; }

}