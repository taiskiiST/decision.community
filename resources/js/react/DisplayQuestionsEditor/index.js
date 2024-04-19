import DisplayQuestionEditor from './DisplayQuestionEditor';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { render } from 'react-dom';
import React from 'react';

const App = () => {
    return (
        <div className="App tuta">
            <DisplayQuestionEditor />

            <ToastContainer />
        </div>
    );
};

const element = document.getElementById('displayQuestionsEditor');
if (element) {
    render(<App />, element);
}
