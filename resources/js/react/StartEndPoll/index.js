import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import StartEndPoll from './StartEndPoll';

const App = () => (
    <>
        <StartEndPoll />

        <ToastContainer />
    </>
);

ReactDOM.render(<App />, document.getElementById('StartEndPoll'));
