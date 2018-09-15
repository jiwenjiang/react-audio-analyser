/**
 * Created by j_bleach on 2018/9/11.
 */
import lame from "./lame";

//
// console.log("support web worker")
// const onMessage = (e) => {
//     console.log(e)
//         // console.log(lame.Mp3Encoder)
//         // console.log(lame)
// }
// addEventListener("message", onMessage);
export default function MyWorker() {
    let onmessage = e => { // eslint-disable-line no-unused-vars
        console.log(lame)
        const mp3Encode = lame().Mp3Encoder(1, 44100, 128);
        console.log(e)
        console.log(mp3Encode)
    };
}
