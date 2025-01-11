import React from 'react';
import { DebounceInput } from 'react-debounce-input';

const ContactInfo = ({
    companyTitle,
    onCompanyTitleChange,
    isCompanyTitleValid,
    clientName,
    isClientNameValid,
    onClientNameChange,
    isClientAddressValid,
    onClientAddressChange,
    clientAddress,
    clientEmail,
    isClientEmailValid,
    isClientEmailExist,
    onClientEmailChange,
    phone,
    isPhoneValid,
    onPhoneChange,
    isClientPhoneExist
}) => {
    return (
        <>
            <div>
                <label
                    htmlFor="company_title"
                    className="block text-sm font-medium leading-6 text-white"
                >
                    Название организации
                </label>

                <DebounceInput
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text"
                    debounceTimeout={700}
                    onChange={onCompanyTitleChange}
                    value={companyTitle}
                    name="company_title"
                    id="company_title"
                    lang="en"
                />

                {companyTitle && !isCompanyTitleValid && (
                    <p className="mt-2 text-sm text-red-800">
                        Название организации должно состоять только из русских
                        или латинских букв, цифр, пробелов
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="client_name"
                    className="block text-sm font-medium leading-6 text-white"
                >
                    ФИО ответственного лица
                </label>

                <DebounceInput
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text"
                    debounceTimeout={700}
                    onChange={onClientNameChange}
                    value={clientName}
                    name="client_name"
                    id="client_name"
                    lang="en"
                />

                {clientName && !isClientNameValid && (
                    <p className="mt-2 text-sm text-red-800">
                        ФИО указано неверно
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="client_address"
                    className="block text-sm font-medium leading-6 text-white"
                >
                    Адрес ответственного лица
                </label>

                <DebounceInput
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text"
                    debounceTimeout={700}
                    onChange={onClientAddressChange}
                    value={clientAddress}
                    name="client_address"
                    id="client_address"
                    lang="en"
                />

                {clientAddress && !isClientAddressValid && (
                    <p className="mt-2 text-sm text-red-800">
                        Адрес указан неверно
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="client_email"
                    className="block text-sm font-medium leading-6 text-white"
                >
                    Email
                </label>

                <DebounceInput
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text"
                    debounceTimeout={700}
                    onChange={onClientEmailChange}
                    value={clientEmail}
                    name="client_email"
                    id="client_email"
                    lang="en"
                />

                {clientEmail && !isClientEmailValid && (
                    <p className="mt-2 text-sm text-red-800">
                        Электронный ящик указан неверно
                    </p>
                )}
                {clientEmail && isClientEmailValid && !isClientEmailExist && (
                    <p className="mt-2 text-sm text-red-800">
                        Данный электронный ящик уже используется. Если вы ходите добавить организацию с этим электронным ящиком, авторизуйтесь под пользователем этого ящика и под ним создайте организацию.
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="phone"
                    className="block text-sm font-medium leading-6 text-white"
                >
                    Телефон в формате 9281234567 (без восьмерки 10 цифр). <br/>
                </label>

                <DebounceInput
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text"
                    debounceTimeout={700}
                    onChange={onPhoneChange}
                    value={phone}
                    name="phone"
                    id="phone"
                    lang="en"
                />
                <label
                    htmlFor="phone"
                    className="block text-sm font-medium leading-6 text-white"
                >
                    <b>Телефон будет использован в качестве логина, а так же пароля (после вы сможете задать свой
                        пароль).</b>
                </label>

                {phone && !isPhoneValid && (
                    <p className="mt-2 text-sm text-red-800">
                        Неверно указан телефон
                    </p>
                )}
                {phone && isPhoneValid && !isClientPhoneExist && (
                    <p className="mt-2 text-sm text-red-800">
                        Данный телефон уже используется. Если вы ходите добавить организацию с этим телефоном,
                        авторизуйтесь под пользователем этого номера и под ним создайте организацию.
                    </p>
                )}
            </div>
        </>
    );
};

export default ContactInfo;
