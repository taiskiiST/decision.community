import React, { useState, useEffect } from "react";
import { EditorState} from 'draft-js';
import { convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { Document, Page } from 'react-pdf';
import '../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {render} from "react-dom";
import { pdfjs } from 'react-pdf';
//pdfjs.GlobalWorkerOptions.workerSrc = '../../shared/pdf.worker.min';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import "react-pdf/dist/esm/Page/TextLayer.css";
import './StylePDF.css';
import StarRating from "../RatingStarsForReports/StarRating";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/legacy/build/pdf.worker.min.js',
    import.meta.url,
).toString();

const { questions, is_admin, users, question_hash_speakers, question_hash_files, display_mode, can_vote, file_hash, isReportDone, ratings_questions, answers} = window.TSN || {};

const DisplayQuestionEditor = () => {
    const [ratings, setRating] = useState(ratings_questions);
    const [hover, setHover] = useState([...Array(5)]);
    useEffect(() => {
        setRating (ratings_questions);
    }, [""]);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const editorStateText = questions.map ( (question) => {
        if ( Array.from(question['text'])[0] == '{' ){
            return EditorState.createWithContent(convertFromRaw(JSON.parse(question['text'])));
        }else{
            return EditorState.createWithText((question['text']));
        }
    });
    const [editorAllStateText, setEditor] = useState(editorStateText);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    let  array_of_radio = new Array();

    function onHandleRadioClick (e) {
        //console.log(e.target.name);
        if (!array_of_radio.includes(e.target.name)) {
            array_of_radio.push(e.target.name);
            let name = e.target.name;
            let nav_id = name.replace("question_", "nav_");
            //$('#' + nav_id).addClass("bg-green-200");
            nav_id = nav_id.replace("nav_", "class_");
            $('.' + nav_id).addClass("bg-green-200");
        }


        if (array_of_radio.length == $(".next").attr('value')) {
            $('.submit-button').removeClass('hidden');
            window.scrollBy({
                top: 500,
                behavior: 'smooth'
            });

            $(".submit-button").flash(7500, 10); // Flash 4 times over a period of 1 second
        }
        //console.log('array_of_radio ',  array_of_radio);
    }
    $.fn.flash = function(duration, iterations) {
        duration = duration || 1000; // Default to 1 second
        iterations = iterations || 1; // Default to 1 iteration
        var iterationDuration = Math.floor(duration / iterations);

        for (var i = 0; i < iterations; i++) {
            this.fadeOut(iterationDuration).fadeIn(iterationDuration);
        }
        return this;
    }
    function onHandleClickNext () {
        setPageNumber(1);
        let current_items = document.getElementsByClassName('border-indigo-500 text-indigo-600');
        let current_id = '';
        if (current_items.length > 0) {
            current_id = current_items[0].getAttribute('id');
        }else{
            return
        }
        let current = current_id.replace("nav_", "class_");

        let htmlElements = document.getElementsByClassName(current);
        let next_loop_id = 0;
        for (let htmlElement of htmlElements) {
            htmlElement.classList.remove(["border-indigo-500"]);
            htmlElement.classList.remove(["text-indigo-600"]);
            htmlElement.classList.add(["hidden"]);
            next_loop_id = Number(htmlElement.getAttribute('name').replace("nav_loop_", "")) + 1;
        }
        let next_id = document.getElementsByName("nav_loop_" + next_loop_id)[0].id
        next_id = next_id.replace("nav_", "");

        let htmlElementsNext = document.getElementsByClassName('class_' + next_id);
        for (let htmlElementNext of htmlElementsNext) {
            htmlElementNext.classList.remove(["hidden"]);
            htmlElementNext.classList.add(["border-indigo-500"]);
            htmlElementNext.classList.add(["text-indigo-600"]);
        }

        document.getElementById('container_question_' + current_id.replace("nav_", "")).classList.add('hidden');
        if (document.getElementById('id_' + current_id.replace("nav_", ""))) {
            document.getElementById('id_' + current_id.replace("nav_", "")).classList.add('hidden');
        }
        document.getElementById('container_question_' + next_id).classList.remove('hidden');
        if (document.getElementById('id_' + next_id)) {
            document.getElementById('id_' + next_id).classList.remove('hidden');
        }

        let value_next = document.getElementsByClassName('next')[0].getAttribute('value');
        if (next_loop_id == value_next){
            let listPrev = document.getElementsByClassName('prev');//[0].classList.remove("hidden");
            for (let prev of listPrev) {
                prev.classList.remove(["hidden"]);
            }
            let listNext = document.getElementsByClassName('next');//[0].classList.add("hidden");
            for (let next of listNext) {
                next.classList.add(["hidden"]);
            }
        } else{
            let listPrev = document.getElementsByClassName('prev');//[0].classList.remove("hidden");
            for (let prev of listPrev) {
                prev.classList.remove(["hidden"]);
            }
            let listNext = document.getElementsByClassName('next');//[0].classList.add("hidden");
            for (let next of listNext) {
                next.classList.remove(["hidden"]);
            }
        }
    }

    function onHandleClickPrev () {
        setPageNumber(1);
        let current = $(".border-indigo-500.text-indigo-600").attr("id");
        let current_id = current.replace("nav_", "");

        current = current.replace("nav_", "class_");
        $('.'+ current).removeClass("border-indigo-500 text-indigo-600");
        $('.'+ current).addClass("hidden");

        let name_curr = $('.' + current).attr("name");
        let current_loop_id = name_curr.replace("nav_loop_", "");

        let prev_loop_id = Number(current_loop_id) - 1;

        let prev_id = document.getElementsByName("nav_loop_" + prev_loop_id)[0].id
        prev_id = prev_id.replace("nav_", "");

        $('.class_' + prev_id ).removeClass("hidden");
        $('.class_' + prev_id ).addClass("border-indigo-500 text-indigo-600");

        // $("#question_" + current_id).addClass('hidden');
        // $("#question_" + prev_id ).removeClass('hidden');

        $("#container_question_" + current_id).addClass('hidden');
        if ($("#id_" + current_id)) {
            $("#id_" + current_id).addClass('hidden');
        }
        $("#container_question_" + prev_id ).removeClass('hidden');
        if ($("#id_" + prev_id )){
            $("#id_" + prev_id ).removeClass('hidden');
        }

        name_curr = $('.class_' + prev_id).attr("name");
        prev_id = name_curr.replace("nav_loop_", "");

        if (prev_id == 1){
            $(".prev").addClass('hidden');
            $(".next").removeClass('hidden');
        } else{
            $(".prev").removeClass('hidden');
            $(".next").removeClass('hidden');
        }
    }

    return (
        <div >
            <nav className="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0">
                <div className="-mt-px w-0 flex-1 flex">
                    <button className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 prev hidden outline-none focus:outline-none"
                            type="button"
                            onClick={onHandleClickPrev}
                    >

                        <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Предыдущий
                    </button>
                </div>
                <div className="flex">
                    {questions.map ( (question, index) => {
                      return  <button id={`nav_${question.id}`}
                                className={`${index == 0 
                                    ? 'border-indigo-500 text-indigo-600 class_' + question.id + ' border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium nav-action outline-none focus:outline-none' 
                                    : 'hidden class_' + question.id +                            ' border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium nav-action outline-none focus:outline-none'} 
                                    `}
                                type="button"
                                      key={index}
                                name={`nav_loop_${index + 1}`}>
                            {index + 1} <span > / {questions.length} </span>
                        </button>
                    } ) }
                </div>

                <div className="-mt-px w-0 flex-1 flex justify-end">
                    <button className={`${questions.length == 1
                        ? 'hidden border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 next outline-none focus:outline-none'
                        : 'border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 next outline-none focus:outline-none'} 
                                    `}
                            value={questions.length}
                            onClick={onHandleClickNext}
                            type="button">
                        Следующий
                        <svg className="ml-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </nav>

            {questions.map ( (question, index) => {
                if (is_admin) {
                    return (<div className={`mt-10 sm:mt-0 ${index == 0 ? '' : 'hidden'}`}
                                 id={`container_question_${question.id}`} key={index}>
                            <div className="p-3 md:col-span-2">
                                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
                                    <div>
                                        <div>Выступающие</div>
                                        <div>
                                            <select name={`speaker${question.id}[]`}
                                                    className="mt-1 block w-full py-1 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-600 sm:text-sm"
                                                    required multiple
                                                    defaultValue={users.map ( (user) => {
                                                        if (question_hash_speakers[question.id]){
                                                            if (question_hash_speakers [question.id].length > 0) {
                                                                if (~question_hash_speakers [question.id][0].users_speaker_id.indexOf(user.id)) {
                                                                    return user.id
                                                                }
                                                            }
                                                        }
                                                    } )}
                                                    id={`select_speaker_question_${question.id}`}
                                                    noValidate
                                            >
                                                {users.map ( (user) => {
                                                    return <option value={user.id} key={user.id}>{user.name}</option>
                                                } )}
                                            </select>
                                        </div>
                                    </div>
                                </div>


                                <div className={`bg-white shadow overflow-hidden sm:rounded-lg`} id={`question_${question.id}`}>
                                    <div className="px-4 py-5 sm:px-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            {index + 1})
                                            <Editor
                                                name={`question_text_${index}`}
                                                id={`question_text_${index}`}
                                                defaultEditorState={editorAllStateText[index]}
                                                toolbarClassName="rdw-storybook-toolbar"
                                                wrapperClassName="rdw-storybook-wrapper"
                                                editorClassName="rdw-storybook-editor"
                                                toolbarStyle={{
                                                    display: "none"
                                                }}
                                                editorStyle={{
                                                    disabled: "true"
                                                }}
                                            />
                                        </h3>
                                    </div>

                                </div>

                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        {question_hash_files[question.id].map( (file, index_map) => (
                                                <div key={question.id + index_map}>
                                                    <p className={`${index_map !== 0 ? 'pt-10' : ''}`} >Описание: {file.text_for_file}</p>
                                                    { (file.path_to_file.indexOf('.pdf') >= 0) &&
                                                        <div>

                                                            <Document file={`/storage/${file.path_to_file}`} onLoadSuccess={onDocumentLoadSuccess}>
                                                                <Page pageNumber={pageNumber} renderTextLayer={false}/>
                                                            </Document>
                                                            <p className="flex justify-center inline items-center place-content-center content-center">
                                                                <button type="button" onClick={() => pageNumber > 1 ? setPageNumber(pageNumber - 1 ) : setPageNumber(pageNumber) } >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="50"
                                                                         height="50" fill="currentColor"
                                                                         className="bi bi-arrow-right-circle"
                                                                         viewBox="0 0 16 16" id="IconChangeColor"
                                                                         transform="scale(-1, 1)">
                                                                        <path fillRule="evenodd"
                                                                              d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                                                                              id="mainIconPathAttribute"></path>
                                                                    </svg>
                                                                </button>
                                                                &nbsp; Стр {pageNumber} из {file_hash[file.id]} &nbsp;
                                                                <button type="button"
                                                                        onClick={() => pageNumber < file_hash[file.id] ? setPageNumber(pageNumber + 1 ) : setPageNumber(pageNumber) }
                                                                    //onChange={onHandleNext}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="50"
                                                                         height="50" fill="currentColor"
                                                                         className="bi bi-arrow-right-circle"
                                                                         viewBox="0 0 16 16" id="IconChangeColor">
                                                                        <path fillRule="evenodd"
                                                                              d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
                                                                              id="mainIconPathAttribute"></path>
                                                                    </svg>
                                                                </button>
                                                            </p>
                                                        </div>
                                                    }
                                                    { ( file.path_to_file.indexOf('.jpg') >= 0 || file.path_to_file.indexOf('.png') >= 0 ) &&
                                                        <img src={`/storage/${file.path_to_file}`} />
                                                    }
                                                    { (file.path_to_file.indexOf('.jpg') < 0 && file.path_to_file.indexOf('.png') < 0 && file.path_to_file.indexOf('.pdf') < 0 ) &&
                                                        <a href={`/storage/${file.path_to_file}`} target="_blank"
                                                           className="bg-violet-500 hover:bg-violet-400 active:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300"
                                                        >
                                                            Скачать
                                                        </a>
                                                    }
                                                </div>
                                            )
                                        )}

                                    </h3>
                                </div>
                            </div>
                            {!display_mode && can_vote && !isReportDone && <div>
                                <fieldset>
                                    <div className="bg-white rounded-md -space-y-px">
                                        {answers[question.id].map((answer, index_map) => {
                                            return <div key={index_map}>
                                                <label
                                                    className="border-gray-200 rounded-tl-md rounded-tr-md relative border p-4 flex cursor-pointer">
                                                    <input type="radio"
                                                           name={`question_${question.id}`}
                                                           value={answer.id}
                                                           className="h-4 w-4 mt-0.5 cursor-pointer text-indigo-600 border-gray-300 focus:ring-indigo-500 input-radio"
                                                           aria-labelledby="privacy-setting-0-label"
                                                           aria-describedby="privacy-setting-0-description"
                                                           onClick={onHandleRadioClick}
                                                    />
                                                    <div className=" ml-3 flex flex-col">
                                                                                    <span id="privacy-setting-0-label"
                                                                                          className="text-gray-900 block text-sm font-medium">
                                                                                        {answer.text}
                                                                                    </span>
                                                    </div>
                                                </label>
                                            </div>
                                        } ) }
                                    </div>
                                </fieldset>
                            </div>
                            }
                            {!display_mode && can_vote && isReportDone && <div>
                                <fieldset>
                                    <div key={"key_"+ index} id={"id_"+questions[index].id} className="flex flex-nowrap inline-block overflow-visible justify-center" >
                                        {[...Array(5)].map((star, index_map) => {
                                            index_map += 1;
                                            return (
                                                <div key={"div_"+index + "_" + index_map} className={"w-1/9 text-7xl"}>
                                                    <button
                                                        type="button"
                                                        key={index + "_" + index_map}
                                                        className={
                                                            (index != 0) ?
                                                                index_map <= ( (hover[index] || ( (hover[index] && ratings[index]) || ratings[index] )) )
                                                                    ? "on index_" + index_map
                                                                    : "off index_" + index_map
                                                                :
                                                                index_map <=
                                                                ( index_map <=( (hover[index] || ( (hover[index] && ratings[index]) || ratings[index] )) )
                                                                        ? ( (hover[index] || ( (hover[index] && ratings[index]) || ratings[index] )) )
                                                                        :
                                                                        (index_map > ( (ratings[index] && ( (hover[index] || ratings[index]) && hover[index] )) ) ) ?
                                                                            ( (ratings[index] && ( (hover[index] || ratings[index]) && hover[index] )) )
                                                                            : ratings[index]
                                                                )
                                                                    ? "on index_" + index_map
                                                                    : "off index_" + index_map
                                                        }

                                                        onClick={() => setRating( (oldValue) => {
                                                            const newValue = [...oldValue]
                                                            newValue[index] = index_map;
                                                            $('.submit-button').removeClass('hidden');
                                                            window.scrollBy({
                                                                top: 500,
                                                                behavior: 'smooth'
                                                            });

                                                            $(".submit-button").flash(7500, 10);

                                                            return newValue;
                                                        })}
                                                        onMouseEnter={() => setHover( (oldValue) => {
                                                            const newValue = [...oldValue]
                                                            newValue[index] = index_map;
                                                            return newValue;
                                                        }   )}
                                                        onMouseLeave={() => setHover( (oldValue) => {
                                                            const newValue = [...oldValue]
                                                            newValue[index] = ratings[index];
                                                            return newValue;
                                                        }        )}

                                                    >
                                                        <span className="">&#9733;</span>
                                                    </button>
                                                </div>
                                            );
                                        } )}
                                        <input id={"rating_" + questions[index].id} name={"question_" + questions[index].id} hidden  value={(ratings[index] == 0) ? '0': answers[questions[index].id][ratings[index] -1 ].id } onChange={() => {}}/>
                                    </div>
                                </fieldset>
                            </div>
                            }
                        </div>
                    )
                }
            })}

            <br/>
            <nav className="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0">
                <div className="-mt-px w-0 flex-1 flex">
                    <button
                        className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 prev hidden outline-none focus:outline-none"
                        type="button"
                        onClick={onHandleClickPrev}
                    >
                        <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd"
                                  d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                                  clipRule="evenodd"/>
                        </svg>
                        Предыдущий
                    </button>
                </div>
                <div className="flex">
                    {questions.map ( (question, index) => {
                        return <button id={`nav_${question.id}`}
                                       className={`${index == 0
                                           ? 'class_' + question.id + ' border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium nav-action outline-none focus:outline-none'
                                           : 'hidden class_' + question.id + ' border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium nav-action outline-none focus:outline-none'} 
                                    `}
                                type="button" key={index}
                                name={`nav_loop_${index + 1}`}>
                            {index + 1} <span > / {questions.length} </span>
                        </button>
                    } ) }
                </div>

                <div className="-mt-px w-0 flex-1 flex justify-end">
                    <button
                        className={`${questions.length == 1
                            ? 'hidden border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 next outline-none focus:outline-none'
                            : 'border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 next outline-none focus:outline-none'} 
                                    `}
                        value={questions.length}
                        onClick={onHandleClickNext}
                        type="button">
                        Следующий
                        <svg className="ml-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd"
                                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                  clipRule="evenodd"/>
                        </svg>
                    </button>
                </div>
            </nav>

        </div>
    );
};

render(<DisplayQuestionEditor />, document.getElementById('displayQuestionsEditor'));

export default DisplayQuestionEditor;