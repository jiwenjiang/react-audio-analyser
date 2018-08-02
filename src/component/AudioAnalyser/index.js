/**
 * Created by j_bleach on 2018/8/1.
 */
import React, {Component} from 'react';
import MediaRecorder from './MediaRecorder';

@MediaRecorder
class AudioAnalyser extends Component {
    componentDidMount(){
        console.log(this);
    }
    render() {
        return (
            <div>
                666
            </div>
        );
    }
}

export default AudioAnalyser;