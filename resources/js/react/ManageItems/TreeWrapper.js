import React from 'react';
import { Dropdown, Menu, Popconfirm, Tree } from 'antd';
import { DeleteOutlined, FolderAddOutlined } from '@ant-design/icons';
import { BallTriangle } from '../../shared/components/spinners/BallTriangle';

const TreeWrapper = ({
    onDrop,
    treeData,
    onLoadData,
    onSelect,
    selectedKeys,
    onDragOver,
    loading,
    onNewCategoryBtnClick,
    onRemoveItemBtnClicked
}) => {
    if (loading) {
        return (
            <div className="flex justify-center mt-4">
                <BallTriangle className="h-16"/>
            </div>
        );
    }

    const prepareItemTitle = (itemId, shortName) => {
        const menu = (
            <Menu>
                <Menu.Item key="addNewCategory">
                    <button
                        type="button"
                        className="focus:outline-none"
                        onClick={e => onNewCategoryBtnClick(e, itemId)}
                    >
                        <div className="flex justify-between items-center">
                            <FolderAddOutlined
                                style={{
                                    color: '#48bb78'
                                }}
                            />

                            <span className="ml-2">New Category</span>
                        </div>
                    </button>
                </Menu.Item>

                <Menu.Item key="removeItem">
                    <Popconfirm
                        title={`Remove '${shortName}'?`}
                        onConfirm={() => onRemoveItemBtnClicked(itemId)}
                        okText="Yes"
                        cancelText="No"
                        placement="bottomRight"
                    >
                        <button
                            type="button"
                            className="focus:outline-none"
                            onClick={e => {e.preventDefault();}}
                        >
                            <div className="flex justify-between items-center">
                                <DeleteOutlined
                                    style={{
                                        color: '#ef4444'
                                    }}
                                />

                                <span className="ml-2">Remove</span>
                            </div>
                        </button>
                    </Popconfirm>
                </Menu.Item>
            </Menu>
        );

        return (
            <Dropdown overlay={menu} trigger={['contextMenu']}>
                <div
                    className="site-dropdown-context-menu"
                >
                    {shortName}
                </div>
            </Dropdown>
        );
    };

    return (
        <Tree
            className="draggable-tree"
            draggable
            blockNode
            onDrop={onDrop}
            treeData={treeData}
            loadData={onLoadData}
            allowDrop={({ dropNode }) => { return dropNode.isCategory; }}
            showLine={{showLeafIcon: false}}
            showIcon={false}
            onSelect={onSelect}
            selectedKeys={selectedKeys}
            onDragOver={onDragOver}
            titleRender={(nodeData) => {
                const { id, shortTitle } = nodeData;

                return prepareItemTitle(id, shortTitle);
            }}
        />
    );
};

export default TreeWrapper;
