/**
 * Created by j_bleach on 2018/8/6.
 */
import React from "react";

const RenderCanvas = Target => {
    return class RenderCanvasClass extends Target {

        constructor(props) {
            super(props)
            this.canvasRef = React.createRef() // react ref
            this.canvasCtx = null; // canvas 上下文
            this.animationId = null;
        }

        componentDidMount() {
            this.initCanvas();
        }

        componentWillUnmount() {
            window.cancelAnimationFrame(this.animationId); //组件销毁前，注销定时动画
        }

        /**
         * @author j_bleach 2018/8/18
         * @describe canvas 配置
         */
        configCanvas() {
            const {height, width, backgroundColor, strokeColor} = this.props;
            const canvas = this.canvasRef.current;
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
        initCanvas() {
            window.cancelAnimationFrame(this.animationId);
            const {height, width} = this.props;
            this.configCanvas();
            this.canvasCtx.moveTo(0, height / 2);
            this.canvasCtx.lineTo(width, height / 2);
            this.canvasCtx.stroke();
        }

        /**
         * @author j_bleach 2018/8/18
         * @describe 动态绘制音频曲线
         */
        renderCurve = () => {
            const {height, width} = this.props;
            this.animationId = window.requestAnimationFrame(this.renderCurve); // 定时动画
            const bufferLength = this.analyser.fftSize; // 默认为2048
            const dataArray = new Uint8Array(bufferLength);
            // console.log("data",dataArray)
            this.analyser.getByteTimeDomainData(dataArray);// 将音频信息存储在长度为2048（默认）的类型数组（dataArray）
            this.configCanvas();
            const sliceWidth = Number(width) / bufferLength;
            let x = 0;
            this.canvasCtx.moveTo(x, height / 2);
            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * height / 2;
                this.canvasCtx["lineTo"](x, y);
                x += sliceWidth;
            }
            this.canvasCtx.lineTo(width, height / 2);
            this.canvasCtx.stroke();
        }

        /**
         * @author j_bleach 2018/8/18
         * @describe 初始化渲染canvas节点
         */
        renderCanvas() {
            const {height, width} = this.props;
            return <canvas ref={this.canvasRef} height={height} width={width}
                           style={{width: width, height: height}}/>
        }
    }
}
export default RenderCanvas;
