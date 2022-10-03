import { useState, useEffect } from 'react';
import {render} from "react-dom";

const {users, csrf_token} = TSN;

function Users() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(users);
    const [onFilterName, setFilterName] = useState(1);
    const [onFilterAddress, setFilterAddress] = useState(1);

    const handleChangeUsersFilter = event => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        searchResults.map((user,index) => (
            [].map.call(document.getElementsByClassName("permissions_" + index), item => item.innerHTML =  "")
        ))
        searchResults.map((user,index) => (
            user.permissions.split("=").map((permission) => (
                [].map.call(document.getElementsByClassName("permissions_" + index), item => item.innerHTML +=  "<div>" + permission + "</div>")
            ))
        ))
    }, []);
    useEffect(() => {
        const results = users
            .filter(person =>
            person.name.toLowerCase().includes(searchTerm) || person.phone.includes(searchTerm)
            || ( person.email ? person.email.toLowerCase().includes(searchTerm) : "" )
            || ( person.position ? person.position.toLowerCase().includes(searchTerm) : "" )
            || ( person.permissions ? person.permissions.toLowerCase().includes(searchTerm) : "" )
            || ( person.address ? person.address.toLowerCase().includes(searchTerm) : "" )
        );
        setSearchResults(results);
    }, [searchTerm]);

    const handleClickNameSort = event => {
        setFilterName(onFilterName? 0: 1);
    };
    useEffect(() => {
        if(onFilterName){
            const results = searchResults.sort((a, b) => a.name > b.name ? 1 : -1)
            setSearchResults(results);
        }else{
            const  results = searchResults.sort((a, b) => a.name < b.name ? 1 : -1)
            setSearchResults(results);
        }
    }, [onFilterName]);

    const handleClickAddressSort = event => {
        setFilterAddress(onFilterAddress? 0: 1);
    };

    useEffect(() => {
        if(onFilterAddress){
            const results = searchResults.sort((a, b) => a.address > b.address ? 1 : -1)
            setSearchResults(results);
        }else{
            const  results = searchResults.sort((a, b) => a.address < b.address ? 1 : -1)
            setSearchResults(results);
        }
    }, [onFilterAddress]);

    function handleClickUpdate(event) {
        event.preventDefault();
        event.target.parentElement.submit();
    }

    function handleClickDelete(event) {
        event.preventDefault();
        event.target.parentElement.submit();
    }

    return (
        <div className="p-2">
            <div className="relative w-80 px-4 py-3">
                <input
                    type="search"
                    className="appearance-none shadow border py-2 px-3 text-gray-500 focus:outline-none focus:shadow-outline w-5/6"
                    id="search"
                    placeholder="Поиск"
                    name="search"
                    autoFocus
                    value={searchTerm}
                    onChange={handleChangeUsersFilter}
                />
                <button type="submit"
                        className="y-2 px-3 w-1/6 h-4/6 absolute inset-y-3 right-0 flex items-center bg-indigo-600 text-white text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <svg className="w-10 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"
                         stroke="currentColor">
                        <path fillRule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clipRule="evenodd"/>
                    </svg>
                </button>
            </div>
            <div className="flex flex-col hidden lg:-mt-px xl:flex">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 ">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="relative px-6 py-3 text-center">
                                        №
                                    </th>
                                    <th scope="col" className="relative px-6 py-3 text-center">
                                        <button onClick={handleClickNameSort}
                                                className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            ФИО
                                        </button>
                                    </th>
                                    <th scope="col" className="relative px-6 py-3 text-center">
                                        <button onClick={handleClickAddressSort}
                                                className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Адрес
                                        </button>
                                    </th>
                                    <th scope="col" className="relative px-6 py-3 text-center">
                                        Телефон
                                    </th>
                                    <th scope="col" className="relative px-6 py-3 text-center">
                                        Электронный ящик
                                    </th>
                                    <th scope="col" className="relative px-6 py-3 text-center">
                                        Должность
                                    </th>
                                    <th scope="col" className="relative px-6 py-3 text-center">
                                        Права
                                    </th>
                                    <th scope="col" className="relative px-6 py-3 text-center" colSpan="2">
                                        Действия
                                    </th>

                                </tr>
                                </thead>

                                <tbody>
                                {searchResults.map((user,index) => (
                                    <tr className={`bg-white ${index % 2 === 0 ? 'bg-gray-200' : ''}`} id={`${index}`} key={`${index}`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-gray-900">
                                            {index +1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-wrap text-wrap text-center font-medium text-gray-900">
                                            {user.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            {user.address}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            {user.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-wrap text-wrap text-center text-sm font-medium">
                                            {user.position}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-nowrap text-center text-sm font-medium">
                                            <div className={`permissions_${index}`}></div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <form method="POST" action="/manage/update">
                                                <input type="hidden" name="_token" value={`${csrf_token}`} />
                                                <input name="user_update" value={`${user.id}`} type="hidden" />
                                                <a href="/manage/update" onClick={handleClickUpdate}
                                                   className="text-indigo-600 hover:text-indigo-900">
                                                    Редактировать
                                                </a>
                                            </form>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <form method="POST" action="/manage/delete">
                                                <input type="hidden" name="_token" value={`${csrf_token}`} />
                                                <input name="user_del" value={`${user.id}`} type="hidden"/>
                                                <a href="/manage/delete"
                                                   onClick={handleClickDelete}
                                                   className="text-indigo-600 hover:text-indigo-900">
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
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 ">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Пользователи
                                    </th>
                                </tr>
                                </thead>

                                <tbody>
                                {searchResults.map((user,index) => (
                                    <tr className="bg-white bg-gray-100 border-b border-gray-400" id={`${index}`} key={`${index}`}>
                                        <td>
                                            <div
                                                className="px-6 py-4 whitespace-wrap text-wrap text-sm font-bold text-gray-900 text-center bg-gray-200">
                                                {index + 1}. {user.name}
                                            </div>
                                            <div
                                                className="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900 text-right">
                                                {user.address}
                                            </div>
                                            <div
                                                className="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900 text-right">
                                                {user.phone}
                                            </div>
                                            <div
                                                className="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900 text-right bg-gray-200">
                                                {user.email}
                                            </div>
                                            <div
                                                className="px-6 py-4 whitespace-wrap text-wrap text-sm font-medium text-gray-900 text-right">
                                                {user.position}
                                            </div>
                                            <div
                                                className="px-6 py-4 whitespace-wrap text-right text-sm font-medium bg-gray-200">
                                                <div className={`permissions_${index}`}></div>
                                            </div>
                                            <div className="px-6 py-4 whitespace-wrap text-right text-sm font-medium">
                                                <form method="POST" action="/manage/update">
                                                    <input type="hidden" name="_token" value={`${csrf_token}`} />
                                                    <input name="user_update" value={`${user.id}`} type="hidden" />
                                                    <a href="/manage/update" onClick={handleClickUpdate}
                                                       className="text-indigo-600 hover:text-indigo-900">
                                                        Редактировать
                                                    </a>
                                                </form>
                                            </div>
                                            <div className="px-6 py-4 whitespace-wrap text-right text-sm font-medium ">
                                                <form method="POST" action="/manage/delete">
                                                    <input type="hidden" name="_token" value={`${csrf_token}`} />
                                                    <input name="user_del" value={`${user.id}`} type="hidden"/>
                                                    <a href="#"
                                                       onClick={handleClickDelete}
                                                       className="text-indigo-600 hover:text-indigo-900">
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