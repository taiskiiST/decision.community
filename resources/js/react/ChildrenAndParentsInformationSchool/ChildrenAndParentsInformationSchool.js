import React , { useEffect, useState } from 'react';
import {DebounceInput} from "react-debounce-input";
import { v4 as uuidv4 } from 'uuid';

const CHILDREN_CHECK_NOT_VALID = 0;
const CHILDREN_CHECK_VALID = 1;
const CHILDREN_SEX_WOMAN = 'Жен';


const {
    csrf_token
} = window.TSN || {};
const ChildrenAndParentsInformationSchool = () => {

    const childrenArr = [{
        id: uuidv4(),
        name: '',
        sex:'men',
        date_of_birthday:''
    }];

    const [children, setChildren] = useState(childrenArr);
    const [validationResult, setValidationResult] = useState({
        status: CHILDREN_CHECK_NOT_VALID,
        class: 'bg-gray-600 hover:bg-gray-700'
    });
    const [validFlagChild, setValidFlagChild] = useState(false);
    const [validFlagParent, setValidFlagParent] = useState(false);

    const validateChildren = (children) => {
        const mapValidChildren = children.map((child, index) => {
            if ((child.name && child.name.length > 0) && (child.date_of_birthday && child.date_of_birthday.length > 0)) {
                return {status: CHILDREN_CHECK_VALID}
            } else {
                return {status: CHILDREN_CHECK_NOT_VALID}
            }
        });
        var localFlag = true;
        mapValidChildren.forEach((valid) => {
            if (valid.status == 0)
                localFlag = false;
        })
        if (localFlag){
            setValidFlagChild (true);
            globalValidate(true, validFlagParent);
        }else{
            setValidFlagChild (false);
            globalValidate(false, validFlagParent);
        }
    };
    const validateParent = () => {
        if ( (document.getElementById('parent_name') && document.getElementById('parent_name').value.length > 0) &&
            (document.getElementById('parent_relationship') && document.getElementById('parent_relationship').value.length > 0) &&
            (document.getElementById('parent_address') && document.getElementById('parent_address').value.length > 0) &&
            (document.getElementById('parent_phone') && document.getElementById('parent_phone').value.length > 0) ) {
            setValidFlagParent (true );
            globalValidate(validFlagChild, true);
        }else {
            setValidFlagParent (false);
            globalValidate(validFlagChild, false);
        }
    };

    const globalValidate = (validFlagChild, validFlagParent) => {
        if (validFlagChild && validFlagParent){
            setValidationResult(
                {
                    status: CHILDREN_CHECK_VALID,
                    class: 'bg-green-600 hover:bg-green-700'
                }
            );
        }else{
            setValidationResult(
                {
                    status: CHILDREN_CHECK_NOT_VALID,
                    class: 'bg-gray-600 hover:bg-gray-700'
                }
            );
        }
    }

    const onChildNameChange = (e) => {
        const newChildId = e.target.id;
        const newChildName = e.target.value;

        const newChild = children.map((child, index) => {
            return index == newChildId
                ? {
                    ...child,
                    name: newChildName
                }
                : child;

        });

        setChildren(newChild);


       validateChildren(newChild);

    };

    const onChildSexChange = (e) => {
        const newChildId = e.target.id;
        const newChildSex = e.target.value;

        const newChild = children.map((child, index) => {
            return index == newChildId
                ? {
                    ...child,
                    sex: newChildSex
                }
                : child;

        });

        setChildren(newChild);

    };

    const onChildDateOfBirthdayChange = (e) => {
        const newChildId = e.target.id;
        const newChildDateOfBirthday = e.target.value;

        const newChild = children.map((child, index) => {
            return index == newChildId
                ? {
                    ...child,
                    date_of_birthday: newChildDateOfBirthday
                }
                : child;

        });

        setChildren(newChild);

        validateChildren(newChild);
    };

    const onSchoolInformationEdit = (e) => {

    };

    const onChildAdd= (e) => {
        const newChildren = children;
        newChildren.push(
            {
                id: uuidv4(),
                name: '',
                sex:'men',
                date_of_birthday:''
            }
        );

        setChildren(newChildren);
        validateChildren(newChildren);
    };

    const onDelChild = (e) => {
        const childId = e.target.id;
        const newChildren = children.filter(({id}) => {
                return id !== childId;
        });

        setChildren(newChildren);
        validateChildren(newChildren);
    };

    return (
        <div className="container px-4">
            <form
                id="form_id"
                action="/children-and-parents-information-school-submit"
                method="POST"
            >
                <input type="hidden" name="_token" value={csrf_token} />
                <div className="col-span-6 sm:col-span-3 mt-2 border-t-8 border-double border-gray-400">
                    <h1 className="text-lg leading-6 font-bold text-gray-900 text-center mt-3">
                        Данные ответственного родителя или лица, его замещающее.
                    </h1>
                    <div className="inline-flex flex-row w-full">
                        <label htmlFor='parent_name' className="mt-3 block text-sm font-medium text-gray-700">Введите полное ФИО родителя или родственника или лица их замещающего</label>
                    </div>
                    <input type='text'
                           name='parent_name'
                           id='parent_name'
                           className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                           onChange={validateParent}
                           required={true}
                    ></input>
                    <div className="inline-flex flex-row w-full">
                        <label htmlFor='parent_relationship' className="mt-3 block text-sm font-medium text-gray-700">Укажите спень родства (папа, мама, бабушка, брат, сестра и т.п.)</label>
                    </div>
                    <input type='text'
                           name='parent_relationship'
                           id='parent_relationship'
                           className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                           onChange={validateParent}
                           required={true}
                    ></input>
                    <div className="inline-flex flex-row w-full">
                        <label htmlFor='parent_address' className="mt-3 block text-sm font-medium text-gray-700">Укажите улицу проживания на поселке и номер дома</label>
                    </div>
                    <input type='text'
                           name='parent_address'
                           id='parent_address'
                           className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                           onChange={validateParent}
                           required={true}
                    ></input>
                    <div className="inline-flex flex-row w-full">
                        <label htmlFor='parent_phone' className="mt-3 block text-sm font-medium text-gray-700">Укажите контактный номер телефона родителя или родственника или лица их замещающего в формате  <b>89XXXXXXXXX</b></label>
                        <span className="validity"></span>
                    </div>
                    <input type="tel"
                           pattern="89[0-9]{9}"
                           name='parent_phone'
                           id='parent_phone'
                           className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                           onChange={validateParent}
                           required={true}
                    ></input>
                </div>

                <div className="col-span-6 sm:col-span-3 mt-5 border-t-8 border-dotted border-gray-400">
                    <h1 className="text-lg leading-6 font-bold text-gray-900 text-center mt-3">
                        Данные детей и школы
                    </h1>

                    {children.map(
                        (child, index) => (
                            <div key={`child_${index}`} className="col-span-6 sm:col-span-3 mt-2 border-t-4 border-gray-400">
                                <div className="inline-flex flex-row w-full">
                                    <label htmlFor={`child-name-${index}`} className="mt-3 block text-sm font-medium text-gray-700">Введите полное ФИО ребенка</label>
                                    <div className="flex-row-reverse contents" >
                                        {(index != 0) && <button className="ml-auto text-red-800" type="button" onClick={onDelChild}>
                                            <svg id={child.id} className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>}
                                    </div>
                                </div>
                                <DebounceInput
                                    className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    type="text"
                                    debounceTimeout={700}
                                    onChange={onChildNameChange}
                                    value={child.name}
                                    name={`child-name-${index}`}
                                    required={true}
                                />

                                <div className="inline-flex flex-row w-full">
                                    <label htmlFor={`child-sex-${index}`} className="mt-3 block text-sm font-medium text-gray-700">Укажите пол ребенка</label>
                                    <div className="mx-2">
                                        {child.sex !== CHILDREN_SEX_WOMAN && (
                                            <select
                                                name={`child-sex-${index}`}
                                                className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                                onChange={onChildSexChange}
                                                defaultValue='мужской'
                                            >
                                                <option value='мужской'>Муж</option>
                                                <option value='женский'>Жен</option>
                                            </select>
                                        )}
                                        {child.sex == CHILDREN_SEX_WOMAN && (
                                            <select
                                                name={`child-sex-${index}`}
                                                className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                                onChange={onChildSexChange}
                                                defaultValue='женский'
                                            >
                                                <option value='мужской'>Муж</option>
                                                <option value='женский'>Жен</option>
                                            </select>
                                        )}
                                    </div>
                                </div>

                                <div className="inline-flex flex-row w-full">
                                    <label htmlFor={`date-birthday-${index}`} className="mt-3 block text-sm font-medium text-gray-700">Введите дату рождения ребенка</label>
                                    <DebounceInput
                                        className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                        type="date"
                                        debounceTimeout={700}
                                        onChange={onChildDateOfBirthdayChange}
                                        value={child.date_of_birthday}
                                        name={`date-birthday-${index}`}
                                        required={true}
                                    />
                                </div>


                                <div className="inline-flex flex-row w-full">
                                    <label htmlFor={`school-name-${index}`} className="mt-3 block text-sm font-medium text-gray-700">Введите название или номер школы (садика)</label>
                                </div>
                                <DebounceInput
                                    className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    type="text"
                                    debounceTimeout={700}
                                    onChange={onSchoolInformationEdit}
                                    value=""
                                    name={`school-name-${index}`}
                                    required={true}
                                />

                                <div className="inline-flex flex-row w-full">
                                    <label htmlFor={`school-address-${index}`} className="mt-3 block text-sm font-medium text-gray-700">Введите адрес школы (садика)</label>
                                </div>
                                <DebounceInput
                                    className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    type="text"
                                    debounceTimeout={700}
                                    onChange={onSchoolInformationEdit}
                                    value=""
                                    name={`school-address-${index}`}
                                    required={true}
                                />

                                <div className="inline-flex flex-row w-full">
                                    <label htmlFor={`school-time-to-${index}`} className="mt-3 block text-sm font-medium text-gray-700">Введите по какому графику и ко скольки по времени вы возете ребенка в школу (садик)</label>
                                </div>
                                <DebounceInput
                                    className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    type="text"
                                    debounceTimeout={700}
                                    onChange={onSchoolInformationEdit}
                                    value=""
                                    name={`school-time-to-${index}`}
                                    required={true}
                                />

                                <div className="inline-flex flex-row w-full">
                                    <label htmlFor={`school-time-from-${index}`} className="mt-3 block text-sm font-medium text-gray-700">Введите по какому графику и в какое временя вы забираете ребенка из школы (садика)</label>
                                </div>
                                <DebounceInput
                                    className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    type="text"
                                    debounceTimeout={700}
                                    onChange={onSchoolInformationEdit}
                                    value=""
                                    name={`school-time-from-${index}`}
                                    required={true}
                                />

                            </div>
                        ),
                    )}

                </div>

                <div className="mt-3">
                    <button
                        type="button"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-2"
                        onClick={onChildAdd}
                    >
                        Добавить данные еще одного ребенка
                    </button>
                </div>

                <div className="inline-flex w-full flex-row place-content-center">
                    <div className="bg-gray-50 px-4 py-3  sm:px-6">
                            <button
                                type="submit"
                                className="justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-green-600 hover:bg-green-700"
                            >
                                Отправить данные
                            </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ChildrenAndParentsInformationSchool;