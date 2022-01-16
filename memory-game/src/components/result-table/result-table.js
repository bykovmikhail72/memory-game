import "../result-table/result-table.sass"
// Динамичекое построение таблицы результатов на основе props приходящих из interactive-menu
const ResultTable = ({totalTime}) => {
    const items = totalTime.map((item, i) => {
        const hours = item.hours < 10 ? `0${item.hours}` : item.hours;
        const minutes = item.minutes < 10 ? `0${item.minutes}` : item.minutes;
        const seconds = item.seconds < 10 ? `0${item.seconds}` : item.seconds;
        return (
            <div className="results__container" key={i}>
                <div className="results__number">{`${i + 1}.`}</div>
                <div className="results__time">{`${hours}:${minutes}:${seconds}`}</div>
            </div>
        )
    })
    //Функция по показу сообщения, что результаты пока отсутствуют
    const showMessageFunc = () => {
        return (
            <div className="empty-results">There are no results yet</div>
        )
    }

    const showMessage = showMessageFunc();

    const results = totalTime.length !== 0 ? items : showMessage;

    return (
        <div className="results">
            {results}
        </div>
    )
}

export default ResultTable;