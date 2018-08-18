/**
 * Created by j_bleach on 2018/8/3.
 */
import React, {Component} from 'react';
import "./index.css";
import {AudioAnalyser} from '../component'

export default class demo extends Component {
    componentDidMount() {
        console.log(this)
    }

    render() {
        return (
            <AudioAnalyser>
                <div className="btn-box">
                    <i className="iconfont icon-start" title="开始"></i>
                    <i className="iconfont icon-pause" title="暂停"></i>
                    <i className="iconfont icon-stop" title="停止"></i>
                </div>
            </AudioAnalyser>
        );
    }
}