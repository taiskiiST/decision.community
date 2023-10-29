import React from 'react';
import { render } from 'react-dom';
import StarRating from './StarRating';

const App = () => {
    return (
        <div className="App">
            <StarRating />
        </div>
    );
};

render(<App />, document.getElementById('RatingStars'));

export default App;