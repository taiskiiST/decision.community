import React from 'react';
import ItemsTable from './ItemsTable';

const ItemsTableWrapper = ({
    selectedItemKey,
    itemsByKeys,
    onEmployeeOnlyChange,
    onRemoveBtnClicked,
    tableInputsDisabled,
    onItemNameChange,
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
            onEmployeeOnlyChange={onEmployeeOnlyChange}
            onRemoveBtnClicked={onRemoveBtnClicked}
            tableInputsDisabled={tableInputsDisabled}
            onItemNameChange={onItemNameChange}
            onItemThumbClicked={onItemThumbClicked}
        />
    );
};

export default ItemsTableWrapper;
