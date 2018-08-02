const MediaRecorder = Target => {
    console.log(Target);
    Target.prototype.initAudio = () => {
        console.log(233);
    }
}
export default MediaRecorder;