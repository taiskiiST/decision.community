import React from 'react';
import { DebounceInput } from 'react-debounce-input';

const ContactInfo = ({
    companyTitle,
    onCompanyTitleChange,
    isCompanyTitleValid,
    clientName,
    isClientNameValid,
    onClientNameChange,
    phone,
    isPhoneValid,
    onPhoneChange,
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
                    ФИО
                </label>

                <DebounceInput
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text"
                    debounceTimeout={700}
                    onChange={onClientNameChange}
                    value={clientName}
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
                    htmlFor="phone"
                    className="block text-sm font-medium leading-6 text-white"
                >
                    Телефон
                </label>

                <DebounceInput
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text"
                    debounceTimeout={700}
                    onChange={onPhoneChange}
                    value={phone}
                    id="phone"
                    lang="en"
                />

                {phone && !isPhoneValid && (
                    <p className="mt-2 text-sm text-red-800">
                        Неверно указан телефон
                    </p>
                )}
            </div>
        </>
    );
};

export default ContactInfo;
