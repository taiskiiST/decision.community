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
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-2"
                    onClick={this.props.handleAddingFile} >
                    Добавить файл к вопросу
                </button>
            </div>
        );
    }
}

export default AddFileToQuestion;