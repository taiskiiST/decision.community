import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import AddFileToQuestion from "./AddFileToQuestion";
import AddAnswerToQuestion from "./AddAnswerToQuestion";
import FilePreview from './FilePreview';
import AnswerPreview from "./AnswerPreview";
import FormErrors from "./FormErrors";

const { poll, count_question,  csrf_token } = TSN;

class Question extends React.Component {

    constructor(props) {
        super(props);
        //this.props.clickTextForFile = false;
        this.handleAddingFile = this.handleAddingFile.bind(this);
        this.handleAddingAnswer = this.handleAddingAnswer.bind(this);
        this.handleDeletingFile = this.handleDeletingFile.bind(this);
        this.handleDeletingAnswer = this.handleDeletingAnswer.bind(this);

        this.handleQuestionTextInput = this.handleQuestionTextInput.bind(this);
        this.handleFileTextInput = this.handleFileTextInput.bind(this);
        this.handleAnswerInput = this.handleAnswerInput.bind(this);
        this.submitForm = this.submitForm.bind(this);

        this.form = React.createRef();

        this.state = {
            fileUploads: [
                {guid: 'guid', text: 'File Name', fileUpload: '', isValid: false},
                ],
            files: [],
            answers: [],
            inputTextOfQuestion: '',
            inputFiles: [],
            inputAnswers: [],
            formErrors: {inputTextOfQuestion: '', inputFilesText: '',inputFilesUpload: '',inputAnswers:''},
            newFormErrors: [],
            inputTextOfQuestionValid: false,
            inputFilesTextValid: [],
            inputFilesUploadValid: [],
            inputAnswersValid: [],
            formValid: false
        };
    }

    submitForm(e) {
        const errors = this.validateFormNew();

        if (errors.length > 0) {
            alert(`Form is not valid: ${errors.join()}`);

            this.setState({ newFormErrors: errors});

            e.preventDefault();

            return;
        }
    }

    handleQuestionTextInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({inputTextOfQuestion: value},
            () => { this.validateField(name, value, 1)} )
    }

    handleAnswerInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(
            (oldState) => ({
                ...oldState,
                inputAnswers: [
                    ...oldState.inputAnswers,
                    {
                        TextAnswerInput:
                            {
                                name: value
                            },
                        inputAnswersValid:{
                            name:false
                        }
                    }
                ]
            }),
            () => {this.validateField(name, value, 4)}
        )


    }

    handleFileTextInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(
            (oldState) => ({
                ...oldState,
                inputFiles: [
                    ...oldState.inputFiles,
                    {
                        TextForFileInput: value
                    }
                ]
            }),
            () => {this.validateField(name, value, 2)}
        )


    }


    //1 - inputQuestion
    //2 - inputTextFile
    //3 - inputUpload
    //4 - inputAnswer

    //question_text_
    //file_text_for_
    //file_id
    //text_answer_
    matchSubstrInInputName (pattern, inputName){
        let pattern_test
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
        if (result_of_match){
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

    validateField(fieldName, value, pattern) {
        let fieldValidationErrors = this.state.formErrors;
        let inputTextOfQuestionValid = this.state.inputTextOfQuestionValid;
        let inputFilesTextValid = this.state.inputFilesTextValid;
        let inputAnswersValid = this.state.inputAnswersValid;

        let result_of_match = this.matchSubstrInInputName(pattern, fieldName);
        if (result_of_match){
            if (result_of_match.groups['question_text']) {
                inputTextOfQuestionValid = value.length > 0;
                fieldValidationErrors.inputTextOfQuestion = inputTextOfQuestionValid ? '' : 'Поле текста вопроса обязательно для заполнения!';
            }
            if (result_of_match.groups['file_text']) {
                inputFilesTextValid = value.length > 0;
                fieldValidationErrors.inputFilesText = inputFilesTextValid ? '' : 'Поле текста описания файла обязательно для заполнения!';
            }
            if (result_of_match.groups['answer_text']) {
                inputAnswersValid['text_answer_'+this.state.answer.answer_id] = value.length > 0;
                fieldValidationErrors.inputAnswersValid['text_answer_'+this.state.answer.answer_id] = inputAnswersValid['text_answer_'+this.state.answer.answer_id] ? '' : 'Поле текста варианта ответа обязательно для заполнения!';
                console.log(inputAnswersValid);
                if (!inputAnswersValid){
                    this.state.answers.map((answer)=> {
                            let cnt = 0;
                            if (!answer.inputAnswersValid[answer.answer_id]){
                                   this.validateField('text_answer_'+answer.answer_id, this.state.inputAnswers[cnt].TextAnswerInput['text_answer_'+answer.answer_id], 4)
                                    cnt++;
                            }
                        }
                    )
                }
            }
        }
        this.setState({formErrors: fieldValidationErrors,
            inputTextOfQuestionValid: inputTextOfQuestionValid,
            inputFilesTextValid: inputFilesTextValid,
            inputAnswersValid: inputAnswersValid,
        }, this.validateForm);
    }

    validateFormNew() {
        const errors = [];

        this.state.fileUploads.forEach(fileUpload => {
            // TODO: check fileUpload
            const isFileUploadValid = false;
            if (isFileUploadValid) {
                return;
            }

            errors.push(`File ${fileUpload.text} has an error.`);
        });

        this.state.answers.forEach(fileUpload => {
            // TODO: check fileUpload
            const isFileUploadValid = false;
            if (isFileUploadValid) {
                return;
            }

            errors.push(`File ${fileUpload.text} has an error.`);
        });

        // TODO: check questionText

        return errors;
    }

    validateForm() {
        this.setState({formValid: this.state.inputTextOfQuestionValid
                &&   this.state.inputFilesTextValid
                //&&   this.state.inputAnswersValid
        });
    }

    handleAddingFile() {
        this.setState((oldState) => ({
            ...oldState,
            files: [
                ...oldState.files,
                {
                    file_id: uuidv4()

                }
            ],
            inputFilesTextValid: false
        }),
            this.validateForm
        );
    }
    handleAddingAnswer() {
        let uuidv = uuidv4();
        this.setState((oldState) => ({
            ...oldState,
            answers: [
                ...oldState.answers,
                {
                    answer_id: uuidv,
                    inputAnswersValid:
                        {
                            [uuidv]: false
                        }
                }
            ]
        }),
            this.validateForm
        );
    }
    handleDeletingFile(file_id) {
        this.setState(oldState => ({
            ...oldState,
            files: oldState.files.filter(file => file.file_id !== file_id)
        }));
    }

    handleDeletingAnswer(answer_id) {
        this.setState(oldState => ({
            ...oldState,
            answers: oldState.answers.filter(answer => answer.answer_id !== answer_id)
        }));
    }

    render() {
        return (
            <div className="shadow overflow-hidden sm:rounded-md">
                <div className="panel panel-default">
                    <FormErrors formErrors={this.state.formErrors} />
                </div>
                <form
                    ref={ (ref) => { this.form = ref; } }
                    onSubmit={this.submitForm}
                    id="form_id" action={`/polls/${poll['id']}/questions/add`} encType="multipart/form-data" method="POST">
                    <input type="hidden" name="_token" value={csrf_token} />
                <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="mt-10 sm:mt-0">
                        <div className="grid">
                            <div className="mt-5 md:mt-0 md:col-span-2">
                                    <div className="col-span-1">
                                        <div className="px-4 sm:px-0">
                                            <h3 className="text-lg font-medium leading-6 text-gray-900 mt-6 ml-6">Добавление вопроса к опросу: {poll['name']} </h3>
                                        </div>
                                    </div>

                                    <div id="question" className="col-span-3 sm:col-span-3 mt-6 pt-6 border-t border-gray-400 ">
                                        <div className="inline-flex flex-row w-full">
                                            <label htmlFor={`question_text_${count_question+1}`} className="block text-sm font-medium text-gray-700">Введите текст вопроса №{count_question+1} (поддерживается HTML формат) </label>
                                        </div>
                                        <textarea type="text"
                                                  name={`question_text_${count_question+1}`}
                                                  id={`question_text_${count_question+1}`}
                                                  autoComplete="given-name"
                                                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                  value={this.state.inputTextOfQuestion}
                                                  onChange={this.handleQuestionTextInput}
                                        ></textarea>
                                    </div>

                                    <div id="files_container">
                                        {
                                            this.state.files.map((file,index) => (
                                                <FilePreview key={file.file_id}
                                                             file={file}
                                                             num_of_question={count_question+1}
                                                             num_of_file={index}
                                                             inputFiles={this.state.inputFiles}
                                                             onDeleteFile={this.handleDeletingFile}
                                                             onChangeTextInputFile={this.handleFileTextInput}
                                                />
                                            ))
                                        }
                                    </div>

                                    <AddFileToQuestion handleAddingFile={this.handleAddingFile}/>



                                    <div id="answer_container">
                                        {
                                            this.state.answers.map((answer,index) => (
                                                <AnswerPreview key={answer.answer_id}
                                                               answer={answer}
                                                               num_of_question={count_question+1}
                                                               num_of_answer={index}
                                                               inputAnswers={this.state.inputAnswers}
                                                               onDeleteAnswer={this.handleDeletingAnswer}
                                                               onChangeTextInputFile={this.handleAnswerInput}
                                                />
                                            ))
                                        }
                                    </div>

                                    <AddAnswerToQuestion handleAddingAnswer={this.handleAddingAnswer}/>


                            </div>
                        </div>
                    </div>
                </div>

                <div className="inline-flex flex-row w-full place-content-between">
                    <div className="px-4 py-3 bg-gray-50  sm:px-6">
                        <button type="submit" className={`${this.state.formValid 
                                                        ? 'justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                                        : 'justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                                        }`}
                                disabled={!this.state.formValid}>
                            Добавить Вопрос к опросу
                        </button>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 sm:px-6 flex-row-reverse ">
                        <a href="/polls"><button type="button" className="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" >
                            Отмена
                        </button></a>
                    </div>

                </div>
                </form>
            </div>
        );
    }
}

export default Question;