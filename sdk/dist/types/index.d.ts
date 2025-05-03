import * as send from "./send";
import * as link from "./link";
import { send as rawSend } from "./send/raw";
import { link as rawLink } from "./link/raw";
import { Parameter } from "./core/parameter";
import { init } from "./core/init";
declare const pathing: {
    send: {
        raw: typeof rawSend;
        purchase: typeof send.purchase;
        playback: typeof send.playback;
        button: typeof send.button;
    };
    link: {
        raw: typeof rawLink;
        purchase: typeof link.purchase;
        playback: typeof link.playback;
        button: typeof link.button;
    };
    Parameter: typeof Parameter;
    init: typeof init;
    track: (type: string, payload: Record<string, any>) => Promise<import("./types").EventResponse>;
};
export { pathing };
export default pathing;
