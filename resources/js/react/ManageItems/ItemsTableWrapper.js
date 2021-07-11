import React from 'react';
import ItemsTable from './ItemsTable';

const ItemsTableWrapper = ({
    selectedItemKey,
    itemsByKeys,
    onRemoveBtnClicked,
    tableInputsDisabled,
    onItemNameChange,
    onItemPhoneChange,
    onItemPinChange,
    onItemAddressChange,
    onItemThumbClicked
}) => {
    let items = [];

    const selectedItem = selectedItemKey ? itemsByKeys.get(selectedItemKey) : null;

    if (! selectedItemKey) {
        // First-level items.
        itemsByKeys.forEach((value, key) => {
            if (value.parentId === 0) {
                items.push(value);
            }
        });
    } else if (selectedItem.isCategory) {
        // A category item.
        itemsByKeys.forEach((value, key) => {
            if (value.parentId === selectedItem.key) {
                items.push(value);
            }
        });
    } else {
        // A non-category item.
        items = [selectedItem];
    }

    if (items.length === 0) {
        return null;
    }

    return (
        <ItemsTable
            items={items}
            onRemoveBtnClicked={onRemoveBtnClicked}
            tableInputsDisabled={tableInputsDisabled}
            onItemNameChange={onItemNameChange}
            onItemPhoneChange={onItemPhoneChange}
            onItemPinChange={onItemPinChange}
            onItemAddressChange={onItemAddressChange}
            onItemThumbClicked={onItemThumbClicked}
        />
    );
};

export default ItemsTableWrapper;
