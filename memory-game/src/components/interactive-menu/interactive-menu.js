import useTimer from '../../hooks/timer.hook';

import '../interactive-menu/interactive-menu.sass'

const InteractiveMenu = () => {
    const {hours, minutes, seconds, startTimer} = useTimer();

    return (
        <section className="interactive">
            <div className="interactive__container">
            <button 
            className="interactive__start"
            onClick={startTimer}>START</button>
                <div className="interactive__timer">
                    <div className="interactive__timer-hours">{hours < 10 ? `0${hours}` : hours}:</div>
                    <div className="interactive__timer-minutes">{minutes < 10 ? `0${minutes}` : minutes}:</div>
                    <div className="interactive__timer-seconds">{seconds < 10 ? `0${seconds}` : seconds}</div>
                </div>
            </div>
        </section>
    )
}

export default InteractiveMenu;