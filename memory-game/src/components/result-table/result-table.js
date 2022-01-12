
import "../result-table/result-table.sass"

const ResultTable = ({totalTime}) => {
    const items = totalTime.forEach((item, i) => {
        return (
            <div className="results" key={i}>
                <div className="results__number">{`${i}.`}</div>
                <div className="results__time">{`${item[0]}:${item[1]}:${item[2]}`}</div>
            </div>
        )
    })

    return (
        <div className="result__container">
            {items}
        </div>
    )
}

export default ResultTable;