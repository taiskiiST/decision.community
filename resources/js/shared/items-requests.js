import { client } from './axios';
import { message } from 'antd';

const {
    GET_ITEMS_URL,
    UPDATE_ITEM_PARENT_URL,
    UPDATE_ITEM_EMPLOYEE_ONLY_URL,
    UPDATE_ITEM_NAME_URL,
    UPDATE_ITEM_THUMB_URL,
    ADD_YOUTUBE_ITEM_URL,
    ADD_PDF_ITEM_URL,
    REMOVE_ITEM_URL,
    ADD_CATEGORY_URL,
} = window.InfoDot || {};

export const getItems = async (parentId) => {
    try {
        const config = {};

        if (parentId) {
            config.params = {
                parentId
            }
        }

        const response = await client.get(GET_ITEMS_URL, config);

        const { data: itemsFromServer } = response;
        if (! itemsFromServer) {
            return [];
        }

        return itemsFromServer;
    } catch (error) {
        message.error(`Error occurred: ${error}`, 5);
    }
};

export const updateItemParent = async (data) => {
    try {
        const response = await client.put(UPDATE_ITEM_PARENT_URL, data);

        const { data: itemFromServer } = response;
        if (! itemFromServer) {
            return null;
        }

        return itemFromServer;
    } catch (error) {
        message.error(`Error occurred: ${error}`, 5);

        return null;
    }
};

export const updateItemEmployeeOnly = async (data) => {
    try {
        const response = await client.put(UPDATE_ITEM_EMPLOYEE_ONLY_URL, data);

        const { data: itemFromServer } = response;
        if (! itemFromServer) {
            return null;
        }

        return itemFromServer;
    } catch (error) {
        message.error(`Error occurred: ${error}`, 5);

        return null;
    }
};

export const updateItemName = async (data) => {
    try {
        const response = await client.put(UPDATE_ITEM_NAME_URL, data);

        const { data: itemFromServer } = response;

        if (! itemFromServer) {
            return null;
        }

        return itemFromServer;
    } catch (error) {
        message.error(`Error occurred: ${error}`, 5);

        return null;
    }
};

export const updateItemThumb = async (id, file) => {
    try {
        const formData = new FormData();

        formData.append('image', file);

        formData.append('id', id);

        const response = await client.post(UPDATE_ITEM_THUMB_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const { data: itemFromServer } = response;
        if (! itemFromServer) {
            return null;
        }

        return itemFromServer;
    } catch (error) {
        message.error(`Error occurred: ${error}`, 5);

        return null;
    }
};

export const addYoutubeItem = async (url, parentId) => {
    try {
        const response = await client.post(ADD_YOUTUBE_ITEM_URL, {
            url,
            parentId: parentId || null
        });

        const { data: itemFromServer } = response;
        if (! itemFromServer) {
            return null;
        }

        return itemFromServer;
    } catch (error) {
        message.error(`Error occurred: ${error}`, 5);

        return null;
    }
};

export const addPdfItem = async (file, parentId, onUploadProgress) => {
    try {
        const formData = new FormData();

        formData.append('file', file);

        if (parentId) {
            formData.append('parentId', parentId);
        }

        const response = await client.post(ADD_PDF_ITEM_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: onUploadProgress
        });

        const { data: itemFromServer } = response;
        if (! itemFromServer) {
            return null;
        }

        return itemFromServer;
    } catch (error) {
        message.error(`Error occurred: ${error}`, 5);

        return null;
    }
};

export const addCategory = async (file, name, parentId, employeeOnly) => {
    try {
        const formData = new FormData();

        formData.append('image', file);

        formData.append('name', name);

        formData.append('employeeOnly', employeeOnly);

        if (parentId) {
            formData.append('parentId', parentId);
        }

        const response = await client.post(ADD_CATEGORY_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const { data: categoryFromServer } = response;
        if (! categoryFromServer) {
            return null;
        }

        return categoryFromServer;
    } catch (error) {
        message.error(`Error occurred: ${error}`, 5);

        return null;
    }
};

export const removeItem = async (itemId) => {
    try {
        const response  = await client.delete(REMOVE_ITEM_URL, {
            data: {
                'id': itemId
            }
        });

        const { data: { deletedIds } } = response;

        return deletedIds;
    } catch (error) {
        message.error(`Error occurred: ${error}`, 5);

        return null;
    }
};
