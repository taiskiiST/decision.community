import React, { Component } from 'react';
import { EditorState } from 'draft-js';
import { convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const {
    poll_full,
    cnt_files_in_question,
    csrf_token,
    questions,
    is_admin,
    poll_finished,
} = window.TSN || {};

function onHandelClickPollFinish(event) {
    event.preventDefault();
    event.target.parentElement.submit();
}

function onHandelClickPollStart(event) {
    event.preventDefault();
    event.target.parentElement.submit();
}
function onHandelClickQuestionPublic(event) {
    event.preventDefault();
    event.target.parentElement.submit();
}

function onHandelClickQuestionDelete(event) {
    event.preventDefault();
    event.target.parentElement.submit();
}
class EditorPreview extends React.Component {
    constructor(props) {
        super(props);
        const editorStateText = questions.map((question) => {
            if (Array.from(question['text'])[0] == '{') {
                return EditorState.createWithContent(
                    convertFromRaw(JSON.parse(question['text'])),
                );
            } else {
                return EditorState.createWithText(question['text']);
            }
        });

        this.state = {
            editorAllStateText: editorStateText,
        };
    }
    render() {
        //console.log(poll);
        return (
            <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 ">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                            >
                                №
                            </th>
                            <th
                                scope="col"
                                className="whitespace-wrap relative px-6 py-3"
                            >
                                {poll_full.name}
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                Количествой файлов
                            </th>
                            {is_admin && (
                                <th scope="col" className="relative px-6 py-3">
                                    Доступен всем
                                </th>
                            )}
                            <th scope="col" className="relative px-6 py-3">
                                Детали
                            </th>
                            {poll_finished && (
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="text-green-600">
                                        Голосование окончено{' '}
                                        {poll_full.finished}
                                    </span>
                                </th>
                            )}
                            {is_admin && !poll_finished && (
                                <th scope="col" className="relative px-6 py-3">
                                    <form
                                        method="POST"
                                        action={`/polls/${poll_full.id}/end/`}
                                    >
                                        <input
                                            type="hidden"
                                            name="_token"
                                            value={csrf_token}
                                        />
                                        <a
                                            href={`/polls/${poll_full.id}/end/`}
                                            onClick={onHandelClickPollFinish}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            Окончить голосование
                                        </a>
                                    </form>
                                </th>
                            )}
                            {is_admin && poll_finished && (
                                <th scope="col" className="relative px-6 py-3">
                                    <form
                                        method="POST"
                                        action={`/polls/${poll_full.id}/end/`}
                                    >
                                        <input
                                            type="hidden"
                                            name="_token"
                                            value={csrf_token}
                                        />
                                        <a
                                            href={`/polls/${poll_full.id}/end/`}
                                            onClick={onHandelClickPollStart}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Возобновить голосование
                                        </a>
                                    </form>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((question, index) => (
                            <tr
                                className={`bg-white ${
                                    index % 2 === 0 ? 'bg-gray-200' : ''
                                }`}
                                key={index}
                            >
                                <td className="whitespace-wrap text-wrap px-6 py-4 text-right text-sm font-medium">
                                    {index + 1}
                                </td>
                                <td className="whitespace-wrap px-6 py-4 text-sm font-medium text-gray-900">
                                    <Editor
                                        name={`question_text_${index}`}
                                        id={`question_text_${index}`}
                                        defaultEditorState={
                                            this.state.editorAllStateText[index]
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
                                </td>
                                <td className="whitespace-wrap text-wrap px-6 py-4 text-sm font-medium text-gray-900">
                                    {cnt_files_in_question[question.id]}
                                </td>
                                <td className="whitespace-wrap text-wrap px-6 py-4 text-sm font-medium text-gray-900">
                                    {is_admin && (
                                        <form
                                            method="POST"
                                            action={`/polls/${poll_full.id}/question/${question.id}/public/`}
                                        >
                                            <input
                                                type="hidden"
                                                name="_token"
                                                value={csrf_token}
                                            />
                                            <input
                                                name="public_question"
                                                value={question.id}
                                                type="hidden"
                                            />
                                            <a
                                                href={`/polls/${poll_full.id}/question/${question.id}/public/`}
                                                onClick={
                                                    onHandelClickQuestionPublic
                                                }
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                {`${
                                                    question.public
                                                        ? 'Да'
                                                        : 'Нет'
                                                }`}
                                            </a>
                                        </form>
                                    )}
                                    {!is_admin && question.public ? 'Да' : ''}
                                </td>
                                <td className="whitespace-wrap text-wrap px-6 py-4 text-sm font-medium text-gray-900">
                                    <a
                                        href={`/polls/view/question/${question.id}/`}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Просмотр
                                    </a>
                                </td>

                                <td className="whitespace-wrap text-wrap px-6 py-4 text-right text-sm font-medium ">
                                    {is_admin && (
                                        <a
                                            href={`${
                                                poll_finished
                                                    ? '#'
                                                    : `/polls/${poll_full.id}/questions/${question.id}/`
                                            }`}
                                            key={index}
                                            className={`${
                                                poll_finished
                                                    ? 'disabled'
                                                    : 'text-indigo-600 hover:text-indigo-900'
                                            }`}
                                            key={index}
                                        >
                                            Изменить вопрос
                                        </a>
                                    )}
                                </td>

                                {is_admin && (
                                    <td className="whitespace-wrap text-wrap px-6 py-4 text-right text-sm font-medium">
                                        {!poll_finished && (
                                            <form
                                                method="POST"
                                                action={`/polls/${poll_full.id}/question/${question.id}/delete/`}
                                            >
                                                <input
                                                    type="hidden"
                                                    name="_token"
                                                    value={csrf_token}
                                                />
                                                <input
                                                    name="del_question"
                                                    value={question.id}
                                                    type="hidden"
                                                />
                                                <a
                                                    href={`/polls/${poll_full.id}/question/${question.id}/delete/`}
                                                    onClick={
                                                        onHandelClickQuestionDelete
                                                    }
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Удалить вопрос
                                                </a>
                                            </form>
                                        )}
                                        {poll_finished && (
                                            <a href="#" className="disabled">
                                                Удалить вопрос
                                            </a>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default EditorPreview;
