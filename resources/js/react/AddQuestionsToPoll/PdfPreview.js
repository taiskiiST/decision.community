import React from 'react';

const PdfPreview = ({ url, alternativeText, file_id }) => (
    <div>
        <object data={url} type="application/pdf" width="100%" height="100%" className="h-96">
            <p className="py-20">
                Перейдите по ссылке для предпросмотра: <br />
                <a href={url} target="_blank" className="bg-violet-500 hover:bg-violet-400 active:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300">ФАЙЛА</a> <br />
                PDF файла
            </p>
        </object>
        <input name={file_id} defaultValue={url} className="hidden"/>
    </div>
);

export default PdfPreview;
