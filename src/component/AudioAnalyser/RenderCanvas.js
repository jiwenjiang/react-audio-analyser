/**
 * Created by j_bleach on 2018/8/6.
 */
import React from 'react';

const RenderCanvas = Target => {
    return class RenderCanvasClass extends Target {
        static canvasRef = React.createRef(); // react ref
        static canvasCtx = null; // canvas 上下文

        componentDidMount() {
            this.initCanvas();
        }

        /**
         * @author j_bleach 2018/8/18
         * @describe canvas 配置
         */
        configCanvas() {
            const {height, width, backgroundColor, strokeColor} = this.props;
            const canvas = RenderCanvasClass.canvasRef.current;
            RenderCanvasClass.canvasCtx = canvas.getContext("2d");
            RenderCanvasClass.canvasCtx.clearRect(0, 0, width, height);
            RenderCanvasClass.canvasCtx.fillStyle = backgroundColor;
            RenderCanvasClass.canvasCtx.fillRect(0, 0, width, height);
            RenderCanvasClass.canvasCtx.lineWidth = 2;
            RenderCanvasClass.canvasCtx.strokeStyle = strokeColor;
            RenderCanvasClass.canvasCtx.beginPath();
        }

        /**
         * @author j_bleach 2018/8/18
         * @describe 画布初始化
         */
        initCanvas() {
            const {height, width} = this.props;
            this.configCanvas();
            RenderCanvasClass.canvasCtx.moveTo(0, height / 2);
            RenderCanvasClass.canvasCtx.lineTo(width, height / 2);
            RenderCanvasClass.canvasCtx.stroke();
        }

        /**
         * @author j_bleach 2018/8/18
         * @describe 动态绘制音频曲线
         * @param name: string
         */
        renderCurve = () => {
            const {height, width} = this.props;
            requestAnimationFrame(this.renderCurve);
            const bufferLength = this.analyser.fftSize;
            const dataArray = new Uint8Array(bufferLength);
            this.analyser.getByteTimeDomainData(dataArray);
            this.configCanvas();

            const sliceWidth = width * 1.0 / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * height / 2;

                if (i === 0) {
                    RenderCanvasClass.canvasCtx.moveTo(x, y);
                } else {
                    RenderCanvasClass.canvasCtx.lineTo(x, y);
                }
                x += sliceWidth;
            }

            RenderCanvasClass.canvasCtx.lineTo(width, height / 2);
            RenderCanvasClass.canvasCtx.stroke();
        }

        /**
         * @author j_bleach 2018/8/18
         * @describe 初始化渲染canvas节点
         */
        renderCanvas() {
            const {height, width} = this.props;
            return <canvas ref={RenderCanvasClass.canvasRef} height={height} width={width}
                           style={{width: width, height: height}}/>
        }
    }
}
export default RenderCanvas;