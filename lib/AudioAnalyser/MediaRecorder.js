var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @author j_bleach 2018/8/18
 * @describe 媒体记录（包含开始，暂停，停止等媒体流及回调操作）
 * @param Target 被装饰类（AudioAnalyser）
 */
import convertWav from "./audioConvertWav";
import WebWorker from "./mp3worker.js";

var MediaRecorderFn = function MediaRecorderFn(Target) {
  var constraints = { audio: true };
  var mp3Worker = new Worker(WebWorker);
  return function (_Target) {
    _inherits(MediaRecorderClass, _Target);

    function MediaRecorderClass(props) {
      _classCallCheck(this, MediaRecorderClass);

      var _this = _possibleConstructorReturn(this, (MediaRecorderClass.__proto__ || Object.getPrototypeOf(MediaRecorderClass)).call(this, props));

      _this.startAudio = function () {
        var recorder = _this.mediaRecorder;
        if (!recorder || recorder && recorder.state === "inactive") {
          navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
            _this.recordAudio(stream);
          }).catch(function (err) {
            MediaRecorderClass.checkAndExecFn(_this.props.errorCallback, err);
            // throw new Error("getUserMedia failed:", err);
          });
          return false;
        }
        if (recorder && recorder.state === "paused") {
          _this.resumeAudio();
        }
      };

      _this.pauseAudio = function () {
        var recorder = _this.mediaRecorder;
        if (recorder && recorder.state === "recording") {
          recorder.pause();
          recorder.onpause = function () {
            MediaRecorderClass.checkAndExecFn(_this.props.pauseCallback);
          };
          _this.audioCtx.suspend();
        }
      };

      _this.stopAudio = function () {
        var _this$props = _this.props,
            audioType = _this$props.audioType,
            audioOptions = _this$props.audioOptions;

        var recorder = _this.mediaRecorder;
        if (recorder && ["recording", "paused"].includes(recorder.state)) {
          recorder.stop();
          recorder.onstop = function () {
            _this.audioStream2Blob(audioType, audioOptions, _this.props.stopCallback);
            _this.audioChunk = []; // 结束后，清空音频存储
          };
          _this.audioCtx.suspend();
          _this.initCanvas();
        }
      };

      MediaRecorderClass.compatibility();
      _this.audioChunk = []; // 音频信息存储对象
      _this.mediaRecorder = null; // 媒体记录对象
      _this.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // 音频上下文
      _this.analyser = _this.audioCtx.createAnalyser();
      return _this;
    }

    /**
     * @author j_bleach 2018/08/02 17:06
     * @describe 浏览器navigator.mediaDevices兼容性处理
     */


    _createClass(MediaRecorderClass, [{
      key: "audioStream2Blob",


      /**
       * @author j_bleach 2018/8/19
       * @describe 音频流转blob对象
       * @param type: string 音频的mime-type
       * @param cb: function 录音停止回调
       */
      value: function audioStream2Blob(type, audioOptions, cb) {
        var _this2 = this;

        var wavBlob = null;
        var chunk = this.audioChunk;
        var audioWav = function audioWav() {
          var fr = new FileReader();
          fr.readAsArrayBuffer(new Blob(chunk, { type: type }));
          var frOnload = function frOnload(e) {
            var buffer = e.target.result;
            _this2.audioCtx.decodeAudioData(buffer).then(function (data) {
              wavBlob = new Blob([new DataView(convertWav(data, audioOptions))], {
                type: "audio/wav"
              });
              MediaRecorderClass.checkAndExecFn(cb, wavBlob);
            });
          };
          fr.onload = frOnload;
        };
        var audioMp3 = function audioMp3() {
          var fr = new FileReader();
          fr.readAsArrayBuffer(new Blob(chunk, { type: "audio/wav" }));
          var frOnload = function frOnload(e) {
            var buffer = e.target.result;
            _this2.audioCtx.decodeAudioData(buffer).then(function (data) {
              var wavBuf = convertWav(data, audioOptions);
              mp3Worker.postMessage({
                cmd: "init",
                config: { bitRate: 128 }
              });
              mp3Worker.postMessage({ cmd: "encode", rawInput: wavBuf });
              mp3Worker.postMessage({ cmd: "finish" });

              mp3Worker.onmessage = function (e) {
                if (e.data.cmd == "end") {
                  var mp3Blob = new Blob(e.data.buf, { type: type });
                  MediaRecorderClass.checkAndExecFn(cb, mp3Blob);
                }
              };
            });
          };
          fr.onload = frOnload;
        };
        switch (type) {
          case "audio/webm":
          case "audio/mp4":
            MediaRecorderClass.checkAndExecFn(cb, new Blob(chunk, { type: MediaRecorderClass.mediaSupported() }));
            break;
          case "audio/wav":
            audioWav();
            break;
          case "audio/mp3":
            audioMp3();
            break;
          default:
            return void 0;
        }
      }

      /**
       * @author j_bleach 2018/8/18
       * @describe 开始录音
       */

      /**
       * @author j_bleach 2018/8/19
       * @describe 暂停录音
       */

      /**
       * @author j_bleach 2018/8/18
       * @describe 停止录音
       */

    }, {
      key: "recordAudio",


      /**
       * @author j_bleach 2018/8/18
       * @describe mediaRecorder音频记录
       * @param stream: binary data 音频流
       */
      value: function recordAudio(stream) {
        var _this3 = this;

        var _props = this.props,
            audioBitsPerSecond = _props.audioBitsPerSecond,
            timeslice = _props.timeslice;

        var mimeType = MediaRecorderClass.mediaSupported();
        this.mediaRecorder = new MediaRecorder(stream, {
          audioBitsPerSecond: audioBitsPerSecond,
          mimeType: mimeType
        });
        this.mediaRecorder.ondataavailable = function (event) {
          MediaRecorderClass.checkAndExecFn(_this3.props.onRecordCallback, event.data);
          _this3.audioChunk.push(event.data);
        };
        this.audioCtx.resume();
        this.mediaRecorder.start(timeslice);
        this.mediaRecorder.onstart = function (e) {
          MediaRecorderClass.checkAndExecFn(_this3.props.startCallback, e);
        };
        this.mediaRecorder.onresume = function (e) {
          _this3.initAudioAnalyser(stream);
          MediaRecorderClass.checkAndExecFn(_this3.props.startCallback, e);
        };
        this.mediaRecorder.onerror = function (e) {
          MediaRecorderClass.checkAndExecFn(_this3.props.errorCallback, e);
        };
        this.initAudioAnalyser(stream);
        this.renderCurve();
      }

      /**
       * @author j_bleach 2019/10/31
       * @describe 重置音频上下文（解决谷歌浏览器 音频数组链接断开问题）
       */

    }, {
      key: "initAudioAnalyser",
      value: function initAudioAnalyser(stream) {
        this.analyser = this.audioCtx.createAnalyser();
        var source = this.audioCtx.createMediaStreamSource(stream);
        source.connect(this.analyser);
      }

      /**
       * @author j_bleach 2018/8/19
       * @describe 恢复录音
       */

    }, {
      key: "resumeAudio",
      value: function resumeAudio() {
        this.audioCtx.resume();
        this.mediaRecorder.resume();
      }
    }], [{
      key: "compatibility",
      value: function compatibility() {
        var _this4 = this;

        var promisifiedOldGUM = function promisifiedOldGUM(constraints) {
          // First get ahold of getUserMedia, if present
          var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

          // Some browsers just don't implement it - return a rejected promise with an error
          // to keep a consistent interface
          if (!getUserMedia) {
            MediaRecorderClass.checkAndExecFn(_this4.props ? _this4.props.errorCallback : null);
            return Promise.reject(new Error("getUserMedia is not implemented in this browser"));
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

    }, {
      key: "checkAndExecFn",
      value: function checkAndExecFn(fn, e) {
        typeof fn === "function" && fn(e);
      }

      /**
       * @author j_bleach 2022/04/17
       * @describe 兼容safari
       * @returns mimeType
       */

    }, {
      key: "mediaSupported",
      value: function mediaSupported() {
        // safari used to not support this
        // ...even if it supported media recorder
        if (!MediaRecorder.isTypeSupported) {
          return "audio/mp4";
        } else if (MediaRecorder.isTypeSupported("audio/webm")) {
          return "audio/webm";
        } else {
          return "audio/mp4";
        }
      }
    }]);

    return MediaRecorderClass;
  }(Target);
};
export default MediaRecorderFn;
//# sourceMappingURL=MediaRecorder.js.map