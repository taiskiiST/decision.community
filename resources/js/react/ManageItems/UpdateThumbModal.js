import React, { useState } from 'react';
import { Modal, Upload, Button } from 'antd';
import ImgCrop from 'antd-img-crop';
import { updateItemThumb } from '../../shared/items-requests';

const UpdateThumbModal = ({
  itemId,
  currentThumbUrl,
  onThumbUpdated,
  visible,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const onSubmit = async () => {
    if (fileList.length === 0 || !fileList[0].originFileObj || !itemId) {
      return;
    }

    setIsLoading(true);

    const newCategory = await updateItemThumb(
      itemId,
      fileList[0].originFileObj,
    );

    if (newCategory) {
      onThumbUpdated(newCategory);

      setFileList([]);
    }

    setIsLoading(false);
  };

  const onPreview = async (file) => {
    let src = file.url;

    if (!src) {
      src = await new Promise((resolve) => {
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
    const { onSuccess } = info;

    onSuccess();
  };

  return (
    <Modal
      title="Изменить картинку"
      width={300}
      onCancel={onCancel}
      visible={visible}
      footer={
        <div className="flex items-center justify-between">
          <Button key="cancel" onClick={onCancel}>
            Отмена
          </Button>

          <Button
            key="submit"
            type="primary"
            loading={isLoading}
            onClick={onSubmit}
            disabled={!itemId || fileList.length === 0}
          >
            Обновить
          </Button>
        </div>
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex w-32 flex-col items-center justify-center px-2">
          <img
            className="rounded-full"
            src={currentThumbUrl}
            alt="Current Thumb"
          />

          <span className="leading-tight text-gray-500">Текущая</span>
        </div>

        <div>
          <ImgCrop rotate>
            <Upload
              customRequest={customRequest}
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
            >
              {fileList.length < 1 && 'Загрузить новую'}
            </Upload>
          </ImgCrop>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateThumbModal;
