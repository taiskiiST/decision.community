import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import {
    getItems,
    updateItemParent,
    removeItem,
    updateItemName,
    updateItemPhone,
    updateItemCost,
    updateItemDescription,
    updateItemAddress,
    updateItemElementary,
    updateItemCommitteeMembers,
    updateItemPresidiumMembers,
    updateItemChairman,
    updateItemRevCommitteeMembers,
    updateItemRevPresidiumMembers,
    updateItemRevChairman,
} from '../../shared/items-requests';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { truncateText } from '../../shared/helpers';
import ItemsTableWrapper from './ItemsTableWrapper';
import TreeWrapper from './TreeWrapper';
import UpdateThumbModal from './UpdateThumbModal';
import AddCategoryModal from './AddCategoryModal';
import AddItemModal from './AddItemModal';
import MembersPicker from './MembersPicker';

const { confirm } = Modal;

const App = () => {
    const [treeLoading, setTreeLoading] = useState(true);
    const [itemsByKeys, setItemsByKeys] = useState(new Map());
    const [selectedItemKey, setSelectedItemKey] = useState(null);
    const [tableInputsDisabled, setTableInputsDisabled] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
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

    const getItemFirstChildren = (itemsByKeys, item) => {
        if (! item) {
            return [];
        }

        const { id } = item;

        const out = [];

        itemsByKeys.forEach((value, key) => {
            const { parentId } = value;

            if (parentId === id) {
                out.push(value);
            }
        });

        return out;
    };

    const prepareItem = (item) => {
        const {
            id,
            parent_id,
            name,
            phone,
            cost,
            description,
            address,
            is_category,
            thumbUrl,
            prepared,
            elementary,
            currentCommitteeMembers,
            currentPresidiumMembers,
            currentChairman,
            currentRevCommitteeMembers,
            currentRevPresidiumMembers,
            currentRevChairman,
        } = item;

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
            thumbUrl: thumbUrl,
            phone: phone,
            cost: cost,
            description: description,
            elementary: elementary,
            address: address,
            prepared: true,
            loadedChildren: true,
            currentCommitteeMembers: currentCommitteeMembers ?? [],
            currentPresidiumMembers: currentPresidiumMembers ?? [],
            currentChairman: currentChairman ?? {},
            currentRevCommitteeMembers: currentRevCommitteeMembers ?? [],
            currentRevPresidiumMembers: currentRevPresidiumMembers ?? [],
            currentRevChairman: currentRevChairman ?? {},
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
            const { updatedChildren } = updatedItemFromServer;

            newItemsByKeys.set(dragItem.key, {
                ...dragItem,
                parentId: parent ? parent.id : 0,
            });

            if (updatedChildren) {
                updateChildrenAfterServerResponse(updatedChildren, newItemsByKeys);
            }

            setItemsByKeys(newItemsByKeys);
        };

        const proceedOnDropWithConfirm = (dragItem, parent) => {
            confirm({
                title: 'Вы уверены?',
                icon: <ExclamationCircleOutlined />,
                content: `Это переместит все содержимое '${dragItem.fullTitle}'.`,
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

        if (dragItem.isCategory && parent) {
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

    const updateChildrenAfterServerResponse = (updatedChildren, newItemsByKeys) => {
        updatedChildren.forEach(child => {
            const { id: childId } = child;

            const loadedItem = newItemsByKeys.get(childId);
            if (! loadedItem) {
                return;
            }

            newItemsByKeys.set(childId, {
                ...loadedItem,
            });
        });
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

    const onNewItemBtnClick = async (e, parentId = null) => {
        if (parentId) {
            setSelectedItemKey(parentId);
        }

        setIsItemModalOpen(true);
    };

    const onCategoryAdded = async (newCategory) => {
        await addItemToTree(newCategory);

        message.success(`Новая сущность '${newCategory.name}' добавлена!`);

        setIsCategoryModalOpen(false);
    };

    const onItemAdded = async (newItem) => {
        await addItemToTree(newItem);

        message.success(`Новая сущность '${newItem.name}' добавлена!`);

        setIsItemModalOpen(false);
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

    const onItemPhoneChange = async (item, e) => {
        const newPhone = e.target.value;
        if (! newPhone) {
            return;
        }

        const { id } = item;

        const updatedItemFromServer = await updateItemPhone({
            id: id,
            phone: newPhone
        });

        if (! updatedItemFromServer) {
            return;
        }

        setItemsByKeys(currentItemsByKeys => {
            const newItemsByKeys = new Map(currentItemsByKeys);

            const { phone } = updatedItemFromServer;

            newItemsByKeys.set(id, {
                ...item,
                phone: phone,
            });

            return newItemsByKeys;
        });
    };

    const onItemCostChange = async (item, e) => {
        const newCost = e.target.value;
        if (! newCost) {
            return;
        }

        const { id } = item;

        const updatedItemFromServer = await updateItemCost({
            id: id,
            cost: newCost
        });

        if (! updatedItemFromServer) {
            return;
        }

        setItemsByKeys(currentItemsByKeys => {
            const newItemsByKeys = new Map(currentItemsByKeys);

            const { cost } = updatedItemFromServer;

            newItemsByKeys.set(id, {
                ...item,
                cost: cost,
            });

            return newItemsByKeys;
        });
    };

    const onItemDescriptionChange = async (item, e) => {
        const newDescription = e.target.value;
        if (! newDescription) {
            return;
        }

        const { id } = item;

        const updatedItemFromServer = await updateItemDescription({
            id: id,
            description: newDescription
        });

        if (! updatedItemFromServer) {
            return;
        }

        setItemsByKeys(currentItemsByKeys => {
            const newItemsByKeys = new Map(currentItemsByKeys);

            const { description } = updatedItemFromServer;

            newItemsByKeys.set(id, {
                ...item,
                description: description,
            });
            return newItemsByKeys;
        });
    };

    const onElementaryChange = async (itemId, isElementary) => {
        const item = itemsByKeys.get(itemId);

        const updatedItemFromServer = await updateItemElementary({
            id: itemId,
            elementary: isElementary
        });

        if (! updatedItemFromServer) {
            return;
        }

        const newItemsByKeys = new Map(itemsByKeys);

        const {
            elementary: newElementary,
            currentCommitteeMembers,
            currentPresidiumMembers,
            currentChairman,
            currentRevCommitteeMembers,
            currentRevPresidiumMembers,
            currentRevChairman,
        } = updatedItemFromServer;

        newItemsByKeys.set(itemId, {
            ...item,
            elementary: newElementary,
            currentCommitteeMembers: currentCommitteeMembers,
            currentPresidiumMembers: currentPresidiumMembers,
            currentChairman: currentChairman,
            currentRevCommitteeMembers: currentRevCommitteeMembers,
            currentRevPresidiumMembers: currentRevPresidiumMembers,
            currentRevChairman: currentRevChairman,
        });

        setItemsByKeys(newItemsByKeys);
    };

    const onItemAddressChange = async (item, e) => {
        const newAddress = e.target.value;
        if (! newAddress) {
            return;
        }

        const { id } = item;

        const updatedItemFromServer = await updateItemAddress({
            id: id,
            address: newAddress
        });

        if (! updatedItemFromServer) {
            return;
        }

        setItemsByKeys(currentItemsByKeys => {
            const newItemsByKeys = new Map(currentItemsByKeys);

            const { address } = updatedItemFromServer;

            newItemsByKeys.set(id, {
                ...item,
                address: address,
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

    const onCommitteeListChange = async (item, selectedMembers) => {
        const { id } = item;

        const updatedItemFromServer = await updateItemCommitteeMembers({
            id: id,
            committeeMembers: selectedMembers.map(member => member.value)
        });

        if (! updatedItemFromServer) {
            return;
        }

        setItemsByKeys(currentItemsByKeys => {
            const newItemsByKeys = new Map(currentItemsByKeys);

            const { currentCommitteeMembers, currentPresidiumMembers, currentChairman } = updatedItemFromServer;

            newItemsByKeys.set(id, {
                ...item,
                currentCommitteeMembers: currentCommitteeMembers,
                currentPresidiumMembers: currentPresidiumMembers,
                currentChairman: currentChairman
            });

            return newItemsByKeys;
        });
    };

    const onPresidiumListChange = async (item, selectedMembers) => {
        const { id } = item;

        const updatedItemFromServer = await updateItemPresidiumMembers({
            id: id,
            presidiumMembers: selectedMembers.map(member => member.value)
        });

        if (! updatedItemFromServer) {
            return;
        }

        setItemsByKeys(currentItemsByKeys => {
            const newItemsByKeys = new Map(currentItemsByKeys);

            const { currentPresidiumMembers, currentChairman } = updatedItemFromServer;

            newItemsByKeys.set(id, {
                ...item,
                currentPresidiumMembers: currentPresidiumMembers,
                currentChairman: currentChairman
            });

            return newItemsByKeys;
        });
    };

    const onChairmanChange = async (item, selectedChairman) => {
        const { id } = item;

        const updatedItemFromServer = await updateItemChairman({
            id: id,
            chairman: selectedChairman.value
        });

        if (! updatedItemFromServer) {
            return;
        }

        setItemsByKeys(currentItemsByKeys => {
            const newItemsByKeys = new Map(currentItemsByKeys);

            const { currentChairman } = updatedItemFromServer;

            newItemsByKeys.set(id, {
                ...item,
                currentChairman: currentChairman,
            });

            return newItemsByKeys;
        });
    };

    const onRevCommitteeListChange = async (item, selectedMembers) => {
        const { id } = item;

        const updatedItemFromServer = await updateItemRevCommitteeMembers({
            id: id,
            revCommitteeMembers: selectedMembers.map(member => member.value)
        });

        if (! updatedItemFromServer) {
            return;
        }

        setItemsByKeys(currentItemsByKeys => {
            const newItemsByKeys = new Map(currentItemsByKeys);

            const {
                currentRevCommitteeMembers,
                currentRevPresidiumMembers,
                currentRevChairman,
            } = updatedItemFromServer;

            newItemsByKeys.set(id, {
                ...item,
                currentRevCommitteeMembers: currentRevCommitteeMembers,
                currentRevPresidiumMembers: currentRevPresidiumMembers,
                currentRevChairman: currentRevChairman,
            });

            return newItemsByKeys;
        });
    };

    const onRevPresidiumListChange = async (item, selectedMembers) => {
        const { id } = item;

        const updatedItemFromServer = await updateItemRevPresidiumMembers({
            id: id,
            revPresidiumMembers: selectedMembers.map(member => member.value)
        });

        if (! updatedItemFromServer) {
            return;
        }

        setItemsByKeys(currentItemsByKeys => {
            const newItemsByKeys = new Map(currentItemsByKeys);

            const { currentRevPresidiumMembers, currentRevChairman } = updatedItemFromServer;

            newItemsByKeys.set(id, {
                ...item,
                currentRevPresidiumMembers: currentRevPresidiumMembers,
                currentRevChairman: currentRevChairman
            });

            return newItemsByKeys;
        });
    };

    const onRevChairmanChange = async (item, selectedRevChairman) => {
        const { id } = item;

        const updatedItemFromServer = await updateItemRevChairman({
            id: id,
            revChairman: selectedRevChairman.value
        });

        if (! updatedItemFromServer) {
            return;
        }

        setItemsByKeys(currentItemsByKeys => {
            const newItemsByKeys = new Map(currentItemsByKeys);

            const { currentRevChairman } = updatedItemFromServer;

            newItemsByKeys.set(id, {
                ...item,
                currentRevChairman: currentRevChairman,
            });

            return newItemsByKeys;
        });
    };

    const onItemThumbClicked = (item) => {
        setUpdateThumbModalItem(item);

        setIsUpdateThumbModalOpen(true);
    };

    const getItemChildren = (item, out) => {
        if (! item) {
            return [];
        }

        const children = getItemFirstChildren(itemsByKeys, item);

        if (children.length === 0 && ! item.isCategory) {
            const { id, fullTitle } = item;

            out.push({
                id: id,
                name: fullTitle
            });

            return out;
        }

        children.forEach(child => {
            return out.concat(getItemChildren(child, out));
        });

        return out;
    };

    const getPotentialCommitteeMembers = (item) => {
        if (! item) {
            return [];
        }

        const out = [];
        getItemChildren(item, out);

        return out;
    };

    const getPotentialChairmen = (item) => {
        if (! item) {
            return [];
        }

        const { elementary } = item;

        if (elementary) {
            return getItemFirstChildren(itemsByKeys, item).map(child => ({
                id: child.id,
                name: child.fullTitle
            }));
        }

        // If not elementary - generate the list from the presidium.
        return potentialPresidiumMembers.filter(member => {
            const { id } = member;

            return currentPresidiumMembers.find(currentPresidiumMemberId => currentPresidiumMemberId === id);
        });
    };

    const getPotentialRevChairmen = (item) => {
        if (! item) {
            return [];
        }

        const { elementary } = item;

        if (elementary) {
            return getItemFirstChildren(itemsByKeys, item).map(child => ({
                id: child.id,
                name: child.fullTitle
            }));
        }

        // If not elementary - generate the list from the presidium.
        return potentialRevPresidiumMembers.filter(member => {
            const { id } = member;

            return currentRevPresidiumMembers.find(currentRevPresidiumMemberId => currentRevPresidiumMemberId === id);
        });
    };

    const treeData = mapToTree(itemsByKeys).children;

    const selectedItem = selectedItemKey ? itemsByKeys.get(selectedItemKey) : null;
    const {
        currentCommitteeMembers,
        currentPresidiumMembers,
        currentChairman,
        currentRevCommitteeMembers,
        currentRevPresidiumMembers,
        currentRevChairman
    } = selectedItem || {};

    const potentialCommitteeMembers = getPotentialCommitteeMembers(selectedItem);
    const potentialRevCommitteeMembers = potentialCommitteeMembers;

    const potentialPresidiumMembers = potentialCommitteeMembers.filter(member => {
        const { id } = member;

        return currentCommitteeMembers.find(currentCommitteeMemberId => currentCommitteeMemberId === id);
    });

    const potentialRevPresidiumMembers = potentialRevCommitteeMembers.filter(member => {
        const { id } = member;

        return currentRevCommitteeMembers.find(currentRevCommitteeMemberId => currentRevCommitteeMemberId === id);
    });

    const potentialChairmen = getPotentialChairmen(selectedItem);
    const potentialRevChairmen = getPotentialRevChairmen(selectedItem);

    return (
        <div className="flex flex-col-reverse justify-end md:justify-between md:flex-row min-h-2xl p-2">
            <AddCategoryModal
                parentId={selectedItem ? selectedItem.id : null}
                onCategoryAdded={onCategoryAdded}
                onCancel={() => setIsCategoryModalOpen(false)}
                visible={isCategoryModalOpen}
            />

            <AddItemModal
                parentId={selectedItem ? selectedItem.id : null}
                onItemAdded={onItemAdded}
                onCancel={() => setIsItemModalOpen(false)}
                visible={isItemModalOpen}
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
                        Новая категория
                    </button>

                    <button
                        type="button"
                        className="mt-2 w-full inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        id="add-new-category-button"
                        onClick={onNewItemBtnClick}
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
                        Новая личность
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
                {
                    selectedItem && selectedItem.isCategory ?
                    (
                        <React.Fragment>
                            <MembersPicker
                                id="committee_members_picker_id"
                                item={selectedItem}
                                onCommitteeListChange={onCommitteeListChange}
                                onPresidiumListChange={onPresidiumListChange}
                                onChairmanChange={onChairmanChange}
                                potentialCommitteeMembers={potentialCommitteeMembers}
                                potentialPresidiumMembers={potentialPresidiumMembers}
                                potentialChairmen={potentialChairmen}

                                currentCommitteeMembers={currentCommitteeMembers}
                                committeeListId={`item_${selectedItem.id}_committee_list`}
                                committeePickerLabel="Комитет"

                                currentPresidiumMembers={currentPresidiumMembers}
                                presidiumListId={`item_${selectedItem.id}_presidium_list`}
                                presidiumPickerLabel="Президиум"

                                currentChairman={currentChairman}
                                chairmenListId={`item_${selectedItem.id}_chairmen_list`}
                                chairmanPickerLabel="Председатель"
                            />

                            <MembersPicker
                                id="rev_committee_members_picker_id"
                                item={selectedItem}
                                onCommitteeListChange={onRevCommitteeListChange}
                                onPresidiumListChange={onRevPresidiumListChange}
                                onChairmanChange={onRevChairmanChange}
                                potentialCommitteeMembers={potentialRevCommitteeMembers}
                                potentialPresidiumMembers={potentialRevPresidiumMembers}
                                potentialChairmen={potentialRevChairmen}

                                currentCommitteeMembers={currentRevCommitteeMembers}
                                committeeListId={`item_${selectedItem.id}_rev_committee_list`}
                                committeePickerLabel="Рев. Комитет"

                                currentPresidiumMembers={currentRevPresidiumMembers}
                                presidiumListId={`item_${selectedItem.id}_rev_presidium_list`}
                                presidiumPickerLabel="Рев. Президиум"

                                currentChairman={currentRevChairman}
                                chairmenListId={`item_${selectedItem.id}_rev_chairmen_list`}
                                chairmanPickerLabel="Рев. Председатель"
                            />
                        </React.Fragment>
                    )
                    :  null
                }

                <div className="hidden md:block mt-2">
                    <ItemsTableWrapper
                        selectedItemKey={selectedItemKey}
                        itemsByKeys={itemsByKeys}
                        onRemoveBtnClicked={onRemoveItemBtnClicked}
                        tableInputsDisabled={tableInputsDisabled}
                        onItemNameChange={onItemNameChange}
                        onItemPhoneChange={onItemPhoneChange}
                        onItemCostChange={onItemCostChange}
                        onItemDescriptionChange={onItemDescriptionChange}
                        onItemAddressChange={onItemAddressChange}
                        onItemThumbClicked={onItemThumbClicked}
                        onElementaryChange={onElementaryChange}
                    />
                </div>
            </div>
        </div>
    );
};

render(<App />, document.getElementById('manage-items-root'));
