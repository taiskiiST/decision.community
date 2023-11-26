import React, { useState, useEffect, Fragment } from 'react';
import ReactDOM from 'react-dom';
import Highlighter from 'react-highlight-words';
import { DebounceInput } from 'react-debounce-input';

const {
    all_questions,
    itemsNameHash,
    itemsPollNameHash,
    cnt_files_in_question,
} = window.TSN || {};

function SearchQuestionsSmallScreen() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(all_questions);

    const handleChangeQuestionsFilter = (event) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        const results = all_questions.filter(
            (question) =>
                question.text.toLowerCase().includes(searchTerm) ||
                itemsNameHash[question.author]
                    .toLowerCase()
                    .includes(searchTerm) ||
                itemsPollNameHash[question.poll_id]
                    .toLowerCase()
                    .includes(searchTerm),
        );
        setSearchResults(results);
    }, [searchTerm]);

    //console.log(searchResults.length);
    return (
        <div className="relative w-64">
            <div>
                <div>
                    <DebounceInput
                        className="focus:shadow-outline w-30 mr-2 appearance-none border py-2 pr-4 text-gray-500 shadow focus:outline-none"
                        type="search"
                        placeholder="Поиск по голосованиям"
                        debounceTimeout={500}
                        onChange={handleChangeQuestionsFilter}
                        value={searchTerm}
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="absolute inset-y-0 right-0 flex items-center bg-indigo-600 text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <svg
                            className="h-4 w-10"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            stroke="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="absolute z-50 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="min-w-full py-2 align-middle sm:px-1 lg:px-8">
                    <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                        {searchTerm && searchResults.length && (
                            <table className="flex min-w-full flex-col divide-y divide-gray-200">
                                <tbody>
                                    {searchResults.map((question, index) => (
                                        <tr
                                            className="flex flex-col border-b border-gray-400 bg-gray-100 bg-white"
                                            key={index}
                                        >
                                            <td colSpan="3">
                                                <div className="whitespace-wrap text-wrap px-6 py-4 text-left text-sm text-gray-900">
                                                    <div className="inline-flex">
                                                        {index + 1}.&#160;
                                                        <Highlighter
                                                            highlightClassName="Highlight"
                                                            searchWords={[
                                                                searchTerm,
                                                            ]}
                                                            autoEscape={true}
                                                            textToHighlight={
                                                                question.text
                                                            }
                                                        />
                                                    </div>
                                                    <i>
                                                        <p className="text-xs">
                                                            (
                                                            <Highlighter
                                                                highlightClassName="Highlight"
                                                                searchWords={[
                                                                    searchTerm,
                                                                ]}
                                                                autoEscape={
                                                                    true
                                                                }
                                                                textToHighlight={
                                                                    itemsPollNameHash[
                                                                        question
                                                                            .poll_id
                                                                    ]
                                                                }
                                                            />
                                                            )
                                                        </p>
                                                    </i>
                                                </div>
                                                <div className="whitespace-wrap text-wrap bg-gray-200 px-6 py-4 text-left text-sm font-medium">
                                                    <Highlighter
                                                        highlightClassName="Highlight"
                                                        searchWords={[
                                                            searchTerm,
                                                        ]}
                                                        autoEscape={true}
                                                        textToHighlight={
                                                            itemsNameHash[
                                                                question.author
                                                            ]
                                                        }
                                                    />
                                                </div>
                                                <div className="whitespace-wrap text-wrap px-6 py-4 text-left text-sm font-medium text-green-600">
                                                    Количество файлов -{' '}
                                                    {
                                                        cnt_files_in_question[
                                                            question.id
                                                        ]
                                                    }
                                                </div>
                                                <div className="whitespace-wrap text-wrap bg-gray-200 px-6 py-4 text-left text-sm font-medium text-green-600">
                                                    <a
                                                        href={`/polls/view/question/${question.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Результаты голосования
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {searchTerm && !searchResults.length && (
                            <div className="whitespace-wrap bg-white px-6 py-4 text-sm font-medium text-gray-900">
                                Ничего не найдено!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(
    <SearchQuestionsSmallScreen />,
    document.getElementById('searchQuestionsSmallScreen'),
);
