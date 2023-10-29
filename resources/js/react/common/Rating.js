import React, { useState } from 'react';
import Rating from '@mui/material/Rating';

const {questions, ratings_questions, answers} = window.TSN || {};

export default function BasicRating() {
    const [ratings, setRating] = useState(ratings_questions);

    return (
            <Rating
                name="simple-controlled"
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            />
    );
}