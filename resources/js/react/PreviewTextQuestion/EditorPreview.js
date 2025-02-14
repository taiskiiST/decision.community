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
                                className="whitespace-wrap relative px-6 py-3 text-left"
                            >
                                {poll_full.name}
                            </th>
                            <th scope="col" className="relative px-6 py-3 text-left">
                                Количествой файлов
                            </th>
                            {is_admin && (
                                <th scope="col" className="relative px-6 py-3 text-left">
                                    Доступен всем
                                </th>
                            )}
                            {!is_admin && (
                                <th scope="col" className="relative px-6 py-3">

                                </th>
                            )}
                            <th scope="col" className="relative px-6 py-3 text-left">
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
