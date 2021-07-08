import React from 'react';
import { BallTriangle } from '../../shared/components/spinners/BallTriangle';
import { Popconfirm } from 'antd';
import { DebounceInput } from 'react-debounce-input';

const ItemsTable = ({
    items,
    onEmployeeOnlyChange,
    onRemoveBtnClicked,
    tableInputsDisabled,
    onItemNameChange,
    onItemThumbClicked
}) => {
    const getItemTypeIcon = (item) => {
        const { isCategory, isPdf, isYoutubeVideo } = item;

        if (isCategory) {
            return (
                <svg
                    className="w-5 h-5 ml-1"
                    xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path
                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                </svg>
            );
        }

        if (isPdf) {
            return (
                <svg
                    className="w-5 h-5 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                </svg>
            );
        }

        if (isYoutubeVideo) {
            return (
                <svg
                    className="w-5 h-5 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                </svg>
            );
        }
    };

    return (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Name
                                </th>

                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Type
                                </th>

                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Employee Only
                                </th>

                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Edit</span>
                                    {
                                        tableInputsDisabled ?
                                            <div className="flex justify-end"><BallTriangle className="h-4"/>
                                            </div> : null
                                    }
                                </th>
                            </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">

                            {
                                items.map(item => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <button
                                                        className="rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:ring-2 hover:ring-indigo-500"
                                                        type="button"
                                                        onClick={() => onItemThumbClicked(item)}
                                                    >
                                                        <span className="sr-only">Update Item Thumb Menu</span>

                                                        <img
                                                            className="h-10 w-10 rounded-full" src={item.thumbUrl}
                                                            alt="img"
                                                        />
                                                    </button>
                                                </div>

                                                <div className="ml-4 w-full">
                                                    <div
                                                        className="text-sm font-medium text-gray-900 w-full truncate"
                                                    >
                                                        <DebounceInput
                                                            className="w-full border-none border-2 focus:outline-none focus:border-solid focus:ring-indigo-500 focus:border-indigo-500"
                                                            type="text"
                                                            debounceTimeout={1000}
                                                            onChange={e => onItemNameChange(item, e)}
                                                            value={item.fullTitle}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                          <span
                                              className="flex justify-center items-center text-gray-600 text-sm"
                                          >
                                              {getItemTypeIcon(item)}
                                          </span>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                            <input
                                                id="isEmployeeOnly" name="isEmployeeOnly" type="checkbox"
                                                onChange={(e) => onEmployeeOnlyChange(item.id, e.target.checked)}
                                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                value={item.isEmployeeOnly}
                                                checked={!! item.isEmployeeOnly}
                                                disabled={tableInputsDisabled}
                                            />

                                            <label
                                                htmlFor="isEmployeeOnly" className="font-medium text-gray-700 sr-only"
                                            >Employee Only
                                            </label>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Popconfirm
                                                title={`Remove '${item.shortTitle}'?`}
                                                onConfirm={() => onRemoveBtnClicked(item.id)}
                                                okText="Yes"
                                                cancelText="No"
                                                placement="topRight"
                                            >
                                                <a
                                                    className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                    href="#"
                                                >
                                                    Remove
                                                </a>
                                            </Popconfirm>
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemsTable;
