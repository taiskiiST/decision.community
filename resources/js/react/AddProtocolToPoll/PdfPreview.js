import React from 'react';

const PdfPreview = ({ url }) => (
    <div>
        <object data={url} type="application/pdf" width="100%" height="100%" className="h-96">
            <div id="pdf-main-container" className="">

                <button id="show-pdf-button" value={url} className="hidden">Show PDF
                </button>
                <div id="pdf-loader">Загружается...</div>
                <div id="pdf-contents">
                    <div id="pdf-meta">
                        <div className="inline-flex flex-row w-full place-content-between">
                            <div className="py-3">
                                <button id="pdf-prev"
                                        className="mt-4 inline-flex items-center px-2 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Назад
                                </button>
                                <button id="pdf-next"
                                        className="mt-4 inline-flex items-center px-2 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Вперед
                                </button>
                            </div>
                            <div className="px-1 py-7 sm:px-6 flex-row-reverse ">
                                <div id="page-count-container" className="inline-flex">Страница&nbsp;
                                    <div id="pdf-current-page"></div>
                                    /
                                    <div id="pdf-total-pages"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <canvas id="pdf-canvas" className="w-full"></canvas>
                    <div id="page-loader">Загружается страница...</div>
                </div>
            </div>
        </object>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.228/pdf.min.js"></script>

    </div>
);

export default PdfPreview;
