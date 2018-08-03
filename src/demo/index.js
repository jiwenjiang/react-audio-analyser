/**
 * Created by j_bleach on 2018/8/3.
 */
import {AudioAnalyser} from '../component'
import React, {Component} from 'react';
export default class demo extends Component {
    componentDidMount() {
    }

    render() {
        return (
            <AudioAnalyser>
                <button>开始</button>
                <button>暂停</button>
                <button>结束</button>
            </AudioAnalyser>
        );
    }
}