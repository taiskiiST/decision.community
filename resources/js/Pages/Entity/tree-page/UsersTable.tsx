import React, { useEffect, useState } from 'react';
import { detachUserFromEntity, getEntityUsers } from '../entities-requests';
import { User } from 'types/types';
import { message } from 'antd';

type UsersTableProps = {
  entityId: number;
};

const USERS_PER_PAGE = 10;

export default function UsersTable({ entityId }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState('');
  const [isDetaching, setIsDetaching] = useState(false);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getEntityUsers(entityId);
      if (Array.isArray(users)) {
        setUsers(users);
      }
    };
    fetchUsers();
  }, [entityId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, usersPerPage]);

  const filteredUsers = users.filter((user) => {
    const q = query.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      user.phone.toLowerCase().includes(q) ||
      user.address.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage,
  );

  const handleDetach = async (userId: number) => {
    if (
      !window.confirm('Вы действительно хотите отвязать этого пользователя?')
    ) {
      return;
    }

    setIsDetaching(true);

    const detachResult = await detachUserFromEntity(entityId, userId);
    if (!detachResult) {
      setIsDetaching(false);

      return;
    }

    if (!detachResult.detached) {
      message.warning(detachResult.msg);
      setIsDetaching(false);

      return;
    }

    message.success(`Сущность отвязана: ${detachResult.id}`);

    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== detachResult.id),
    );
    setIsDetaching(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    // Reset to first page if filter changes and current page would be out of range
    if ((currentPage - 1) * USERS_PER_PAGE >= filteredUsers.length) {
      setCurrentPage(1);
    }
  }, [query, filteredUsers.length]);

  return (
    <div className="p-4">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Поиск пользователей..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Total found */}
      <div className="mb-2 text-sm text-gray-600">
        Всего найдено: {filteredUsers.length}
      </div>

      {/* Page Size */}
      <div className="flex items-center gap-2 mb-4">
        <label htmlFor="pageSize" className="text-sm text-gray-700">
          Результатов на странице:
        </label>

        <select
          id="pageSize"
          value={usersPerPage}
          onChange={(e) => setUsersPerPage(Number(e.target.value))}
          className="px-2 py-1 text-sm border border-gray-300 rounded-md"
        >
          {[10, 25, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Table for Desktop */}
      <div className="overflow-x-auto">
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">
                  Имя
                </th>
                <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">
                  Email
                </th>
                <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">
                  Телефон
                </th>
                <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">
                  Адрес
                </th>
                <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {user.phone}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {user.address}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleDetach(user.id)}
                      className="font-semibold text-red-600 cursor-pointer hover:text-red-800"
                    >
                      {isDetaching ? 'Отвязка...' : 'Отвязать'}
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-sm text-center text-gray-500"
                  >
                    Пользователи не найдены
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="space-y-4 md:hidden">
          {paginatedUsers.map((user) => (
            <div
              key={user.id}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <p className="text-sm font-semibold text-gray-700">
                Имя: <span className="font-normal">{user.name}</span>
              </p>
              <p className="text-sm font-semibold text-gray-700">
                Email: <span className="font-normal">{user.email}</span>
              </p>
              <p className="text-sm font-semibold text-gray-700">
                Телефон: <span className="font-normal">{user.phone}</span>
              </p>
              <p className="text-sm font-semibold text-gray-700">
                Адрес: <span className="font-normal">{user.address}</span>
              </p>
              <button
                onClick={() => handleDetach(user.id)}
                className="mt-4 font-semibold text-red-600 cursor-pointer hover:text-red-800"
              >
                {isDetaching ? 'Отвязка...' : 'Отвязать'}
              </button>
            </div>
          ))}
          {paginatedUsers.length === 0 && (
            <div className="text-sm text-center text-gray-500">
              Пользователи не найдены
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2 text-sm text-gray-700">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded cursor-pointer disabled:cursor-default disabled:opacity-50"
            >
              Пред.
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`cursor-pointer rounded border px-3 py-1 ${
                  currentPage === i + 1 ? 'bg-blue-500 text-white' : ''
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded cursor-pointer disabled:cursor-default disabled:opacity-50"
            >
              След.
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
