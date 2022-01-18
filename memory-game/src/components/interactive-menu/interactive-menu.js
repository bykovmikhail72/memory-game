import {useState, useEffect, useRef} from 'react'
import {useSelector, useDispatch} from 'react-redux';
import {toggleStarted} from '../../store/actions';

import ResultTable from '../result-table/result-table';
import timerActions from '../../utils/timerActions/timerActions';

import '../interactive-menu/interactive-menu.sass'

const InteractiveMenu = () => {
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [hours, setHours] = useState(0);
    const [totalTime, setTotalTime] = useState([]);

    const interval = useRef(null);

    const dispatch = useDispatch();

    const {started, allOppened} = useSelector(state => state);
    //При нажатии кнопки старт происходит обнуление таймера и его запуск
    useEffect(() => {
        if (started) {
            setSeconds(0);
            setMinutes(0);
            setHours(0);
            interval.current = setInterval(timer, 1000);
        };

        return () => {
            interval.current && clearInterval(interval.current);
            interval.current = null;
        };
        // eslint-disable-next-line
    }, [started]);
    //Заполнение массива объектами с затраченным временем для дальнейшей передачи в компонент result-table
    useEffect(() => {
        if (allOppened) {
            setTotalTime(item => {
                const newObj = {
                    hours,
                    minutes,
                    seconds
                };
                return [...item, newObj];
            });
        };
        // eslint-disable-next-line
    }, [allOppened]);
    // Функция запуска таймера изменяющая состояние глобальной переменной started
    const startTimer = () => {
        dispatch(toggleStarted());
    };
    //Логика таймера
    const timer = () => {
        setSeconds(item => item + 1);
    };

    useEffect(() => {
        if (seconds === 60) {
            setMinutes(item => item + 1);
            setSeconds(0);
        };   

        if (minutes === 60) {
            setHours(item => item + 1);
            setMinutes(0);
        };
        // eslint-disable-next-line
    }, [seconds]);

    // const {hoursModify, minutesModify, secondsModify} = timerActions(seconds, minutes, hours);

    return (
        <section className="interactive">
            <h2 className="interactive__label">This is interactive panel</h2>
                <div className="container">
                    <div className="interactive__results">
                        <h3 className="interactive__title">Score table</h3>
                        <ResultTable totalTime={totalTime}/>
                    </div>
                    <div className="interactive__container">
                        <div className="interactive__timer">
                            <div className="interactive__timer-hours">{hours < 10 ? `0${hours}` : hours}:</div>
                            <div className="interactive__timer-minutes">{minutes < 10 ? `0${minutes}` : minutes}:</div>
                            <div className="interactive__timer-seconds">{seconds < 10 ? `0${seconds}` : seconds}</div>
                        </div> 
                        <button 
                            className="interactive__start btn btn-success mt-2"
                            onClick={startTimer}
                            disabled={started}
                        >START</button> 
                    </div>
                </div>
        </section>
    );
};

export default InteractiveMenu;