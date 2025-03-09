import React from 'react';

class AddFileToQuestion extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    //const product = this.props.product;
    return (
      <div>
        <button
          type="button"
          className="mt-2 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={this.props.handleAddingFile}
        >
          Добавить файл к вопросу
        </button>
      </div>
    );
  }
}

export default AddFileToQuestion;
