import React, { Component } from 'react';
import { EditorState} from 'draft-js';
import { convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const { question } = window.TSN || {};

class ViewQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editorAllStateText: Array.from(question['text'])[0] == '{' ? EditorState.createWithContent(convertFromRaw(JSON.parse(question['text']))) : EditorState.createWithText((question['text']))
        }
    }

    render() {
        //console.log(poll);
        return (
            <>
                <Editor
                    name={`question_text_${question.id}`}
                    id={`question_text_${question.id}`}
                    defaultEditorState={this.state.editorAllStateText}
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
            </>
        );
    }
}

export default ViewQuestion;