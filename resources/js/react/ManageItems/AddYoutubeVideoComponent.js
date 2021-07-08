import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { YoutubeIcon } from '../../shared/components/icons/youtube';

const AddYoutubeVideoComponent = ({
    onYoutubeLinkPaste,
    onYoutubeLinkDrop,
    onYoutubeLinkChange,
    onAddYoutubeItemButtonClick,
    youtubeUrl
}) => {
    return (
        <div className="w-full flex rounded-md shadow-sm border border-dashed hover:border-blue-400 transition-colors">
            <span className="inline-flex h-32 items-center pl-1 md:pl-2 rounded-l-md text-gray-500 text-sm bg-gray-50">
                <YoutubeIcon />
            </span>

            <input
                onDrop={onYoutubeLinkDrop}
                onPaste={onYoutubeLinkPaste}
                type="text"
                name="youtube_video_url"
                id="youtube_video_url"
                className="focus:outline-none focus:shadow-none focus:ring-0 focus:border-transparent flex-grow block w-full rounded-none border-gray-300 text-base lg:text-lg font-medium placeholder-gray-700 border-none bg-gray-50"
                placeholder="Drop / paste a Youtube link"
                onChange={onYoutubeLinkChange}
                value={youtubeUrl}
            />

            <span className="inline-flex w-16 h-32 items-center text-gray-500 text-sm bg-gray-50">
                    <button
                        type="button"
                        className="h-full w-full rounded-r-md bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={onAddYoutubeItemButtonClick}
                    >
                        <PlusOutlined />
                    </button>
                </span>
        </div>
    );
};

export default AddYoutubeVideoComponent;
