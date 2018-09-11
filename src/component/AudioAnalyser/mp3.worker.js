/**
 * Created by j_bleach on 2018/9/11.
 */
console.log("support web worker")
const onMessage = (e) => {
    console.log(e)
}
addEventListener("message", onMessage);
