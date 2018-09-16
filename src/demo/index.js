/**
 * Created by j_bleach on 2018/8/3.
 */
import React, {Component} from "react";
import "./index.css";
import AudioAnalyser from "../component"


export default class demo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            status: ""
        }
    }

    componentDidMount() {
    }

    controlAudio(status) {
        this.setState({
            status
        })
    }

    render() {
        const {status, audioSrc} = this.state;
        const audioProps = {
            audioType: "audio/wav",
            // audioOptions: {sampleRate: 30000}, // 设置输出音频采样率
            status,
            audioSrc,
            startCallback: (e) => {
                console.log("succ start", e)
            },
            pauseCallback: (e) => {
                console.log("succ pause", e)
            },
            stopCallback: (e) => {
                this.setState({
                    audioSrc: window.URL.createObjectURL(e)
                })
                console.log("succ stop", e)
            },
            errorCallback: (err) => {
                console.log("error", err)
            }
        }
        return (
            <AudioAnalyser {...audioProps}>
                <div className="btn-box">
                    {status !== "recording" &&
                    <i className="iconfont icon-start" title="开始"
                       onClick={() => this.controlAudio("recording")}></i>}
                    {status === "recording" &&
                    <i className="iconfont icon-pause" title="暂停"
                       onClick={() => this.controlAudio("paused")}></i>}
                    <i className="iconfont icon-stop" title="停止"
                       onClick={() => this.controlAudio("inactive")}></i>
                </div>
            </AudioAnalyser>
        );
    }
}