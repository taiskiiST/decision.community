import React from 'react';
import PdfPreview from './PdfPreview';
import {v4 as uuidv4} from "uuid";
import FormErrors from "./FormErrors";

const { poll, csrf_token, file_protocol, error } = TSN;

class Protocol extends React.Component {
    constructor(props) {
        super(props);
        this.handleFileUploadInput = this.handleFileUploadInput.bind(this);
        this.handleDeletingFile = this.handleDeletingFile.bind(this);
        this.handleProtocolDelete = this.handleProtocolDelete.bind(this);
        this.form = React.createRef();

        this.state = {
            fileUpload: {
                file_id: uuidv4(),
                type:'',
                hideDragAndDrop: false,
                file: '',
                fileInputRef: React.createRef(),
                isValidFileSize: false,
                isValidFileName: false,
            },
            formErrors: {
                inputFileUploadSize: error ? error : '',
                inputFileUploadName: '',
            }
        };
    }
    handleProtocolDelete = (event) => {
        event.preventDefault();
        $('#form_del_protocol')[0].submit();

       // this.closest('form').submit();
    }

    handleDeletingFile() {
        this.setState((oldState) => ({
            ...oldState,
            fileUpload:{
                ...oldState.fileUpload,
                file_id: uuidv4(),
                type:'',
                hideDragAndDrop: false,
                file: '',
                fileInputRef: React.createRef(),
                isValidFileSize: false,
                isValidFileName: false,
                afterDelete: true
            }
        }))

    }

    handleFileUploadInput = (event) => {
        //console.log('id ', id);
        let type = '';
        if (!event.target.files[0]){
            return false
        }
        switch (event.target.files[0].type) {
            case 'image/png':
                type = 'img';
                break;
            case 'application/pdf':
                type = 'pdf';
                break;
            default:
                type = 'other';
                break;
        }

        this.setState((oldState) => ({
            ...oldState,
            fileUpload:{
                ...oldState.fileUpload,
                type: type,
                hideDragAndDrop: true,
                file: event.target.files,
                afterDelete: false
            }
        }))
        this.allFunctions(type, event);
    }

    allFunctions (type,event){
        this.checkFileSize(type, event.target.files);
        this.checkFileName(type, event.target.files);
    }

    checkFileSize(type, uploadFile){
        if (uploadFile[0].size < 10485760) {
            this.setState((oldState) => ({
                ...oldState,
                fileUpload:{
                    ...oldState.fileUpload,
                    isValidFileSize: true
                }
            }))
            this.setState((oldState) => ({
                ...oldState,
                formErrors: {
                    ...oldState.formErrors,
                    inputFileUploadSize: ''
                }
            }));
        }else{
            this.setState((oldState) => ({
                ...oldState,
                fileUpload:{
                    ...oldState.fileUpload,
                    isValidFileSize: false,
                }
            }))
            this.setState((oldState) => ({
                ...oldState,
                formErrors: {
                    ...oldState.formErrors,
                    inputFileUploadSize: 'Файл должен быть не больше 10Мб!'
                }
            }));
        }
    }
    checkFileName(type, uploadFile){
        if (this.checkNameOfFile(uploadFile[0].name)) {
            this.setState((oldState) => ({
                ...oldState,
                fileUpload:{
                    ...oldState.fileUpload,
                    isValidFileName: true,
                    fileLoaded:true
                }
            }))
            this.setState((oldState) => ({
                ...oldState,
                formErrors: {
                    ...oldState.formErrors,
                    inputFileUploadName: ''
                }
            }));
        }else{
            this.setState((oldState) => ({
                ...oldState,
                fileUpload:{
                    ...oldState.fileUpload,
                    isValidFileName: false
                }
            }))
            this.setState((oldState) => ({
                ...oldState,
                formErrors: {
                    ...oldState.formErrors,
                    inputFileUploadName: 'Недопустимое имя файла!'
                }
            }));
        }
    }

    checkNameOfFile(name){
        if (name.length > 0 && name.length < 50 && name.match(/^(?!^(PRN|AUX|CLOCK\$|NUL|CON|COM\d|LPT\d|\..*)(\..+)?$)[^\x00-\x1f\\?*:\";|/]+$/)){
            return true
        }else{
            return false
        }
    }

    render() {
        //console.log(error);
        return (
            <div id={`data_${this.state.fileUpload.file_id}`} className="col-span-6 sm:col-span-3 mt-8 border-t-8 border-double border-gray-400">
                <div className="panel panel-default">
                    <FormErrors formErrors={this.state.formErrors} />
                </div>
                <label className="block text-lg text-black font-semibold mt-6">Скан подписанного протокола:</label>
                <form
                    ref={ (ref) => { this.form = ref; } }
                    onSubmit={this.submitForm}
                    id="form_id" action={`/polls/${poll}/addProtocol`} encType="multipart/form-data" method="POST">
                    <input type="hidden" name="_token" value={csrf_token} />
                <div className="flex columns-2 mt-4">
                    {!this.state.fileUpload.file && file_protocol && <div id={`prev_${this.state.fileUpload.file_id}`} className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mt-6">Предварительный просмотр к файла</label>
                        <div className="mt-1 h-96 w-full relative text-center">
                            <div id="pdf-viewer" className="absolute inset-y-0 left-0 w-full" >
                                {(!this.state.fileUpload.file && !this.state.fileUpload.isValidFileName && !this.state.fileUpload.isValidFileSize && file_protocol) &&
                                    <PdfPreview url={`/storage/${file_protocol}`} />
                                }
                            </div>
                        </div>
                    </div>
                    }
                    {this.state.fileUpload.type=='pdf'  && <div id={`prev_${this.state.fileUpload.file_id}`} className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mt-6">Предварительный просмотр к файла</label>
                        <div className="mt-1 h-96 w-full relative text-center">
                            <div id="pdf-viewer" className="absolute inset-y-0 left-0 w-full" >
                                {this.state.fileUpload.file && this.state.fileUpload.isValidFileName && this.state.fileUpload.isValidFileSize &&
                                    <PdfPreview url={URL.createObjectURL(this.state.fileUpload.file[0])} />
                                }
                            </div>
                        </div>
                    </div>
                    }
                    {this.state.fileUpload.type && this.state.fileUpload.type!=='pdf' && <div id={`prev_${this.state.fileUpload.file_id}`} className="w-1/2">
                        <div className="mt-1 h-96 relative text-center">
                            <div id="pdf-viewer" className="py-20 " >
                                Загрузите протокол в формате PDF
                            </div>
                        </div>
                    </div>
                    }
                    <div id={`drag_and_drop_aria_${this.state.fileUpload.file_id}`} className={`${ (this.state.fileUpload.hideDragAndDrop  || file_protocol) ? 'w-1/2' : 'w-full'} place-self-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md`} >
                        <div className="mt-1 flex justify-center ">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="flex text-sm text-gray-600 flex-col">
                                    <label htmlFor={this.state.fileUpload.file_id} className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                        <span>{(this.state.fileUpload.hideDragAndDrop || file_protocol) ? 'Измените файл' : 'Загрузите файл'}</span>
                                        <input id={this.state.fileUpload.file_id}
                                               name={this.state.fileUpload.file_id}
                                               type="file"
                                               className="sr-only"
                                               ref={this.state.fileUpload.fileInput}
                                               onChange={this.handleFileUploadInput}/>
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500">
                                    PDF, PNG, JPG, GIF не более 10MB
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                    <div className="inline-flex">
                        <button type="submit" className={`${this.state.fileUpload.isValidFileName && this.state.fileUpload.isValidFileSize && this.state.fileUpload.type=='pdf'
                            ? 'justify-center mt-6 ml-6 mr-6 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            : 'justify-center mt-6 ml-6 mr-6 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }`}
                                              disabled={!this.state.fileUpload.isValidFileName || !this.state.fileUpload.isValidFileSize}>
                            Загрузить протокол
                        </button>
                        {file_protocol && <button type="submit" className="justify-center mt-6 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <form
                                ref={ (ref) => { this.form = ref; } }
                                id="form_del_protocol" action={`/polls/${poll}/delProtocol`} method='get'>
                                <input type="hidden" name="_token" value={csrf_token} />
                                    <a href={`/polls/${poll}/delProtocol`}
                                       onClick={this.handleProtocolDelete}
                                       className="hover:text-white"
                                       >
                                        Удалить сохраненный протокол
                                    </a>
                            </form>
                        </button>}
                    </div>
                </form>
            </div>
        );
    }
}

export default Protocol;