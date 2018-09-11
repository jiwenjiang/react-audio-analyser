[English](./README.md) | 简体中文
# react-audio-analyser

录音并实时绘制音频曲线，支持音频转码audio/wav

## 示例

[在线示例](https://jiwenjiang.github.io/).

## 安装

`npm install react-audio-analyser --save`

## 特征

- 记录音频，绘制曲线
- 支持输出转换为audio/wav
- 各状态勾子触发，错误处理

## 样例

`react-audio-analyser`组件的状态更新，通过本身传入的status属性决定

```js

import React, {Component} from "react";
import "./index.css";
import AudioAnalyser from "react-audio-analyser"


export default class demo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            status: null
        }
    }

    controlAudio(status) {
        this.setState({
            status
        })
    }

    render() {
        const {status, audioSrc} = this.state;
        const audioProps = {
            audioType: "audio/wav", // 暂时只支持转换 audio/wav, 默认 audio/webm
            status, // 通过改变状态属性，来触发组件各状态更新
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

```
## 属性(audioProps)

属性   | 描述                                          | 默认值               |是否必填
-------------|------------------------------------------------------|-------------------------|------------
`status`     | `recording` 开始录音 , `paused` 暂停录音 , `inactive` 停止录音 | undefined               | 是
`audioType`       | 录音输出类型      | audio/webm | 否
`audioSrc`     | 录音文件路径（通过输出音频文件转换），设置此属性后显示audio播放器    | null    | 否
`startCallback`     | 开始（恢复）录音成功回调     |   undefined                 | 否
`pauseCallback`     | 暂停录音成功回调       |   undefined                 | 否
`stopCallback`     | 停止录音       |   undefined                 | 否
`errorCallback`     | 错误处理回调       |   undefined                 | 否
`backgroundColor`   | 音频曲线背景色       |   rgba(0, 0, 0, 1)                 | 否
`strokeColor`   | 音频曲线线条色       |  #ffffff                | 否
`className`   | 音频曲线样式类       |  audioContainer                | 否
`audioBitsPerSecond`   | 音频码率       |  128000                | 否
`width`   | 音频曲线宽度       |  500px                | 否
`height`   | 高度       |  100px                | 否
`audioOptions`   |  audio/wav 输出格式选项       |  {}              | 否
`audioOptions.sampleRate`   | 输出audio/wav 音频采样率设置       |              | 否


## 许可证

MIT

## 待做
- 输出音频转换MP3格式
- 多样曲线展示
