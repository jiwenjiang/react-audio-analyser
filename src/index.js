import React from 'react';
import ReactDOM from 'react-dom';
import Demo from './demo/index';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Demo />, document.getElementById('root'));
registerServiceWorker();
