import { useState, useEffect, Fragment } from 'react';
import { render } from 'react-dom';
import Highlighter from 'react-highlight-words';
import { Listbox, Transition } from '@headlessui/react';

const { users, csrf_token, companies, current_company, isSuperAdmin } =
    window.TSN || {};

function Users() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(users);
    const [onFilterName, setFilterName] = useState(1);
    const [onFilterAddress, setFilterAddress] = useState(0);

    const [filterCompany, setFilterCompany] = useState(current_company);

    const handleChangeUsersFilter = (event) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        const filteredUsers = users.filter((person) => {
            if (!person.companies_ids.includes(Number(filterCompany.id))) {
                return false;
            }

            const searchTermLowerCased = searchTerm.toLowerCase();

            return (
                person.name.toLowerCase().includes(searchTermLowerCased) ||
                person.phone.includes(searchTermLowerCased) ||
                (person.email &&
                    person.email
                        .toLowerCase()
                        .includes(searchTermLowerCased)) ||
                (person.position &&
                    person.position
                        .toLowerCase()
                        .includes(searchTermLowerCased)) ||
                (person.permissions &&
                    person.permissions
                        .join()
                        .toLowerCase()
                        .includes(searchTermLowerCased)) ||
                (person.address &&
                    person.address.toLowerCase().includes(searchTermLowerCased))
            );
        });

        sortUsers(filteredUsers);

        setSearchResults(filteredUsers);
    }, [searchTerm, filterCompany]);

    const handleClickNameSort = (event) => {
        setFilterName(onFilterName ? 0 : 1);
        if (onFilterName) {
            setSearchResults(
                searchResults.sort((a, b) => (a.name > b.name ? 1 : -1)),
            );
        } else {
            setSearchResults(
                searchResults.sort((a, b) => (a.name < b.name ? 1 : -1)),
            );
        }
    };

    const handleClickAddressSort = (event) => {
        setFilterAddress(onFilterAddress ? 0 : 1);
        if (onFilterAddress) {
            setSearchResults(
                searchResults.sort((a, b) => (a.address > b.address ? 1 : -1)),
            );
        } else {
            setSearchResults(
                searchResults.sort((a, b) => (a.address < b.address ? 1 : -1)),
            );
        }
    };

    const sortUsers = (users) => {
        if (onFilterName) {
            users.sort((a, b) => (a.name > b.name ? 1 : -1));
        } else {
            users.sort((a, b) => (a.name < b.name ? 1 : -1));
        }

        if (onFilterAddress) {
            users.sort((a, b) => (a.address > b.address ? 1 : -1));
        } else {
            users.sort((a, b) => (a.address < b.address ? 1 : -1));
        }
    };

    function handleClickUpdate(event) {
        event.preventDefault();
        event.target.parentElement.submit();
    }

    function handleClickDelete(event) {
        event.preventDefault();
        event.target.parentElement.submit();
    }

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    return (
        <div className="p-2">
            <div className="flex hidden flex-col lg:-mt-px xl:flex">
                <div className="flex">
                    <div className="relative w-80 px-4 py-3">
                        <input
                            type="search"
                            className="focus:shadow-outline w-5/6 appearance-none border px-3 py-2 text-gray-500 shadow focus:outline-none"
                            id="search"
                            placeholder="Поиск"
                            name="search"
                            autoFocus
                            value={searchTerm}
                            onChange={handleChangeUsersFilter}
                        />
                        <button
                            type="submit"
                            className="y-2 absolute inset-y-3 right-0 flex h-4/6 w-1/6 items-center bg-indigo-600 px-3 text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <svg
                                className="h-4 w-10"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                stroke="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="relative w-80 px-8 py-3">
                        {isSuperAdmin && (
                            <Listbox
                                value={filterCompany}
                                onChange={setFilterCompany}
                            >
                                {({ open }) => (
                                    <>
                                        {/*<Listbox.Label className="block text-sm font-medium text-gray-700">Выберете компанию</Listbox.Label>*/}
                                        <div className="relative mt-1">
                                            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                                <span className="flex items-center">
                                                    <span className="ml-3 block truncate">
                                                        {filterCompany.title}
                                                    </span>
                                                </span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2"></span>
                                            </Listbox.Button>

                                            <Transition
                                                show={open}
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {companies.map(
                                                        (company) => (
                                                            <Listbox.Option
                                                                key={company.id}
                                                                className={({
                                                                    active,
                                                                }) =>
                                                                    classNames(
                                                                        active
                                                                            ? 'bg-indigo-600 text-white'
                                                                            : 'text-gray-900',
                                                                        'relative cursor-default select-none py-2 pl-3 pr-9',
                                                                    )
                                                                }
                                                                value={company}
                                                            >
                                                                {({
                                                                    filterCompany,
                                                                    active,
                                                                }) => (
                                                                    <>
                                                                        <div className="flex items-center">
                                                                            <span
                                                                                className={classNames(
                                                                                    filterCompany
                                                                                        ? 'font-semibold'
                                                                                        : 'font-normal',
                                                                                    'ml-3 block truncate',
                                                                                )}
                                                                            >
                                                                                {
                                                                                    company.title
                                                                                }
                                                                            </span>
                                                                        </div>

                                                                        {filterCompany ? (
                                                                            <span
                                                                                className={classNames(
                                                                                    active
                                                                                        ? 'text-white'
                                                                                        : 'text-indigo-600',
                                                                                    'absolute inset-y-0 right-0 flex items-center pr-4',
                                                                                )}
                                                                            ></span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        ),
                                                    )}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Listbox>
                        )}
                    </div>
                </div>
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 ">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="relative px-6 py-3 text-center"
                                        >
                                            №
                                        </th>
                                        <th
                                            scope="col"
                                            className="relative px-6 py-3 text-center"
                                        >
                                            <button
                                                onClick={handleClickNameSort}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                ФИО
                                            </button>
                                        </th>
                                        <th
                                            scope="col"
                                            className="relative px-6 py-3 text-center"
                                        >
                                            <button
                                                onClick={handleClickAddressSort}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                Адрес
                                            </button>
                                        </th>
                                        <th
                                            scope="col"
                                            className="relative px-6 py-3 text-center"
                                        >
                                            Телефон
                                        </th>
                                        <th
                                            scope="col"
                                            className="relative px-6 py-3 text-center"
                                        >
                                            Электронный ящик
                                        </th>
                                        <th
                                            scope="col"
                                            className="relative px-6 py-3 text-center"
                                        >
                                            Должность
                                        </th>
                                        <th
                                            scope="col"
                                            className="relative px-6 py-3 text-center"
                                        >
                                            Права
                                        </th>
                                        <th
                                            scope="col"
                                            className="relative px-6 py-3 text-center"
                                            colSpan="2"
                                        >
                                            Действия
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {searchResults.map((user, index) => (
                                        <tr
                                            className={`bg-white ${
                                                index % 2 === 0
                                                    ? 'bg-gray-200'
                                                    : ''
                                            }`}
                                            id={`${index}`}
                                            key={`${index}`}
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 text-center font-medium text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="whitespace-wrap text-wrap px-6 py-4 text-center font-medium text-gray-900">
                                                {user.name && (
                                                    <Highlighter
                                                        highlightClassName="Highlight"
                                                        searchWords={[
                                                            searchTerm,
                                                        ]}
                                                        autoEscape={true}
                                                        textToHighlight={
                                                            user.name
                                                        }
                                                    />
                                                )}
                                            </td>
                                            <td className="whitespace-wrap text-wrap px-6 py-4 text-center text-sm font-medium">
                                                {user.address && (
                                                    <Highlighter
                                                        highlightClassName="Highlight"
                                                        searchWords={[
                                                            searchTerm,
                                                        ]}
                                                        autoEscape={true}
                                                        textToHighlight={
                                                            user.address
                                                        }
                                                    />
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                                                {user.phone && (
                                                    <Highlighter
                                                        highlightClassName="Highlight"
                                                        searchWords={[
                                                            searchTerm,
                                                        ]}
                                                        autoEscape={true}
                                                        textToHighlight={
                                                            user.phone
                                                        }
                                                    />
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                                                {user.email && (
                                                    <Highlighter
                                                        highlightClassName="Highlight"
                                                        searchWords={[
                                                            searchTerm,
                                                        ]}
                                                        autoEscape={true}
                                                        textToHighlight={
                                                            user.email
                                                        }
                                                    />
                                                )}
                                            </td>
                                            <td className="whitespace-wrap text-wrap px-6 py-4 text-center text-sm font-medium">
                                                {user.position && (
                                                    <Highlighter
                                                        highlightClassName="Highlight"
                                                        searchWords={[
                                                            searchTerm,
                                                        ]}
                                                        autoEscape={true}
                                                        textToHighlight={
                                                            user.position
                                                        }
                                                    />
                                                )}
                                            </td>
                                            <td className="text-nowrap whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                                                {user.permissions
                                                    ? user.permissions.map(
                                                          (
                                                              permission,
                                                              index,
                                                          ) => (
                                                              <div
                                                                  key={`${index}`}
                                                              >
                                                                  <Highlighter
                                                                      highlightClassName="Highlight"
                                                                      searchWords={[
                                                                          searchTerm,
                                                                      ]}
                                                                      autoEscape={
                                                                          true
                                                                      }
                                                                      textToHighlight={
                                                                          permission
                                                                      }
                                                                  />
                                                              </div>
                                                          ),
                                                      )
                                                    : ''}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                                                <form
                                                    method="POST"
                                                    action="/manage/update"
                                                >
                                                    <input
                                                        type="hidden"
                                                        name="_token"
                                                        value={`${csrf_token}`}
                                                    />
                                                    <input
                                                        name="user_update"
                                                        value={`${user.id}`}
                                                        type="hidden"
                                                    />
                                                    <a
                                                        href="/manage/update"
                                                        onClick={
                                                            handleClickUpdate
                                                        }
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Редактировать
                                                    </a>
                                                </form>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                                                <form
                                                    method="POST"
                                                    action="/manage/delete"
                                                >
                                                    <input
                                                        type="hidden"
                                                        name="_token"
                                                        value={`${csrf_token}`}
                                                    />
                                                    <input
                                                        name="user_del"
                                                        value={`${user.id}`}
                                                        type="hidden"
                                                    />
                                                    <a
                                                        href="/manage/delete"
                                                        onClick={
                                                            handleClickDelete
                                                        }
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Удалить
                                                    </a>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col xl:hidden ">
                <div className="flex flex-col-reverse">
                    <div className="relative w-80 px-4 py-3">
                        <input
                            type="search"
                            className="focus:shadow-outline w-5/6 appearance-none border px-3 py-2 text-gray-500 shadow focus:outline-none"
                            id="search"
                            placeholder="Поиск"
                            name="search"
                            autoFocus
                            value={searchTerm}
                            onChange={handleChangeUsersFilter}
                        />
                        <button
                            type="submit"
                            className="y-2 absolute inset-y-3 right-0 flex h-4/6 w-1/6 items-center bg-indigo-600 px-3 text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <svg
                                className="h-4 w-10"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                stroke="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="relative w-80 px-8 py-3">
                        {isSuperAdmin && (
                            <Listbox
                                value={filterCompany}
                                onChange={setFilterCompany}
                            >
                                {({ open }) => (
                                    <>
                                        {/*<Listbox.Label className="block text-sm font-medium text-gray-700">Выберете компанию</Listbox.Label>*/}
                                        <div className="relative mt-1">
                                            <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                                <span className="flex items-center">
                                                    <span className="ml-3 block truncate">
                                                        {filterCompany.title}
                                                    </span>
                                                </span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2"></span>
                                            </Listbox.Button>

                                            <Transition
                                                show={open}
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {companies.map(
                                                        (company) => (
                                                            <Listbox.Option
                                                                key={company.id}
                                                                className={({
                                                                    active,
                                                                }) =>
                                                                    classNames(
                                                                        active
                                                                            ? 'bg-indigo-600 text-white'
                                                                            : 'text-gray-900',
                                                                        'relative cursor-default select-none py-2 pl-3 pr-9',
                                                                    )
                                                                }
                                                                value={company}
                                                            >
                                                                {({
                                                                    filterCompany,
                                                                    active,
                                                                }) => (
                                                                    <>
                                                                        <div className="flex items-center">
                                                                            <span
                                                                                className={classNames(
                                                                                    filterCompany
                                                                                        ? 'font-semibold'
                                                                                        : 'font-normal',
                                                                                    'ml-3 block truncate',
                                                                                )}
                                                                            >
                                                                                {
                                                                                    company.title
                                                                                }
                                                                            </span>
                                                                        </div>

                                                                        {filterCompany ? (
                                                                            <span
                                                                                className={classNames(
                                                                                    active
                                                                                        ? 'text-white'
                                                                                        : 'text-indigo-600',
                                                                                    'absolute inset-y-0 right-0 flex items-center pr-4',
                                                                                )}
                                                                            ></span>
                                                                        ) : null}
                                                                    </>
                                                                )}
                                                            </Listbox.Option>
                                                        ),
                                                    )}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Listbox>
                        )}
                    </div>
                </div>
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 ">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                        >
                                            Пользователи
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {searchResults.map((user, index) => (
                                        <tr
                                            className="border-b border-gray-400 bg-gray-100 bg-white"
                                            id={`${index}`}
                                            key={`${index}`}
                                        >
                                            <td>
                                                <div className="whitespace-wrap text-wrap bg-gray-200 px-6 py-4 text-center text-sm font-bold text-gray-900">
                                                    {index + 1}.{' '}
                                                    {user.name && (
                                                        <Highlighter
                                                            highlightClassName="Highlight"
                                                            searchWords={[
                                                                searchTerm,
                                                            ]}
                                                            autoEscape={true}
                                                            textToHighlight={
                                                                user.name
                                                            }
                                                        />
                                                    )}
                                                </div>
                                                <div className="whitespace-wrap px-6 py-4 text-right text-sm font-medium text-gray-900">
                                                    {user.address && (
                                                        <Highlighter
                                                            highlightClassName="Highlight"
                                                            searchWords={[
                                                                searchTerm,
                                                            ]}
                                                            autoEscape={true}
                                                            textToHighlight={
                                                                user.address
                                                            }
                                                        />
                                                    )}
                                                </div>
                                                <div className="whitespace-wrap px-6 py-4 text-right text-sm font-medium text-gray-900">
                                                    {user.phone && (
                                                        <Highlighter
                                                            highlightClassName="Highlight"
                                                            searchWords={[
                                                                searchTerm,
                                                            ]}
                                                            autoEscape={true}
                                                            textToHighlight={
                                                                user.phone
                                                            }
                                                        />
                                                    )}
                                                </div>
                                                <div className="whitespace-wrap bg-gray-200 px-6 py-4 text-right text-sm font-medium text-gray-900">
                                                    {user.email && (
                                                        <Highlighter
                                                            highlightClassName="Highlight"
                                                            searchWords={[
                                                                searchTerm,
                                                            ]}
                                                            autoEscape={true}
                                                            textToHighlight={
                                                                user.email
                                                            }
                                                        />
                                                    )}
                                                </div>
                                                <div className="whitespace-wrap text-wrap px-6 py-4 text-right text-sm font-medium text-gray-900">
                                                    {user.position && (
                                                        <Highlighter
                                                            highlightClassName="Highlight"
                                                            searchWords={[
                                                                searchTerm,
                                                            ]}
                                                            autoEscape={true}
                                                            textToHighlight={
                                                                user.position
                                                            }
                                                        />
                                                    )}
                                                </div>
                                                <div className="whitespace-wrap bg-gray-200 px-6 py-4 text-right text-sm font-medium">
                                                    {user.permissions
                                                        ? user.permissions.map(
                                                              (
                                                                  permission,
                                                                  index,
                                                              ) => (
                                                                  <div
                                                                      key={`${index}`}
                                                                  >
                                                                      <Highlighter
                                                                          highlightClassName="Highlight"
                                                                          searchWords={[
                                                                              searchTerm,
                                                                          ]}
                                                                          autoEscape={
                                                                              true
                                                                          }
                                                                          textToHighlight={
                                                                              permission
                                                                          }
                                                                      />
                                                                  </div>
                                                              ),
                                                          )
                                                        : ''}
                                                </div>
                                                <div className="whitespace-wrap px-6 py-4 text-right text-sm font-medium">
                                                    <form
                                                        method="POST"
                                                        action="/manage/update"
                                                    >
                                                        <input
                                                            type="hidden"
                                                            name="_token"
                                                            value={`${csrf_token}`}
                                                        />
                                                        <input
                                                            name="user_update"
                                                            value={`${user.id}`}
                                                            type="hidden"
                                                        />
                                                        <a
                                                            href="/manage/update"
                                                            onClick={
                                                                handleClickUpdate
                                                            }
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Редактировать
                                                        </a>
                                                    </form>
                                                </div>
                                                <div className="whitespace-wrap px-6 py-4 text-right text-sm font-medium ">
                                                    <form
                                                        method="POST"
                                                        action="/manage/delete"
                                                    >
                                                        <input
                                                            type="hidden"
                                                            name="_token"
                                                            value={`${csrf_token}`}
                                                        />
                                                        <input
                                                            name="user_del"
                                                            value={`${user.id}`}
                                                            type="hidden"
                                                        />
                                                        <a
                                                            href="#"
                                                            onClick={
                                                                handleClickDelete
                                                            }
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            Удалить
                                                        </a>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

render(<Users />, document.getElementById('users'));
