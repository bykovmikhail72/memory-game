import {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';

import useImageService from "../../services/ImageService"
import Spinner from '../spinner/spinner';
import Question from '../question/question';
import { toggleAllOppened } from '../../actions';

import '../cards/cards.sass'
import backImg from '../../sources/backSide.PNG'

const Cards = () => {
    const [data, setData] = useState([]);
    const [openedCards, setOpenedCards] = useState([]);
    const [disabled, setDisabled] = useState(true);
    const [counterOpened, setCounterOpened] = useState(0);

    //Ипользуем кастомные хуки по запросу даных с API
    const {getAllCharacters, loading} = useImageService();

    //Используем useSelector react-redux для получения состояния started из стора
    const started = useSelector(state => state.started);
    const allOppened = useSelector(state => state.allOppened);
    const playAgain = useSelector(state => state.playAgain);

    //Создаем переменную dispatch для возможности выполнения функции action creator
    const dispatch = useDispatch();

    //Запрос на сервер и создание карточек
    useEffect(() => {
        getAllCharacters()
            .then(createCards);
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (playAgain) {
                getAllCharacters()
                .then(createCards);
        }
        // eslint-disable-next-line
    }, [playAgain])

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

    //Функция переворачивания карточек и установки фокуса
    const reverseCard = (i) => {
        itemRefs.current[i].classList.add('flip');
        itemRefs.current[i].focus();
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
        //Если количество открытых карточек - 2, то производим изменение элемента opened в массиве объектов
        if (openedCards.length === 2) {
            setDisabled(true);
            if (data[openedCards[0]].id === data[openedCards[1]].id) {
                clearTimeout(oneCardOpenedTimeout.current);
                //Создаем два новых объекта для открытых карточек, в которых меняем значение opened на true
                const firstObj = {...data[openedCards[0]], opened: !data[openedCards[0]].opened};
                const secondObj = {...data[openedCards[1]], opened: !data[openedCards[1]].opened};
                //Заменяем в data объекты открытых карточек для сохранения иммутабельности
                const firstStep = [...data.slice(0, openedCards[0]), firstObj, ...data.slice(openedCards[0] + 1)];
                const secondStep = [...firstStep.slice(0, openedCards[1]), secondObj, ...firstStep.slice(openedCards[1] + 1)];

                setData(secondStep);

                setCounterOpened(item => item + 2);

                if (counterOpened === 34) {
                    setTimeout(() => {
                        dispatch(toggleAllOppened());
                    }, 2000)
                }
            }

            clearTimeout(oneCardOpenedTimeout.current);
            //Если условия выше не выполнились и две открытые карточки - разные, то закрываем их основываясь на значении opened
            twoCardOpenedTimeout.current = setTimeout(() => {
                console.log('first')
                data.forEach((item, i) => {
                    if (!item.opened) {
                        itemRefs.current[i].classList.remove('flip');
                    }
                })
                setOpenedCards([]);
                setDisabled(false);
            }, 2000);
        }
        // eslint-disable-next-line
    }, [openedCards])
    //Дополнительный useEffect с зависимостью от data, ввиду асинхронности выполнения сеттеров
    useEffect(() => {
        clearTimeout(twoCardOpenedTimeout.current);
        setTimeout(() => {
            console.log('second')
            console.log(data)
            data.forEach((item, i) => {
                //Дополнительное условие, для того, чтобы useEffect не вызывался при начальном рендере страницы
                if (openedCards === []) {
                    if (!item.opened) {
                        console.log(item.opened);
                        itemRefs.current[i].remove('flip');
                    }
                }
            })

            setOpenedCards([]);
            setDisabled(false);
        }, 2000);
        // eslint-disable-next-line
    }, [data]);


    //Динамическое построение карточек на странице
    const renderCards = () => {
        const cards = data.map((item, i) => {
            return (
                <button 
                    className='card'
                    tabIndex={0}
                    id={item.id} 
                    disabled={openedCards.length === 2 ? disabled : !started}
                    key={i}
                    ref={el => itemRefs.current[i] = el}
                    onClick={() => {reverseCard(i)}}
                    onKeyPress={(e) => {
                        if (e.key === '' || e.key === 'Enter') {
                            reverseCard(i);
                        } 
                    }}>
                        <img src={item.path} alt={item.name} className="card-front" />
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
    const newGame = allOppened ? <Question/> : null
    const content = !loading && !allOppened ? items : null;

    return (
        <main className="memory-game">
            {content}
            {newGame}
            {spinner}
        </main>
    )
}

export default Cards;