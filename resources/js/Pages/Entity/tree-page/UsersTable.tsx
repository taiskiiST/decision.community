import React, { useState } from 'react';

const initialUsers = [
  { id: 1, name: 'Ivan Petrov', email: 'ivan@example.com', phone: '9884121512', address: 'Moscow, Russia' },
  { id: 2, name: 'Anna Smirnova', email: 'anna@example.com', phone: '9213345123', address: 'Saint Petersburg, Russia' },
  { id: 3, name: 'Dmitry Ivanov', email: 'dmitry@example.com', phone: '9167766543', address: 'Novosibirsk, Russia' },
  // Add more users as needed
];

type UsersTableProps = {
  entityId: number
}

export default function UsersTable( { entityId }) {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredUsers = users.filter((user) => {
    const q = query.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.phone.toLowerCase().includes(q) ||
      user.address.toLowerCase().includes(q)
    );
  });

  const handleDelete = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setIsDeleting(true);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Table for Desktop */}
      <div className="overflow-x-auto">
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">Name</th>
                <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">Email</th>
                <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">Phone</th>
                <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">Address</th>
                <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{user.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{user.address}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="font-semibold text-red-600 hover:text-red-800"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-sm text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="space-y-4 md:hidden">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <p className="text-sm font-semibold text-gray-700">Name: <span className="font-normal">{user.name}</span></p>
              <p className="text-sm font-semibold text-gray-700">Email: <span className="font-normal">{user.email}</span></p>
              <p className="text-sm font-semibold text-gray-700">Phone: <span className="font-normal">{user.phone}</span></p>
              <p className="text-sm font-semibold text-gray-700">Address: <span className="font-normal">{user.address}</span></p>
              <button
                onClick={() => handleDelete(user.id)}
                className="mt-4 font-semibold text-red-600 hover:text-red-800"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="text-sm text-center text-gray-500">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
}
