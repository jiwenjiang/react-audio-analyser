/**
 * Created by j_bleach on 2018/8/1.
 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import MediaRecorder from "./MediaRecorder";
import RenderCanvas from "./RenderCanvas";


@MediaRecorder
@RenderCanvas
class AudioAnalyser extends Component {

    static renderProps = ["status", "audioSrc"]

    /**
     * @author j_bleach 2020/1/1
     * @describe ["status", "audioSrc"]判断是否渲染
     * @param props: object
     * @param nextProps: object
     * @param renderProps: array
     * @return boolean
     */
    static checkRender(props, nextProps, renderProps) {
        const keys = [...new Set(renderProps)]
        return keys.some(v => props[v] !== nextProps[v])
    }

    shouldComponentUpdate(nextProps) {
        return AudioAnalyser.checkRender(this.props, nextProps, AudioAnalyser.renderProps)
    }

    componentDidUpdate(prevProps) {
        if (this.props.status !== prevProps.status) {
            const event = {
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

    audioProgress = () => {
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
        const audio = new Audio();
        audio.src = this.props.audioSrc;
        const source = this.audioCtx.createMediaElementSource(audio);
        source.connect(this.analyser);
        // this.analyser.connect(this.audioCtx.destination);
        this.renderCurve();

    }

    render() {
        const {
            children, className, audioSrc
        } = this.props;

        return (
          <div className={className}>
              <div>
                  {this.renderCanvas()}
              </div>
              {children}
              {
                  audioSrc &&
                  <div>
                      <audio controls src={audioSrc} id={audioSrc.substring(audioSrc.length - 6)}/>
                  </div>
              }
          </div>
        );
    }
}

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

