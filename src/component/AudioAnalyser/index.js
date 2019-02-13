/**
 * Created by j_bleach on 2018/8/1.
 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import MediaRecorder from "./MediaRecorder";
import RenderCanvas from "./RenderCanvas";
// import "./index.css";


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

