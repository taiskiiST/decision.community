import React from 'react';

type Entity = {
  id: number;
  name: string;
  phone: string;
  thumb_url: string; 
};

type EntitiessTableProps = {
  entities: Entity[];
};

const OrganizationsTable: React.FC<EntitiessTableProps> = ({ entities }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white divide-y divide-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700">
              ID
            </th>

            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700">
              Name
            </th>

            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700">
              Phone
            </th>

            <th className="px-6 py-3 text-sm font-medium text-left text-gray-700">
              Thumb
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {entities.map((org) => (
            <tr key={org.id}>
              <td className="px-6 py-4 text-sm text-gray-800">{org.id}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{org.name}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{org.phone}</td>
              <td className="px-6 py-4">
                <img
                  src={org.thumb_url}
                  alt={`${org.name} thumbnail`}
                  className="object-cover w-10 h-10 rounded-full"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrganizationsTable;
