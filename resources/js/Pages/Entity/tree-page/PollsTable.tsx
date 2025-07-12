import React, { useEffect, useState } from 'react';
import { generateProtocol, getEntityPolls } from '../entities-requests';
import { Poll } from 'types/types';
import dayjs from 'dayjs';

type PollsTableProps = {
  entityId: number;
};

const DEFAULT_POLLS_PER_PAGE = 10;
const DATE_TIME_FORMAT = 'D MMMM YYYY г., HH:mm';

export default function PollsTable({ entityId }: PollsTableProps) {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [query, setQuery] = useState('');
  const [pollsPerPage, setPollsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPolls = async () => {
      const polls = await getEntityPolls(entityId);

      if (Array.isArray(polls)) {
        setPolls(polls);
      }
    };
    fetchPolls();
  }, [entityId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, pollsPerPage]);

  const filteredPolls = polls.filter((poll) => {
    const q = query.toLowerCase();

    return (
      poll.name.toLowerCase().includes(q) ||
      poll.start?.toLowerCase().includes(q) ||
      poll.finished?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredPolls.length / pollsPerPage);

  const paginatedPolls = filteredPolls.slice(
    (currentPage - 1) * pollsPerPage,
    currentPage * pollsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    // Reset to first page if filter changes and current page would be out of range
    if ((currentPage - 1) * DEFAULT_POLLS_PER_PAGE >= filteredPolls.length) {
      setCurrentPage(1);
    }
  }, [query, filteredPolls.length]);

  const onGenerateProtocolClick = async (pollId: number) => {
    await generateProtocol(entityId, pollId);
  };

  return (
    <div className="p-4">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Поиск голосований..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Total found */}
      <div className="mb-2 text-sm text-gray-600">
        Всего найдено: {filteredPolls.length}
      </div>

      {/* Page Size */}
      <div className="flex items-center gap-2 mb-4">
        <label htmlFor="pageSize" className="text-sm text-gray-700">
          Результатов на странице:
        </label>

        <select
          id="pageSize"
          value={pollsPerPage}
          onChange={(e) => setPollsPerPage(Number(e.target.value))}
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
                  Название
                </th>
                <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">
                  Начало
                </th>
                <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">
                  Конец
                </th>
                <th className="px-4 py-2 text-sm font-semibold text-left text-gray-700">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedPolls.map((poll) => (
                <tr key={poll.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {poll.name}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-800">
                    {poll.start
                      ? dayjs(poll.start).format(DATE_TIME_FORMAT)
                      : ''}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-800">
                    {poll.finished
                      ? dayjs(poll.finished).format(DATE_TIME_FORMAT)
                      : ''}
                  </td>

                  <td className="px-4 py-3 text-sm text-center">
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => onGenerateProtocolClick(poll.id)}
                        className="font-semibold text-red-600 cursor-pointer hover:text-red-800"
                      >
                        Сгенерировать протокол
                      </button>

                      {poll.blank_with_answers_doc_url && (
                        <a
                          href={poll.blank_with_answers_doc_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Скачать
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedPolls.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-sm text-center text-gray-500"
                  >
                    Протоколы не найдены
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="space-y-4 md:hidden">
          {paginatedPolls.map((poll) => (
            <div
              key={poll.id}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <p className="text-sm font-semibold text-gray-700">
                Название: <span className="font-normal">{poll.name}</span>
              </p>

              <p className="text-sm font-semibold text-gray-700">
                Начало:{' '}
                <span className="font-normal">
                  {poll.start ? dayjs(poll.start).format() : ''}
                </span>
              </p>

              <p className="text-sm font-semibold text-gray-700">
                Конец:{' '}
                <span className="font-normal">
                  {poll.finished ? dayjs(poll.finished).format() : ''}
                </span>
              </p>

              <button
                onClick={() => onGenerateProtocolClick(poll.id)}
                className="block mt-4 font-semibold text-red-600 cursor-pointer hover:text-red-800"
              >
                Сгенерировать протокол
              </button>

              {poll.blank_with_answers_doc_url && (
                <a
                  href={poll.blank_with_answers_doc_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-blue-600 hover:underline"
                >
                  Скачать
                </a>
              )}
            </div>
          ))}
          {paginatedPolls.length === 0 && (
            <div className="text-sm text-center text-gray-500">
              Протоколы не найдены
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
