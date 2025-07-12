import React from 'react';
import { Entity } from 'types/types';

type EntitiessTableProps = {
  entities: Entity[];
};

const OrganizationsTable: React.FC<EntitiessTableProps> = ({ entities }) => {
  console.log('entities', entities);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg bg-white shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              ID
            </th>

            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Name
            </th>

            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Phone
            </th>

            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Thumb
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {entities.map((entity) => (
            <tr key={entity.id}>
              <td className="px-6 py-4 text-sm text-gray-800">{entity.id}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{entity.name}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{entity.phone}</td>
              <td className="px-6 py-4">
                <img
                  src={entity.thumb_url}
                  alt={`${entity.name} thumbnail`}
                  className="h-10 w-10 rounded-full object-cover"
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
