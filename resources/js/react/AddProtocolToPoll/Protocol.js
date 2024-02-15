import React from 'react';
import PdfPreview from './PdfPreview';
import { v4 as uuidv4 } from 'uuid';
import FormErrors from './FormErrors';

const { poll, csrf_token, file_protocol, error, is_admin } = window.TSN || {};

var _PDF_DOC,
    _CURRENT_PAGE,
    _TOTAL_PAGES,
    _PAGE_RENDERING_IN_PROGRESS = 0,
    _CANVAS = document.querySelector('#pdf-canvas');

// initialize and load the PDF
async function showPDF(pdf_url) {
    if (document.querySelector('#pdf-loader')) {
        document.querySelector('#pdf-loader').style.display = 'block';
    }

    // get handle of pdf document
    try {
        _PDF_DOC = await pdfjsLib.getDocument({ url: pdf_url });
    } catch (error) {
        alert(error.message);
    }

    // total pages in pdf
    _TOTAL_PAGES = _PDF_DOC.numPages;

    // Hide the pdf loader and show pdf container
    if (document.querySelector('#pdf-loader')) {
        document.querySelector('#pdf-loader').style.display = 'none';
    }
    if (document.querySelector('#pdf-contents')) {
        document.querySelector('#pdf-contents').style.display = 'block';
    }
    if (document.querySelector('#pdf-total-pages')) {
        document.querySelector('#pdf-total-pages').innerHTML = _TOTAL_PAGES;
    }

    // show the first page
    showPage(1);
}

// load and render specific page of the PDF
async function showPage(page_no) {
    _PAGE_RENDERING_IN_PROGRESS = 1;
    _CURRENT_PAGE = page_no;

    // disable Previous & Next buttons while page is being loaded
    document.querySelector('#pdf-next').disabled = true;
    document.querySelector('#pdf-prev').disabled = true;

    // while page is being rendered hide the canvas and show a loading message
    if (document.querySelector('#pdf-canvas')) {
        document.querySelector('#pdf-canvas').style.display = 'none';
    }
    if (document.querySelector('#page-loader')) {
        document.querySelector('#page-loader').style.display = 'block';
    }

    // update current page
    document.querySelector('#pdf-current-page').innerHTML = page_no;

    // get handle of page
    try {
        var page = await _PDF_DOC.getPage(page_no);
    } catch (error) {
        alert(error.message);
    }

    // original width of the pdf page at scale 1
    var pdf_original_width = page.getViewport(0.9).width;

    // as the canvas is of a fixed width we need to adjust the scale of the viewport where page is rendered
    var scale_required = _CANVAS.width / pdf_original_width;

    // get viewport to render the page at required scale
    var viewport = page.getViewport(scale_required);

    // set canvas height same as viewport height
    _CANVAS.height = viewport.height;

    // setting page loader height for smooth experience
    if (document.querySelector('#page-loader')) {
        document.querySelector('#page-loader').style.height =
            _CANVAS.height + 'px';
        document.querySelector('#page-loader').style.lineHeight =
            _CANVAS.height + 'px';
    }

    var render_context = {
        canvasContext: _CANVAS.getContext('2d'),
        viewport: viewport,
    };

    // render the page contents in the canvas
    try {
        await page.render(render_context);
    } catch (error) {
        alert(error.message);
    }

    _PAGE_RENDERING_IN_PROGRESS = 0;

    // re-enable Previous & Next buttons
    document.querySelector('#pdf-next').disabled = false;
    document.querySelector('#pdf-prev').disabled = false;

    // show the canvas and hide the page loader
    document.querySelector('#pdf-canvas').style.display = 'block';
    document.querySelector('#page-loader').style.display = 'none';
}

// click on the "Previous" page button
if (document.querySelector('#pdf-prev')) {
    document.querySelector('#pdf-prev').addEventListener('click', function () {
        if (_CURRENT_PAGE != 1) showPage(--_CURRENT_PAGE);
    });
}

// click on the "Next" page button
if (document.querySelector('#pdf-next')) {
    document.querySelector('#pdf-next').addEventListener('click', function () {
        if (_CURRENT_PAGE != _TOTAL_PAGES) showPage(++_CURRENT_PAGE);
    });
}

typeof window.jQuery === 'function' &&
    $(document).ready(function () {
        if (document.querySelector('#show-pdf-button')) {
            document.querySelector('#show-pdf-button').style.display = 'none';
            value = document.querySelector('#show-pdf-button').value;
            showPDF(value);
        }
    });

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
                type: '',
                hideDragAndDrop: false,
                file: '',
                fileInputRef: React.createRef(),
                isValidFileSize: false,
                isValidFileName: false,
            },
            formErrors: {
                inputFileUploadSize: error ? error : '',
                inputFileUploadName: '',
            },
        };
    }
    handleProtocolDelete = (event) => {
        event.preventDefault();
        $('#form_del_protocol')[0].submit();

        // this.closest('form').submit();
    };

    handleDeletingFile() {
        this.setState((oldState) => ({
            ...oldState,
            fileUpload: {
                ...oldState.fileUpload,
                file_id: uuidv4(),
                type: '',
                hideDragAndDrop: false,
                file: '',
                fileInputRef: React.createRef(),
                isValidFileSize: false,
                isValidFileName: false,
                afterDelete: true,
            },
        }));
    }

    handleFileUploadInput = (event) => {
        //console.log('id ', id);
        let type = '';
        if (!event.target.files[0]) {
            return false;
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
            fileUpload: {
                ...oldState.fileUpload,
                type: type,
                hideDragAndDrop: true,
                file: event.target.files,
                afterDelete: false,
            },
        }));
        this.allFunctions(type, event);
    };

    allFunctions(type, event) {
        this.checkFileSize(type, event.target.files);
        this.checkFileName(type, event.target.files);
    }

    checkFileSize(type, uploadFile) {
        if (uploadFile[0].size < 10485760) {
            this.setState((oldState) => ({
                ...oldState,
                fileUpload: {
                    ...oldState.fileUpload,
                    isValidFileSize: true,
                },
            }));
            this.setState((oldState) => ({
                ...oldState,
                formErrors: {
                    ...oldState.formErrors,
                    inputFileUploadSize: '',
                },
            }));
        } else {
            this.setState((oldState) => ({
                ...oldState,
                fileUpload: {
                    ...oldState.fileUpload,
                    isValidFileSize: false,
                },
            }));
            this.setState((oldState) => ({
                ...oldState,
                formErrors: {
                    ...oldState.formErrors,
                    inputFileUploadSize: 'Файл должен быть не больше 10Мб!',
                },
            }));
        }
    }
    checkFileName(type, uploadFile) {
        if (this.checkNameOfFile(uploadFile[0].name)) {
            this.setState((oldState) => ({
                ...oldState,
                fileUpload: {
                    ...oldState.fileUpload,
                    isValidFileName: true,
                    fileLoaded: true,
                },
            }));
            this.setState((oldState) => ({
                ...oldState,
                formErrors: {
                    ...oldState.formErrors,
                    inputFileUploadName: '',
                },
            }));
        } else {
            this.setState((oldState) => ({
                ...oldState,
                fileUpload: {
                    ...oldState.fileUpload,
                    isValidFileName: false,
                },
            }));
            this.setState((oldState) => ({
                ...oldState,
                formErrors: {
                    ...oldState.formErrors,
                    inputFileUploadName: 'Недопустимое имя файла!',
                },
            }));
        }
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

    render() {
        return (
            <div
                id={`data_${this.state.fileUpload.file_id}`}
                className="col-span-6 mt-8 border-t-8 border-double border-gray-400 sm:col-span-3"
            >
                <div className="panel panel-default">
                    <FormErrors formErrors={this.state.formErrors} />
                </div>
                <label className="mt-6 block text-lg font-semibold text-black">
                    Скан подписанного протокола:
                </label>
                <form
                    ref={(ref) => {
                        this.form = ref;
                    }}
                    onSubmit={this.submitForm}
                    id="form_id"
                    action={`/polls/${poll}/addProtocol`}
                    encType="multipart/form-data"
                    method="POST"
                >
                    <input type="hidden" name="_token" value={csrf_token} />
                    <div className="mt-4 flex columns-2">
                        {!this.state.fileUpload.file && file_protocol && (
                            <div
                                id={`prev_${this.state.fileUpload.file_id}`}
                                className="w-1/2"
                            >
                                <label className="mt-6 block text-sm font-medium text-gray-700">
                                    Предварительный просмотр к файла
                                </label>
                                <div className="relative mt-1 h-96 w-full text-center">
                                    <div
                                        id="pdf-viewer"
                                        className="absolute inset-y-0 left-0 w-full"
                                    >
                                        {!this.state.fileUpload.file &&
                                            !this.state.fileUpload
                                                .isValidFileName &&
                                            !this.state.fileUpload
                                                .isValidFileSize &&
                                            file_protocol && (
                                                <PdfPreview
                                                    url={`/storage/${file_protocol}`}
                                                />
                                            )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {this.state.fileUpload.type == 'pdf' && (
                            <div
                                id={`prev_${this.state.fileUpload.file_id}`}
                                className="w-1/2"
                            >
                                <label className="mt-6 block text-sm font-medium text-gray-700">
                                    Предварительный просмотр к файла
                                </label>
                                <div className="relative mt-1 h-96 w-full text-center">
                                    <div
                                        id="pdf-viewer"
                                        className="absolute inset-y-0 left-0 w-full"
                                    >
                                        {this.state.fileUpload.file &&
                                            this.state.fileUpload
                                                .isValidFileName &&
                                            this.state.fileUpload
                                                .isValidFileSize && (
                                                <PdfPreview
                                                    url={URL.createObjectURL(
                                                        this.state.fileUpload
                                                            .file[0],
                                                    )}
                                                />
                                            )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {this.state.fileUpload.type &&
                            this.state.fileUpload.type !== 'pdf' && (
                                <div
                                    id={`prev_${this.state.fileUpload.file_id}`}
                                    className="w-1/2"
                                >
                                    <div className="relative mt-1 h-96 text-center">
                                        <div id="pdf-viewer" className="py-20 ">
                                            Загрузите протокол в формате PDF
                                        </div>
                                    </div>
                                </div>
                            )}
                        {is_admin && (
                            <div
                                id={`drag_and_drop_aria_${this.state.fileUpload.file_id}`}
                                className={`${
                                    this.state.fileUpload.hideDragAndDrop ||
                                    file_protocol
                                        ? 'w-1/2'
                                        : 'w-full'
                                } place-self-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5`}
                            >
                                <div className="mt-1 flex justify-center ">
                                    <div className="space-y-1 text-center">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="flex flex-col text-sm text-gray-600">
                                            <label
                                                htmlFor={
                                                    this.state.fileUpload
                                                        .file_id
                                                }
                                                className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                            >
                                                <span>
                                                    {this.state.fileUpload
                                                        .hideDragAndDrop ||
                                                    file_protocol
                                                        ? 'Измените файл'
                                                        : 'Загрузите файл'}
                                                </span>
                                                <input
                                                    id={
                                                        this.state.fileUpload
                                                            .file_id
                                                    }
                                                    name={
                                                        this.state.fileUpload
                                                            .file_id
                                                    }
                                                    type="file"
                                                    className="sr-only"
                                                    ref={
                                                        this.state.fileUpload
                                                            .fileInput
                                                    }
                                                    onChange={
                                                        this
                                                            .handleFileUploadInput
                                                    }
                                                />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PDF, PNG, JPG, GIF не более 10MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {is_admin && (
                        <div className="inline-flex">
                            <button
                                type="submit"
                                className={`${
                                    this.state.fileUpload.isValidFileName &&
                                    this.state.fileUpload.isValidFileSize &&
                                    this.state.fileUpload.type == 'pdf'
                                        ? 'ml-6 mr-6 mt-6 justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                                        : 'ml-6 mr-6 mt-6 justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                                }`}
                                disabled={
                                    !this.state.fileUpload.isValidFileName ||
                                    !this.state.fileUpload.isValidFileSize
                                }
                            >
                                Загрузить протокол
                            </button>
                            {file_protocol && (
                                <button
                                    type="submit"
                                    className="mt-6 justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <form
                                        ref={(ref) => {
                                            this.form = ref;
                                        }}
                                        id="form_del_protocol"
                                        action={`/polls/${poll}/delProtocol`}
                                        method="get"
                                    >
                                        <input
                                            type="hidden"
                                            name="_token"
                                            value={csrf_token}
                                        />
                                        <a
                                            href={`/polls/${poll}/delProtocol`}
                                            onClick={this.handleProtocolDelete}
                                            className="hover:text-white"
                                        >
                                            Удалить сохраненный протокол
                                        </a>
                                    </form>
                                </button>
                            )}
                        </div>
                    )}
                </form>
            </div>
        );
    }
}

export default Protocol;
