import React from 'react';

const FileLoadedPreview = ({ url, alternativeText = 'Просмотреть файл по ссылке', file_id }) => (
    <div>
        <a href={url} target="_blank" className="bg-violet-500 hover:bg-violet-400 active:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300">{alternativeText}</a>
        <input name={file_id} defaultValue={url} className="hidden"/>
    </div>
);

export default FileLoadedPreview;
