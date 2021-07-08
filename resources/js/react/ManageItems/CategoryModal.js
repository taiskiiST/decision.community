import React, { useState } from 'react';
import { Modal, Upload, Input, Button, Checkbox } from 'antd';
import ImgCrop from 'antd-img-crop';
import { addCategory } from '../../shared/items-requests';

const CategoryModal = ({
    parentId,
    onCategoryAdded,
    visible,
    onCancel,
    isEmployeeOnlyDisabled
}) => {
    const [categoryName, setCategoryName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [employeeOnly, setEmployeeOnly] = useState(false);

    const onSubmit = async () => {
        if (fileList.length === 0 || ! fileList[0].originFileObj || ! categoryName) {
            return;
        }

        setIsLoading(true);

        const newCategory = await addCategory(fileList[0].originFileObj, categoryName, parentId, employeeOnly);

        if (newCategory) {
            onCategoryAdded(newCategory);

            setCategoryName('');
            setFileList([]);
            setEmployeeOnly(false);
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
        setCategoryName(e.target.value);
    };

    const onEmployeeOnlyClick = (e) => {
        setEmployeeOnly(e.target.checked);
    };

    return (
        <Modal
            onCancel={onCancel}
            title="Adding a New Category"
            visible={visible}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isLoading}
                    onClick={onSubmit}
                    disabled={! categoryName || fileList.length === 0}
                >
                    Submit
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
                            {fileList.length < 1 && 'Add Icon'}
                        </Upload>
                    </ImgCrop>
                </div>

                <div className="flex-grow ml-4 flex flex-col justify-between items-start">
                    <div>
                        <label htmlFor="categoryName">
                            Name
                        </label>

                        <Input
                            id="categoryName"
                            placeholder="New Category"
                            allowClear
                            onChange={onNameChange}
                            value={categoryName}
                        />
                    </div>

                    <div className="mt-4">
                        <Checkbox
                            checked={isEmployeeOnlyDisabled ? true : employeeOnly}
                            disabled={isEmployeeOnlyDisabled}
                            onChange={onEmployeeOnlyClick}
                        >
                            Employee Only
                        </Checkbox>
                    </div>
                </div>
            </div>
        </Modal>
    )
};

export default CategoryModal;
