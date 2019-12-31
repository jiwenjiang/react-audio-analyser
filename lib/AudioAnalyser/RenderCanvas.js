var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Created by j_bleach on 2018/8/6.
 */
import React from "react";

var RenderCanvas = function RenderCanvas(Target) {
    return function (_Target) {
        _inherits(RenderCanvasClass, _Target);

        function RenderCanvasClass(props) {
            _classCallCheck(this, RenderCanvasClass);

            var _this = _possibleConstructorReturn(this, (RenderCanvasClass.__proto__ || Object.getPrototypeOf(RenderCanvasClass)).call(this, props));

            _this.renderCurve = function () {
                var _this$props = _this.props,
                    height = _this$props.height,
                    width = _this$props.width;

                _this.animationId = window.requestAnimationFrame(_this.renderCurve); // 定时动画
                var bufferLength = _this.analyser.fftSize; // 默认为2048
                var dataArray = new Uint8Array(bufferLength);
                // console.log("data",dataArray)
                _this.analyser.getByteTimeDomainData(dataArray); // 将音频信息存储在长度为2048（默认）的类型数组（dataArray）
                _this.configCanvas();
                var sliceWidth = Number(width) / bufferLength;
                var x = 0;
                _this.canvasCtx.moveTo(x, height / 2);
                for (var i = 0; i < bufferLength; i++) {
                    var v = dataArray[i] / 128.0;
                    var y = v * height / 2;
                    _this.canvasCtx["lineTo"](x, y);
                    x += sliceWidth;
                }
                _this.canvasCtx.lineTo(width, height / 2);
                _this.canvasCtx.stroke();
            };

            _this.canvasRef = React.createRef(); // react ref
            _this.canvasCtx = null; // canvas 上下文
            _this.animationId = null;
            return _this;
        }

        _createClass(RenderCanvasClass, [{
            key: "componentDidMount",
            value: function componentDidMount() {
                this.initCanvas();
            }
        }, {
            key: "componentWillUnmount",
            value: function componentWillUnmount() {
                window.cancelAnimationFrame(this.animationId); //组件销毁前，注销定时动画
            }

            /**
             * @author j_bleach 2018/8/18
             * @describe canvas 配置
             */

        }, {
            key: "configCanvas",
            value: function configCanvas() {
                var _props = this.props,
                    height = _props.height,
                    width = _props.width,
                    backgroundColor = _props.backgroundColor,
                    strokeColor = _props.strokeColor;

                var canvas = this.canvasRef.current;
                this.canvasCtx = canvas.getContext("2d");
                this.canvasCtx.clearRect(0, 0, width, height);
                this.canvasCtx.fillStyle = backgroundColor;
                this.canvasCtx.fillRect(0, 0, width, height);
                this.canvasCtx.lineWidth = 2;
                this.canvasCtx.strokeStyle = strokeColor;
                this.canvasCtx.beginPath();
            }

            /**
             * @author j_bleach 2018/8/18
             * @describe 画布初始化,停止动画
             */

        }, {
            key: "initCanvas",
            value: function initCanvas() {
                window.cancelAnimationFrame(this.animationId);
                var _props2 = this.props,
                    height = _props2.height,
                    width = _props2.width;

                this.configCanvas();
                this.canvasCtx.moveTo(0, height / 2);
                this.canvasCtx.lineTo(width, height / 2);
                this.canvasCtx.stroke();
            }

            /**
             * @author j_bleach 2018/8/18
             * @describe 动态绘制音频曲线
             */

        }, {
            key: "renderCanvas",


            /**
             * @author j_bleach 2018/8/18
             * @describe 初始化渲染canvas节点
             */
            value: function renderCanvas() {
                var _props3 = this.props,
                    height = _props3.height,
                    width = _props3.width;

                return React.createElement("canvas", { ref: this.canvasRef, height: height, width: width,
                    style: { width: width, height: height } });
            }
        }]);

        return RenderCanvasClass;
    }(Target);
};
export default RenderCanvas;
//# sourceMappingURL=RenderCanvas.js.map