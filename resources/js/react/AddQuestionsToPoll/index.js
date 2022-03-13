import React from 'react';
import ReactDOM from 'react-dom';
import Question from './Question';

const App = () => (
    <Question />
);

ReactDOM.render(
    <App />,
    document.getElementById('add-questions-to-poll')
);