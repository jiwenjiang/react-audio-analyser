import React from 'react';
import ReactDOM from 'react-dom';
import Demo from './demo/mixAudio';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Demo />, document.getElementById('root'));
registerServiceWorker();
