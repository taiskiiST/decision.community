import React from 'react';
import ReactDOM from 'react-dom';
import DisplayQuestionEditor from './DisplayQuestionEditor';

const App = () => (
    <DisplayQuestionEditor />
);

ReactDOM.render(
    <App />,
    document.getElementById('displayQuestionsEditor')
);