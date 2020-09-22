/**
 * @author j_bleach 2018/8/18
 * @describe 媒体记录（包含开始，暂停，停止等媒体流及回调操作）
 * @param Target 被装饰类（AudioAnalyser）
 */
import convertWav from "./audioConvertWav";
import WebWorker from "./mp3worker.js";

const MediaRecorderFn = Target => {
    const constraints = {audio: true};
    const mp3Worker = new Worker(WebWorker);
    return class MediaRecorderClass extends Target {

        constructor(props) {
            super(props);
            MediaRecorderClass.compatibility();
            this.audioChunk = [] // 音频信息存储对象
            this.mediaRecorder = null // 媒体记录对象
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // 音频上下文
            this.analyser = this.audioCtx.createAnalyser();
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
                    MediaRecorderClass.checkAndExecFn(this.props ? this.props.errorCallback : null);
                    return Promise.reject(
                      new Error("getUserMedia is not implemented in this browser")
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
         * @author j_bleach 2018/8/19
         * @describe 验证函数，如果存在即执行
         * @param fn: function 被验证函数
         * @param e: object 事件对象 event object
         */
        static checkAndExecFn(fn, e) {
            typeof fn === "function" && fn(e)
        }

        /**
         * @author j_bleach 2018/8/19
         * @describe 音频流转blob对象
         * @param type: string 音频的mime-type
         * @param cb: function 录音停止回调
         */
        audioStream2Blob(type, audioOptions, cb) {
            let wavBlob = null;
            const chunk = this.audioChunk;
            const audioWav = () => {
                let fr = new FileReader();
                fr.readAsArrayBuffer(new Blob(chunk, {type}))
                let frOnload = (e) => {
                    const buffer = e.target.result
                    this.audioCtx.decodeAudioData(buffer).then(data => {
                        wavBlob = new Blob([new DataView(convertWav(data, audioOptions))], {
                            type: "audio/wav"
                        })
                        MediaRecorderClass.checkAndExecFn(cb, wavBlob);
                    })
                }
                fr.onload = frOnload
            }
            const audioMp3 = () => {
                let fr = new FileReader();
                fr.readAsArrayBuffer(new Blob(chunk, {type: "audio/wav"}))
                let frOnload = (e) => {
                    const buffer = e.target.result;
                    this.audioCtx.decodeAudioData(buffer).then(data => {
                        const wavBuf = convertWav(data, audioOptions)
                        mp3Worker.postMessage({
                            cmd: "init",
                            config: {bitRate: 128}
                        });
                        mp3Worker.postMessage({cmd: "encode", rawInput: wavBuf});
                        mp3Worker.postMessage({cmd: "finish"});

                        mp3Worker.onmessage = (e) => {
                            if (e.data.cmd == "end") {
                                const mp3Blob = new Blob(e.data.buf, {type});
                                MediaRecorderClass.checkAndExecFn(cb, mp3Blob);
                            }
                        };
                    })
                }
                fr.onload = frOnload
            }
            switch (type) {
                case "audio/webm":
                    MediaRecorderClass.checkAndExecFn(cb, new Blob(chunk, {type}));
                    break;
                case "audio/wav":
                    audioWav();
                    break;
                case "audio/mp3":
                    audioMp3();
                    break;
                default:
                    return void 0
            }
        }

        /**
         * @author j_bleach 2018/8/18
         * @describe 开始录音
         */
        startAudio = () => {
            const recorder = this.mediaRecorder;
            if (!recorder || (recorder && recorder.state === "inactive")) {
                navigator.mediaDevices.getUserMedia(constraints).then(stream => {
                    this.recordAudio(stream);
                }).catch(err => {
                      MediaRecorderClass.checkAndExecFn(this.props.errorCallback, err);
                      // throw new Error("getUserMedia failed:", err);
                  }
                )
                return false
            }
            if (recorder && recorder.state === "paused") {
                this.resumeAudio();
            }
        }
        /**
         * @author j_bleach 2018/8/19
         * @describe 暂停录音
         */
        pauseAudio = () => {
            const recorder = this.mediaRecorder;
            if (recorder && recorder.state === "recording") {
                recorder.pause();
                recorder.onpause = () => {
                    MediaRecorderClass.checkAndExecFn(this.props.pauseCallback);
                }
                this.audioCtx.suspend();
            }
        }
        /**
         * @author j_bleach 2018/8/18
         * @describe 停止录音
         */
        stopAudio = () => {
            const {audioType, audioOptions} = this.props;
            const recorder = this.mediaRecorder;
            if (recorder && ["recording", "paused"].includes(recorder.state)) {
                recorder.stop();
                recorder.onstop = () => {
                    this.audioStream2Blob(audioType, audioOptions, this.props.stopCallback);
                    this.audioChunk = []; // 结束后，清空音频存储
                }
                this.audioCtx.suspend();
                this.initCanvas();
            }
        }

        /**
         * @author j_bleach 2018/8/18
         * @describe mediaRecorder音频记录
         * @param stream: binary data 音频流
         */
        recordAudio(stream) {
            const {audioBitsPerSecond, mimeType, timeslice} = this.props;
            this.mediaRecorder = new MediaRecorder(stream, {audioBitsPerSecond, mimeType});
            this.mediaRecorder.ondataavailable = (event) => {
                MediaRecorderClass.checkAndExecFn(this.props.onRecordCallback, event.data);
                this.audioChunk.push(event.data);
            }
            this.audioCtx.resume();
            this.mediaRecorder.start(timeslice);
            this.mediaRecorder.onstart = (e) => {
                MediaRecorderClass.checkAndExecFn(this.props.startCallback, e);
            }
            this.mediaRecorder.onresume = (e) => {
                this.initAudioAnalyser(stream)
                MediaRecorderClass.checkAndExecFn(this.props.startCallback, e);
            }
            this.mediaRecorder.onerror = (e) => {
                MediaRecorderClass.checkAndExecFn(this.props.errorCallback, e);
            }
            this.initAudioAnalyser(stream)
            this.renderCurve();
        }

        /**
         * @author j_bleach 2019/10/31
         * @describe 重置音频上下文（解决谷歌浏览器 音频数组链接断开问题）
         */

        initAudioAnalyser(stream) {
            this.analyser = this.audioCtx.createAnalyser();
            const source = this.audioCtx.createMediaStreamSource(stream);
            source.connect(this.analyser);
        }

        /**
         * @author j_bleach 2018/8/19
         * @describe 恢复录音
         */
        resumeAudio() {
            this.audioCtx.resume();
            this.mediaRecorder.resume();
        }
    }
}
export default MediaRecorderFn;
