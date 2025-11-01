import { client } from '../../shared/axios';
import { message } from 'antd';
import { User } from 'types/types';

export const getAllUsers = async () => {
  try {
    const response = await client.get<User[]>('/manage/users/all');

    const { data: users } = response;
    if (!users) {
      return [];
    }

    return users;
  } catch (error) {
    message.error(`Error occurred: ${error}`, 5);

    return [];
  }
};