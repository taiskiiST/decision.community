import React from 'react';

class AnswerPreview extends React.Component {
    constructor(props) {
            super(props);

    }

    render() {
        const answer = this.props.answer;
        const num_of_question = this.props.num_of_question;
        const num_of_answer = this.props.num_of_answer;
        const isUpdate = this.props.isUpdate;
        const num_question = this.props.numQuestion;
        const isReport = this.props.isReport;
        //console.log(isReport);
        return (
            <div>
                <div id={`answer_${answer.answer_id}`} className={`col-span-6 sm:col-span-3 mt-8 border-t-8 border-double border-gray-400 ${isReport ? 'hidden': ''}`}>
                   <div className="inline-flex flex-row w-full">
                       {!isUpdate && <label htmlFor={`text_answer_${answer.answer_id}`} className="mt-3 block text-sm font-medium text-gray-700">Введите текст ответа к вопросу №{num_of_question}, ответ №{num_of_answer+1} </label>}
                       {isUpdate && <label htmlFor={`text_answer_${answer.answer_id}`} className="mt-3 block text-sm font-medium text-gray-700">Введите текст ответа к вопросу №{num_question}, ответ №{num_of_answer+1} </label>}
                       <div className="flex-row-reverse contents" >
                           {(num_of_answer != 0)&&<button id={`btn-del-answer-${answer.answer_id}`} className="ml-auto text-red-800" type="button" onClick={() => this.props.onDeleteAnswer(answer.answer_id)}>
                               <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                               </svg>
                           </button>}
                       </div>
                   </div>
                   <input type='text'
                          name={`text_answer_${answer.answer_id}`}
                          id={`text_answer_${answer.answer_id}`}
                          className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                          value={answer.text}
                          onChange={this.props.onChangeTextInputAnswer}
                   ></input>
             </div>
            </div>
        );
    }
}

export default AnswerPreview;