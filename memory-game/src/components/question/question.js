import { togglePlayAgain } from "../../actions";

import { useDispatch } from "react-redux";

import "../question/question.sass";

const Question = () => {
    const dispatch = useDispatch();

    return (
        <div className="question">
            <h3 className="question__title">Do you want to play again?</h3>
            <button 
                className="question__btn btn btn-primary"
                onClick={() => dispatch(togglePlayAgain())}>Yes, of cource!</button>
        </div>
    )
}

export default Question;