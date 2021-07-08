import React  from 'react';
import { addItem } from '../../shared/items-requests';
import AddEntityModal from './AddEntityModal';

const AddItemModal = ({
    parentId,
    onItemAdded,
    visible,
    onCancel,
}) => {
    return (
        <AddEntityModal
            parentId={parentId}
            onAdded={onItemAdded}
            visible={visible}
            onCancel={onCancel}
            addFunction={addItem}
        />
    );
};

export default AddItemModal;
