import {useState, useEffect} from 'react'

const useTimer = () => {
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [hours, setHours] = useState(0);

    let interval;

    const startTimer = () => {
        interval = setInterval(timer, 1000);
    }

    const stopTimer = () => {
        clearInterval(interval);
    }

    const timer = () => {
        setSeconds(item => item + 1);
    }

    useEffect(() => {
        if (seconds === 60) {
            setMinutes(item => item + 1);
            setSeconds(0);
    }

        if (minutes === 60) {
            setHours(item => item + 1);
            setMinutes(0);
        }
    }, [seconds])

    return {seconds, minutes, hours, startTimer, stopTimer}
}

export default useTimer;