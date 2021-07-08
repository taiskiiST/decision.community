import React from 'react';
import { FilePdfOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { addPdfItem } from '../../shared/items-requests';

const { Dragger } = Upload;

const AddPdfComponent = ({
    parentId,
    onPdfAdded
}) => {
    const customRequest = async (info) => {
        const { file, onSuccess, onError, onProgress } = info;

        const newItem = await addPdfItem(file, parentId, (progressEvent) => {
            onProgress({
                percent: Math.round((progressEvent.loaded * 100) / progressEvent.total)
            }, file);
        });

        if (newItem) {
            onSuccess();

            onPdfAdded(newItem);
        } else {
            onError();
        }
    };

    return (
        <Dragger
            name="file"
            multiple={true}
            accept=".pdf"
            customRequest={customRequest}
            itemRender={(originNode, file) => {
                const { percent } = file;

                if (percent === 100) {
                    return null;
                }

                return originNode;
            }}
        >
            <p className="ant-upload-drag-icon">
                <FilePdfOutlined
                    style={{
                        color: '#ef4444'
                    }}
                />
            </p>

            <p className="text-base lg:text-lg font-medium text-gray-700">Click or drop PDF files</p>
        </Dragger>
    );
};

export default AddPdfComponent;
