English | [简体中文](./README_zh-CN.md)
# react-audio-analyser


[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/jiwenjiang/react-audio-analyser)
[![GitHub release](https://img.shields.io/github/release/qubyte/rubidium.svg)](https://www.npmjs.com/package/react-audio-analyser)




recording audio and drawing the curve. support for converting the audio to wav.

## Demo

Check out the [demo](https://jiwenjiang.github.io/).

## Installation

`npm install react-audio-analyser --save`

## Features

- Record audio and show the curve
- Support output audio/wav
- Various state callbacks

## Example



```js

import React, {Component} from "react";
import "./index.css";
import AudioAnalyser from "react-audio-analyser"


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

    changeScheme(e) {
        this.setState({
            audioType: e.target.value
        })
    }

    render() {
        const {status, audioSrc, audioType} = this.state;
        const audioProps = {
            audioType,
            // audioOptions: {sampleRate: 30000}, // 设置输出音频采样率
            status,
            audioSrc,
            timeslice: 1000, // timeslice（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
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
            onRecordCallback: (e) => {
                console.log("recording", e)
            },
            errorCallback: (err) => {
                console.log("error", err)
            }
        }
        return (
            <div>
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
                <p>choose output type</p>
                <select name="" id="" onChange={(e) => this.changeScheme(e)} value={audioType}>
                    <option value="audio/webm">audio/webm（default）</option>
                    <option value="audio/wav">audio/wav</option>
                    <option value="audio/mp3">audio/mp3</option>
                </select>
            </div>
        );
    }
}

```
## Properties(audioProps)

Properties   | Description                                          | Default               |IsRequired
-------------|------------------------------------------------------|-------------------------|------------
`status`     | `recording` start , `paused` pause , `inactive` stop | undefined               | yes
`audioType`       | audio output type      | audio/webm | no
`timeslice`       | The number of milliseconds to record into each Blob      | undefined | no
`audioSrc`     | window.URL.createObjectURL of output audio blob ,when the prop set, showing the audio control list    | null    | no                  |
`startCallback`     | Function triggered after starting(resuming) recording     |   undefined                 | no
`pauseCallback`     | Function triggered after pausing recording       |   undefined                 | no
`stopCallback`     | Function triggered after stoping recording       |   undefined                 | no
`onRecordCallback`     | Function triggered after setting timeslice or stoping recording       |   undefined                 | no
`errorCallback`     | Function triggered after error       |   undefined                 | no
`backgroundColor`   | audio canvas backgroundColor       |   rgba(0, 0, 0, 1)                 | no
`strokeColor`   | audio canvas strokeColor       |  #ffffff                | no
`className`   | audio canvas css classname       |  audioContainer                | no
`audioBitsPerSecond`   | audioBitsPerSecond       |  128000                | no
`width`   | audio canvas width       |  500px                | no
`height`   | audio canvas height       |  100px                | no
`audioOptions`   | output audio/wav options       |  {}              | no
`audioOptions.sampleRate`   | output audio/wav sampleRate       |              | no


## License

MIT

## TODO
- output audio/mp3 (completed)
- Diverse audio curve display