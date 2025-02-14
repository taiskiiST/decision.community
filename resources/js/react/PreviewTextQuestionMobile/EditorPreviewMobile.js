import React from 'react';
import { EditorState } from 'draft-js';
import { convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { client } from '../../shared/axios';
import { toast } from 'react-toastify';

const {
    poll_full,
    cnt_files_in_question,
    csrf_token,
    questions,
    is_admin,
    poll_finished,
    poll_start
} = window.TSN || {};

class EditorPreviewMobile extends React.Component {
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

    async togglePollState(e) {
        e.preventDefault();

        try {
            await client.post(`/polls/${poll_full.id}/end`);

            toast.success('Статус голосования успешно изменён.');

            window.location.reload();
        } catch (e) {
            toast.error('Ошибка изменения статуса голосования.');
        }
    }

    render() {
        //console.log(poll);
        return (
            <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                <table className="flex min-w-full flex-col divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="whitespace-wrap text-wrap px-1 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                            >
                                {poll_full.name}
                            </th>
                            {poll_finished && (
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="text-green-600">
                                        Голосование окончено{' '}
                                        {poll_full.finished}
                                    </span>
                                </th>
                            )}
                            {!poll_finished && poll_start && (
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="text-green-600">
                                        Голосование началось
                                    </span>
                                </th>
                            )}
                            {!poll_finished && !poll_start && (
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="text-green-600">
                                        Голосование ещё не началось
                                    </span>
                                </th>
                            )}
                            {is_admin && (
                                <th scope="col" className="relative px-6 py-3">
                                    <a href={`/polls/${poll_full.id}/requisites`}
                                       className="inline-flex items-center px-4 py-2 border
                                       border-transparent text-sm font-medium rounded-md shadow-sm
                                       text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none
                                       focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 submit-button">
                                        Настройки опроса
                                    </a>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((question, index) => (
                            <tr
                                className="flex flex-col border-b border-gray-400 bg-gray-100 bg-white"
                                key={index}
                            >
                                <td colSpan="3">
                                    <div className="whitespace-wrap text-wrap px-6 py-4 text-left text-sm text-gray-900">
                                        {index + 1}.
                                        <Editor
                                            name={`question_text_${index}`}
                                            id={`question_text_${index}`}
                                            defaultEditorState={
                                                this.state.editorAllStateText[
                                                    index
                                                ]
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
                                        {`${
                                            question.public && is_admin
                                                ? ' (ПУБЛИЧНЫЙ!)'
                                                : ''
                                        }`}
                                    </div>
                                    <div className="whitespace-wrap text-wrap bg-gray-200 px-6 py-4 text-left text-sm font-medium text-green-600">
                                        Количество файлов -{' '}
                                        {cnt_files_in_question[question.id]}
                                    </div>
                                    {is_admin && (
                                        <div>
                                            <div className="whitespace-wrap text-wrap px-6 py-4 text-right text-sm font-medium">
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
                                            </div>
                                            <div className="whitespace-wrap text-wrap bg-gray-200 px-6 py-4 text-left text-sm font-medium text-green-600">
                                                <a
                                                    href={`/polls/view/question/${question.id}/`}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Просмотр
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                    {!is_admin && (
                                        <div className="whitespace-wrap text-wrap px-6 py-4 text-left text-sm font-medium text-green-600">
                                            <a
                                                href={`/polls/view/question/${question.id}/`}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Просмотр
                                            </a>
                                        </div>
                                    )}
                                    <div
                                        className={`${
                                            is_admin
                                                ? 'whitespace-wrap text-wrap px-6 py-4 text-right text-sm font-medium text-green-600'
                                                : `whitespace-wrap text-wrap bg-gray-200 px-6 py-4 text-right text-sm font-medium text-green-600`
                                        }`}
                                    >
                                        {is_admin && (
                                            <form
                                                method="POST"
                                                action={`/polls/${poll_full.id}/question/${question.id}/public`}
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
                                                <button
                                                    type="submit"
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    {`${
                                                        question.public
                                                            ? 'Да'
                                                            : 'Нет'
                                                    }`}
                                                </button>
                                            </form>
                                        )}
                                        {!is_admin && question.public
                                            ? 'Да'
                                            : ''}
                                    </div>
                                    {is_admin && (
                                        <div
                                            className={`${
                                                is_admin
                                                    ? 'whitespace-wrap text-wrap bg-gray-200 px-6 py-4 text-left text-sm font-medium text-green-600'
                                                    : `whitespace-wrap text-wrap px-6 py-4 text-left text-sm font-medium text-green-600`
                                            }`}
                                        >
                                            {!poll_finished && (
                                                <form
                                                    method="POST"
                                                    action={`/polls/${poll_full.id}/question/${question.id}/delete`}
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
                                                    <button
                                                        type="submit"
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Удалить вопрос
                                                    </button>
                                                </form>
                                            )}
                                            {poll_finished && (
                                                <a
                                                    href="#"
                                                    className="disabled"
                                                >
                                                    Удалить вопрос
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default EditorPreviewMobile;
