import React, { Component } from 'react';
import { EditorState} from 'draft-js';
import { convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const { poll_full, cnt_files_in_question, csrf_token, questions, is_admin, users, question_hash_speakers, question_hash_files} = window.TSN || {};
// console.log(questions);
// console.log(is_admin);
// console.log(users);
class DisplayQuestionEditor extends React.Component {
    constructor(props) {
        super(props);

        const editorStateText = questions.map ( (question) => {
            if ( Array.from(question['text'])[0] == '{' ){
                return EditorState.createWithContent(convertFromRaw(JSON.parse(question['text'])));
            }else{
                return EditorState.createWithText((question['text']));
            }
        });
        //console.log(editorStateText);

        this.state = {
            editorAllStateText : editorStateText
        }
        //console.log(this.state.editorAllStateText[0]);
    }

    render() {

        return (
            <div>
                {questions.map ( (question, index) => {
                    if (is_admin) {
                        return (<div className={`mt-10 sm:mt-0 ${index == 0 ? '' : 'hidden'}`}
                                     id={`speaker_question_${question.id}`} key={index}>
                                <div className="p-3 md:col-span-2">
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
                                        <div>
                                            <div>Выступающие</div>
                                            <div>
                                                <select name={`speaker${question.id}[]`}
                                                        className="mt-1 block w-full py-1 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        required multiple
                                                        defaultValue={users.map ( (user) => {
                                                            if (question_hash_speakers [question.id].length > 0) {
                                                                if (~question_hash_speakers [question.id][0].users_speaker_id.indexOf(user.id)) {
                                                                    return user.id
                                                                }
                                                            }
                                                        } )}
                                                        id={`select_speaker_question_${question.id}`}
                                                >
                                                    {users.map ( (user) => {
                                                        return <option value={user.id} key={user.id}>{user.name}</option>
                                                    } )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="bg-white shadow overflow-hidden sm:rounded-lg {!! $loop->first ? '' : 'hidden' !!}" id="question_{!! $question->id !!}">
                                        <div className="px-4 py-5 sm:px-6">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                {index + 1})
                                                <Editor
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
                                            </h3>
                                        </div>

                                    </div>

                                    <div className="px-4 py-5 sm:px-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            {users.map ( (user) => {
                                                return <option value={user.id} key={user.id}>{user.name}</option>
                                            } )}

                                            {question_hash_files[question.id].map( (file, index) => (
                                                <div key={question.id + index}>
                                                    <p className={`${index !== 0 ? 'pt-10' : ''}`} >Описание: {file.text_for_file}</p>
                                                    {~file.path_to_file.indexOf('.pdf') &&
                                                        <p>PDF</p>
                                                    }
                                                    { ( ~file.path_to_file.indexOf('.jpg') || ~file.path_to_file.indexOf('.png') ) &&
                                                       <img src={`/storage/${file.path_to_file}`} />
                                                    }
                                                    { (!~file.path_to_file.indexOf('.jpg') && !~file.path_to_file.indexOf('.png') && !~file.path_to_file.indexOf('.pdf') ) &&
                                                        <a href={file.path_to_file} target="_blank"
                                                           className="bg-violet-500 hover:bg-violet-400 active:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300"
                                                           >
                                                            Скачать
                                                        </a>
                                                    }
                                                </div>
                                                )
                                            )}

                                        </h3>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
        );
    }
}

export default DisplayQuestionEditor;