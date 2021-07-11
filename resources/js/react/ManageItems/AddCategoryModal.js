import React  from 'react';
import { addCategory } from '../../shared/items-requests';
import AddEntityModal from './AddEntityModal';

const AddCategoryModal = ({
    parentId,
    onCategoryAdded,
    visible,
    onCancel,
}) => {
    return (
        <AddEntityModal
            parentId={parentId}
            onAdded={onCategoryAdded}
            visible={visible}
            onCancel={onCancel}
            addFunction={addCategory}
        />
    );
};

export default AddCategoryModal;
