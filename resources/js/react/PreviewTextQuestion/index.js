import React from 'react';
import ReactDOM from 'react-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditorPreview from './EditorPreview';

const App = () => (
    <>
        <EditorPreview />

        <ToastContainer />
    </>
);

ReactDOM.render(<App />, document.getElementById('PreviewTextQuestion'));
