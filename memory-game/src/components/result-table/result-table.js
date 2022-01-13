
import "../result-table/result-table.sass"

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

    const showMessageFunc = () => {
        return (
            <h3 className="empty-results">'There are no results yet'</h3>
        )
    }

    const showMessage = showMessageFunc();

    const message = totalTime === [] ? showMessage : null;
    const results = totalTime.length > 0 ? items : null;

    return (
        <div className="results">
            {message}
            {results}
        </div>
    )
}

export default ResultTable;