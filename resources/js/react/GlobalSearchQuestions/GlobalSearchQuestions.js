import { useState, useEffect, Fragment } from 'react';
import {render} from "react-dom";
import Highlighter from "react-highlight-words";

const {all_questions, itemsNameHash, itemsPollNameHash, cnt_files_in_question} = window.TSN || {};


function SearchQuestionsFullScreen() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(all_questions);

    const handleChangeQuestionsFilter = event => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        if (!all_questions) {
            return;
        }

        const results = all_questions
            .filter(question =>
                question.text.toLowerCase().includes(searchTerm)
                || itemsNameHash[question.author].toLowerCase().includes(searchTerm)
                || itemsPollNameHash[question.poll_id].toLowerCase().includes(searchTerm)
            );
        setSearchResults(results);
    }, [searchTerm]);

    //console.log(searchResults.length);
    return (
        <div className="p-2">
            <div className="relative w-80">
                <input
                    type="search"
                    className="appearance-none shadow border py-2 px-3 text-gray-500 focus:outline-none focus:shadow-outline w-full"
                    id="searchQuestionsFullScreen"
                    placeholder="Поиск по голосованиям"
                    name="searchQuestions"
                    autoFocus
                    value={searchTerm}
                    onChange={handleChangeQuestionsFilter}

                />
                <button type="submit"
                        className="absolute inset-y-0 right-0 flex items-center bg-indigo-600 text-white text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <svg className="w-10 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                         viewBox="0 0 20 20" stroke="currentColor">
                        <path fillRule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clipRule="evenodd"/>
                    </svg>
                </button>
            </div>
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 absolute z-50">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            {searchTerm && searchResults.length && <table className="min-w-full divide-y divide-gray-200 ">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs text-gray-500 uppercase">
                                        №
                                    </th>
                                    <th scope="col" className="relative px-6 py-3 whitespace-wrap">
                                        Тема / вопрос
                                    </th>
                                    <th scope="col" className="relative px-6 py-3 whitespace-wrap">
                                        Автор
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        Количествой файлов
                                    </th>

                                    <th scope="col" className="relative px-6 py-3">
                                        Просмотр
                                    </th>
                                </tr>
                                </thead>

                                <tbody>
                                {searchResults.map((question,index) => (
                                    <tr className={`bg-white ${index % 2 === 0 ? 'bg-gray-200' : ''}`} key={index}>
                                        <td className="px-6 py-4 whitespace-wrap text-nowrap text-right text-sm font-medium">
                                            <div className="inline-flex">{index + 1}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900">
                                            <p className="text-xs">
                                                <Highlighter
                                                    highlightClassName="Highlight"
                                                    searchWords={[searchTerm]}
                                                    autoEscape={true}
                                                    textToHighlight={itemsPollNameHash[question.poll_id]}
                                                />
                                            </p> <br />
                                            <p className="text-lg">
                                                <Highlighter
                                                    highlightClassName="Highlight"
                                                    searchWords={[searchTerm]}
                                                    autoEscape={true}
                                                    textToHighlight={question.text }
                                                />
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-wrap text-wrap text-sm font-medium text-gray-900">
                                            <Highlighter
                                                highlightClassName="Highlight"
                                                searchWords={[searchTerm]}
                                                autoEscape={true}
                                                textToHighlight={ itemsNameHash[question.author] }
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-wrap text-wrap text-sm font-medium text-gray-900">
                                            {cnt_files_in_question[question.id]}
                                        </td>
                                        <td className="px-6 py-4 whitespace-wrap text-wrap text-sm font-medium text-gray-900">
                                            <a href={`/polls/view/question/${question.id}`} className="text-indigo-600 hover:text-indigo-900">Результаты голосования</a>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>}
                            {searchTerm && !searchResults.length &&
                                <div className="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900 bg-white">Ничего не найдено!</div>
                            }
                            </div>
                    </div>
                </div>
            </div>
    );
}


render(<SearchQuestionsFullScreen />, document.getElementById('searchQuestionsFullScreen'));
