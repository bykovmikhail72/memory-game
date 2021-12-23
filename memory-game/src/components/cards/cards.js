import {useState, useEffect, useRef} from 'react';

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
        function itemsPosition() {
            let indexArrData = [];
            for (let i = 0; i <= 35; i++) {
                indexArrData.push(i);
            }

            indexArrData.sort(() => Math.random() - 0.5);

            return indexArrData;
        }

        const indexArrData = itemsPosition();

        const newChar = [...char, ...char];

        const newData = indexArrData.map(position => newChar[position]);

        setData(newData);
    }

    const {getAllCharacters, loading} = useImageService();

    const itemRefs = useRef([]);

    let pairOfCardsArr = [];

    const reverseCard = (i) => {
        // itemRefs.current.forEach(item => item.classList.remove('flip'));
        itemRefs.current[i].classList.add('flip');
        itemRefs.current[i].focus();
        
        pairOfCardsArr.push(itemRefs.current[i].id);
    

        if (pairOfCardsArr.length === 2) {
            if (pairOfCardsArr[0] === pairOfCardsArr[1]) {
                const firstIndex = data.findIndex(item => item.id == pairOfCardsArr[0]);
                const secondIndex = data.findIndex(item => item.id == pairOfCardsArr[1]);
                console.log(firstIndex, secondIndex);
                console.log(data);

                setTimeout(() => {
                    itemRefs.current[firstIndex].classList.add('card-hidden');
                    itemRefs.current[secondIndex].classList.add('card-hidden');
                }, 2000)
                console.log(itemRefs.current[firstIndex]);
                console.log(itemRefs.current[secondIndex])
            }

            pairOfCardsArr = [];

            setTimeout(() => {
                itemRefs.current.forEach(item => item.classList.remove('flip'));
            }, 2000);
        }
        
    }
    
    const renderCards = () => {
        const cards = data.map((item, i) => {
            return (
                <div 
                    className='card'
                    tabIndex={0}
                    id={item.id} 
                    key={i}
                    ref={el => itemRefs.current[i] = el}
                    onClick={() => {reverseCard(i)}}
                    onKeyPress={(e) => {
                        if (e.key === '' || e.key === 'Enter') {
                            reverseCard(i);
                        } 
                    }}>
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
    const content = !loading ? items : null;

    return (
        <main className="memory-game">
            {content}
            {spinner}
        </main>
    )
}

export default Cards;