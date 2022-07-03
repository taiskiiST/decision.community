import { client } from './axios';
import { message } from 'antd';

const {
    GET_ITEMS_URL,
    UPDATE_ITEM_PARENT_URL,
    UPDATE_ITEM_NAME_URL,
    UPDATE_ITEM_PHONE_URL,
    UPDATE_ITEM_PIN_URL,
    UPDATE_ITEM_DESCRIPTION_URL,
    UPDATE_ITEM_ADDRESS_URL,
    UPDATE_ITEM_THUMB_URL,
    ADD_ITEM_URL,
    REMOVE_ITEM_URL,
    ADD_CATEGORY_URL,
    UPDATE_ITEM_ELEMENTARY_URL,
    UPDATE_ITEM_COMMITTEE_MEMBERS_URL,
    UPDATE_ITEM_PRESIDIUM_MEMBERS_URL,
    UPDATE_ITEM_CHAIRMAN_URL,
    UPDATE_ITEM_REV_COMMITTEE_MEMBERS_URL,
    UPDATE_ITEM_REV_PRESIDIUM_MEMBERS_URL,
    UPDATE_ITEM_REV_CHAIRMAN_URL,
} = window.TSN || {};

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

export const updateItemCommitteeMembers = async (data) => {
    try {
        const response = await client.put(UPDATE_ITEM_COMMITTEE_MEMBERS_URL, data);

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

export const updateItemPresidiumMembers = async (data) => {
    try {
        const response = await client.put(UPDATE_ITEM_PRESIDIUM_MEMBERS_URL, data);

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

export const updateItemChairman = async (data) => {
    try {
        const response = await client.put(UPDATE_ITEM_CHAIRMAN_URL, data);

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

export const updateItemRevCommitteeMembers = async (data) => {
    try {
        const response = await client.put(UPDATE_ITEM_REV_COMMITTEE_MEMBERS_URL, data);

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

export const updateItemRevPresidiumMembers = async (data) => {
    try {
        const response = await client.put(UPDATE_ITEM_REV_PRESIDIUM_MEMBERS_URL, data);

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

export const updateItemRevChairman = async (data) => {
    try {
        const response = await client.put(UPDATE_ITEM_REV_CHAIRMAN_URL, data);

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

export const updateItemPhone = async (data) => {
    try {
        const response = await client.put(UPDATE_ITEM_PHONE_URL, data);

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

export const updateItemPin = async (data) => {
    try {
        const response = await client.put(UPDATE_ITEM_PIN_URL, data);

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

export const updateItemDescription = async (data) => {
    try {
        const response = await client.put(UPDATE_ITEM_DESCRIPTION_URL, data);

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

export const updateItemElementary = async (data) => {
    try {
        const response = await client.put(UPDATE_ITEM_ELEMENTARY_URL, data);

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

export const updateItemAddress = async (data) => {
    try {
        const response = await client.put(UPDATE_ITEM_ADDRESS_URL, data);

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

export const addItem = async (file, name, parentId) => {
    try {
        const formData = new FormData();

        if (file) {
            formData.append('image', file);
        }

        formData.append('name', name);

        if (parentId) {
            formData.append('parentId', parentId);
        }

        const response = await client.post(ADD_ITEM_URL, formData, {
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

export const addCategory = async (file, name, parentId) => {
    try {
        const formData = new FormData();

        if (file) {
            formData.append('image', file);
        }

        formData.append('name', name);

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
