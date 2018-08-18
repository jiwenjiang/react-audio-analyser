/**
 * @author j_bleach 2018/8/18
 * @describe 媒体记录（包含开始，暂停，停止等媒体流及回调操作）
 * @param Target 被装饰类（AudioAnalyser）
 */
const MediaRecorderFn = Target => {
    const constraints = {audio: true};
    return class MediaRecorderClass extends Target {
        static audioChunk = [] // 音频信息存储对象
        static mediaRecorder = null // 媒体记录对象
        static audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // 音频上下文

        constructor(props) {
            super(props);
            MediaRecorderClass.compatibility();
            this.analyser = MediaRecorderClass.audioCtx.createAnalyser()
        }

        /**
         * @author j_bleach 2018/08/02 17:06
         * @describe 浏览器navigator.mediaDevices兼容性处理
         */
        static compatibility() {
            const promisifiedOldGUM = (constraints) => {
                // First get ahold of getUserMedia, if present
                const getUserMedia =
                    navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia;

                // Some browsers just don't implement it - return a rejected promise with an error
                // to keep a consistent interface
                if (!getUserMedia) {
                    return Promise.reject(
                        new Error('getUserMedia is not implemented in this browser')
                    );
                }
                // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
                return new Promise(function (resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            };

            // Older browsers might not implement mediaDevices at all, so we set an empty object first
            if (navigator.mediaDevices === undefined) {
                navigator.mediaDevices = {};
            }

            // Some browsers partially implement mediaDevices. We can't just assign an object
            // with getUserMedia as it would overwrite existing properties.
            // Here, we will just add the getUserMedia property if it's missing.
            if (navigator.mediaDevices.getUserMedia === undefined) {
                navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
            }
        }

        /**
         * @author j_bleach 2018/8/18
         * @describe 开始录音
         */
        startAudio = () => {
            navigator.mediaDevices.getUserMedia(constraints).then(stream => {
                this.recordAudio(stream);
                if (typeof this.props.startCallback === "function") {
                    this.props.startCallback();
                }
            })
        }

        /**
         * @author j_bleach 2018/8/18
         * @describe mediaRecorder音频记录
         * @param stream: binary data
         */
        recordAudio(stream) {
            const {audioBitsPerSecond, mimeType} = this.props;
            MediaRecorderClass.mediaRecorder = new MediaRecorder(stream, {audioBitsPerSecond, mimeType});
            MediaRecorderClass.mediaRecorder.ondataavailable = (event) => {
                MediaRecorderClass.audioChunk.push(event.data);
            }
            MediaRecorderClass.audioCtx.resume();
            MediaRecorderClass.mediaRecorder.start(10);
            const source = MediaRecorderClass.audioCtx.createMediaStreamSource(stream);
            source.connect(this.analyser);
            this.renderCurve(this.analyser);
        }
    }
}
export default MediaRecorderFn;