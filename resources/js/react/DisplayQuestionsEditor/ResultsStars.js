import Rating from '@mui/material/Rating';
import React from 'react';

const ResultsStars = ({ question }) => {
    const { averageGrade, votersNumber, potentialVotersNumber } = question;
    const avgGrade = Number(averageGrade);

    let ending = '';
    if (averageGrade > 1) {
        ending = 'а';
    }
    if (averageGrade >= 5) {
        ending = 'ов';
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <Rating
                name="question-rating"
                value={avgGrade}
                sx={{
                    '& .MuiSvgIcon-root': {
                        width: 60,
                        height: 60,
                    },
                }}
                readOnly
            />

            <label className="italic">
                Средняя оценка работы <b>{avgGrade}</b> {`балл${ending}`}
            </label>

            <label className="italic">
                Проголосовало <b>{votersNumber}</b> из{' '}
                <b>{potentialVotersNumber}</b>
            </label>
        </div>
    );
};

export default ResultsStars;
