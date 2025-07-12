import React, { useState } from 'react';
import { Modal, Upload, Input, Button } from 'antd';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import ImgCrop from 'antd-img-crop';
import type { UploadFile } from 'antd/es/upload';
import { addEntity } from '../entities-requests';
import { Entity } from 'types/types';

type AddEntityModalProps = {
    parentId: number | null;
    onEntityAdded: (entity: Entity) => void;
    onCancel: () => void;
    open: boolean;
};

const AddEntityModal = ({
    parentId,
    onEntityAdded,
    onCancel,
    open,
}: AddEntityModalProps) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const onSubmit = async () => {
        if (!name) {
            return;
        }

        setIsLoading(true);

        const fileObj =
            typeof fileList[0] === 'undefined' ? null : fileList[0].originFileObj;

        const normalizedPhone = phoneNumber.replace(/\D/g, '').replace(/^7/, '');
        const newEntity = await addEntity(fileObj, name, normalizedPhone, parentId);

        if (newEntity) {
            onEntityAdded(newEntity);

            setName('');
            setPhoneNumber('');
            setFileList([]);
        }

        setIsLoading(false);
    };

    const onPreview = async (file: UploadFile) => {
        let src: string | undefined = file.url;

        if (!src && file.originFileObj instanceof Blob) {
            src = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj as Blob);
                reader.onload = () => resolve(reader.result as string);
            });
        }

        if (!src) {
            return;
        }

        const image = new Image();
        image.src = src;

        const imgWindow = window.open(src);
        if (imgWindow) {
            const doc = imgWindow.document;

            // Clear and build the new document safely
            doc.open();
            doc.body.innerHTML = ''; // clear just in case
            const style = doc.createElement('style');
            style.textContent = `
      body { margin: 0; display: flex; align-items: center; justify-content: center; height: 100vh; background: #000; }
      img { max-width: 100%; max-height: 100%; object-fit: contain; }
    `;
            doc.head.appendChild(style);

            const img = new Image();
            img.src = src;

            doc.body.appendChild(img);
            doc.close();
        } else {
            console.error('Failed to open preview window');
        }
    };

    const onChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        setFileList(newFileList);
    };

    const customRequest = async (info: UploadRequestOption) => {
        const { onSuccess } = info;

        onSuccess?.('ok');
    };

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const onPhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
    };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            title="Добавить новую сущность"
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Отмена
                </Button>,

                <Button
                    key="submit"
                    type="primary"
                    loading={isLoading}
                    onClick={onSubmit}
                    disabled={!name}
                >
                    ОК
                </Button>,
            ]}
        >
            <div className="flex flex-row items-center justify-between">
                <div>
                    <ImgCrop rotationSlider zoomSlider>
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

                <div className="ml-4 flex flex-grow flex-col items-start justify-between">
                    <div className="space-y-2">
                        <div>
                            <label htmlFor="name">Имя</label>
                            <Input
                                id="name"
                                placeholder="Новая сущность"
                                allowClear
                                onChange={onNameChange}
                                value={name}
                            />
                        </div>

                        <div>
                            <label htmlFor="phone">Телефон</label>
                            <Input
                                id="phone"
                                placeholder="+7 (___) ___-__-__"
                                allowClear
                                onChange={onPhoneNumberChange}
                                value={phoneNumber}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AddEntityModal;
