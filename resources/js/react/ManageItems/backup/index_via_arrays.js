import React, { useState, useEffect, useRef } from 'react';
import { render } from 'react-dom';
import { addYoutubeItem, getItems, updateItem } from '../../../shared/items-requests';
import { message } from 'antd';
import { truncateText } from '../../../shared/helpers';
import DropAndPasteComponent from '../DropAndPasteComponent';
import ItemsTableWrapper from '../ItemsTableWrapper';
import TreeWrapper from '../TreeWrapper';

const App = () => {
    const treeElement = useRef(null);
    const [treeData, setTreeData] = useState([]);
    const [treeLoading, setTreeLoading] = useState(true);
    const [addingYoutubeItem, setAddingYoutubeItem] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);
    const [youtubeUrl, setYoutubeUrl] = useState('');

    useEffect(() => {
        const getFirstLevelItems = async () => {
            setTreeLoading(true);

            const items = await getItems();

            if (! Array.isArray(items)) {
                return;
            }

            setTreeData(items.map(item => prepareItem(item)));

            setTreeLoading(false);
        };

        getFirstLevelItems();
    }, []);

    const updateTreeData = (list, key, children) => {
        return list.map((node) => {
            if (node.key === key) {
                return { ...node, children };
            } else if (node.children) {
                return { ...node, children: updateTreeData(node.children, key, children) };
            }

            return node;
        });
    };

    const prepareItem = (item) => {
        const { id, parent_id, name, is_category, isPdf, isYoutubeVideo, isEmployeeOnly, thumbUrl, prepared } = item;

        if (prepared) {
            return item;
        }

        return {
            id: id,
            parentId: parent_id,
            key: id,
            title: truncateText(name),
            fullTitle: name,
            isCategory: is_category,
            isLeaf: ! is_category,
            isPdf: isPdf,
            isYoutubeVideo: isYoutubeVideo,
            isEmployeeOnly: isEmployeeOnly,
            thumbUrl: thumbUrl,
            prepared: true
        };
    };

    const refreshItemsChildren = (key, newChildren) => {
        const preparedChildren = newChildren.map(child => prepareItem(child));

        setTreeData((original) =>
            updateTreeData(original, key, preparedChildren),
        );

        return preparedChildren;
    };

    const onLoadData = ({ key, children }) => {
        return new Promise(async (resolve) => {
            if (children) {
                resolve();

                return;
            }

            const newChildren = await getItems(key);

            if (! Array.isArray(newChildren)) {
                return;
            }

            refreshItemsChildren(key, newChildren);

            resolve();
        });
    };

    const loop = (data, key, callback) => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].key === key) {
                return callback(data[i], i, data);
            }

            if (data[i].children) {
                loop(data[i].children, key, callback);
            }
        }
    };

    const findObjectByKey = (data, key) => {
        let out = null;

        loop(data, key, (item) => {
            out = item;
        });

        return out;
    }

    const extractObjectByKey = (data, key) => {
        let out = null;

        loop(data, key, (item, index, arr) => {
            arr.splice(index, 1);

            out = item;
        });

        return out;
    }

    const addItemToTree = async (itemFromServer) => {
        const item = prepareItem(itemFromServer);

        const { parentId } = item;

        // Adding an item to the first level.
        if (! parentId) {
            setTreeData([
                ...treeData,
                item
            ])

            return;
        }

        // Adding an item inside a category.
        const category = findObjectByKey(treeData, parentId);
        if (! category) {
            message.error('Could not find a category');

            return;
        }

        const { key } = category;

        const existingChildren = await getItemsChildrenIfNotYet(key);

        setTreeData((original) =>
            updateTreeData(original, key, [
                ...existingChildren,
                item
            ]),
        );
    };

    const getItemsChildrenIfNotYet = async (key) => {
        const item = findObjectByKey([...treeData], key);

        if (! item) {
            return [];
        }

        const { children } = item;

        if (children) {
            return children;
        }

        const newChildren = await getItems(key);

        if (! Array.isArray(newChildren)) {
            return children;
        }

        return refreshItemsChildren(key, newChildren);
    };

    const onDrop = async (info) => {
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        const dropPos = info.node.props.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        const targetItemChildren = await getItemsChildrenIfNotYet(dropKey);

        const updatedItemFromServer = await updateItem({
            id: dragKey,
            parentId: info.dropToGap ? null : dropKey
        });

        if (! updatedItemFromServer) {
            return;
        }

        const data = [...treeData];

        // Find dragObject
        const dragObj = extractObjectByKey(data, dragKey);

        if (! info.dropToGap) {
            // Drop on the content
            loop(data, dropKey, item => {
                item.children = item.key === dropKey ? targetItemChildren : (item.children || []);

                item.children.unshift(dragObj);
            });
        } else {
            let ar;
            let i;

            loop(data, dropKey, (item, index, arr) => {
                ar = arr;
                i = index;
            });

            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i + 1, 0, dragObj);
            }
        }

        setTreeData(data);
    };

    const onSelect = async (selectedKeys, {selected, selectedNodes, node, event}) => {
        if (! selected) {
            setSelectedNode(null);

            return;
        }

        const { loaded, key, isCategory } = node;

        if (isCategory && ! loaded) {
            node.children = await getItemsChildrenIfNotYet(key) || [];
        }

        setSelectedNode(node);
    };

    const chooseNewItemParentId = () => {
        if (! selectedNode) {
            return null;
        }

        if (selectedNode.isCategory) {
            return selectedNode.id;
        }

        return selectedNode.parentId;
    }

    const onYoutubeLinkPaste = async (e) => {
        const url = e.clipboardData.getData('Text');

        setYoutubeUrl(url);

        await createYoutubeItem(url);
    };

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

        addItemToTree(newItem);

        message.success(`Video ${newItem.name} has been added!`);

        setYoutubeUrl('');

        if (selectedNode && selectedNode.isCategory) {
            // In order to refresh the current category's table items.
            setSelectedNode(selectedNode ? {
                ...selectedNode,
                children: [
                    ...selectedNode.children,
                    newItem
                ]
            } : null);
        }
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
    };

    return (
        <div className="flex flex-row min-h-2xl">
            <div className="w-72 min-w-72 p-4">
                <TreeWrapper
                    treeElement={treeElement}
                    onDrop={onDrop}
                    treeData={treeData}
                    onLoadData={onLoadData}
                    onSelect={onSelect}
                    onDragOver={onDragOver}
                    loading={treeLoading}
                />
            </div>

            <div className="flex-grow p-2 min-h-full overflow-hidden">
                <DropAndPasteComponent
                    loading={addingYoutubeItem}
                    onYoutubeLinkPaste={onYoutubeLinkPaste}
                    onYoutubeLinkChange={(e) => setYoutubeUrl(e.target.value)}
                    onAddYoutubeItemButtonClick={onAddYoutubeItemButtonClick}
                    youtubeUrl={youtubeUrl}
                />

                <ItemsTableWrapper
                    selectedNode={selectedNode}
                    treeData={treeData}
                    onEmployeeOnlyChange={onEmployeeOnlyChange}
                />
            </div>
        </div>
    );
};

render(<App />, document.getElementById('manage-items-root'));
