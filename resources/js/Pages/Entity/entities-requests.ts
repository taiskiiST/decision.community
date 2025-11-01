import { client } from '../../shared/axios';
import { message } from 'antd';
import { RcFile } from 'antd/es/upload';
import { DetachEntityResult, DetachUserResult, Entity, Poll, User } from 'types/types';

export const getEntityChildren = async (parentId: number | null) => {
  try {
    const config: { params: { parentId?: number | null } } = { params: {} };

    if (parentId) {
      config.params = {
        parentId,
      };
    }

    const response = await client.get<Entity[]>(
      `/entities-tree/${parentId}/get-direct-children`,
      config,
    );

    const { data: entities } = response;
    if (!entities) {
      return [];
    }

    return entities;
  } catch (error) {
    message.error(`Error occurred: ${error}`, 5);
  }
};

export const getEntityUsers = async (entityId: number) => {
  try {
    const config: { params: { entityId: number } } = { params: { entityId } };

    const response = await client.get<User[]>(
      `/entities-tree/${entityId}/get-users`,
      config,
    );

    const { data: users } = response;
    if (!users) {
      return [];
    }

    return users;
  } catch (error) {
    message.error(`Error occurred: ${error}`, 5);
  }
};

export const addEntity = async (
  file: RcFile | null | undefined,
  name: string,
  normalizedPhoneNumber: string,
  parentId: number | null,
) => {
  try {
    const formData = new FormData();

    if (file) {
      formData.append('image', file);
    }

    formData.append('name', name);
    formData.append('phone', normalizedPhoneNumber);

    if (parentId) {
      formData.append('parentId', parentId ? parentId.toString() : '');
    }

    const response = await client.post('/entities-tree/add-entity', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const { data: categoryFromServer } = response;
    if (!categoryFromServer) {
      return null;
    }

    return categoryFromServer;
  } catch (error) {
    message.error(`Error occurred: ${error}`, 5);

    return null;
  }
};

export const detachEntityFromCompany = async (
  entityId: number,
): Promise<DetachEntityResult> => {
  try {
    const response = await client.delete(`/entities-tree/${entityId}/detach`);

    const {
      data: { detachInfo },
    } = response;

    return detachInfo;
  } catch (error) {
    message.error(`Error occurred: ${error}`, 5);

    return null;
  }
};

export const detachUserFromEntity = async (
  entityId: number,
  userId: number
): Promise<DetachUserResult> => {
  try {
    const response = await client.delete(`/entities-tree/${entityId}/detach-user/${userId}`);

    const {
      data: { detachInfo },
    } = response;

    return detachInfo;
  } catch (error) {
    message.error(`Error occurred: ${error}`, 5);

    return null;
  }
};

export const getEntityPolls = async (entityId: number) => {
  try {
    const config: { params: { entityId: number } } = { params: { entityId } };

    const response = await client.get<Poll[]>(
      `/entities-tree/${entityId}/get-polls`,
      config,
    );

    const { data: polls } = response;
    if (!polls) {
      return [];
    }

    return polls;
  } catch (error) {
    message.error(`Error occurred: ${error}`, 5);
  }
};

export const generateProtocol = async (
  entityId: number,
  pollId: number,
) => {
  try {
    const formData = new FormData();

    formData.append('entity_id', entityId.toString());

    const response = await client.post(`/polls/${pollId}/generateProtocol`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const { data } = response;
    if (!data) {
      return null;
    }

    return data;
  } catch (error) {
    message.error(`Error occurred: ${error}`, 5);

    return null;
  }
};