import React, {Component, useState} from 'react';
import { EditorState} from 'draft-js';
import { convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const { questions, poll_report_done, answers, countVotedForAnswer, poll, countByQuestion, middleAnswerThatAllUsersMarkOnReport, questionMaxCountVotes } = window.TSN || {};

const ViewQuestionMobile = () => {
    const editorStateText = questions.map ( (question) => {
        if ( Array.from(question['text'])[0] == '{' ){
            return EditorState.createWithContent(convertFromRaw(JSON.parse(question['text'])));
        }else{
            return EditorState.createWithText((question['text']));
        }
    });
    const [editorAllStateText, setEditor] = useState(editorStateText);

    return (
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                {questions.map( (question, index) => {
                    if(!poll_report_done){
                    return (
                        <div key={index}>
                            <label className="block text-lg text-black font-semibold mt-6 whitespace-wrap text-wrap">
                                <a href={`/polls/view/question/${question.id}/`}
                                   className="text-indigo-600 hover:text-indigo-900">
                                    {index + 1}. <Editor
                                    name={`question_text_${index}`}
                                    id={`question_text_${index}`}
                                    defaultEditorState={editorAllStateText[index]}
                                    toolbarClassName="rdw-storybook-toolbar"
                                    wrapperClassName="rdw-storybook-wrapper"
                                    editorClassName="rdw-storybook-editor"
                                    toolbarStyle={{
                                        display: "none"
                                    }}
                                    editorStyle={{
                                        disabled: "true"
                                    }}
                                />
                                </a>
                            </label>
                            <table className="min-w-full divide-y divide-gray-200 border-b-2 border-gray-400 ">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col"
                                        className="px-1 py-3 text-left text-xs font-medium text-gray-500 whitespace-wrap tracking-wider text-wrap">
                                        Вариант ответа
                                    </th>
                                    <th scope="col" className="px-1 py-3 text-left text-xs font-medium text-gray-500 whitespace-wrap tracking-wider text-wrap">
                                        Количество голосов
                                    </th>
                                    <th scope="col" className="px-1 py-3 text-left text-xs font-medium text-gray-500 whitespace-wrap tracking-wider text-wrap">
                                        В процентах
                                    </th>
                                </tr>
                                </thead>

                                <tbody>
                                {answers[question.id].map( (answer, index) => {
                                    return (
                                        <tr className="bg-white bg-gray-100 border-b border-gray-400"
                                            key={index}>
                                            <td>
                                                <div className={`px-1 py-4 whitespace-wrap text-sm font-bold text-gray-900 text-center ${countVotedForAnswer[answer.id] == questionMaxCountVotes[question.id] ? 'font-bold' : ''}`} >
                                                    {answer.text}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={`px-1 py-4 whitespace-nowrap text-center text-sm font-medium bg-gray-200  
                                                    ${countVotedForAnswer[answer.id] == questionMaxCountVotes[question.id]
                                                    ? 'font-bold' : ''}`} >
                                                {countVotedForAnswer[answer.id]}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={`px-1 py-4 whitespace-nowrap text-center text-sm font-medium bg-gray-200
                                                    ${countVotedForAnswer[answer.id] == questionMaxCountVotes[question.id]
                                                    ? 'font-bold' : ''}`} >
                                                {poll.potential_voters_number
                                                ? ((countVotedForAnswer[answer.id] / poll.potential_voters_number)*100).toFixed(2)
                                                : 0}
                                                </div>
                                            </td>
                                        </tr>)
                                    }
                                )}

                                <tr className="bg-white bg-gray-100 border-b border-gray-400" >
                                    <td>
                                        <div className="px-1 py-4 whitespace-wrap text-sm font-bold text-gray-900 text-center">
                                        ИТОГО
                                        </div>
                                    </td>

                                    <td>
                                        <div className="px-1 py-4 whitespace-nowrap font-bold text-center text-sm font-medium bg-gray-200">
                                        {countByQuestion[question.id]} из {poll.potential_voters_number}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="px-1 py-4 whitespace-nowrap font-bold text-center text-sm font-medium bg-gray-200">
                                        {countByQuestion[question.id] && poll.potential_voters_number
                                            ? ((countByQuestion[question.id] / poll.potential_voters_number)*100).toFixed(2) + '%'
                                            : '0 %'
                                        }
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div> )
                        }else {
                        return (
                        <div className="text-center" key={index}>
                            <div className="text-left">
                                <label className="block text-lg text-black font-semibold mt-6 whitespace-wrap text-wrap">
                                    <a
                                        href={`/polls/view/question/${question.id}/`}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        {index + 1}.
                                        <Editor
                                            name={`question_text_${index}`}
                                            id={`question_text_${index}`}
                                            defaultEditorState={editorAllStateText[index]}
                                            toolbarClassName="rdw-storybook-toolbar"
                                            wrapperClassName="rdw-storybook-wrapper"
                                            editorClassName="rdw-storybook-editor"
                                            toolbarStyle={{
                                                display: "none"
                                            }}
                                            editorStyle={{
                                                disabled: "true"
                                            }}
                                        />
                                    </a>
                                </label>
                            </div>
                            <div id="id_33" className="flex flex-nowrap inline-block overflow-visible justify-center">
                                {["1", "2", "3", "4", "5"].map( (index) => {
                                        return (
                                        <div className="w-1/9 text-7xl" key={index}>
                                            <button type="button"
                                                    className={`${index <= middleAnswerThatAllUsersMarkOnReport[question.id] ? 'on' : 'off'} 
                                                    index_${index}
                                                    middelAnswerQuestion_${middleAnswerThatAllUsersMarkOnReport[question.id]}
                                                    `}
                                            >
                                                <span className="">★</span>
                                            </button>
                                        </div>
                                        )
                                    })
                                }
                            </div>
                            <label className="italic"> Средняя оценка
                                работы <b>{middleAnswerThatAllUsersMarkOnReport[question.id]}</b>
                                {middleAnswerThatAllUsersMarkOnReport[question.id] == 1
                                    ? ' балл'
                                    : middleAnswerThatAllUsersMarkOnReport[question.id] == 5
                                        ? ' баллов'
                                        : ' балла'
                                }
                            </label>
                            <br/>
                            <label
                                className="italic"> Проголосовано <b>{countByQuestion[question.id]}</b> из <b>{poll.potential_voters_number}</b></label>
                        </div>)
                    }
                } )}

            </div>
        </div>
    );
}

export default ViewQuestionMobile;