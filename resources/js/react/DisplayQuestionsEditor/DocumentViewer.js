import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import {
    ArrowLongLeftIcon,
    ArrowLongRightIcon,
} from '@heroicons/react/20/solid';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const Paginator = ({
    onPreviousClick,
    onNextClick,
    currentPage,
    pagesCount,
}) => (
    <nav className="flex w-72 items-center justify-between border-t border-gray-200 px-4 sm:px-0">
        <div className="-mt-px flex w-0 flex-1">
            <button
                type="button"
                onClick={onPreviousClick}
                className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
                <ArrowLongLeftIcon
                    className="mr-3 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                />
                Предыдущая страница
            </button>
        </div>

        <div className="hidden md:-mt-px md:flex">
            <div className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                {currentPage} <span> / {pagesCount} </span>
            </div>
            {/* Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" */}
        </div>

        <div className="-mt-px flex w-0 flex-1 justify-end">
            <button
                type="button"
                onClick={onNextClick}
                className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
            >
                Следующая страница
                <ArrowLongRightIcon
                    className="ml-3 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                />
            </button>
        </div>
    </nav>
);

const ImageViewer = ({ file }) => (
    <div className="w-128">
        <img src={`/storage/${file.path_to_file}`} alt="Document picture" />
    </div>
);

const OtherFileViewer = ({ file }) => (
    <a
        href={`/storage/${file.path_to_file}`}
        target="_blank"
        className="bg-violet-500 hover:bg-violet-400 focus:outline-none focus:ring focus:ring-violet-300 active:bg-violet-600"
    >
        Скачать
    </a>
);

const PDFViewer = ({ file }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(0);

    return (
        <div className="flex flex-col items-center justify-center">
            <Document
                file={`/storage/${file.path_to_file}`}
                onLoadSuccess={({ numPages }) => setPagesCount(numPages)}
            >
                <Page pageNumber={currentPage} renderTextLayer={false} />
            </Document>

            <Paginator
                currentPage={currentPage}
                pagesCount={pagesCount}
                onNextClick={() =>
                    setCurrentPage((prev) => Math.min(pagesCount, prev + 1))
                }
                onPreviousClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                }
            />
        </div>
    );
};

const DocumentViewer = ({ file }) => {
    if (!file) {
        return null;
    }

    const { path_to_file } = file;

    if (path_to_file.indexOf('.pdf') >= 0) {
        return <PDFViewer file={file} />;
    }

    if (
        path_to_file.indexOf('.jpg') >= 0 ||
        path_to_file.indexOf('.png') >= 0
    ) {
        return <ImageViewer file={file} />;
    }

    return <OtherFileViewer file={file} />;
};

export default DocumentViewer;
