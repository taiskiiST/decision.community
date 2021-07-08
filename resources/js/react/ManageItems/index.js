import React, { useState, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import {
    addYoutubeItem,
    getItems,
    updateItemParent,
    updateItemEmployeeOnly,
    removeItem,
    updateItemName,
} from '../../shared/items-requests';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { truncateText } from '../../shared/helpers';
import ItemsTableWrapper from './ItemsTableWrapper';
import TreeWrapper from './TreeWrapper';
import AddPdfComponent from './AddPdfComponent';
import AddYoutubeVideoComponent from './AddYoutubeVideoComponent';
import { BallTriangle } from '../../shared/components/spinners/BallTriangle';
import CategoryModal from './CategoryModal';
import UpdateThumbModal from './UpdateThumbModal';

const { confirm } = Modal;

const App = () => {
    const [treeLoading, setTreeLoading] = useState(true);
    const [addingYoutubeItem, setAddingYoutubeItem] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [itemsByKeys, setItemsByKeys] = useState(new Map());
    const [selectedItemKey, setSelectedItemKey] = useState(null);
    const [tableInputsDisabled, setTableInputsDisabled] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isUpdateThumbModalOpen, setIsUpdateThumbModalOpen] = useState(false);
    const [updateThumbModalItem, setUpdateThumbModalItem] = useState(null);

    useEffect(() => {
        const getFirstLevelItems = async () => {
            setTreeLoading(true);

            const items = await getItems();

            if (! Array.isArray(items)) {
                return;
            }

            const newItemsByKeys = new Map();

            items.forEach(item => {
                const preparedItem = (prepareItem(item));

                newItemsByKeys.set(preparedItem.key, preparedItem);
            });

            setItemsByKeys(newItemsByKeys);

            setTreeLoading(false);
        };

        getFirstLevelItems();
    }, []);

    const mapToTree = (map) => {
        const root = { id: 0, parentId: null, children: [] };

        const nodeList = { 0 : root };

        map.forEach((value, key) => {
            nodeList[key] = {
                ...nodeList[key],
                ...value
            };

            if (typeof nodeList[value.parentId] === 'undefined') {
                nodeList[value.parentId] = {};
            }

            if (typeof nodeList[value.parentId].children === 'undefined') {
                nodeList[value.parentId].children = [];
            }

            nodeList[value.parentId].children.push(nodeList[key]);
        });

        return root;
    };

    const prepareItem = (item) => {
        const { id, parent_id, name, is_category, isPdf, isYoutubeVideo, isEmployeeOnly, thumbUrl, prepared } = item;

        if (prepared) {
            return item;
        }

        const shortName = truncateText(name);

        return {
            id: id,
            parentId: Number(parent_id),
            key: id,
            fullTitle: name,
            shortTitle: shortName,
            isCategory: is_category,
            isLeaf: ! is_category,
            isPdf: isPdf,
            isYoutubeVideo: isYoutubeVideo,
            isEmployeeOnly: isEmployeeOnly,
            thumbUrl: thumbUrl,
            prepared: true,
            loadedChildren: false,
        };
    };

    const onLoadData = async ({ key, children }) => {
        return new Promise(async (resolve) => {
            const item = itemsByKeys.get(key);

            const { isCategory } = item;

            if (isCategory) {
                await fetchItemsChildrenIfNotYet(key);
            }

            resolve();
        });
    };

    const addItemToTree = async (itemFromServer) => {
        const item = prepareItem(itemFromServer);

        setItemsByKeys(currentItemsByKeys => {
            const newItemsByKeys = new Map(currentItemsByKeys);

            newItemsByKeys.set(item.key, item);

            return newItemsByKeys;
        });
    };

    const removeItemsFromTree = async (itemsIds) => {
        setItemsByKeys(currentItemsByKeys => {
            const newItemsByKeys = new Map(currentItemsByKeys);

            itemsIds.forEach(itemIdToDelete => {
                // Unselect the item if it is the one being deleted.
                if (itemIdToDelete === selectedItemKey) {
                    setSelectedItemKey(null);
                }

                newItemsByKeys.delete(itemIdToDelete);
            });

            return newItemsByKeys;
        });
    };

    const fetchItemsChildrenIfNotYet = async (key) => {
        const item = itemsByKeys.get(key);

        if (! item) {
            return;
        }

        const { loadedChildren } = item;

        if (loadedChildren) {
            return;
        }

        const newChildren = await getItems(key);

        if (! Array.isArray(newChildren)) {
            return;
        }

        const newItemsByKeys = new Map(itemsByKeys);

        newItemsByKeys.set(key, {
            ...item,
            loadedChildren: true,
        });

        newChildren.forEach(itemFromServer => {
            const preparedItem = prepareItem(itemFromServer);

            const { key } = preparedItem;

            newItemsByKeys.set(key, preparedItem);
        })

        setItemsByKeys(newItemsByKeys);
    };

    const onDrop = async (info) => {
        const proceedOnDrop = async (dragItem, parent) => {
            const updatedItemFromServer = await updateItemParent({
                id: dragItem.id,
                parentId: parent ? parent.id : null,
            });

            if (! updatedItemFromServer) {
                return;
            }

            const newItemsByKeys = new Map(itemsByKeys);

            // Change item's parent.
            const { isEmployeeOnly, updatedChildren } = updatedItemFromServer;

            newItemsByKeys.set(dragItem.key, {
                ...dragItem,
                parentId: parent ? parent.id : 0,
                isEmployeeOnly: isEmployeeOnly
            });

            if (updatedChildren) {
                updateChildrenAfterServerResponse(updatedChildren, newItemsByKeys, isEmployeeOnly);
            }

            setItemsByKeys(newItemsByKeys);
        };

        const proceedOnDropWithConfirm = (dragItem, parent) => {
            confirm({
                title: 'Do you want to continue?',
                icon: <ExclamationCircleOutlined />,
                content: `This will make all items inside '${dragItem.fullTitle}' employee-only.`,
                async onOk() {
                    await proceedOnDrop(dragItem, parent);
                },
                onCancel() {
                },
            });
        };

        const dragKey = info.dragNode.props.eventKey;
        const dragItem = itemsByKeys.get(dragKey);

        const dropKey = info.node.props.eventKey;
        const parentId = info.dropToGap ? null : dropKey;
        const parent = parentId ? itemsByKeys.get(parentId) : null;

        if (dragItem.isCategory && parent && parent.isEmployeeOnly) {
            proceedOnDropWithConfirm(dragItem, parent);
        } else {
            await proceedOnDrop(dragItem, parent);
        }
    };

    const clickedInsideContextMenu = (nativeEvent) => {
        const { target } = nativeEvent;

        return target.className !== 'ant-dropdown-trigger site-dropdown-context-menu';
    };

    const onSelect = async (selectedKeys, e) => {
        const {selected, node, nativeEvent}  = e;

        // Do not react if the event was triggered by clicking on
        // something inside the context menu.
        if (clickedInsideContextMenu(nativeEvent)) {
            return;
        }

        if (! selected) {
            setSelectedItemKey(null);

            return;
        }

        const { loaded, key, isCategory } = node;

        if (isCategory && ! loaded) {
            await fetchItemsChildrenIfNotYet(key);
        }

        setSelectedItemKey(key);
    };

    const chooseNewItemParentId = () => {
        if (! selectedItemKey) {
            return null;
        }

        const selectedItem = itemsByKeys.get(selectedItemKey);

        if (selectedItem.isCategory) {
            return selectedItem.id;
        }

        return selectedItem.parentId;
    }

    const onYoutubeLinkPaste = async (e) => {
        const url = e.clipboardData.getData('Text');

        setYoutubeUrl(url);

        await createYoutubeItem(url);
    };

    const onYoutubeLinkDrop = async (e) => {
        e.preventDefault();

        const url = e.dataTransfer.getData("Text");

        setYoutubeUrl(url);

        await createYoutubeItem(url);
    }

    const onAddYoutubeItemButtonClick = async (e) => {
        if (! youtubeUrl) {
            return;
        }

        await createYoutubeItem(youtubeUrl);
    }

    const createYoutubeItem = async (url) => {
        if (! url) {
            return;
        }

        setAddingYoutubeItem(true);

        const newItem = await addYoutubeItem(url, chooseNewItemParentId());

        setAddingYoutubeItem(false);

        if (! newItem) {
            return;
        }

        await addItemToTree(newItem);

        message.success(`Video ${newItem.name} has been added!`);

        setYoutubeUrl('');
    }

    const onDragOver = ({ event, node }) => {
        const clientY = event.clientY;
        const pageY = event.pageY;

        // When reaching the top - scroll up.
        if (clientY < 250) {
            window.scrollBy({
                top: -50,
                behavior: 'smooth'
            });
        }

        // When reaching the bottom - scroll down.
        if (pageY > window.scrollY + window.innerHeight - 200) {
            window.scrollBy({
                top: 50,
                behavior: 'smooth'
            });
        }
    };

    const onEmployeeOnlyChange = async (itemId, isEmployeeOnly) => {
        const proceedEmployeeOnlyChange = async (item, isEmployeeOnly) => {
            const { id: itemId } = item;

            const updatedItemFromServer = await updateItemEmployeeOnly({
                id: itemId,
                employeeOnly: isEmployeeOnly
            });

            if (! updatedItemFromServer) {
                return;
            }

            const newItemsByKeys = new Map(itemsByKeys);

            const { employee_only: newEmployeeOnly, updatedChildren } = updatedItemFromServer;

            newItemsByKeys.set(itemId, {
                ...item,
                isEmployeeOnly: newEmployeeOnly
            });

            if (updatedChildren) {
                updateChildrenAfterServerResponse(updatedChildren, newItemsByKeys, newEmployeeOnly);
            }

            setItemsByKeys(newItemsByKeys);
        };

        const proceedEmployeeOnlyChangeWithConfirm = (item, isEmployeeOnly) => {
            confirm({
                title: 'Do you want to continue?',
                icon: <ExclamationCircleOutlined />,
                content: `This will make all items inside '${item.fullTitle}' employee-only.`,
                async onOk() {
                    await proceedEmployeeOnlyChange(item, isEmployeeOnly);
                },
                onCancel() {
                },
            });
        };

        setTableInputsDisabled(true);

        const item = itemsByKeys.get(itemId);

        if (item.isCategory && isEmployeeOnly) {
            await proceedEmployeeOnlyChangeWithConfirm(item, isEmployeeOnly);
        } else {
            await proceedEmployeeOnlyChange(item, isEmployeeOnly);
        }

        setTableInputsDisabled(false);
    };

    const updateChildrenAfterServerResponse = (updatedChildren, newItemsByKeys, newEmployeeOnly) => {
        // Update all children's isEmployeeOnly.
        updatedChildren.forEach(child => {
            const { id: childId } = child;

            const loadedItem = newItemsByKeys.get(childId);
            if (! loadedItem) {
                return;
            }

            newItemsByKeys.set(childId, {
                ...loadedItem,
                isEmployeeOnly: newEmployeeOnly
            });
        });
    };

    const onPdfAdded = async (newItem) => {
        await addItemToTree(newItem);

        message.success(`PDF ${newItem.name} has been added!`);
    };

    const onRemoveItemBtnClicked = async (itemId) => {
        const deletedIds = await removeItem(itemId);
        if (! Array.isArray(deletedIds)) {
            return;
        }

        message.success(`The item has been removed!`);

        await removeItemsFromTree(deletedIds);
    };

    const onNewCategoryBtnClick = async (e, parentId = null) => {
        if (parentId) {
            setSelectedItemKey(parentId);
        }

        setIsCategoryModalOpen(true);
    };

    const onCategoryAdded = async (newCategory) => {
        await addItemToTree(newCategory);

        message.success(`A new category '${newCategory.name}' has been added!`);

        setIsCategoryModalOpen(false);
    };

    const onItemNameChange = async (item, e) => {
        const newName = e.target.value;
        if (! newName) {
            return;
        }

        const { id } = item;

        const updatedItemFromServer = await updateItemName({
            id: id,
            name: newName
        });

        if (! updatedItemFromServer) {
            return;
        }

        setItemsByKeys(currentItemsByKeys => {
            const newItemsByKeys = new Map(currentItemsByKeys);

            const { name } = updatedItemFromServer;

            newItemsByKeys.set(id, {
                ...item,
                fullTitle: name,
                shortTitle: truncateText(name),
            });

            return newItemsByKeys;
        });
    };

    const onItemThumbChange = async (updatedItemFromServer) => {
        if (! updatedItemFromServer) {
            return;
        }

        const { id } = updatedItemFromServer;

        const currentItem = itemsByKeys.get(id);
        if (! currentItem) {
            return;
        }

        setItemsByKeys(currentItemsByKeys => {
            const newItemsByKeys = new Map(currentItemsByKeys);

            const { thumbUrl } = updatedItemFromServer;

            newItemsByKeys.set(id, {
                ...currentItem,
                thumbUrl: thumbUrl,
            });

            return newItemsByKeys;
        });

        message.success(`A thumb has been changed!`);

        setIsUpdateThumbModalOpen(false);
    };

    const onItemThumbClicked = (item) => {
        setUpdateThumbModalItem(item);

        setIsUpdateThumbModalOpen(true);
    };

    const treeData = mapToTree(itemsByKeys).children;
    const selectedItem = selectedItemKey ? itemsByKeys.get(selectedItemKey) : null;

    return (
        <div className="flex flex-col-reverse justify-end md:justify-between md:flex-row min-h-2xl p-2">
            <CategoryModal
                parentId={selectedItem ? selectedItem.id : null}
                onCategoryAdded={onCategoryAdded}
                onCancel={() => setIsCategoryModalOpen(false)}
                visible={isCategoryModalOpen}
                isEmployeeOnlyDisabled={selectedItem ? selectedItem.isCategory && selectedItem.isEmployeeOnly : false}
            />

            <UpdateThumbModal
                itemId={updateThumbModalItem ? updateThumbModalItem.id : null}
                currentThumbUrl={updateThumbModalItem ? updateThumbModalItem.thumbUrl : null}
                onThumbUpdated={onItemThumbChange}
                onCancel={() => setIsUpdateThumbModalOpen(false)}
                visible={isUpdateThumbModalOpen}
            />

            <div className="w-full md:w-72 min-w-72 p-1">
                <div className="mb-2">
                    <button
                        type="button"
                        className="w-full inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        id="add-new-category-button"
                        onClick={onNewCategoryBtnClick}
                    >
                        <svg
                            className="block -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        New Category
                    </button>
                </div>

                <TreeWrapper
                    onDrop={onDrop}
                    treeData={treeData}
                    onLoadData={onLoadData}
                    onSelect={onSelect}
                    selectedKeys={selectedItemKey ? [selectedItemKey] : []}
                    onDragOver={onDragOver}
                    loading={treeLoading}
                    onNewCategoryBtnClick={onNewCategoryBtnClick}
                    onRemoveItemBtnClicked={onRemoveItemBtnClicked}
                />
            </div>

            <div className="md:flex-grow p-1 min-h-full overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start">
                    <div className="w-full md:flex-1 mb-4 md:pr-2">
                        <AddPdfComponent
                            parentId={chooseNewItemParentId()}
                            onPdfAdded={onPdfAdded}
                        />
                    </div>

                    <div className="w-full md:flex-1 mb-2 md:pl-2 flex justify-center items-center">
                        {
                            addingYoutubeItem
                                ? <BallTriangle className="h-24"/>
                                : <AddYoutubeVideoComponent
                                    loading={addingYoutubeItem}
                                    onYoutubeLinkPaste={onYoutubeLinkPaste}
                                    onYoutubeLinkDrop={onYoutubeLinkDrop}
                                    onYoutubeLinkChange={(e) => setYoutubeUrl(e.target.value)}
                                    onAddYoutubeItemButtonClick={onAddYoutubeItemButtonClick}
                                    youtubeUrl={youtubeUrl}
                                />
                        }
                    </div>
                </div>

                <div className="hidden md:block">
                    <ItemsTableWrapper
                        selectedItemKey={selectedItemKey}
                        itemsByKeys={itemsByKeys}
                        onEmployeeOnlyChange={onEmployeeOnlyChange}
                        onRemoveBtnClicked={onRemoveItemBtnClicked}
                        tableInputsDisabled={tableInputsDisabled}
                        onItemNameChange={onItemNameChange}
                        onItemThumbClicked={onItemThumbClicked}
                    />
                </div>
            </div>
        </div>
    );
};

render(<App />, document.getElementById('manage-items-root'));
