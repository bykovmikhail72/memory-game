import {useState, useEffect, useRef} from 'react';

import useImageService from "../../services/ImageService"
import Spinner from '../spinner/spinner';
import useTimer from '../../hooks/timer.hook';

import '../cards/cards.sass'
import backImg from '../../sources/backSide.PNG'

const Cards = () => {
    const [data, setData] = useState([]);
    const [openedCards, setOpenedCards] = useState([]);
    const [disabled, setDisabled] = useState(false);

    //Ипользуем кастомные хуки по запросу даных с API и управлению таймером
    const {startTimer, stopTimer} = useTimer();
    const {getAllCharacters, loading} = useImageService();

    //Запрос на сервер и создание карточек
    useEffect(() => {
        getAllCharacters()
            .then(createCards);
    }, [])

    //Заполняем стейт данными карточек в рандомном порядке, получая данные с API.
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

    //Используем рефы для получения карточки при нажатии и установки фокуса
    const itemRefs = useRef([]);

    //Функция переворачивания карточек
    const reverseCard = (i) => {
        itemRefs.current[i].classList.add('flip');
        itemRefs.current[i].focus();

        startTimer();

        setOpenedCards(item => [...item, i]);
    }

    const oneCardOpenedTimeout = useRef();
    const twoCardOpenedTimeout = useRef();

    //Сравнение открытых карточек и выполнение дальнейших действий по результатам условия
    useEffect(() => {
        if (openedCards.length < 2 && openedCards.length > 0) {
            oneCardOpenedTimeout.current = setTimeout(() => {
                itemRefs.current.forEach(item => item.classList.remove('flip'));
                setOpenedCards([]);
            }, 5000);
        }

        if (openedCards.length === 2) {
            setDisabled(true);
            if (data[openedCards[0]].id === data[openedCards[1]].id) {
                clearTimeout(oneCardOpenedTimeout);
                setTimeout(() => {
                    itemRefs.current[openedCards[0]].classList.add('card-hidden');
                    itemRefs.current[openedCards[1]].classList.add('card-hidden');
                }, 2000);
            }

            clearTimeout(oneCardOpenedTimeout.current);

            twoCardOpenedTimeout.current = setTimeout(() => {
                itemRefs.current.forEach(item => item.classList.remove('flip'));
                setOpenedCards([]);
                setDisabled(false);
            }, 2000)
        }
        
        if (openedCards.length === 36) {
            stopTimer();
        }
    }, [openedCards])

    //Динамическое построение карточек на странице
    const renderCards = () => {
        const cards = data.map((item, i) => {
            return (
                <button 
                    className='card'
                    tabIndex={0}
                    id={item.id} 
                    disabled={disabled}
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
                </button>
            )
        })
        //Конструкция для центрирования спиннера загрузки
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