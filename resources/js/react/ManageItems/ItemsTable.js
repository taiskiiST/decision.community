import React from 'react';
import { BallTriangle } from '../../shared/components/spinners/BallTriangle';
import { Popconfirm } from 'antd';
import { DebounceInput } from 'react-debounce-input';

const ItemsTable = ({
    items,
    onRemoveBtnClicked,
    tableInputsDisabled,
    onItemNameChange,
    onItemPhoneChange,
    onItemPinChange,
    onItemAddressChange,
    onItemThumbClicked
}) => {
    const getItemTypeIcon = (item) => {
        const { isCategory } = item;

        if (isCategory) {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
            );
        }

        return (
            <svg
                xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
            </svg>
        );
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
                                    Имя
                                </th>

                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Тип
                                </th>

                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Телефон
                                </th>

                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Адрес
                                </th>

                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Пин
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

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="ml-4 w-full">
                                                <div
                                                    className="text-sm font-medium text-gray-900 w-full truncate"
                                                >
                                                    <DebounceInput
                                                        className="w-full border-none border-2 focus:outline-none focus:border-solid focus:ring-indigo-500 focus:border-indigo-500"
                                                        type="text"
                                                        debounceTimeout={1000}
                                                        onChange={e => onItemPhoneChange(item, e)}
                                                        value={item.phone}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="ml-4 w-full">
                                                <div
                                                    className="text-sm font-medium text-gray-900 w-full truncate"
                                                >
                                                    <DebounceInput
                                                        className="w-full border-none border-2 focus:outline-none focus:border-solid focus:ring-indigo-500 focus:border-indigo-500"
                                                        type="text"
                                                        debounceTimeout={1000}
                                                        onChange={e => onItemAddressChange(item, e)}
                                                        value={item.address}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="ml-4 w-full">
                                                <div
                                                    className="text-sm font-medium text-gray-900 w-full truncate"
                                                >
                                                    <DebounceInput
                                                        className="w-full border-none border-2 focus:outline-none focus:border-solid focus:ring-indigo-500 focus:border-indigo-500"
                                                        type="text"
                                                        debounceTimeout={1000}
                                                        onChange={e => onItemPinChange(item, e)}
                                                        value={item.pin}
                                                    />
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Popconfirm
                                                title={`Удалить '${item.shortTitle}'?`}
                                                onConfirm={() => onRemoveBtnClicked(item.id)}
                                                okText="Да"
                                                cancelText="Нет"
                                                placement="topRight"
                                            >
                                                <a
                                                    className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                    href="#"
                                                >
                                                    Удалить
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
