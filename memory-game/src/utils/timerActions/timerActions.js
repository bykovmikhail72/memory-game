const timerActions = (props) => {
    const hours = props.hours < 10 ? `0${props.hours}` : props.hours;
    const minutes = props.minutes < 10 ? `0${props.minutes}` : props.minutes;
    const seconds = props.seconds < 10 ? `0${props.seconds}` : props.seconds;

    return {hours, minutes, seconds};
}

export default timerActions;