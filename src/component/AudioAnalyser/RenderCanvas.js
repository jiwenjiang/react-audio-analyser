/**
 * Created by j_bleach on 2018/8/6.
 */
import React from 'react';

const RenderCanvas = Target => {
    return class RenderCanvasClass extends Target {
        // static canvasCtx = null;
        constructor() {
            super();
            this.canvasRef = React.createRef();
            console.log(this)
        }

        componentDidMount() {
            this.initCanvas();
        }

        initCanvas() {
            const {height, width, backgroundColor, strokeColor} = this.props;
            const canvas = this.canvasRef.current;
            this.canvasCtx = canvas.getContext("2d");
            this.canvasCtx.clearRect(0, 0, width, height);
            this.canvasCtx.fillStyle = backgroundColor;
            this.canvasCtx.fillRect(0, 0, width, height);
            this.canvasCtx.lineWidth = 2;
            this.canvasCtx.strokeStyle = strokeColor;
            this.canvasCtx.beginPath();
            this.canvasCtx.moveTo(0, height / 2);
            this.canvasCtx.lineTo(width, height / 2);
            this.canvasCtx.stroke();
        }

        renderCanvas() {
            const {height, width} = this.props;
            return <canvas ref={this.canvasRef} height={height} width={width} style={{width: width, height: height}}/>
        }
    }
}
export default RenderCanvas;