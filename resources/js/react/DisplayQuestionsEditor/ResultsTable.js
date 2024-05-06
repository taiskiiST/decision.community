import React from 'react';

const ResultsTable = ({ question }) => {
    const { answers, votersNumber, potentialVotersNumber } = question;

    let answerIdWithMaxVotes = null;
    let maxVotesNumber = 0;
    answers.forEach((answer) => {
        const { votesNumber, id } = answer;
        if (!answerIdWithMaxVotes || votesNumber > maxVotesNumber) {
            answerIdWithMaxVotes = id;
            maxVotesNumber = votesNumber;
        }
    });

    return (
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-200 border-b-2 border-gray-400 ">
                <thead className="bg-gray-50">
                <tr>
                    <th
                        scope="col"
                        className="whitespace-wrap text-wrap px-1 py-3 text-left text-xs font-medium tracking-wider text-gray-500"
                    >
                        №
                    </th>
                    <th
                        scope="col"
                        className="whitespace-wrap text-wrap px-1 py-3 text-left text-xs font-medium tracking-wider text-gray-500"
                    >
                        Вариант ответа
                    </th>
                    <th
                        scope="col"
                        className="whitespace-wrap text-wrap px-1 py-3 text-left text-xs font-medium tracking-wider text-gray-500"
                    >
                        Количество голосов
                    </th>
                    <th
                        scope="col"
                        className="whitespace-wrap text-wrap px-1 py-3 text-left text-xs font-medium tracking-wider text-gray-500"
                    >
                        В процентах
                    </th>
                </tr>
                </thead>

                <tbody>
                    {answers.map((answer, index) => (
                        <tr key={answer.id} className="even:bg-gray-50">
                            <td >
                                <div
                                    className={`whitespace-nowrap px-1 py-4 text-center text-sm font-medium  
                                                    ${
                                        answer.id === answerIdWithMaxVotes
                                            ? 'font-bold'
                                            : 'font-medium'
                                    }`}
                                >
                                    {index + 1}
                                </div>
                            </td>
                            <td
                                className="border-b border-gray-400 bg-gray-100 bg-white"
                            >
                                <div
                                    className={`whitespace-wrap px-1 py-4 text-center text-sm font-bold text-gray-900 ${
                                        answer.id === answerIdWithMaxVotes
                                            ? 'font-bold'
                                            : 'font-medium'
                                    }`}
                                >
                                    {answer.text}
                                </div>
                            </td>
                            <td>
                                <div
                                    className={`whitespace-nowrap bg-gray-200 px-1 py-4 text-center text-sm font-medium  
                                                    ${
                                        answer.id === answerIdWithMaxVotes
                                            ? 'font-bold'
                                            : 'font-medium'
                                    }`}
                                >
                                    {answer.votesNumber}
                                </div>
                            </td>
                            <td>
                                <div
                                    className={`whitespace-nowrap bg-gray-200 px-1 py-4 text-center text-sm font-medium  
                                                    ${
                                        answer.id === answerIdWithMaxVotes
                                            ? 'font-bold'
                                            : 'font-medium'
                                    }`}
                                >
                                    {potentialVotersNumber
                                        ? Math.round(
                                        (answer.votesNumber /
                                            potentialVotersNumber) *
                                        100 *
                                        100,
                                    ) / 100
                                        : 0}
                                    %
                                </div>
                            </td>
                        </tr>
                    ))}

                    <tr className="border-b border-gray-400 bg-gray-100 bg-white">
                        <td></td>
                        <td>
                            <div className="whitespace-wrap px-1 py-4 text-center text-sm font-bold text-gray-900">
                                ИТОГО
                            </div>
                        </td>
                        <td>
                            <div className="whitespace-nowrap bg-gray-200 px-1 py-4 text-center text-sm font-bold font-medium">
                                {`${votersNumber} из ${potentialVotersNumber}`}
                            </div>
                        </td>
                        <td>
                            <div className="whitespace-nowrap bg-gray-200 px-1 py-4 text-center text-sm font-bold font-medium">
                                {potentialVotersNumber > 0
                                    ? Math.round(
                                    (votersNumber / potentialVotersNumber) *
                                    100 *
                                    100,
                                ) / 100
                                    : 0}
                                %
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ResultsTable;
