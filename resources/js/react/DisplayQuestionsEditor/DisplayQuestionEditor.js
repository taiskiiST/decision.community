import React, { useState, useEffect } from 'react';
import { EditorState } from 'draft-js';
import { convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { toast } from 'react-toastify';
import { client } from '../../shared/axios';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { isJson } from '../../shared/helpers';
import Answers from './Answers';
import DocumentViewer from './DocumentViewer';

const { voteUrl, pollId, questionsCount, displayMode, canVote, isTypeReport } =
    window.TSN || {};

const getEditorState = (question) => {
    if (!question) {
        return EditorState.createWithText('');
    }

    const { text } = question;
    if (!text) {
        return EditorState.createWithText('');
    }

    return isJson(text)
        ? EditorState.createWithContent(convertFromRaw(JSON.parse(text)))
        : EditorState.createWithText(text);
};

const Paginator = ({
    onHandleClickPrev,
    previousButtonDisabled,
    indexQuestion,
    onHandleClickNext,
    nextButtonDisabled,
}) => (
    <nav className="flex items-center justify-between px-4 sm:px-0">
        <div className="-mt-px flex w-0 flex-1">
            <PreviousButton
                onClick={onHandleClickPrev}
                disabled={previousButtonDisabled}
            />
        </div>

        <QuestionPosition
            position={indexQuestion}
            questionsCount={questionsCount}
        />

        <div className="-mt-px flex w-0 flex-1 justify-end">
            <NextButton
                onClick={onHandleClickNext}
                disabled={nextButtonDisabled}
            />
        </div>
    </nav>
);

const PreviousButton = ({ disabled, onClick }) => (
    <button
        className={`prev inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 outline-none hover:border-gray-300 hover:text-gray-700 focus:outline-none ${
            disabled ? 'hidden' : ''
        }`}
        type="button"
        onClick={onClick}
    >
        <svg
            className="mr-3 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
            />
        </svg>
        Предыдущий
    </button>
);

const NextButton = ({ disabled, onClick }) => (
    <button
        className={`next inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 outline-none hover:border-gray-300 hover:text-gray-700 focus:outline-none ${
            disabled ? 'hidden  ' : ''
        }`}
        value={questionsCount}
        onClick={onClick}
        type="button"
    >
        Следующий
        <svg
            className="ml-3 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
            />
        </svg>
    </button>
);

const QuestionPosition = ({ position, questionsCount }) => (
    <button
        className="nav-action inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600 outline-none focus:outline-none"
        type="button"
    >
        {position} <span> / {questionsCount} </span>
    </button>
);

const QuestionFiles = ({ questionFiles }) =>
    questionFiles.map((file, index_map) => (
        <div key={file.id}>
            <p className={`${index_map !== 0 ? 'pt-10' : ''}`}>
                Описание: {file.text_for_file}
            </p>

            <DocumentViewer file={file} />
        </div>
    ));

const DisplayQuestionEditor = () => {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [votes, setVotes] = useState({});

    useEffect(() => {
        getNextQuestion();
    }, []);

    const editorState = getEditorState(currentQuestion);

    const currentQuestionId = currentQuestion?.id;
    const indexQuestion = currentQuestion?.position_in_poll || 1;
    const nextButtonDisabled = indexQuestion === Number(questionsCount);
    const previousButtonDisabled = indexQuestion === 1;
    const votesCount = Object.keys(votes).length;
    const voteButtonDisabled = isTypeReport
        ? votesCount < 1
        : votesCount !== questionsCount;

    const onAnswerClick = (questionId, answerId) => {
        setVotes((prev) => ({
            ...prev,
            [questionId]: answerId,
        }));
    };

    function onHandleClickNext() {
        if (nextButtonDisabled) {
            return;
        }

        getNextQuestion();
    }

    const onHandleClickPrev = async () => {
        if (previousButtonDisabled) {
            return;
        }

        await getPreviousQuestion();
    };

    const getQuestion = async (positionInPoll) => {
        let result;

        try {
            result = await client.get('/question/getQuestion', {
                params: {
                    pollId,
                    positionInPoll,
                },
            });
        } catch (error) {
            console.log('e', error);

            return;
        }

        const { data } = result;
        if (!data) {
            return;
        }

        setCurrentQuestion(data);
    };

    const getNextQuestion = async () => {
        await getQuestion(
            currentQuestion ? currentQuestion.position_in_poll + 1 : 1,
        );
    };

    const getPreviousQuestion = async () => {
        await getQuestion(
            currentQuestion ? currentQuestion.position_in_poll - 1 : 1,
        );
    };

    const onVoteButtonClick = async () => {
        try {
            await client.post(voteUrl, {
                votes,
            });
        } catch (e) {
            console.log('e', e);
            toast.error('Ошибка сохранения.');

            return;
        }

        toast.success('Всё получилось!');

        window.location = '/polls';
    };

    if (!currentQuestion) {
        return null;
    }

    return (
        <div>
            <Paginator
                indexQuestion={indexQuestion}
                previousButtonDisabled={previousButtonDisabled}
                onHandleClickPrev={onHandleClickPrev}
                nextButtonDisabled={nextButtonDisabled}
                onHandleClickNext={onHandleClickNext}
            />

            <div
                className={`mt-10 sm:mt-0`}
                id={`container_question_${currentQuestionId}`}
            >
                <div className="p-3 md:col-span-2">
                    <div
                        className={`overflow-hidden bg-white shadow sm:rounded-lg`}
                        id={`question_${currentQuestionId}`}
                    >
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                <Editor
                                    name={`question_text_${indexQuestion}`}
                                    id={`question_text_${indexQuestion}`}
                                    editorState={editorState}
                                    toolbarClassName="rdw-storybook-toolbar"
                                    wrapperClassName="rdw-storybook-wrapper"
                                    editorClassName="rdw-storybook-editor"
                                    toolbarStyle={{
                                        display: 'none',
                                    }}
                                    editorStyle={{
                                        disabled: 'true',
                                    }}
                                />
                            </h3>
                        </div>
                    </div>

                    <div className="px-4 py-5 sm:px-6">
                        <QuestionFiles
                            questionFiles={currentQuestion.question_files}
                        />
                    </div>
                </div>

                {!displayMode && canVote && (
                    <Answers
                        isTypeReport={isTypeReport}
                        votes={votes}
                        question={currentQuestion}
                        onAnswerClick={onAnswerClick}
                    />
                )}
            </div>

            <div className="mt-3">
                <Paginator
                    indexQuestion={indexQuestion}
                    previousButtonDisabled={previousButtonDisabled}
                    onHandleClickPrev={onHandleClickPrev}
                    nextButtonDisabled={nextButtonDisabled}
                    onHandleClickNext={onHandleClickNext}
                />
            </div>

            <div className="mt-4 flex w-full items-center justify-between">
                <button
                    type="button"
                    className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    onClick={() => {
                        if (
                            confirm(
                                'Вы уверены, что хотите окончить голосование?',
                            )
                        )
                            window.location = '/polls';
                    }}
                >
                    Отмена
                </button>

                <button
                    type="button"
                    className="rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:bg-gray-600"
                    disabled={voteButtonDisabled}
                    onClick={() =>
                        confirm('Сохранить результаты?') && onVoteButtonClick()
                    }
                >
                    Проголосовать
                </button>
            </div>
        </div>
    );
};

export default DisplayQuestionEditor;
