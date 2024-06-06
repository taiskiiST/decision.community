import React, { useEffect, useState } from 'react';
import { client } from '../../shared/axios';
import { DebounceInput } from 'react-debounce-input';
import ContactInfo from './ContactInfo';

const { FETCH_EXISTING_SUBDOMAINS_URL } = window.TSN || {};

const SUB_DOMAIN_NOT_CHECKED = 0;
const SUB_DOMAIN_FREE = 1;
const SUB_DOMAIN_IN_USE = 2;
const SUB_DOMAIN_INVALID = 3;

const Form = () => {
    const [subDomain, setSubDomain] = useState('');
    const [companyTitle, setCompanyTitle] = useState('');
    const [clientName, setClientName] = useState('');
    const [phone, setPhone] = useState('');

    const [domainValidationResult, setDomainValidationResult] = useState({
        status: SUB_DOMAIN_NOT_CHECKED,
        text: '',
        class: '',
    });
    const [existingSubDomains, setExistingSubDomains] = useState([]);

    useEffect(() => {
        const getExistingSubDomains = async () => {
            let response;

            try {
                response = await client.get(FETCH_EXISTING_SUBDOMAINS_URL);
            } catch (e) {
                console.log('e', e);

                return;
            }

            setExistingSubDomains(response.data);
        };

        getExistingSubDomains();
    }, []);

    const validateSubdomain = (subDomain, existingSubDomains) => {
        const includes = existingSubDomains.includes(subDomain.trim());

        if (includes)
            return {
                text: 'Этот субдомен уже занят',
                class: 'text-red-800',
                status: SUB_DOMAIN_IN_USE,
            };

        const valid = !!subDomain.trim().match(/^[a-z0-9_\-]+$/);

        if (valid) {
            return {
                text: 'Субдомен свободен',
                class: 'text-green-200',
                status: SUB_DOMAIN_FREE,
            };
        }

        return {
            text: 'Субдомен некорректен',
            class: 'text-red-800',
            status: SUB_DOMAIN_INVALID,
        };
    };

    const validateCompanyTitle = () => {
        return !!companyTitle.trim().match(/^[a-zA-Zа-яА-Я\s0-9]*$/);
    };

    const validateClientName = () => {
        return !!clientName.trim().match(/^[a-zA-Zа-яА-Я\s]*$/);
    };

    const validatePhone = () => {
        return !!phone.trim().match(/(?:\+|\d)[\d\-\(\) ]{9,}\d/g);
    };

    const onSubDomainChange = (e) => {
        const newSubDomain = e.target.value;
        setSubDomain(newSubDomain);

        setDomainValidationResult(
            validateSubdomain(newSubDomain, existingSubDomains),
        );
    };

    const onCompanyTitleChange = (e) => {
        const newCompanyTitle = e.target.value;

        setCompanyTitle(newCompanyTitle);
    };

    const onClientNameChange = (e) => {
        const newClientName = e.target.value;

        setClientName(newClientName);
    };

    const onPhoneChange = (e) => {
        const newPhone = e.target.value;

        setPhone(newPhone);
    };

    const isSubDomainChecked =
        domainValidationResult.status !== SUB_DOMAIN_NOT_CHECKED;
    const isSubDomainValid =
        subDomain && domainValidationResult.status === SUB_DOMAIN_FREE;

    const isCompanyTitleValid = validateCompanyTitle();
    const isClientNameValid = validateClientName();
    const isPhoneValid = validatePhone();

    const createButtonEnabled =
        isSubDomainValid &&
        isCompanyTitleValid &&
        isClientNameValid &&
        isPhoneValid;

    return (
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div className="bg-white/20 px-6 py-12 shadow sm:rounded-lg sm:px-12">
                    <h2 className="text-center text-xl font-bold uppercase tracking-tight text-white">
                        создайте организацию
                    </h2>

                    <form className="mt-2 space-y-6" action="#">
                        <div>
                            <label
                                htmlFor="subDomain"
                                className="block text-sm font-medium leading-6 text-white"
                            >
                                Субдомен латинскими буквами
                            </label>

                            <DebounceInput
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                type="text"
                                debounceTimeout={700}
                                onChange={onSubDomainChange}
                                value={subDomain}
                                id="subDomain"
                                lang="en"
                            />

                            {isSubDomainChecked && (
                                <p
                                    className={`mt-2 text-sm ${domainValidationResult.class}`}
                                >
                                    {domainValidationResult.text}
                                </p>
                            )}
                        </div>

                        {isSubDomainValid && (
                            <ContactInfo
                                companyTitle={companyTitle}
                                isCompanyTitleValid={isCompanyTitleValid}
                                onCompanyTitleChange={onCompanyTitleChange}
                                clientName={clientName}
                                isClientNameValid={isClientNameValid}
                                onClientNameChange={onClientNameChange}
                                phone={phone}
                                isPhoneValid={isPhoneValid}
                                onPhoneChange={onPhoneChange}
                            />
                        )}

                        <div>
                            <button
                                type="button"
                                className="flex w-full justify-center rounded-md bg-brand-yellow px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-brand-yellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow"
                                disabled={!createButtonEnabled}
                            >
                                Создать
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Form;
