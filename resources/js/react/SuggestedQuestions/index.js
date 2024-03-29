import { useState, useEffect, Fragment } from 'react';
import { render } from 'react-dom';
import Highlighter from 'react-highlight-words';
import { Listbox, Transition } from '@headlessui/react';

const {
    csrf_token,
    itemsNameHash,
    itemsPollNameHash,
    suggested_questions,
    hasOwnQuestions,
    authUserId,
    cnt_files_in_question,
    itemsPollFinishedHash,
    isAuthUserVote,
} = window.TSN || {};

function SuggestedQuestions() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResultsQuestions, setSearchResultsQuestions] =
        useState(suggested_questions);

    const [selected, setSelected] = useState('Все предложенные вопросы');

    const handleChangeQuestionsFilter = (event) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        const results = suggested_questions.filter((question) => {
            const searchTermLowerCased = searchTerm.toLowerCase();

            return (
                question.text.toLowerCase().includes(searchTermLowerCased) ||
                itemsNameHash[question.author]
                    ?.toLowerCase()
                    ?.includes(searchTermLowerCased) ||
                itemsPollNameHash[question.poll_id]
                    ?.toLowerCase()
                    ?.includes(searchTermLowerCased)
            );
        });
        setSearchResultsQuestions(results);
    }, [searchTerm]);

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    useEffect(() => {
        let results = suggested_questions;
        if (String(selected) === String('Мои вопросы')) {
            results = suggested_questions.filter(
                (question) => question.author == authUserId,
            );
        } else {
            if (String(selected) === String('Принятые к рассмортрению')) {
                results = suggested_questions.filter(
                    (question) => question.accepted == true,
                );
            }
        }
        setSearchResultsQuestions(results);
    }, [selected]);

    return (
        <div className="p-2">
            <div className="flex hidden flex-col lg:-mt-px xl:flex">
                <div className="flex">
                    <div className="relative w-80 px-4 py-3">
                        <input
                            type="search"
                            className="focus:shadow-outline w-5/6 appearance-none border px-3 py-2 text-gray-500 shadow focus:outline-none"
                            id="search"
                            placeholder="Поиск"
                            name="search"
                            autoFocus
                            value={searchTerm}
                            onChange={handleChangeQuestionsFilter}
                        />
                        <button
                            type="submit"
                            className="y-2 absolute inset-y-3 right-0 flex h-4/6 w-1/6 items-center bg-indigo-600 px-3 text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                    <div className="relative w-80 px-8 py-3">
                        <Listbox value={selected} onChange={setSelected}>
                            {({ open }) => (
                                <>
                                    {/*<Listbox.Label className="block text-sm font-medium text-gray-700">Выберете компанию</Listbox.Label>*/}
                                    <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                            <span className="flex items-center">
                                                <span className="ml-3 block truncate">
                                                    {selected}
                                                </span>
                                            </span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2"></span>
                                        </Listbox.Button>

                                        <Transition
                                            show={open}
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {[
                                                    'Все предложенные вопросы',
                                                    'Мои вопросы',
                                                    'Принятые к рассмортрению',
                                                ].map(
                                                    (
                                                        question_status,
                                                        index,
                                                    ) => (
                                                        <Listbox.Option
                                                            key={index}
                                                            className={({
                                                                active,
                                                            }) =>
                                                                classNames(
                                                                    active
                                                                        ? 'bg-indigo-600 text-white'
                                                                        : 'text-gray-900',
                                                                    'relative cursor-default select-none py-2 pl-3 pr-9',
                                                                )
                                                            }
                                                            value={
                                                                question_status
                                                            }
                                                        >
                                                            {({
                                                                selected,
                                                                active,
                                                            }) => (
                                                                <>
                                                                    <div className="flex items-center">
                                                                        <span
                                                                            className={classNames(
                                                                                selected
                                                                                    ? 'font-semibold'
                                                                                    : 'font-normal',
                                                                                'ml-3 block truncate',
                                                                            )}
                                                                        >
                                                                            {
                                                                                question_status
                                                                            }
                                                                        </span>
                                                                    </div>

                                                                    {selected ? (
                                                                        <span
                                                                            className={classNames(
                                                                                active
                                                                                    ? 'text-white'
                                                                                    : 'text-indigo-600',
                                                                                'absolute inset-y-0 right-0 flex items-center pr-4',
                                                                            )}
                                                                        ></span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    ),
                                                )}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Listbox>
                    </div>
                </div>
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
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
                                            Проголосовать
                                        </th>

                                        {hasOwnQuestions && (
                                            <th
                                                scope="col"
                                                className="relative px-6 py-3"
                                            >
                                                Редкатировать свой вопрос
                                            </th>
                                        )}

                                        <th
                                            scope="col"
                                            className="relative px-6 py-3"
                                        >
                                            Просмотр
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {searchResultsQuestions.map(
                                        (question, index) => (
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
                                                        {question.author ==
                                                            authUserId && (
                                                            <span className="star">
                                                                &#9733;
                                                            </span>
                                                        )}{' '}
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
                                                                    question
                                                                        .poll_id
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
                                                </td>
                                                <td className="whitespace-wrap text-wrap px-6 py-4 text-sm font-medium text-gray-900">
                                                    {
                                                        cnt_files_in_question[
                                                            question.id
                                                        ]
                                                    }
                                                </td>
                                                <td className="whitespace-wrap text-wrap px-6 py-4 text-sm font-medium text-gray-900">
                                                    {isAuthUserVote[
                                                        question.id
                                                    ] && (
                                                        <p>
                                                            Вы уже проголосовали
                                                        </p>
                                                    )}
                                                    {!isAuthUserVote[
                                                        question.id
                                                    ] && (
                                                        <a
                                                            href={`/polls/${question.poll_id}/display/public`}
                                                            className={`text-indigo-600 hover:text-indigo-900`}
                                                        >
                                                            Голосовать
                                                        </a>
                                                    )}
                                                </td>
                                                <td className="whitespace-wrap text-wrap px-6 py-4 text-sm font-medium text-gray-900">
                                                    {question.author ==
                                                        authUserId &&
                                                        question.is_editing ==
                                                            1 && (
                                                            <a
                                                                href={`${
                                                                    !itemsPollFinishedHash[
                                                                        question
                                                                            .poll_id
                                                                    ]
                                                                        ? '/polls/' +
                                                                          question.poll_id +
                                                                          '/questions/' +
                                                                          question.id +
                                                                          ''
                                                                        : '#'
                                                                }`}
                                                                className={`${
                                                                    itemsPollFinishedHash[
                                                                        question
                                                                            .poll_id
                                                                    ]
                                                                        ? 'disabled'
                                                                        : 'text-indigo-600 hover:text-indigo-900'
                                                                }`}
                                                            >
                                                                Изменить вопрос
                                                            </a>
                                                        )}
                                                    {!question.is_editing &&
                                                        question.author ==
                                                            authUserId && (
                                                            <form
                                                                method="POST"
                                                                action={`/question_suggested/${question.id}/delete/`}
                                                                id="formId"
                                                            >
                                                                <input
                                                                    type="hidden"
                                                                    name="_token"
                                                                    value={
                                                                        csrf_token
                                                                    }
                                                                />
                                                                <a
                                                                    href="#"
                                                                    className="text-indigo-600 hover:text-indigo-900"
                                                                >
                                                                    <button type="submit">
                                                                        Удалить
                                                                        вопрос
                                                                    </button>
                                                                </a>
                                                            </form>
                                                        )}
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
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col xl:hidden ">
                <div className="flex flex-col-reverse">
                    <div className="relative w-80 px-4 py-3">
                        <input
                            type="search"
                            className="focus:shadow-outline w-5/6 appearance-none border px-3 py-2 text-gray-500 shadow focus:outline-none"
                            id="search"
                            placeholder="Поиск"
                            name="search"
                            autoFocus
                            value={searchTerm}
                            onChange={handleChangeQuestionsFilter}
                        />
                        <button
                            type="submit"
                            className="y-2 absolute inset-y-3 right-0 flex h-4/6 w-1/6 items-center bg-indigo-600 px-3 text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
                    <div className="relative w-80 px-8 py-3">
                        <Listbox value={selected} onChange={setSelected}>
                            {({ open }) => (
                                <>
                                    {/*<Listbox.Label className="block text-sm font-medium text-gray-700">Выберете компанию</Listbox.Label>*/}
                                    <div className="relative mt-1">
                                        <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                            <span className="flex items-center">
                                                <span className="ml-3 block truncate">
                                                    {selected}
                                                </span>
                                            </span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2"></span>
                                        </Listbox.Button>

                                        <Transition
                                            show={open}
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {[
                                                    'Все предложенные вопросы',
                                                    'Мои вопросы',
                                                    'Принятые к рассмортрению',
                                                ].map(
                                                    (
                                                        question_status,
                                                        index,
                                                    ) => (
                                                        <Listbox.Option
                                                            key={index}
                                                            className={({
                                                                active,
                                                            }) =>
                                                                classNames(
                                                                    active
                                                                        ? 'bg-indigo-600 text-white'
                                                                        : 'text-gray-900',
                                                                    'relative cursor-default select-none py-2 pl-3 pr-9',
                                                                )
                                                            }
                                                            value={
                                                                question_status
                                                            }
                                                        >
                                                            {({
                                                                selected,
                                                                active,
                                                            }) => (
                                                                <>
                                                                    <div className="flex items-center">
                                                                        <span
                                                                            className={classNames(
                                                                                selected
                                                                                    ? 'font-semibold'
                                                                                    : 'font-normal',
                                                                                'ml-3 block truncate',
                                                                            )}
                                                                        >
                                                                            {
                                                                                question_status
                                                                            }
                                                                        </span>
                                                                    </div>

                                                                    {selected ? (
                                                                        <span
                                                                            className={classNames(
                                                                                active
                                                                                    ? 'text-white'
                                                                                    : 'text-indigo-600',
                                                                                'absolute inset-y-0 right-0 flex items-center pr-4',
                                                                            )}
                                                                        ></span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    ),
                                                )}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Listbox>
                    </div>
                </div>
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
                    <div className="min-w-full py-2 align-middle sm:px-1 lg:px-8">
                        <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                            <table className="flex min-w-full flex-col divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="whitespace-wrap text-wrap px-1 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                        >
                                            Список вопросов
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResultsQuestions.map(
                                        (question, index) => (
                                            <tr
                                                className="flex flex-col border-b border-gray-400 bg-gray-100 bg-white"
                                                key={index}
                                            >
                                                <td colSpan="3">
                                                    <div className="whitespace-wrap text-wrap px-6 py-4 text-left text-sm text-gray-900">
                                                        <div className="inline-flex">
                                                            {question.author ==
                                                                authUserId && (
                                                                <span className="star">
                                                                    &#9733;
                                                                </span>
                                                            )}{' '}
                                                            {index + 1}.&#160;
                                                            <Highlighter
                                                                highlightClassName="Highlight"
                                                                searchWords={[
                                                                    searchTerm,
                                                                ]}
                                                                autoEscape={
                                                                    true
                                                                }
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
                                                                    question
                                                                        .author
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
                                                    <div className="whitespace-wrap text-wrap bg-gray-200 px-6 py-4 text-left text-sm font-medium">
                                                        <a
                                                            href={`/polls/${question.poll_id}/display/public`}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Голосовать
                                                        </a>
                                                    </div>
                                                    <div className="whitespace-wrap text-wrap px-6 py-4 text-left text-sm font-medium text-green-600">
                                                        <a
                                                            href={`/polls/view/question/${question.id}`}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Результаты
                                                            голосования
                                                        </a>
                                                    </div>
                                                    {((question.author ==
                                                        authUserId &&
                                                        question.is_editing ==
                                                            1) ||
                                                        (!question.is_editing &&
                                                            question.author ==
                                                                authUserId)) && (
                                                        <div className="whitespace-wrap text-wrap bg-gray-200 px-6 py-4 text-left text-sm font-medium text-green-600">
                                                            {question.author ==
                                                                authUserId &&
                                                                question.is_editing ==
                                                                    1 && (
                                                                    <a
                                                                        href={`${
                                                                            !itemsPollFinishedHash[
                                                                                question
                                                                                    .poll_id
                                                                            ]
                                                                                ? '/polls/' +
                                                                                  question.poll_id +
                                                                                  '/questions/' +
                                                                                  question.id +
                                                                                  ''
                                                                                : '#'
                                                                        }`}
                                                                        className={`${
                                                                            itemsPollFinishedHash[
                                                                                question
                                                                                    .poll_id
                                                                            ]
                                                                                ? 'disabled'
                                                                                : 'text-indigo-600 hover:text-indigo-900'
                                                                        }`}
                                                                    >
                                                                        Изменить
                                                                        вопрос
                                                                    </a>
                                                                )}
                                                            {!question.is_editing &&
                                                                question.author ==
                                                                    authUserId && (
                                                                    <form
                                                                        method="POST"
                                                                        action={`/question_suggested/${question.id}/delete/`}
                                                                        id="formId"
                                                                    >
                                                                        <input
                                                                            type="hidden"
                                                                            name="_token"
                                                                            value={
                                                                                csrf_token
                                                                            }
                                                                        />
                                                                        <a
                                                                            href="#"
                                                                            className="text-indigo-600 hover:text-indigo-900"
                                                                        >
                                                                            <button type="submit">
                                                                                Удалить
                                                                                вопрос
                                                                            </button>
                                                                        </a>
                                                                    </form>
                                                                )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

render(<SuggestedQuestions />, document.getElementById('suggested_questions'));
