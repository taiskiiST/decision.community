import React from 'react';
import Rating from '@mui/material/Rating';

const RegularAnswers = ({ question, votes, onAnswerClick }) => (
    <fieldset>
        <div className="-space-y-px rounded-md bg-white">
            {question.answers.map((answer) => {
                return (
                    <div key={answer.id}>
                        <label className="relative flex cursor-pointer rounded-tl-md rounded-tr-md border border-gray-200 p-4">
                            <input
                                type="radio"
                                className="input-radio mt-0.5 h-4 w-4 cursor-pointer border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                aria-labelledby="privacy-setting-0-label"
                                aria-describedby="privacy-setting-0-description"
                                onChange={() =>
                                    onAnswerClick(question.id, answer.id)
                                }
                                name="answer"
                                checked={votes[question.id] === answer.id}
                            />
                            <div className=" ml-3 flex flex-col">
                                <span
                                    id="privacy-setting-0-label"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    {answer.text}
                                </span>
                            </div>
                        </label>
                    </div>
                );
            })}
        </div>
    </fieldset>
);

const   RatingAnswers = ({ question, votes, onAnswerClick }) => {
    const currentAnswerId = votes[question.id] || question.userVotedAnswerId;
    let currentValue = 0;

    if (currentAnswerId) {
        const answer = question.answers.find(
            (a) => Number(a.id) === currentAnswerId,
        );

        currentValue = Number(answer.text);
    }

    return (
        <div className="flex items-center justify-center">
            <Rating
                name="question-rating"
                value={currentValue}
                onChange={(event, newValue) => {
                    const answer = question.answers.find(
                        (a) => Number(a.text) === newValue,
                    );

                    onAnswerClick(question.id, answer.id);
                }}
                sx={{
                    '& .MuiSvgIcon-root': {
                        width: 60,
                        height: 60,
                    },
                }}
            />
        </div>
    );
};

const Answers = ({ isTypeReport, votes, question, onAnswerClick }) => {
    return (
        <>
            {isTypeReport ? (
                <RatingAnswers
                    question={question}
                    votes={votes}
                    onAnswerClick={onAnswerClick}
                />
            ) : (
                <RegularAnswers
                    question={question}
                    votes={votes}
                    onAnswerClick={onAnswerClick}
                />
            )}
        </>
    );
};

export default Answers;
