import React from 'react';
import ReactDOM from 'react-dom';
import ChildrenAndParentsInformation from './ChildrenAndParentsInformation';

const App = () => (
    <ChildrenAndParentsInformation />
);

ReactDOM.render(
    <App />,
    document.getElementById('children-and-parents-information')
);