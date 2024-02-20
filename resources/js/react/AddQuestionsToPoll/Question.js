import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import AddFileToQuestion from './AddFileToQuestion';
import AddAnswerToQuestion from './AddAnswerToQuestion';
import FilePreview from './FilePreview';
import AnswerPreview from './AnswerPreview';
import FormErrors from './FormErrors';
import { toBase64 } from '../../shared/helpers';

const EMPTY_EDITOR_HTML_LENGTH = 8;

const {
    poll,
    count_question,
    current_num_question,
    csrf_token,
    question,
    files,
    answer,
    error,
    isReport,
    isInformationPost,
    isSuggestedQuestion,
} = window.TSN || {};
var ChangeTextFieldFlag = false;
class Question extends React.Component {
    constructor(props) {
        //console.log(isSuggestedQuestion);
        super(props);

        //this.props.clickTextForFile = false;
        this.handleAddingFile = this.handleAddingFile.bind(this);
        this.handleAddingAnswer = this.handleAddingAnswer.bind(this);
        this.handleDeletingFile = this.handleDeletingFile.bind(this);
        this.handleDeletingAnswer = this.handleDeletingAnswer.bind(this);

        //this.handleQuestionTextInput = this.handleQuestionTextInput.bind(this);
        this.handleFileTextInput = this.handleFileTextInput.bind(this);
        this.handleAnswerInput = this.handleAnswerInput.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.handleFileUploadInput = this.handleFileUploadInput.bind(this);

        this.handleQuestionPublic = this.handleQuestionPublic.bind(this);
        this.handleQuestionEditing = this.handleQuestionEditing.bind(this);

        this.onEditorStateChange = this.onEditorStateChange.bind(this);

        this.form = React.createRef();

        if (!question) {
            this.state = {
                fileUploads: [
                    // {guid: 'guid', text: 'File Name', fileUpload: '', isValidText: false, isValidFileSize: false, isValidFileName: false, hideDragAndDrop:'',fileInputRef:''},
                ],
                editorStateText: EditorState.createEmpty(),
                answers: !isReport
                    ? isInformationPost
                        ? []
                        : [
                              // {guid: 'guid', text: 'Answer', isValidText: false}
                              {
                                  answer_id: uuidv4(),
                                  text: 'За',
                                  isValidText: true,
                              },
                              {
                                  answer_id: uuidv4(),
                                  text: 'Против',
                                  isValidText: true,
                              },
                              {
                                  answer_id: uuidv4(),
                                  text: 'Воздержался',
                                  isValidText: true,
                              },
                          ]
                    : [
                          // {guid: 'guid', text: 'Answer', isValidText: false}
                          {
                              answer_id: uuidv4(),
                              text: '1',
                              isValidText: true,
                          },
                          {
                              answer_id: uuidv4(),
                              text: '2',
                              isValidText: true,
                          },
                          {
                              answer_id: uuidv4(),
                              text: '3',
                              isValidText: true,
                          },
                          {
                              answer_id: uuidv4(),
                              text: '4',
                              isValidText: true,
                          },
                          {
                              answer_id: uuidv4(),
                              text: '5',
                              isValidText: true,
                          },
                      ],
                inputTextOfQuestion: {
                    text: '',
                    isValid: false,
                },
                formErrors: {
                    inputTextOfQuestion: '',
                    inputFilesText: '',
                    inputFilesUploadSize: '',
                    inputFilesUploadName: '',
                    inputAnswers: '',
                },
                inputFilesTextIsValid: false,
                newFormErrors: [],
                formValid: false,
                isValidAllTextOfFiles: true,
                isValidAllUploadFiles: true,
                isValidAllAnswers: true,
                isPublic: '',
                isEditing: '',
            };
        } else {
            let files_whith_ref;
            files_whith_ref = files.map((file) => {
                return {
                    ...file,
                    fileInputRef: React.createRef(),
                };
            });
            this.state = {
                fileUploads: files_whith_ref,
                answers: answer,
                inputTextOfQuestion: {
                    text: question['text'],
                    isValid: true,
                },
                formErrors: {
                    inputTextOfQuestion: '',
                    inputFilesText: '',
                    inputFilesUploadSize: !error ? '' : error,
                    inputFilesUploadName: '',
                    inputAnswers: '',
                },
                inputFilesTextIsValid: false,
                newFormErrors: [],
                formValid: false,
                isValidAllTextOfFiles: true,
                isValidAllUploadFiles: true,
                isValidAllAnswers: true,
                isPublic: question['public'] ? 'checked' : '',
                isEditing: question['is_editing'] ? '' : 'checked',
                editorStateText:
                    Array.from(question['text'])[0] == '{'
                        ? EditorState.createWithContent(
                              convertFromRaw(JSON.parse(question['text'])),
                          )
                        : EditorState.createWithText(question['text']),
            };
        }
    }

    submitForm(e) {
        // const errors = this.validateFormNew();
        //
        // if (errors.length > 0) {
        //     alert(`Form is not valid: ${errors.join()}`);
        //
        //     this.setState({ newFormErrors: errors});
        //
        //     e.preventDefault();
        //
        //     return;
        // }
    }

    // handleQuestionTextInput = (e) => {
    //     console.log (e);
    //     const value = e.blocks[0];//.text;
    //     this.setState((oldState) => ({
    //             ...oldState,
    //         inputTextOfQuestion:
    //                 {
    //                     ...oldState.inputTextOfQuestion,
    //                     text: value
    //                 }
    //
    //         }), this.validateFormTextQuestion(value)
    //     )
    // }

    validateFormTextQuestion(html) {
        if (html && html.length > EMPTY_EDITOR_HTML_LENGTH) {
            this.setState(
                (oldState) => ({
                    ...oldState,
                    inputTextOfQuestion: {
                        ...oldState.inputTextOfQuestion,
                        isValid: true,
                    },
                }),
                this.validateForm,
            );
            this.setState(
                (oldState) => ({
                    ...oldState,
                    formErrors: {
                        ...oldState.formErrors,
                        inputTextOfQuestion: '',
                    },
                }),
                this.validateForm,
            );
        } else {
            this.setState(
                (oldState) => ({
                    ...oldState,
                    formErrors: {
                        ...oldState.formErrors,
                        inputTextOfQuestion:
                            'Поле текста вопроса обязательно для заполнения!',
                    },
                }),
                this.validateForm,
            );
            this.setState(
                (oldState) => ({
                    ...oldState,
                    inputTextOfQuestion: {
                        ...oldState.inputTextOfQuestion,
                        isValid: false,
                    },
                }),
                this.validateForm,
            );
        }
    }

    handleFileTextInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        //file_text_for_

        let id = this.getId(2, name);
        //console.log(id['0']);
        let newFile = this.state.fileUploads.map((file) => {
            if (value.length > 0) {
                return file.file_id == id['0']
                    ? {
                          ...file,
                          text: value,
                          isValidText: true,
                      }
                    : file;
            } else {
                return file.file_id == id['0']
                    ? {
                          ...file,
                          text: value,
                          isValidText: false,
                      }
                    : file;
            }
        });
        //console.log(newFile);
        this.setState(
            (oldState) => ({
                ...oldState,
                fileUploads: newFile,
            }),
            this.validateAllInputOfFile,
        );
    };
    validateAllInputOfAnswer() {
        let isValid = [];
        isValid = this.state.answers.map((answer) => {
            //console.log(file.isValidText);
            return answer.isValidText;
        });

        let isValidAll = true;
        for (let i = 0; i < isValid.length; i++) {
            isValidAll = isValidAll && isValid[i];
        }

        if (isValidAll) {
            this.setState(
                (oldState) => ({
                    ...oldState,
                    isValidAllAnswers: true,
                }),
                this.validateForm,
            );
        } else {
            this.setState(
                (oldState) => ({
                    ...oldState,
                    isValidAllAnswers: false,
                }),
                this.validateForm,
            );
        }

        this.setState(
            (oldState) => ({
                ...oldState,
                formErrors: {
                    ...oldState.formErrors,
                    inputAnswers: !isValidAll
                        ? 'Описание ответа обязательно для заполенния!'
                        : '',
                },
            }),
            this.validateForm,
        );
    }
    //===================================================================

    validateAllOfFile() {
        let newFormError = this.state.formErrors;
        this.checkAllUploadsFilesSize()
            ? (newFormError.inputFilesUploadSize = '')
            : (newFormError.inputFilesUploadSize =
                  'Файл должен быть не больше 10Мб!');

        this.checkAllUploadsFilesName()
            ? (newFormError.inputFilesUploadName = '')
            : (newFormError.inputFilesUploadName = 'Недопустимое имя файла!');

        this.validateAllInputOfFile()
            ? (newFormError.inputFilesText = '')
            : (newFormError.inputFilesText =
                  'Описание файла обязательно для заполенния!');

        this.validateAllInputOfFile()
            ? this.setState({ isValidAllTextOfFiles: true })
            : this.setState({ isValidAllTextOfFiles: false });

        this.checkAllUploadsFilesSize() && this.checkAllUploadsFilesName()
            ? this.setState({ isValidAllUploadFiles: true })
            : this.setState({ isValidAllUploadFiles: false });

        this.setState(
            {
                formErrors: newFormError,
            },
            this.validateForm,
        );
    }
    //===================================================================
    validateAllInputOfFile() {
        let isValid = [];
        isValid = this.state.fileUploads.map((file) => {
            return file.isValidText;
        });
        if (isValid.length == 0) {
            return true;
        }

        let isValidAll = true;
        for (let i = 0; i < isValid.length; i++) {
            isValidAll = isValidAll && isValid[i];
        }

        if (isValidAll) {
            this.setState(
                (oldState) => ({
                    ...oldState,
                    isValidAllTextOfFiles: true,
                }),
                this.validateForm,
            );
        } else {
            this.setState(
                (oldState) => ({
                    ...oldState,
                    isValidAllTextOfFiles: false,
                }),
                this.validateForm,
            );
        }

        this.setState(
            (oldState) => ({
                ...oldState,
                formErrors: {
                    ...oldState.formErrors,
                    inputFilesText: !isValidAll
                        ? 'Описание файла обязательно для заполенния!'
                        : '',
                },
            }),
            this.validateForm,
        );
        return isValidAll;
    }

    isValidAllTextAndFileFalse() {
        this.setState(
            (oldState) => ({
                ...oldState,
                isValidAllTextOfFiles: false,
                isValidAllUploadFiles: false,
            }),
            this.validateForm,
        );
        this.setState(
            (oldState) => ({
                ...oldState,
                formErrors: {
                    ...oldState.formErrors,
                    inputFilesText:
                        'Описание файла обязательно для заполенния!',
                    inputFilesUploadName: 'Выберете файл.',
                },
            }),
            this.validateForm,
        );
    }

    checkAllUploadsFilesName() {
        let isValidName = [];
        isValidName = this.state.fileUploads.map((file) => {
            return file.isValidFileName;
        });
        if (isValidName.length == 0) {
            return true;
        }

        let isValidAll = true;
        for (let i = 0; i < isValidName.length; i++) {
            isValidAll = isValidAll && isValidName[i];
        }

        return isValidAll;
    }

    checkUploadFileName(newFile) {
        let isValid = [];
        isValid = newFile.map((file) => {
            return file.isValidFileName;
        });

        let isValidAll = true;
        for (let i = 0; i < isValid.length; i++) {
            isValidAll = isValidAll && isValid[i];
        }
        //console.log(isValidAll);
        return isValidAll;
    }

    checkAllUploadsFilesSize() {
        let isValidSize = [];
        isValidSize = this.state.fileUploads.map((file) => {
            return file.isValidFileSize;
        });
        if (isValidSize.length == 0) {
            return true;
        }

        let isValidAll = true;
        for (let i = 0; i < isValidSize.length; i++) {
            isValidAll = isValidAll && isValidSize[i];
        }

        return isValidAll;
    }

    checkUploadFileSize(newFile) {
        let isValid = [];
        isValid = newFile.map((file) => {
            return file.isValidFileSize;
        });

        let isValidAll = true;
        for (let i = 0; i < isValid.length; i++) {
            isValidAll = isValidAll && isValid[i];
        }
        //console.log(isValidAll);
        return isValidAll;
    }

    checkNameOfFile(name) {
        if (
            name.length > 0 &&
            name.length < 50 &&
            name.match(
                /^(?!^(PRN|AUX|CLOCK\$|NUL|CON|COM\d|LPT\d|\..*)(\..+)?$)[^\x00-\x1f\\?*:\";|/]+$/,
            )
        ) {
            return true;
        } else {
            return false;
        }
    }
    checkFileTypeSizeName(type, uploadFile, id) {
        let newFile = [];
        //console.log(uploadFile[0].size);
        newFile = this.state.fileUploads.map((file) => {
            if (uploadFile[0].size < 10485760) {
                //check all   event.target.files[0].size   formErrors.inputFilesUpload

                return file.file_id == id
                    ? {
                          ...file,
                          type: type,
                          fileUpload: uploadFile,
                          hideDragAndDrop: true,
                          isValidFileSize: true,
                      }
                    : file;
            } else {
                this.setState(
                    (oldState) => ({
                        ...oldState,
                        formErrors: {
                            ...oldState.formErrors,
                            inputFilesUploadSize:
                                'Файл должен быть не больше 10Мб!',
                        },
                    }),
                    this.validateForm,
                );
                return file.file_id !== id
                    ? file
                    : {
                          ...file,
                          type: type,
                          fileUpload: uploadFile,
                          hideDragAndDrop: true,
                          isValidFileSize: false,
                      };
            }
        });

        newFile = newFile.map((file) => {
            if (this.checkNameOfFile(uploadFile[0].name)) {
                return file.file_id == id
                    ? {
                          ...file,
                          type: type,
                          fileUpload: uploadFile,
                          hideDragAndDrop: true,
                          isValidFileName: true,
                          fileLoaded: true,
                      }
                    : file;
            } else {
                this.setState(
                    (oldState) => ({
                        ...oldState,
                        formErrors: {
                            ...oldState.formErrors,
                            inputFilesUploadName: 'Недопустимое имя файла!',
                        },
                    }),
                    this.validateForm,
                );
                return file.file_id == id
                    ? {
                          ...file,
                          type: type,
                          fileUpload: uploadFile,
                          hideDragAndDrop: true,
                          isValidFileName: false,
                      }
                    : file;
            }
        });

        if (
            this.checkAllUploadsFilesSize &&
            this.checkUploadFileSize(newFile) &&
            this.checkAllUploadsFilesName &&
            this.checkUploadFileName(newFile)
        ) {
            this.setState({ isValidAllUploadFiles: true });
            this.setState(
                (oldState) => ({
                    ...oldState,
                    formErrors: {
                        ...oldState.formErrors,
                        inputFilesUploadSize: '',
                        inputFilesUploadName: '',
                    },
                }),
                this.validateForm,
            );
        }

        if (
            (!this.checkAllUploadsFilesSize ||
                !this.checkUploadFileSize(newFile)) &&
            this.checkAllUploadsFilesName &&
            this.checkUploadFileName(newFile)
        ) {
            this.setState({ isValidAllUploadFiles: false });
            this.setState(
                (oldState) => ({
                    ...oldState,
                    formErrors: {
                        ...oldState.formErrors,
                        inputFilesUploadSize:
                            'Файл должен быть не больше 10Мб!',
                        inputFilesUploadName: '',
                    },
                }),
                this.validateForm,
            );
        }

        if (
            this.checkAllUploadsFilesSize &&
            this.checkUploadFileSize(newFile) &&
            (!this.checkAllUploadsFilesName ||
                !this.checkUploadFileName(newFile))
        ) {
            this.setState({ isValidAllUploadFiles: false });
            this.setState(
                (oldState) => ({
                    ...oldState,
                    formErrors: {
                        ...oldState.formErrors,
                        inputFilesUploadSize: '',
                        inputFilesUploadName: 'Недопустимое имя файла!',
                    },
                }),
                this.validateForm,
            );
        }
        return newFile;
    }

    handleFileUploadInput = (event) => {
        //file_id
        let id = event.target.name;
        let newFile = [];
        let type = '';
        if (!event.target.files[0]) {
            return false;
        }
        //console.log(event.target.files[0].type );
        switch (event.target.files[0].type) {
            case 'image/png':
                type = 'img';
                break;
            case 'image/jpeg':
                type = 'img';
                break;
            case 'application/pdf':
                type = 'pdf';
                break;
            default:
                type = 'other';
                break;
        }
        newFile = this.checkFileTypeSizeName(type, event.target.files, id);

        this.setState(
            (oldState) => ({
                ...oldState,
                fileUploads: newFile,
            }),
            this.validateForm,
        );
        console.log('this.state.fileUploads', this.state.fileUploads);
    };

    handleAnswerInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        //text_answer_
        let id = this.getId(4, name);

        const newAnswer = this.state.answers.map((answer) => {
            if (value.length > 0) {
                return answer.answer_id == id['0']
                    ? {
                          ...answer,
                          text: value,
                          isValidText: true,
                      }
                    : answer;
            } else {
                return answer.answer_id == id['0']
                    ? {
                          ...answer,
                          text: value,
                          isValidText: false,
                      }
                    : answer;
            }
        });

        this.setState(
            (oldState) => ({
                ...oldState,
                answers: newAnswer,
            }),
            this.validateAllInputOfAnswer,
        );
    };
    //1 - inputQuestion
    //2 - inputTextFile
    //3 - inputUpload
    //4 - inputAnswer

    //question_text_
    //file_text_for_
    //file_id
    //text_answer_
    getId(pattern, inputName) {
        let pattern_test;
        switch (pattern) {
            case 1:
                pattern_test = /(?<question_text>question_text_)/u;
                break;
            case 2:
                pattern_test = /(?<file_text>file_text_for_)/u;
                break;
            case 4:
                pattern_test = /(?<answer_text>text_answer_)/u;
                break;
            default:
                break;
        }
        let result_of_match = pattern_test.exec(inputName);
        if (result_of_match) {
            switch (pattern) {
                case 1:
                    pattern_test = /(?<question_text>[^question_text_].*$)/u;
                    break;
                case 2:
                    pattern_test = /(?<file_text>[^file_text_for_].*$)/u;
                    break;
                case 4:
                    pattern_test = /(?<answer_text>[^text_answer_].*$)/u;
                    break;
                default:
                    break;
            }
            return pattern_test.exec(inputName);
        }
        return false;
    }

    validateForm() {
        // console.log('this.state.inputTextOfQuestion.isValid', this.state.inputTextOfQuestion.isValid);
        //console.log('this.state.isValidAllUploadFiles: ', this.state.isValidAllUploadFiles);
        this.setState({
            formValid:
                this.state.inputTextOfQuestion.isValid &&
                this.state.isValidAllTextOfFiles &&
                this.state.isValidAllUploadFiles &&
                this.state.isValidAllAnswers,
        });
    }

    validateFormNew() {
        const errors = [];

        this.state.fileUploads.forEach((fileUpload) => {
            // TODO: check fileUpload
            const isFileUploadValid = false;
            if (isFileUploadValid) {
                return;
            }

            errors.push(`File ${fileUpload.text} has an error.`);
        });

        this.state.answers.forEach((fileUpload) => {
            // TODO: check answers
            const isFileUploadValid = false;
            if (isFileUploadValid) {
                return;
            }

            errors.push(`File ${fileUpload.text} has an error.`);
        });

        // TODO: check questionText

        return errors;
    }

    handleAddingFile() {
        let uuidv = uuidv4();
        this.setState(
            (oldState) => ({
                ...oldState,
                fileUploads: [
                    ...oldState.fileUploads,
                    {
                        file_id: uuidv,
                        text: '',
                        fileUpload: '',
                        type: '',
                        hideDragAndDrop: false,
                        fileInputRef: React.createRef(),
                        isValidFileSize: false,
                        isValidFileName: false,
                        isValidText: false,
                    },
                ],
            }),
            this.isValidAllTextAndFileFalse,
        );
    }
    handleAddingAnswer() {
        let uuidv = uuidv4();
        this.setState(
            (oldState) => ({
                ...oldState,
                answers: [
                    ...oldState.answers,
                    {
                        answer_id: uuidv,
                        text: '',
                        isValidText: false,
                    },
                ],
            }),
            this.validateAllInputOfAnswer,
        );
    }
    handleDeletingFile(file_id) {
        this.setState(
            (oldState) => ({
                ...oldState,
                fileUploads: oldState.fileUploads.filter(
                    (file) => file.file_id !== file_id,
                ),
            }),
            this.validateAllOfFile,
        );
    }

    handleDeletingAnswer(answer_id) {
        this.setState(
            (oldState) => ({
                ...oldState,
                answers: oldState.answers.filter(
                    (answer) => answer.answer_id !== answer_id,
                ),
            }),
            this.validateAllInputOfAnswer,
        );
    }

    handleQuestionPublic = (e) => {
        let checked;

        if (e.target.checked) {
            checked = 'checked';
        } else {
            checked = '';
        }

        this.setState(
            (oldState) => ({
                ...oldState,
                isPublic: checked,
            }),
            this.validateAllInputOfAnswer,
        );

        //console.log('this.state: ',this.state);
    };

    handleQuestionEditing = (e) => {
        let checked;

        if (e.target.checked) {
            checked = 'checked';
        } else {
            checked = '';
        }

        this.setState(
            (oldState) => ({
                ...oldState,
                isEditing: checked,
            }),
            this.validateAllInputOfAnswer,
        );

        //console.log('this.state: ',this.state);
    };
    onEditorStateChange = (editorStateText) => {
        const raw = convertToRaw(editorStateText.getCurrentContent());
        const json = JSON.stringify(raw);
        const html = draftToHtml(raw);

        ChangeTextFieldFlag = true;
        this.setState(
            (oldState) => ({
                ...oldState,
                editorStateText: editorStateText,
            }),
            this.validateFormTextQuestion(html),
        );

        if (question['id']) {
            document.getElementById('question_text_' + question['id']).value =
                json;
        } else {
            document.getElementById('question_text_0').value = json;
        }
    };
    render() {
        return (
            <div className="overflow-hidden shadow sm:rounded-md">
                <div className="panel panel-default">
                    <FormErrors formErrors={this.state.formErrors} />
                </div>
                <form
                    ref={(ref) => {
                        this.form = ref;
                    }}
                    onSubmit={this.submitForm}
                    id="form_id"
                    action={`/polls/${poll['id']}/questions/add`}
                    encType="multipart/form-data"
                    method="POST"
                >
                    <input type="hidden" name="_token" value={csrf_token} />
                    <div className="bg-white px-4 py-5 sm:p-6">
                        <div className="mt-10 sm:mt-0">
                            <div className="grid">
                                <div className="mt-5 md:col-span-2 md:mt-0">
                                    <div className="col-span-2 inline-flex">
                                        <div className="px-4 sm:px-0">
                                            {!question && (
                                                <h3 className="ml-6 mt-6 text-lg font-medium leading-6 text-gray-900">
                                                    Добавление вопроса к теме:{' '}
                                                    {poll['name']}
                                                </h3>
                                            )}
                                            {question && (
                                                <h3 className="ml-6 mt-6 text-lg font-medium leading-6 text-gray-900">
                                                    Изменения вопроса{' '}
                                                    {current_num_question} по
                                                    теме: {poll['name']} с id{' '}
                                                    {question['id']}
                                                </h3>
                                            )}
                                        </div>
                                        {isSuggestedQuestion && (
                                            <div className="flex items-center bg-white px-4 py-5 sm:p-6">
                                                <div className="flex items-center">
                                                    <input
                                                        id="QuestionEditingDone"
                                                        name={`QuestionEditingDone_${question['id']}`}
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        onChange={
                                                            this
                                                                .handleQuestionEditing
                                                        }
                                                        defaultChecked={
                                                            this.state.isEditing
                                                        }
                                                    />
                                                    <label
                                                        htmlFor="QuestionPublic"
                                                        className="ml-2 block text-sm text-gray-900"
                                                    >
                                                        Окончить режим
                                                        редактирования (PS Если
                                                        вы ставите галочку, то
                                                        после подтверждения
                                                        вопрос будет доступен к
                                                        голосованию всем
                                                        пользователям и изменить
                                                        вопрос будет невозможно!
                                                        В случае ошибки, вопрос
                                                        можно будет только
                                                        удалить.)
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        id="question"
                                        className="col-span-3 mt-6 border-t border-gray-400 pt-6 sm:col-span-3 "
                                    >
                                        <div className="inline-flex w-full flex-row">
                                            {!question && (
                                                <label
                                                    htmlFor={`question_text_${
                                                        count_question + 1
                                                    }`}
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Введите текст вопроса №
                                                    {count_question + 1}{' '}
                                                    (поддерживается HTML формат){' '}
                                                </label>
                                            )}
                                            {question && (
                                                <label
                                                    htmlFor={`question_text_${current_num_question}`}
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Введите текст вопроса №
                                                    {current_num_question}{' '}
                                                    (поддерживается HTML формат){' '}
                                                </label>
                                            )}
                                        </div>
                                        {!question && (
                                            <div className="rdw-storybook-root">
                                                <Editor
                                                    name="question_text_0"
                                                    id="question_text_0"
                                                    defaultEditorState={
                                                        this.state
                                                            .editorStateText
                                                    }
                                                    toolbarClassName="rdw-storybook-toolbar"
                                                    wrapperClassName="rdw-storybook-wrapper"
                                                    editorClassName="rdw-storybook-editor"
                                                    onEditorStateChange={
                                                        this.onEditorStateChange
                                                    }
                                                    toolbarStyle={{
                                                        border: '1px solid #ccc',
                                                        borderRadius:
                                                            '0.313rem',
                                                    }}
                                                    editorStyle={{
                                                        padding: '0.625rem',
                                                        fontFamily:
                                                            'montserrat',
                                                        border: '1px solid #ccc',
                                                        marginTop: '1rem',
                                                        backgroundColor: '#fff',
                                                        borderRadius:
                                                            '0.625rem',
                                                        minHeight: '10rem',
                                                        boxShadow:
                                                            '0px 2px 4px 0px hsla(0, 0%, 0%, 0.451)',
                                                    }}
                                                    toolbar={{
                                                        blockType: {
                                                            options: [
                                                                'Normal',
                                                                'Blockquote',
                                                                'Code',
                                                            ],
                                                        },
                                                        embedded: {
                                                            embedCallback: (
                                                                url,
                                                            ) => {
                                                                const result =
                                                                    url.match(
                                                                        /<iframe.+src="([^"]+)".+<\/iframe>/,
                                                                    );
                                                                if (
                                                                    !result ||
                                                                    result.length <
                                                                        2
                                                                ) {
                                                                    return url;
                                                                }

                                                                return result[1];
                                                            },
                                                        },
                                                        image: {
                                                            urlEnabled: true,
                                                            uploadEnabled: true,
                                                            uploadCallback:
                                                                async (
                                                                    file,
                                                                ) => {
                                                                    return toBase64(
                                                                        file,
                                                                    ).then(
                                                                        (
                                                                            fileInBase64,
                                                                        ) => ({
                                                                            data: {
                                                                                link: fileInBase64,
                                                                            },
                                                                        }),
                                                                    );
                                                                },
                                                            previewImage: true,
                                                        },
                                                    }}
                                                />
                                                <input
                                                    hidden
                                                    name="question_text_0"
                                                    id="question_text_0"
                                                    defaultValue={
                                                        ChangeTextFieldFlag
                                                            ? this.state
                                                                  .editorStateText
                                                            : JSON.stringify(
                                                                  convertToRaw(
                                                                      this.state.editorStateText.getCurrentContent(),
                                                                  ),
                                                              )
                                                    }
                                                />
                                            </div>
                                        )}

                                        {question && (
                                            <div className="rdw-storybook-root">
                                                <Editor
                                                    name={`question_text_${question.id}`}
                                                    id={`question_text_${question.id}`}
                                                    defaultEditorState={
                                                        this.state
                                                            .editorStateText
                                                    }
                                                    wrapperClassName="demo-wrapper"
                                                    editorClassName="demo-editor"
                                                    onEditorStateChange={
                                                        this.onEditorStateChange
                                                    }
                                                    toolbarStyle={{
                                                        border: '1px solid #ccc',
                                                        borderRadius:
                                                            '0.313rem',
                                                    }}
                                                    editorStyle={{
                                                        padding: '0.625rem',
                                                        fontFamily:
                                                            'montserrat',
                                                        border: '1px solid #ccc',
                                                        marginTop: '1rem',
                                                        backgroundColor: '#fff',
                                                        borderRadius:
                                                            '0.625rem',
                                                        minHeight: '10rem',
                                                        boxShadow:
                                                            '0px 2px 4px 0px hsla(0, 0%, 0%, 0.451)',
                                                    }}
                                                    toolbar={{
                                                        blockType: {
                                                            options: [
                                                                'Normal',
                                                                'Blockquote',
                                                                'Code',
                                                            ],
                                                        },
                                                        embedded: {
                                                            embedCallback: (
                                                                url,
                                                            ) => {
                                                                const result =
                                                                    url.match(
                                                                        /<iframe.+src="([^"]+)".+<\/iframe>/,
                                                                    );
                                                                if (
                                                                    !result ||
                                                                    result.length <
                                                                        2
                                                                ) {
                                                                    return url;
                                                                }

                                                                return result[1];
                                                            },
                                                        },
                                                        image: {
                                                            urlEnabled: true,
                                                            uploadEnabled: true,
                                                            uploadCallback:
                                                                async (
                                                                    file,
                                                                ) => {
                                                                    return toBase64(
                                                                        file,
                                                                    ).then(
                                                                        (
                                                                            fileInBase64,
                                                                        ) => ({
                                                                            data: {
                                                                                link: fileInBase64,
                                                                            },
                                                                        }),
                                                                    );
                                                                },
                                                            previewImage: true,
                                                        },
                                                    }}
                                                />
                                                <input
                                                    hidden
                                                    name={`question_text_${question.id}`}
                                                    id={`question_text_${question.id}`}
                                                    defaultValue={
                                                        ChangeTextFieldFlag
                                                            ? this.state
                                                                  .editorStateText
                                                            : JSON.stringify(
                                                                  convertToRaw(
                                                                      this.state.editorStateText.getCurrentContent(),
                                                                  ),
                                                              )
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div id="files_container">
                                        {this.state.fileUploads.map(
                                            (file, index) => (
                                                <FilePreview
                                                    key={index}
                                                    file={file}
                                                    value={file.text}
                                                    num_of_question={
                                                        count_question + 1
                                                    }
                                                    num_of_file={index}
                                                    onDeleteFile={
                                                        this.handleDeletingFile
                                                    }
                                                    onChangeTextInputFile={
                                                        this.handleFileTextInput
                                                    }
                                                    onChangeUploadInputFile={
                                                        this
                                                            .handleFileUploadInput
                                                    }
                                                    fileInputRef={
                                                        file.fileInputRef
                                                    }
                                                    hideDragAndDrop={
                                                        file.hideDragAndDrop
                                                    }
                                                    isUpdate={question}
                                                    numQuestion={
                                                        current_num_question
                                                    }
                                                />
                                            ),
                                        )}
                                    </div>

                                    <AddFileToQuestion
                                        handleAddingFile={this.handleAddingFile}
                                    />

                                    <div id="answer_container">
                                        {!isInformationPost &&
                                            this.state.answers.map(
                                                (answer, index) => (
                                                    <AnswerPreview
                                                        key={answer.answer_id}
                                                        answer={answer}
                                                        num_of_question={
                                                            count_question + 1
                                                        }
                                                        num_of_answer={index}
                                                        onDeleteAnswer={
                                                            this
                                                                .handleDeletingAnswer
                                                        }
                                                        onChangeTextInputAnswer={
                                                            this
                                                                .handleAnswerInput
                                                        }
                                                        isUpdate={question}
                                                        isReport={isReport}
                                                        numQuestion={
                                                            current_num_question
                                                        }
                                                    />
                                                ),
                                            )}
                                    </div>

                                    {!isInformationPost && (
                                        <AddAnswerToQuestion
                                            handleAddingAnswer={
                                                this.handleAddingAnswer
                                            }
                                            isReport={isReport}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {!isSuggestedQuestion && (
                        <div className="flex items-center bg-white px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <input
                                    id="QuestionPublic"
                                    name="QuestionPublic"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    onChange={this.handleQuestionPublic}
                                    defaultChecked={this.state.isPublic}
                                />
                                <label
                                    htmlFor="QuestionPublic"
                                    className="ml-2 block text-sm text-gray-900"
                                >
                                    Доступен всем
                                </label>
                            </div>
                        </div>
                    )}

                    <div hidden>
                        <input
                            id="SuggestedQuestion"
                            name="SuggestedQuestion"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            defaultChecked={
                                isSuggestedQuestion ? 'checked' : ''
                            }
                        />
                    </div>

                    <div className="inline-flex w-full flex-row place-content-between">
                        <div className="bg-gray-50 px-4 py-3  sm:px-6">
                            {!question && (
                                <button
                                    type="submit"
                                    className={`${
                                        this.state.formValid
                                            ? 'justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                                            : 'justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                                    }`}
                                    disabled={!this.state.formValid}
                                >
                                    Добавить Вопрос к опросу
                                </button>
                            )}
                            {question && (
                                <button
                                    type="submit"
                                    className={`${
                                        this.state.formValid
                                            ? 'justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                                            : 'justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                                    }`}
                                    disabled={!this.state.formValid}
                                >
                                    Изменить Вопрос к опросу
                                </button>
                            )}
                        </div>

                        <div className="flex-row-reverse bg-gray-50 px-4 py-3 sm:px-6 ">
                            {!isSuggestedQuestion && (
                                <a href={`/polls/${poll['id']}/edit`}>
                                    <button
                                        type="button"
                                        className="justify-end rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        Отмена
                                    </button>
                                </a>
                            )}
                            {isSuggestedQuestion && (
                                <a href={`/polls/view/suggested/questions`}>
                                    <button
                                        type="button"
                                        className="justify-end rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        Отмена
                                    </button>
                                </a>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default Question;
