import { togglePlayAgain } from "../../actions";

import { useDispatch } from "react-redux";

import "../question/question.sass";

const Question = () => {
    const dispatch = useDispatch();

    return (
        <div className="question">
            <h3 className="question__title">Do you want to play again?</h3>
            <div className="question__buttons">
                <button 
                    className="question__buttons-yes btn btn-primary"
                    onClick={() => dispatch(togglePlayAgain())}>Yes</button>
                <button 
                    className="question__buttons-no btn btn-danger">No</button>
            </div>
        </div>
    )
}

export default Question;