/**
 * Created by j_bleach on 2018/8/3.
 */
import React, {Component} from "react";
import "./index.css";
import {AudioAnalyser} from "../component"

export default class demo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            status: null
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
        const {status} = this.state;
        const audioProps = {
            status,
            startCallback: () => {
                console.log("succ start")
            },
            pauseCallback: () => {
                console.log("succ pause")
            },
            stopCallback: () => {
                console.log("succ stop")
            }
        }
        return (
            <AudioAnalyser {...audioProps}>
                <div className="btn-box">
                    <i className="iconfont icon-start" title="开始" onClick={() => this.controlAudio("recording")}></i>
                    <i className="iconfont icon-pause" title="暂停" onClick={() => this.controlAudio("paused")}></i>
                    <i className="iconfont icon-stop" title="停止" onClick={() => this.controlAudio("inactive")}></i>
                </div>
            </AudioAnalyser>
        );
    }
}