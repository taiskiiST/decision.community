import React from 'react';
import PDFObject from 'pdfobject';
import PdfPreview from './PdfPreview';
import FileLoadedPreview from './FileLoadedPreview';

class FilePreview extends React.Component {
    constructor(props) {
            super(props);
    }

    render() {
    //console.log(this.props.file);
        const file = this.props.file;
        const file_id = file.file_id;
        const text = file.text;
        const num_of_question = this.props.num_of_question;
        const num_of_file = this.props.num_of_file;
        const isUpdate = this.props.isUpdate;
        const num_question = this.props.numQuestion;

        return (
            <div id={`data_${file_id}`} className="col-span-6 sm:col-span-3 mt-8 border-t-8 border-double border-gray-400">
                <div >
                       <div className="inline-flex flex-row w-full">
                       {!isUpdate && <label htmlFor={`file_text_for_${file_id}`} className="mt-3 block text-sm font-medium text-gray-700">Введите описание файла к вопросу №{num_of_question}, файлу №{num_of_file+1} </label>}
                       {isUpdate && <label htmlFor={`file_text_for_${file_id}`} className="mt-3 block text-sm font-medium text-gray-700">Введите описание файла к вопросу №{num_question}, файлу №{num_of_file+1} </label>}
                           <div className="flex-row-reverse contents" >
                               <button id={`btn-del-data-${file_id}`} className="ml-auto text-red-800" type="button" onClick={() => this.props.onDeleteFile(file_id)}>
                                   <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                   </svg>
                               </button>
                           </div>
                       </div>
                       <textarea type="text"
                                 name={`file_text_for_${file_id}`}
                                 id={`file_text_for_${file_id}`}
                                 className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                 onChange={this.props.onChangeTextInputFile}
                                 value={this.props.value}
                                 >
                                 {this.props.value}
                       </textarea>
                 </div>
                <div className="flex columns-2 mt-4">
                    {this.props.file.type=='img' && <div id={`prev_${file_id}`} className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mt-6">Предварительный просмотр к файлу №{num_of_file+1} вопроса №{num_of_question}</label>
                        <div className="mt-1 flex items-center">
                               {this.props.file.fileUpload  && this.props.file.fileLoaded &&[...this.props.file.fileUpload].map((file,index)=>(
                                    this.props.file.isValidFileName && this.props.file.isValidFileSize && <img key="index" id={URL.createObjectURL(file).split('/')['3']} src={URL.createObjectURL(file)}/>
                                ))}
                                {this.props.file.fileUpload  && !this.props.file.fileLoaded &&[...this.props.file.fileUpload].map((file,index)=>(
                                    this.props.file.isValidFileName && this.props.file.isValidFileSize && <div key="index"><img id={file.name} src={file.name}/><input name={file_id} defaultValue={file.name} className="hidden"/></div>
                                ))}
                            </div>
                        </div>
                    }
                    {this.props.file.type=='pdf' && <div id={`prev_${file_id}`} className="w-1/2">
                         <label className="block text-sm font-medium text-gray-700 mt-6">Предварительный просмотр к файлу PDF №{num_of_file+1} вопроса №{num_of_question}</label>
                         <div className="mt-1 h-96 w-full relative text-center">
                            <div id="pdf-viewer" className="absolute inset-y-0 left-0 w-full" >
                                {this.props.file.fileUpload && this.props.file.fileLoaded && [...this.props.file.fileUpload].map((file,index)=>(
                                    this.props.file.isValidFileName && this.props.file.isValidFileSize && <PdfPreview key={index} url={URL.createObjectURL(file)} alternativeText={file.name} />
                                ))}
                                {this.props.file.fileUpload && !this.props.file.fileLoaded && [...this.props.file.fileUpload].map((file,index)=>(
                                    this.props.file.isValidFileName && this.props.file.isValidFileSize && <PdfPreview key={index} url={file.name} alternativeText={file.name} file_id={file_id}/>
                                ))}
                            </div>
                         </div>
                       </div>
                    }
                    {this.props.file.type=='other' && <div id={`prev_${file_id}`} className="w-1/2">
                         <label className="block text-sm font-medium text-gray-700 mt-6">Предварительный просмотр к файлу №{num_of_file+1} вопроса №{num_of_question}</label>
                         <div className="mt-6 h-24 w-full text-center">
                            <div id="file-viewer" className="flex h-1/2 flex-col-reverse" >
                                {this.props.file.fileUpload && this.props.file.fileLoaded &&[...this.props.file.fileUpload].map((file,index)=>(
                                    this.props.file.isValidFileName && this.props.file.isValidFileSize && <FileLoadedPreview key={index} url={URL.createObjectURL(file)} alternativeText={file.name} />
                                ))}
                                {this.props.file.fileUpload && !this.props.file.fileLoaded &&[...this.props.file.fileUpload].map((file,index)=>(
                                    this.props.file.isValidFileName && this.props.file.isValidFileSize && <FileLoadedPreview key={index} url={file.name} file_id={file_id}/>
                                ))}
                            </div>
                         </div>
                       </div>
                    }
                     <div id={`drag_and_drop_aria_${file_id}`} className={`${this.props.file.hideDragAndDrop ? 'w-1/2' : 'w-full'} place-self-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md`} >
                      <div className="mt-1 flex justify-center ">
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600 flex-col">
                            <label htmlFor={file_id} className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                              <span>{this.props.file.hideDragAndDrop ? 'Измените файл' : 'Загрузите файл'}</span>
                              <input id={file_id}
                                     name={file_id}
                                     type="file"
                                     className="sr-only"
                                     ref={this.props.fileInput}
                                     onChange={this.props.onChangeUploadInputFile}/>
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">
                            PDF, PNG, JPG, GIF не более 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default FilePreview;