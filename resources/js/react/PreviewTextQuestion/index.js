import React from 'react';
import ReactDOM from 'react-dom';
import EditorPreview from './EditorPreview';

const App = () => (
    <EditorPreview />
);

ReactDOM.render(
    <App />,
    document.getElementById('PreviewTextQuestion')
);