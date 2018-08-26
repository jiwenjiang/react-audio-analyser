/**
 * Created by j_bleach on 2018/8/1.
 */
import React, {Component} from "react";
import MediaRecorder from "./MediaRecorder";
import RenderCanvas from "./RenderCanvas";
import "./index.css";


@MediaRecorder
@RenderCanvas
class AudioAnalyser extends Component {

    componentDidUpdate(prevProps) {
        if (this.props.status !== prevProps.status) {
            const event = {
                inactive: this.stopAudio,
                recording: this.startAudio,
                paused: this.pauseAudio
            }[this.props.status];
            event && event();
        }
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
                        <audio controls src={audioSrc}/>
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
    width: 500,
    height: 100
};

export default AudioAnalyser;

