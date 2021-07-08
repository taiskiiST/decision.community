import React from 'react';
import ItemsTable from '../ItemsTable';

const ItemsTableWrapper = ({
    selectedNode,
    treeData,
    onEmployeeOnlyChange
}) => {
    let items = [];

    // First-level items.
    if (! selectedNode) {
        items = treeData;
    } else if (selectedNode.isCategory && Array.isArray(selectedNode.children)) {
        // A category item.
        items = selectedNode.children;
    } else {
        // A non-category item.
        items = [selectedNode];
    }

    return (
        <ItemsTable items={items} onEmployeeOnlyChange={onEmployeeOnlyChange}/>
    );
};

export default ItemsTableWrapper;
