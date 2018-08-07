/**
 * Created by j_bleach on 2018/8/1.
 */
import React, {Component} from 'react';
import MediaRecorder from './MediaRecorder';
import RenderCanvas from './RenderCanvas';


@MediaRecorder
@RenderCanvas
class AudioAnalyser extends Component {
    componentDidMount() {
        this.startAudio();
    }

    componentDidUpdate(prevProps) {
        if (this.props.status !== prevProps.status) {
            const event = {
                inactive: this.stopAudio,
                recording: this.startAudio,
                paused: this.pauseAudio,
            }[this.props.status];
            event && event();
        }
    }

    render() {
        const {children, className} = this.props;
        return (
            <div className={className}>
                {this.renderCanvas()}
                {children}
            </div>
        );
    }
}

AudioAnalyser.defaultProps = {
    backgroundColor: "rgba(0, 0, 0, 1)",
    strokeColor: "#ffffff",
    className: "",
    audioBitsPerSecond: 128000,
    mimeType: "audio/webm;codecs=opus",
    width: 640,
    height: 100,
};

export default AudioAnalyser;

