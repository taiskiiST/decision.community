import React from 'react';
import ReactDOM from 'react-dom';
import Protocol from './Protocol';

const App = () => (
    <Protocol />
);

ReactDOM.render(
    <App />,
    document.getElementById('add-protocol-to-poll')
);