import React, { Component, useState } from 'react';
import { EditorState } from 'draft-js';
import { convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const {
    questions,
    poll_report_done,
    answers,
    countVotedForAnswer,
    poll,
    countByQuestion,
    middleAnswerThatAllUsersMarkOnReport,
    questionMaxCountVotes,
    countWeightsVotedForAnswer,
    countWeightsByQuestion
} = window.TSN || {};

const ViewQuestion = () => {
    const editorStateText = questions.map((question) => {
        if (Array.from(question['text'])[0] == '{') {
            return EditorState.createWithContent(
                convertFromRaw(JSON.parse(question['text'])),
            );
        } else {
            return EditorState.createWithText(question['text']);
        }
    });
    const [editorAllStateText, setEditor] = useState(editorStateText);

    return (
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                {questions.map((question, index) => {
                    if (!poll_report_done) {
                        return (
                            <div key={index}>
                                <label className="whitespace-wrap mt-10 block text-lg font-semibold text-black">
                                    <a
                                        href={`/polls/view/question/${question.id}/`}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        {index + 1}.
                                        <Editor
                                            name={`question_text_${index}`}
                                            id={`question_text_${index}`}
                                            defaultEditorState={
                                                editorAllStateText[index]
                                            }
                                            toolbarClassName="rdw-storybook-toolbar"
                                            wrapperClassName="rdw-storybook-wrapper"
                                            editorClassName="rdw-storybook-editor"
                                            toolbarStyle={{
                                                display: 'none',
                                            }}
                                            readOnly
                                            toolbar={{
                                                link: {
                                                    showOpenOptionOnHover: false,
                                                },
                                            }}
                                        />
                                    </a>
                                </label>
                                <table className="min-w-full divide-y divide-gray-200 border-b-2 border-gray-400 ">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                            >
                                                Вариант ответа
                                            </th>
                                            <th
                                                scope="col"
                                                className="relative px-6 py-3 text-center"
                                            >
                                                Количество голосов
                                            </th>
                                            <th
                                                scope="col"
                                                className="relative px-6 py-3 text-center"
                                            >
                                                В процентах
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {answers[question.id].map(
                                            (answer, index) => {
                                                return (
                                                    <tr
                                                        className={`${
                                                            index % 2 != 0
                                                                ? 'bg-white'
                                                                : 'bg-gray-200'
                                                        }`}
                                                        key={index}
                                                    >
                                                        <td
                                                            className={`whitespace-wrap px-6 py-4 text-left text-gray-900 ${
                                                                countVotedForAnswer[
                                                                    answer.id
                                                                ] ==
                                                                questionMaxCountVotes[
                                                                    question.id
                                                                ]
                                                                    ? 'font-bold'
                                                                    : 'font-medium'
                                                            }`}
                                                        >
                                                            {answer.text}
                                                        </td>
                                                        <td
                                                            className={`whitespace-wrap px-6 py-4 text-center text-gray-900 
                                                    ${
                                                        countVotedForAnswer[
                                                            answer.id
                                                        ] ==
                                                        questionMaxCountVotes[
                                                            question.id
                                                        ]
                                                            ? 'font-bold'
                                                            : 'font-medium'
                                                    }`}
                                                        >

                                                            {countWeightsVotedForAnswer[answer.id]
                                                                ?(
                                                                    countWeightsVotedForAnswer[
                                                                            answer
                                                                                .id
                                                                            ]
                                                                ).toFixed(2)
                                                                : 0}
                                                        </td>
                                                        <td
                                                            className={`whitespace-wrap px-6 py-4 text-center text-gray-900 
                                                    ${
                                                        countVotedForAnswer[
                                                            answer.id
                                                        ] ==
                                                        questionMaxCountVotes[
                                                            question.id
                                                        ]
                                                            ? 'font-bold'
                                                            : 'font-medium'
                                                    }`}
                                                        >
                                                            {poll.potential_voters_number
                                                                ? (
                                                                      (countWeightsVotedForAnswer[
                                                                          answer
                                                                              .id
                                                                      ] /
                                                                          poll.potential_voters_number) *
                                                                      100
                                                                  ).toFixed(2)
                                                                : 0}
                                                        </td>
                                                    </tr>
                                                );
                                            },
                                        )}

                                        <tr
                                            className={`${
                                                index % 2 != 0
                                                    ? 'bg-white'
                                                    : 'bg-gray-200'
                                            }`}
                                        >
                                            <td className="whitespace-wrap px-6 py-4 text-left font-bold text-gray-900">
                                                ИТОГО
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-bold">
                                                {(countWeightsByQuestion[
                                                    question.id
                                                    ]).toFixed(2)
                                                }{' '}
                                                из{' '}
                                                {poll.potential_voters_number}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-bold">
                                                {countWeightsByQuestion[question.id] &&
                                                poll.potential_voters_number
                                                    ? (
                                                          (countWeightsByQuestion[
                                                              question.id
                                                          ] /
                                                              poll.potential_voters_number) *
                                                          100
                                                      ).toFixed(2) + '%'
                                                    : '0 %'}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        );
                    } else {
                        return (
                            <div className="text-center" key={index}>
                                <div className="text-left">
                                    <label className="whitespace-wrap mt-10 block text-lg font-semibold text-black">
                                        <a
                                            href={`/polls/view/question/${question.id}/`}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            {index + 1}.
                                            <Editor
                                                name={`question_text_${index}`}
                                                id={`question_text_${index}`}
                                                defaultEditorState={
                                                    editorAllStateText[index]
                                                }
                                                toolbarClassName="rdw-storybook-toolbar"
                                                wrapperClassName="rdw-storybook-wrapper"
                                                editorClassName="rdw-storybook-editor"
                                                toolbarStyle={{
                                                    display: 'none',
                                                }}
                                                readOnly
                                                toolbar={{
                                                    link: {
                                                        showOpenOptionOnHover: false,
                                                    },
                                                }}
                                            />
                                        </a>
                                    </label>
                                </div>
                                <div
                                    id="id_33"
                                    className="inline-block flex flex-nowrap justify-center overflow-visible"
                                >
                                    {['1', '2', '3', '4', '5'].map((index) => {
                                        return (
                                            <div
                                                className="w-1/9 text-7xl"
                                                key={index}
                                            >
                                                <button
                                                    type="button"
                                                    className={`${
                                                        index <=
                                                        middleAnswerThatAllUsersMarkOnReport[
                                                            question.id
                                                        ]
                                                            ? 'on'
                                                            : 'off'
                                                    } 
                                                    index_${index}
                                                    middelAnswerQuestion_${
                                                        middleAnswerThatAllUsersMarkOnReport[
                                                            question.id
                                                        ]
                                                    }
                                                    `}
                                                >
                                                    <span className="">★</span>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                                <label className="italic">
                                    {' '}
                                    Средняя оценка работы{' '}
                                    <b>
                                        {
                                            middleAnswerThatAllUsersMarkOnReport[
                                                question.id
                                            ]
                                        }
                                    </b>
                                    {middleAnswerThatAllUsersMarkOnReport[
                                        question.id
                                    ] == 1
                                        ? ' балл'
                                        : middleAnswerThatAllUsersMarkOnReport[
                                              question.id
                                          ] == 5
                                        ? ' баллов'
                                        : ' балла'}
                                </label>
                                <br />
                                <label className="italic">
                                    {' '}
                                    Проголосовано{' '}
                                    <b>
                                        {countByQuestion[question.id]}
                                    </b> из{' '}
                                    <b>{poll.potential_voters_number}</b>
                                </label>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default ViewQuestion;
