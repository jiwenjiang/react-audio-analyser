import React from 'react';
import ReactDOM from 'react-dom';
import {AudioAnalyser} from './component/index';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<AudioAnalyser />, document.getElementById('root'));
registerServiceWorker();
