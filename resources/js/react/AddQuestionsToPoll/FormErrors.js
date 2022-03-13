import React from 'react';
import { XCircleIcon } from '@heroicons/react/solid';

const FormErrors = ({ formErrors }) => (
    <div className='formErrors'>
        {( formErrors.inputTextOfQuestion
        || formErrors.inputFilesText
        || formErrors.inputFilesUploadSize
        || formErrors.inputFilesUploadName
        || formErrors.inputAnswers) && <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Исправьте слудющие ошибки в заполенении формы:</h3>
                    <div className="mt-2 text-sm text-red-700">
                        <ul role="list" className="list-disc pl-5 space-y-1">
        {Object.keys(formErrors).map((fieldName, i) => {
            //console.log(formErrors);
            if(formErrors[fieldName].length > 0){
                return (
                                        <li key={i}>{formErrors[fieldName]}</li>
                )
            } else {
                return '';
            }
        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>}
    </div>
);

export default FormErrors;
