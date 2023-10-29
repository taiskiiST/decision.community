import React, { Component } from 'react';
import { EditorState} from 'draft-js';
import { convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const { poll_full, cnt_files_in_question, csrf_token, questions, is_admin, poll_finished} = window.TSN || {};

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
class EditorPreviewMobile extends React.Component {
    constructor(props) {
        super(props);
        const editorStateText = questions.map ( (question) => {
            if ( Array.from(question['text'])[0] == '{' ){
                return EditorState.createWithContent(convertFromRaw(JSON.parse(question['text'])));
            }else{
                return EditorState.createWithText((question['text']));
            }
        });

        this.state = {
            editorAllStateText : editorStateText
        }
    }
    render() {
        //console.log(poll);
        return (
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 flex flex-col">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col"
                                className="px-1 py-3 text-left text-xs whitespace-wrap text-wrap font-medium text-gray-500 uppercase tracking-wider">
                                {poll_full.name}
                            </th>
                            {poll_finished && <th scope="col" className="relative px-1 py-3">
                                <span
                                    className="text-green-600">Голосование окончено {poll_full.finished}</span>
                            </th>}
                            { is_admin && !poll_finished && <th scope="col" className="relative px-1 py-3">
                                <form method="POST" action={`/polls/${poll_full.id}/end/`}>
                                    <input type="hidden" name="_token" value={csrf_token} />
                                    <a href={`/polls/${poll_full.id}/end/`}
                                       onClick={onHandelClickPollFinish}
                                       className="text-green-600 whitespace-wrap text-wrap hover:text-green-900">
                                        Окончить голосование
                                    </a>
                                </form>
                            </th>}
                            { is_admin && poll_finished && <th scope="col" className="relative px-1 py-3">
                                <form method="POST" action={`/polls/${poll_full.id}/end/`}>
                                    <input type="hidden" name="_token" value={csrf_token} />
                                    <a href={`/polls/${poll_full.id}/end/`}
                                       onClick={onHandelClickPollStart}
                                       className="text-red-600 whitespace-wrap text-wrap hover:text-red-900">
                                        Возобновить голосование
                                    </a>
                                </form>
                            </th>}
                        </tr>
                        </thead>
                        <tbody>
                {questions.map( (question, index) => (
                    <tr className="bg-white bg-gray-100 border-b border-gray-400 flex flex-col" key={index}>
                        <td colSpan="3">
                            <div className="px-6 py-4 whitespace-wrap text-sm text-gray-900 text-left text-wrap">
                                {index + 1}. <Editor
                                name={`question_text_${index}`}
                                id={`question_text_${index}`}
                                defaultEditorState={this.state.editorAllStateText[index]}
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
                                {`${question.public && is_admin ? ' (ПУБЛИЧНЫЙ!)' : ''}`}
                            </div>
                            <div
                                className="px-6 py-4 whitespace-wrap text-wrap text-left text-sm font-medium text-green-600 bg-gray-200">
                                Количество файлов - {cnt_files_in_question[question.id]}
                            </div>
                            {is_admin && <div><div class="px-6 py-4 whitespace-wrap text-wrap text-right text-sm font-medium">
                                    <a href={`${poll_finished ? '#' : `/polls/${poll_full.id}/questions/${question.id}/`  }`} key={index}
                                                    className={`${poll_finished ? 'disabled' : 'text-indigo-600 hover:text-indigo-900'}`} key={index} >
                                        Изменить вопрос</a>
                                </div>
                                <div className="px-6 py-4 whitespace-wrap text-wrap text-left text-sm font-medium text-green-600 bg-gray-200">
                                    <a href={`/polls/view/question/${question.id}/`}
                                        className="text-indigo-600 hover:text-indigo-900">Просмотр</a>
                                </div>
                            </div>
                            }
                            {!is_admin && <div className="px-6 py-4 whitespace-wrap text-wrap text-left text-sm font-medium text-green-600">
                                <a href={`/polls/view/question/${question.id}/`}
                                   className="text-indigo-600 hover:text-indigo-900">Просмотр</a>
                            </div>}
                            <div className={`${is_admin ? 'px-6 py-4 whitespace-wrap text-wrap text-right text-sm font-medium text-green-600' 
                                                        : `px-6 py-4 whitespace-wrap text-wrap text-right text-sm font-medium text-green-600 bg-gray-200`  }`}>
                                {is_admin && <form method="POST" action={`/polls/${poll_full.id}/question/${question.id}/public/`}>
                                    <input type="hidden" name="_token" value={csrf_token} />
                                    <input name="public_question" value={question.id} type="hidden"/>
                                    <a href={`/polls/${poll_full.id}/question/${question.id}/public/`}
                                       onClick={onHandelClickQuestionPublic}
                                       className="text-indigo-600 hover:text-indigo-900" >
                                        {`${question.public ? 'Да' : 'Нет'}`}
                                    </a>
                                </form>}
                                { !is_admin && question.public ? 'Да' : ''}
                            </div>
                            {is_admin && <div className={`${is_admin ? 'px-6 py-4 whitespace-wrap text-wrap text-left text-sm font-medium text-green-600 bg-gray-200'
                                : `px-6 py-4 whitespace-wrap text-wrap text-left text-sm font-medium text-green-600`  }` }>
                                {!poll_finished && <form method="POST" action={`/polls/${poll_full.id}/question/${question.id}/delete/`}>
                                    <input type="hidden" name="_token" value={csrf_token} />
                                    <input name="del_question" value={question.id} type="hidden"/>
                                    <a href={`/polls/${poll_full.id}/question/${question.id}/delete/`}
                                       onClick={onHandelClickQuestionDelete}
                                       className="text-indigo-600 hover:text-indigo-900">
                                        Удалить вопрос
                                    </a>
                                </form>
                                }
                                { poll_finished && <a href="#" className="disabled">
                                    Удалить вопрос
                                </a>
                                }
                            </div>
                            }

                        </td>

                    </tr>
                ) )}
                </tbody>
                </table>
            </div>
        );
    }
}

export default EditorPreviewMobile;
