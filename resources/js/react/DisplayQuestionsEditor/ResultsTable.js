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
            <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                    <tr>
                        <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                        >
                            №
                        </th>
                        <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                            Вариант ответа
                        </th>
                        <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                            Количество голосов
                        </th>
                        <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                            В процентах
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {answers.map((answer, index) => (
                        <tr key={answer.id} className="even:bg-gray-50">
                            <td
                                className={`whitespace-nowrap py-4 pl-4 pr-3 text-sm  text-gray-900 sm:pl-3 ${
                                    answer.id === answerIdWithMaxVotes
                                        ? 'font-bold'
                                        : 'font-medium'
                                }`}
                            >
                                {index + 1}
                            </td>
                            <td
                                className={`whitespace-nowrap px-3 py-4 text-sm text-gray-500 ${
                                    answer.id === answerIdWithMaxVotes
                                        ? 'font-bold'
                                        : 'font-medium'
                                }`}
                            >
                                {answer.text}
                            </td>
                            <td
                                className={`whitespace-nowrap px-3 py-4 text-sm text-gray-500 ${
                                    answer.id === answerIdWithMaxVotes
                                        ? 'font-bold'
                                        : 'font-medium'
                                }`}
                            >
                                {answer.votesNumber}
                            </td>
                            <td
                                className={`whitespace-nowrap px-3 py-4 text-sm text-gray-500 ${
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
                            </td>
                        </tr>
                    ))}

                    <tr className="bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-gray-900 sm:pl-3"></td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-gray-900">
                            ИТОГО
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-gray-900">
                            {`${votersNumber} из ${potentialVotersNumber}`}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-gray-900">
                            {potentialVotersNumber > 0
                                ? Math.round(
                                      (votersNumber / potentialVotersNumber) *
                                          100 *
                                          100,
                                  ) / 100
                                : 0}
                            %
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ResultsTable;
