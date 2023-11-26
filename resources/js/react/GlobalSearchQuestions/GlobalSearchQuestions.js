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

function SearchQuestionsFullScreen() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(all_questions);
    const handleChangeQuestionsFilter = (event) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        if (!all_questions) {
            return;
        }

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

    return (
        <div className="p-2">
            <div className="relative w-80">
                <DebounceInput
                    className="focus:shadow-outline w-full appearance-none border px-3 py-2 text-gray-500 shadow focus:outline-none"
                    type="search"
                    placeholder="Поиск по голосованиям"
                    debounceTimeout={500}
                    onChange={handleChangeQuestionsFilter}
                    value={searchTerm}
                />

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
            <div className="absolute z-50 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                        {searchTerm && searchResults.length && (
                            <table className="min-w-full divide-y divide-gray-200 ">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs uppercase text-gray-500"
                                        >
                                            №
                                        </th>
                                        <th
                                            scope="col"
                                            className="whitespace-wrap relative px-6 py-3"
                                        >
                                            Тема / вопрос
                                        </th>
                                        <th
                                            scope="col"
                                            className="whitespace-wrap relative px-6 py-3"
                                        >
                                            Автор
                                        </th>
                                        <th
                                            scope="col"
                                            className="relative px-6 py-3"
                                        >
                                            Количествой файлов
                                        </th>

                                        <th
                                            scope="col"
                                            className="relative px-6 py-3"
                                        >
                                            Просмотр
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {searchResults.map((question, index) => (
                                        <tr
                                            className={`bg-white ${
                                                index % 2 === 0
                                                    ? 'bg-gray-200'
                                                    : ''
                                            }`}
                                            key={index}
                                        >
                                            <td className="whitespace-wrap text-nowrap px-6 py-4 text-right text-sm font-medium">
                                                <div className="inline-flex">
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td className="whitespace-wrap px-6 py-4 text-sm font-medium text-gray-900">
                                                <p className="text-xs">
                                                    <Highlighter
                                                        highlightClassName="Highlight"
                                                        searchWords={[
                                                            searchTerm,
                                                        ]}
                                                        autoEscape={true}
                                                        textToHighlight={
                                                            itemsPollNameHash[
                                                                question.poll_id
                                                            ]
                                                        }
                                                    />
                                                </p>{' '}
                                                <br />
                                                <p className="text-lg">
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
                                                </p>
                                            </td>
                                            <td className="whitespace-wrap text-wrap px-6 py-4 text-sm font-medium text-gray-900">
                                                <Highlighter
                                                    highlightClassName="Highlight"
                                                    searchWords={[searchTerm]}
                                                    autoEscape={true}
                                                    textToHighlight={
                                                        itemsNameHash[
                                                            question.author
                                                        ]
                                                    }
                                                />
                                            </td>
                                            <td className="whitespace-wrap text-wrap px-6 py-4 text-sm font-medium text-gray-900">
                                                {
                                                    cnt_files_in_question[
                                                        question.id
                                                    ]
                                                }
                                            </td>
                                            <td className="whitespace-wrap text-wrap px-6 py-4 text-sm font-medium text-gray-900">
                                                <a
                                                    href={`/polls/view/question/${question.id}`}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Результаты голосования
                                                </a>
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
    <SearchQuestionsFullScreen />,
    document.getElementById('searchQuestionsFullScreen'),
);
