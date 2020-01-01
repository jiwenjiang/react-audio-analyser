var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _class2, _temp;

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

var AudioAnalyser = MediaRecorder(_class = RenderCanvas(_class = (_temp = _class2 = function (_Component) {
    _inherits(AudioAnalyser, _Component);

    function AudioAnalyser() {
        _classCallCheck(this, AudioAnalyser);

        return _possibleConstructorReturn(this, (AudioAnalyser.__proto__ || Object.getPrototypeOf(AudioAnalyser)).apply(this, arguments));
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
                    React.createElement("audio", { controls: true, src: audioSrc })
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
}(Component), _class2.renderProps = ["status", "audioSrc"], _temp)) || _class) || _class;

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