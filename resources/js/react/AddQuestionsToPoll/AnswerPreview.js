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
        <div
          id={`answer_${answer.answer_id}`}
          className={`col-span-6 mt-8 border-t-8 border-double border-gray-400 sm:col-span-3 ${isReport ? 'hidden' : ''}`}
        >
          <div className="inline-flex w-full flex-row">
            {!isUpdate && (
              <label
                htmlFor={`text_answer_${answer.answer_id}`}
                className="mt-3 block text-sm font-medium text-gray-700"
              >
                Введите текст ответа к вопросу №{num_of_question}, ответ №
                {num_of_answer + 1}{' '}
              </label>
            )}
            {isUpdate && (
              <label
                htmlFor={`text_answer_${answer.answer_id}`}
                className="mt-3 block text-sm font-medium text-gray-700"
              >
                Введите текст ответа к вопросу №{num_question}, ответ №
                {num_of_answer + 1}{' '}
              </label>
            )}
            <div className="contents flex-row-reverse">
              {num_of_answer != 0 && (
                <button
                  id={`btn-del-answer-${answer.answer_id}`}
                  className="ml-auto text-red-800"
                  type="button"
                  onClick={() => this.props.onDeleteAnswer(answer.answer_id)}
                >
                  <svg
                    className="h-8 w-8"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <input
            type="text"
            name={`text_answer_${answer.answer_id}`}
            id={`text_answer_${answer.answer_id}`}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={answer.text}
            onChange={this.props.onChangeTextInputAnswer}
          ></input>
        </div>
      </div>
    );
  }
}

export default AnswerPreview;
