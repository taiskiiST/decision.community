import React, { useState, useEffect } from "react";
import {render} from "react-dom";

const {questions, ratings_questions, answers} = TSN;

const StarRating = () => {
    const [ratings, setRating] = useState(ratings_questions);
    const [hover, setHover] = useState([...Array(questions.length)]);

    useEffect(() => {
        setRating (ratings_questions);
    }, [""]);

    return (
        <div >

            {[...Array(questions.length)].map((cnt, index_question) => {
                return (
                    <div key={"key_"+index_question} id={"id_"+questions[index_question].id} className={(index_question == 0)? "flex flex-nowrap inline-block overflow-visible justify-center" : "flex flex-nowrap inline-block overflow-visible justify-center hidden"}>
                        {[...Array(5)].map((star, index) => {
                        index += 1;
                        return (
                            <div key={"div_"+index_question + "_" + index} className={"w-1/9 text-7xl"}>
                                <button
                                    type="button"
                                    key={index_question + "_" + index}
                                    className={
                                        (index_question != 0) ?
                                        index <= ( (hover[index_question] || ( (hover[index_question] && ratings[index_question]) || ratings[index_question] )) ) ?
                                                "on index_" + index
                                                : "off index_" + index
                                        :
                                            index <=
                                                    ( index <=( (hover[index_question] || ( (hover[index_question] && ratings[index_question]) || ratings[index_question] )) )
                                                    ? ( (hover[index_question] || ( (hover[index_question] && ratings[index_question]) || ratings[index_question] )) )
                                                    :
                                                            (index > ( (ratings[index_question] && ( (hover[index_question] || ratings[index_question]) && hover[index_question] )) ) ) ?
                                                                ( (ratings[index_question] && ( (hover[index_question] || ratings[index_question]) && hover[index_question] )) )
                                                                : ratings[index_question]
                                                    )
                                                ? "on index_" + index
                                                : "off index_" + index
                                    }
                                    //className={index <= (( ((hover[index_question] || ratings[index_question]) && ratings[index_question]) || ((hover[index_question] && ratings[index_question]) || ratings[index_question] ) )) ? "on index_" + index : "off index_" + index }
                                    onClick={() => setRating( (oldValue) => {
                                        const newValue = [...oldValue]
                                        newValue[index_question] = index;
                                        return newValue;
                                    })}
                                    onMouseEnter={() => setHover( (oldValue) => {
                                        const newValue = [...oldValue]
                                        newValue[index_question] = index;
                                        return newValue;
                                    }   )}
                                    onMouseLeave={() => setHover( (oldValue) => {
                                        const newValue = [...oldValue]
                                        newValue[index_question] = ratings[index_question];
                                        return newValue;
                                    }        )}

                                >
                                    <span className="">&#9733;</span>
                                </button>
                            </div>
                        );
                    })}
                    <input id={"rating_" + questions[index_question].id} name={"question_" + questions[index_question].id} hidden  value={(ratings[index_question] == 0) ? '0': answers[questions[index_question].id][ratings[index_question]-1].id } onChange={() => {}}/>
                    </div>
                )
            })
            }
        </div>
    );
};

render(<StarRating />, document.getElementById('RatingStars'));

export default StarRating;
