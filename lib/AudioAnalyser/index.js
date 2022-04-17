var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp2;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by j_bleach on 2018/8/1.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import MediaRecorder from "./MediaRecorder";
import RenderCanvas from "./RenderCanvas";

var AudioAnalyser = MediaRecorder(_class = RenderCanvas(_class = (_temp2 = _class2 = function (_Component) {
    _inherits(AudioAnalyser, _Component);

    function AudioAnalyser() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, AudioAnalyser);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AudioAnalyser.__proto__ || Object.getPrototypeOf(AudioAnalyser)).call.apply(_ref, [this].concat(args))), _this), _this.audioProgress = function () {
            // var request = new XMLHttpRequest();
            // request.open("GET", this.props.audioSrc, true);
            // request.responseType = "arraybuffer"; // 设置数据类型为arraybuffer
            // request.onload = () => {
            //     var audioData = request.response;
            //     this.audioCtx.decodeAudioData(audioData, (buffer) => {
            //         console.log("buffer", buffer)
            //         const AudioBufferSourceNode = this.audioCtx.createBufferSource()
            //         this.analyser = this.audioCtx.createAnalyser();
            //         AudioBufferSourceNode.buffer = buffer; // AudioBuffer数据赋值给buffer属性
            //         //AudioBufferSourceNode.connect(audioCtx.destination); // 如果只是播放音频，这边就直接将AudioBufferSourceNode连接到AudioDestinationNode
            //         AudioBufferSourceNode.connect(this.analyser);  // 实现播放后，需要将bufferSourceNode连接到AnalyserNode，才能通过AnalyserNode获取后面可视化所需的数据
            //         AudioBufferSourceNode.loop = true;  // 循环播放，默认为false
            //         AudioBufferSourceNode.start(0); // 开始播放音频
            //         this.renderCurve();
            //     });
            // }
            // request.send();
            // let fr = new FileReader();
            // fr.readAsArrayBuffer(this.props.audioBlob)
            // fr.onload = (e) => {
            //     this.audioCtx.decodeAudioData(e.target.result).then(data => {
            //         console.log("bef", data)
            //         // const source = this.audioCtx.createBufferSource()
            //         // this.analyser = this.audioCtx.createAnalyser();
            //         // source.connect(this.analyser);
            //         // //connect the analyser to the destination(the speaker), or we won't hear the sound
            //         // // this.analyser.connect(this.audioCtx.destination);
            //         // source.buffer = data;
            //         // if (!source.start) {
            //         //     source.start = source.noteOn //in old browsers use noteOn method
            //         //     source.stop = source.noteOff //in old browsers use noteOff method
            //         // }
            //         //
            //         // // start the source playing
            //         // source.start(0);
            //         // console.log("src", source)
            //
            //
            //     })
            // }
            var audio = new Audio();
            audio.src = _this.props.audioSrc;
            var source = _this.audioCtx.createMediaElementSource(audio);
            source.connect(_this.analyser);
            // this.analyser.connect(this.audioCtx.destination);
            _this.renderCurve();
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(AudioAnalyser, [{
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(nextProps) {
            return AudioAnalyser.checkRender(this.props, nextProps, AudioAnalyser.renderProps);
        }
    }, {
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps) {
            if (this.props.status !== prevProps.status) {
                var event = {
                    inactive: this.stopAudio,
                    recording: this.startAudio,
                    paused: this.pauseAudio
                }[this.props.status];
                event && event();
            }
            // TODO 音频回显
            // if (this.props.audioSrc !== prevProps.audioSrc) {
            //     const audioId = this.props.audioSrc.substring(this.props.audioSrc.length - 6)
            //     document.getElementById(audioId).addEventListener("timeupdate", this.audioProgress)
            //     // console.log("change audio src!", audioEle)
            // }
        }
    }, {
        key: "render",
        value: function render() {
            var _props = this.props,
                children = _props.children,
                className = _props.className,
                audioSrc = _props.audioSrc;


            return React.createElement(
                "div",
                { className: className },
                React.createElement(
                    "div",
                    null,
                    this.renderCanvas()
                ),
                children,
                audioSrc && React.createElement(
                    "div",
                    null,
                    React.createElement("audio", { controls: true, src: audioSrc, id: audioSrc.substring(audioSrc.length - 6) })
                )
            );
        }
    }], [{
        key: "checkRender",


        /**
         * @author j_bleach 2020/1/1
         * @describe ["status", "audioSrc"]判断是否渲染
         * @param props: object
         * @param nextProps: object
         * @param renderProps: array
         * @return boolean
         */
        value: function checkRender(props, nextProps, renderProps) {
            var keys = [].concat(_toConsumableArray(new Set(renderProps)));
            return keys.some(function (v) {
                return props[v] !== nextProps[v];
            });
        }
    }]);

    return AudioAnalyser;
}(Component), _class2.renderProps = ["status", "audioSrc"], _temp2)) || _class) || _class;

AudioAnalyser.defaultProps = {
    status: "",
    audioSrc: "",
    backgroundColor: "rgba(0, 0, 0, 1)",
    strokeColor: "#ffffff",
    className: "audioContainer",
    audioBitsPerSecond: 128000,
    mimeType: "audio/webm",
    audioType: "audio/webm",
    audioOptions: {},
    width: 500,
    height: 100
};
AudioAnalyser.propTypes = {
    status: PropTypes.string,
    audioSrc: PropTypes.string,
    backgroundColor: PropTypes.string,
    strokeColor: PropTypes.string,
    className: PropTypes.string,
    audioBitsPerSecond: PropTypes.number,
    audioType: PropTypes.string,
    audioOptions: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    timeslice: PropTypes.number,
    startCallback: PropTypes.func,
    pauseCallback: PropTypes.func,
    stopCallback: PropTypes.func,
    onRecordCallback: PropTypes.func
};
export default AudioAnalyser;
//# sourceMappingURL=index.js.map