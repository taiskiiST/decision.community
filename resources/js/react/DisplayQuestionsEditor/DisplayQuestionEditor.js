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
import axios from 'axios';
import StarRating from "../RatingStarsForReports/StarRating";
import {v4 as uuidv4} from "uuid";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/legacy/build/pdf.worker.min.js',
    import.meta.url,
).toString();

const {  is_admin, users, question_hash_speakers, question_hash_files, display_mode, can_vote, file_hash, isReportDone,
    ratings_questions, answers, question_first, count_questions, question_list_id} = window.TSN || {};

const DisplayQuestionEditor = () => {
    const [currentQuestionId, setCurrentQuestionId] = useState(question_first.id);
    const [currentQuestion, setCurrentQuestion] = useState(question_first);
    const [indexQuestion, setIndexQuestion] = useState(0);
    const [ratings, setRating] = useState(ratings_questions);
    const [hover, setHover] = useState([...Array(5)]);
    useEffect(() => {
        setRating (ratings_questions);
    }, [""]);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const [editorAllStateText, setEditor] = useState(
        Array.from(currentQuestion['text'])[0] == '{' ?
        EditorState.createWithContent(convertFromRaw(JSON.parse(currentQuestion['text'])))
        :  EditorState.createWithText((currentQuestion['text']))
    );
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
            // htmlElement.classList.remove(["border-indigo-500"]);
            // htmlElement.classList.remove(["text-indigo-600"]);
            // htmlElement.classList.add(["hidden"]);
             next_loop_id = Number(htmlElement.getAttribute('name').replace("nav_loop_", "")) + 1;
         }
        let next_id = question_list_id [next_loop_id];

        // let htmlElementsNext = document.getElementsByClassName('class_' + next_id);
        // for (let htmlElementNext of htmlElementsNext) {
        //     htmlElementNext.classList.remove(["hidden"]);
        //     htmlElementNext.classList.add(["border-indigo-500"]);
        //     htmlElementNext.classList.add(["text-indigo-600"]);
        // }



        // document.getElementById('container_question_' + current_id.replace("nav_", "")).classList.add('hidden');
        // if (document.getElementById('id_' + current_id.replace("nav_", ""))) {
            // document.getElementById('id_' + current_id.replace("nav_", "")).classList.add('hidden');
        // }
        // console.log(question_list_id);
        // console.log(next_id);
        setCurrentQuestionId(next_id);
        getQuestion(currentQuestionId);




        //console.log('next_id', next_id);
        // document.getElementById('container_question_' + next_id).classList.remove('hidden');
        // if (document.getElementById('id_' + next_id)) {
        //     document.getElementById('id_' + next_id).classList.remove('hidden');
        // }



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
        // $('.'+ current).removeClass("border-indigo-500 text-indigo-600");
        // $('.'+ current).addClass("hidden");

        let name_curr = $('.' + current).attr("name");
        let current_loop_id = name_curr.replace("nav_loop_", "");

        let prev_loop_id = Number(current_loop_id) - 1;

        let prev_id = question_list_id [prev_loop_id];

        // let prev_id = document.getElementsByName("nav_loop_" + prev_loop_id)[0].id
        // prev_id = prev_id.replace("nav_", "");

        setCurrentQuestionId(prev_id);
        getQuestion(currentQuestionId);
        setIndexQuestion(indexQuestion - 1);

        // $('.class_' + prev_id ).removeClass("hidden");
        // $('.class_' + prev_id ).addClass("border-indigo-500 text-indigo-600");

        // $("#question_" + current_id).addClass('hidden');
        // $("#question_" + prev_id ).removeClass('hidden');

        // $("#container_question_" + current_id).addClass('hidden');
        // if ($("#id_" + current_id)) {
        //     $("#id_" + current_id).addClass('hidden');
        // }
        // $("#container_question_" + prev_id ).removeClass('hidden');
        // if ($("#id_" + prev_id )){
        //     $("#id_" + prev_id ).removeClass('hidden');
        // }

        // name_curr = $('.class_' + prev_id).attr("name");
        // prev_id = name_curr.replace("nav_loop_", "");

        if (prev_id == 1){
            $(".prev").addClass('hidden');
            $(".next").removeClass('hidden');
        } else{
            $(".prev").removeClass('hidden');
            $(".next").removeClass('hidden');
        }
    }

    const getQuestion = async (currentQuestionId) => {
        try {
            const result = await axios.get('/question/getQuestion', {
                params: {
                    question_id: currentQuestionId
                },
            });
            const { data } = result;

            setCurrentQuestion(data);
            setEditor(Array.from(currentQuestion['text'])[0] == '{' ?
                EditorState.createWithContent(convertFromRaw(JSON.parse(currentQuestion['text'])))
                :  EditorState.createWithText((currentQuestion['text'])));
            setIndexQuestion(indexQuestion + 1);

        } catch (error) {
            console.log('e', error);
        }
    };

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
                    {/*{questions.map ( (question, index) => {*/}
                    {/*  return  <button id={`nav_${question.id}`}*/}
                    {/*            className={`${index == 0 */}
                    {/*                ? 'border-indigo-500 text-indigo-600 class_' + question.id + ' border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium nav-action outline-none focus:outline-none' */}
                    {/*                : 'hidden class_' + question.id +                            ' border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium nav-action outline-none focus:outline-none'} */}
                    {/*                `}*/}
                    {/*            type="button"*/}
                    {/*                  key={index}*/}
                    {/*            name={`nav_loop_${index + 1}`}>*/}
                    {/*        {index + 1} <span > / {questions.length} </span>*/}
                    {/*    </button>*/}
                    {/*} ) }*/}
                    <button id={`nav_${currentQuestionId}`}
                            className={`border-indigo-500 text-indigo-600 class_${currentQuestionId} border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium nav-action outline-none focus:outline-none`}
                            type="button"
                            name={`nav_loop_${indexQuestion}`}>
                        {indexQuestion + 1} <span > / {count_questions} </span>
                    </button>
                </div>

                <div className="-mt-px w-0 flex-1 flex justify-end">
                    <button className={`${count_questions == 1
                        ? 'hidden border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 next outline-none focus:outline-none'
                        : 'border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 next outline-none focus:outline-none'} 
                                    `}
                            value={count_questions}
                            onClick={onHandleClickNext}
                            type="button">
                        Следующий
                        <svg className="ml-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </nav>



            <div className={`mt-10 sm:mt-0`}
                                 id={`container_question_${currentQuestionId}`}>
                            <div className="p-3 md:col-span-2">
                                { is_admin && <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
                                    <div>
                                        <div>Выступающие</div>
                                        <div>
                                            <select name={`speaker${currentQuestionId}[]`}
                                                    className="mt-1 block w-full py-1 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-600 sm:text-sm"
                                                    required multiple
                                                    defaultValue={users.map ( (user) => {
                                                        if (question_hash_speakers[currentQuestionId]){
                                                            if (question_hash_speakers [currentQuestionId].length > 0) {
                                                                if (~question_hash_speakers [currentQuestionId][0].users_speaker_id.indexOf(user.id)) {
                                                                    return user.id
                                                                }
                                                            }
                                                        }
                                                    } )}
                                                    id={`select_speaker_question_${currentQuestionId}`}
                                                    noValidate
                                            >
                                                {users.map ( (user) => {
                                                    return <option value={user.id} key={user.id}>{user.name}</option>
                                                } )}
                                            </select>
                                        </div>
                                    </div>
                                </div>}


                                <div className={`bg-white shadow overflow-hidden sm:rounded-lg`} id={`question_${currentQuestionId}`}>
                                    <div className="px-4 py-5 sm:px-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            {indexQuestion + 1})
                                            <Editor
                                                name={`question_text_${indexQuestion}`}
                                                id={`question_text_${indexQuestion}`}
                                                defaultEditorState={editorAllStateText}
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
                                        {question_hash_files[currentQuestionId].map( (file, index_map) => (
                                                <div key={currentQuestionId + index_map}>
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
                                        {answers[currentQuestionId].map((answer, index_map) => {
                                            return <div key={index_map}>
                                                <label
                                                    className="border-gray-200 rounded-tl-md rounded-tr-md relative border p-4 flex cursor-pointer">
                                                    <input type="radio"
                                                           name={`question_${currentQuestionId}`}
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
                                    <div id={"id_"+ currentQuestionId} className="flex flex-nowrap inline-block overflow-visible justify-center" >
                                        {[...Array(5)].map((star, index_map) => {
                                            index_map += 1;
                                            return (
                                                <div className={"w-1/9 text-7xl"} key={index_map}>
                                                    <button
                                                        type="button"

                                                        className={
                                                            (indexQuestion != 0) ?
                                                                index_map <= ( (hover[indexQuestion] || ( (hover[indexQuestion] && ratings[indexQuestion]) || ratings[indexQuestion] )) )
                                                                    ? "on index_" + index_map
                                                                    : "off index_" + index_map
                                                                :
                                                                index_map <=
                                                                ( index_map <=( (hover[indexQuestion] || ( (hover[indexQuestion] && ratings[indexQuestion]) || ratings[indexQuestion] )) )
                                                                        ? ( (hover[indexQuestion] || ( (hover[indexQuestion] && ratings[indexQuestion]) || ratings[indexQuestion] )) )
                                                                        :
                                                                        (index_map > ( (ratings[indexQuestion] && ( (hover[indexQuestion] || ratings[indexQuestion]) && hover[indexQuestion] )) ) ) ?
                                                                            ( (ratings[indexQuestion] && ( (hover[indexQuestion] || ratings[indexQuestion]) && hover[indexQuestion] )) )
                                                                            : ratings[indexQuestion]
                                                                )
                                                                    ? "on index_" + index_map
                                                                    : "off index_" + index_map
                                                        }

                                                        onClick={() => setRating( (oldValue) => {
                                                            const newValue = [...oldValue]
                                                            newValue[indexQuestion] = index_map;
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
                                                            newValue[indexQuestion] = index_map;
                                                            return newValue;
                                                        }   )}
                                                        onMouseLeave={() => setHover( (oldValue) => {
                                                            const newValue = [...oldValue]
                                                            newValue[indexQuestion] = ratings[indexQuestion];
                                                            return newValue;
                                                        }        )}

                                                    >
                                                        <span className="">&#9733;</span>
                                                    </button>
                                                </div>
                                            );
                                        } )}
                                        <input id={"rating_" + currentQuestionId} name={"question_" + currentQuestionId} hidden  value={(ratings[indexQuestion] == 0) ? '0': answers[currentQuestionId][ratings[indexQuestion] -1 ].id } onChange={() => {}}/>
                                    </div>
                                </fieldset>
                            </div>
                            }
                        </div>

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
                    {/*{questions.map ( (question, index) => {*/}
                    {/*    return <button id={`nav_${question.id}`}*/}
                    {/*                   className={`${index == 0*/}
                    {/*                       ? 'class_' + question.id + ' border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium nav-action outline-none focus:outline-none'*/}
                    {/*                       : 'hidden class_' + question.id + ' border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium nav-action outline-none focus:outline-none'} */}
                    {/*                `}*/}
                    {/*            type="button" key={index}*/}
                    {/*            name={`nav_loop_${index + 1}`}>*/}
                    {/*        {index + 1} <span > / {questions.length} </span>*/}
                    {/*    </button>*/}
                    {/*} ) }*/}
                    <button id={`nav_${currentQuestionId}`}
                            className={`class_${currentQuestionId} border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium nav-action outline-none focus:outline-none`}
                            type="button"
                            name={`nav_loop_${indexQuestion}`}>
                        {indexQuestion + 1} <span > / {count_questions} </span>
                    </button>
                </div>

                <div className="-mt-px w-0 flex-1 flex justify-end">
                    <button
                        className={`${count_questions == 1
                            ? 'hidden border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 next outline-none focus:outline-none'
                            : 'border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 next outline-none focus:outline-none'} 
                                    `}
                        value={count_questions}
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