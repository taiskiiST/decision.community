import React, { useState } from 'react';
import { Modal, Upload, Input, Button } from 'antd';
import ImgCrop from 'antd-img-crop';

const AddEntityModal = ({
    parentId,
    onAdded,
    visible,
    onCancel,
    addFunction
}) => {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    const onSubmit = async () => {
        if (! name) {
            return;
        }

        setIsLoading(true);

        const fileObj = typeof fileList[0] === 'undefined' ? null : fileList[0].originFileObj;

        const newEntity = await addFunction(fileObj, name, parentId);

        if (newEntity) {
            onAdded(newEntity);

            setName('');
            setFileList([]);
        }

        setIsLoading(false);
    };

    const onPreview = async file => {
        let src = file.url;

        if (! src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }

        const image = new Image();
        image.src = src;

        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };

    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const customRequest = async (info) => {
        const { onSuccess} = info;

        onSuccess();
    };

    const onNameChange = (e) => {
        setName(e.target.value);
    };

    return (
        <Modal
            onCancel={onCancel}
            title="Добавить новую сущность"
            visible={visible}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Отмена
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isLoading}
                    onClick={onSubmit}
                    disabled={! name}
                >
                    ОК
                </Button>,
            ]}
        >
            <div className="flex flex-row justify-between items-center">
                <div>
                    <ImgCrop rotate>
                        <Upload
                            customRequest={customRequest}
                            listType="picture-card"
                            fileList={fileList}
                            onChange={onChange}
                            onPreview={onPreview}
                        >
                            {fileList.length < 1 && 'Иконка'}
                        </Upload>
                    </ImgCrop>
                </div>

                <div className="flex-grow ml-4 flex flex-col justify-between items-start">
                    <div>
                        <label htmlFor="name">
                            Имя
                        </label>

                        <Input
                            id="name"
                            placeholder="Новая сущность"
                            allowClear
                            onChange={onNameChange}
                            value={name}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    )
};

export default AddEntityModal;
