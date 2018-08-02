const MediaRecorder = Target => {
    console.log(Target);
    Target.prototype.initAudio = () => {
        console.log(666);
    }
    return Target;
}
export default MediaRecorder;