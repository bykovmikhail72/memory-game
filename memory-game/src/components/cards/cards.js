import {useState, useEffect} from 'react';

import useImageService from "../../services/ImageService"
import Spinner from '../spinner/spinner';

import '../cards/cards.sass'
import backImg from '../../sources/backSide.PNG'

const Cards = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        getAllCharacters()
            .then(createCards);
    }, [])

    const createCards = (char) => {
        function itemPosition() {
            let indexArr = [];
            for (let i = 0; i <= 17; i++) {
                indexArr.push(i);
            }

            indexArr.sort(() => Math.random() - 0.5);

            return indexArr;
        }

        const indexArr = itemPosition();
        
        const newData = indexArr.map(position => char[position]);

        setData([...char, ...newData]);
    }

    const {getAllCharacters, loading} = useImageService();
    
    const renderCards = () => {
        const cards = data.map((item, i) => {
            return (
                <div className="card" key={i}>
                    <img src={item.thumbnail} alt={item.name} className="card-front" />
                    <img src={backImg} alt="back side" className="card-back" />
                </div>
            )
        })

        return (
            <div className="container">
                {cards}
            </div>
        )
    }

    const items = renderCards();

    const spinner = loading ? <Spinner/> : null;

    return (
        <main className="memory-game">
            {items}
            {spinner}
        </main>
    )
}

export default Cards;