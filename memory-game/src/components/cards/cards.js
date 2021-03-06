import {useState, useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {toggleAllOppened} from '../../store/actions';

import useImageService from "../../services/ImageService"
import createCardsArr from '../../utils/createCards/createCards';
import Spinner from '../spinner/spinner';
import Question from '../question/question';

import '../cards/cards.sass'

// Общее число карточек
const CARDS = 36;

const Cards = () => {
    const [data, setData] = useState([]);
    const [openedCards, setOpenedCards] = useState([]);
    const [disabled, setDisabled] = useState(true);
    const [counterOpened, setCounterOpened] = useState(0);

    // Ипользуем кастомный хук по запросу даных с API
    const {getAllCharacters, loading} = useImageService();

    // Используем useSelector react-redux для получения состояния started из стора
    const {started, allOppened, playAgain} = useSelector(state => state);

    // Создаем переменную dispatch для возможности выполнения функции action creator
    const dispatch = useDispatch();
    
    // Функция по отправке запроса на локальный сервер и отрисовке карточек
    function request() {
        getAllCharacters()
            .then(createCards);
    };
    // Функция по возвращению карточек в исходное состояние
    function removeFlip() {
        data.forEach((item, i) => {
            if (!item.opened) {
                itemRefs.current[i].classList.remove('flip');
            }
        });
        setOpenedCards([]);
    };
    // Функция по модификации стейта - изменение свойства opened
    function createNewData () {
        clearTimeout(oneCardOpenedTimeout.current);
        //Создаем два новых объекта для открытых карточек, в которых меняем значение opened на true
        const firstObj = {...data[openedCards[0]], opened: !data[openedCards[0]].opened};
        const secondObj = {...data[openedCards[1]], opened: !data[openedCards[1]].opened};
        //Заменяем в data объекты открытых карточек для сохранения иммутабельности
        const firstStep = [...data.slice(0, openedCards[0]), firstObj, ...data.slice(openedCards[0] + 1)];
        const secondStep = [...firstStep.slice(0, openedCards[1]), secondObj, ...firstStep.slice(openedCards[1] + 1)];

        setData(secondStep);

        setCounterOpened(item => item + 2);
    }

    // Запрос на сервер и создание карточек
    // eslint-disable-next-line
    useEffect(request, []);
    // Ререндер карточек при необходимости запуска новой игры
    useEffect(() => {
        if (playAgain) {
            request();
        }
        // eslint-disable-next-line
    }, [playAgain]);

    // Заполняем стейт данными карточек в рандомном порядке, получая данные с локальной БД
    const createCards = (char) => {
        const newData = createCardsArr(char);

        setData(newData);
    };

    // Используем рефы для получения карточки при нажатии и установки фокуса
    const itemRefs = useRef([]);

    // Функция переворачивания карточек и установки фокуса
    const reverseCard = (i) => {
        itemRefs.current[i].classList.add('flip');
        itemRefs.current[i].focus();
        setOpenedCards(item => [...item, i]);
    };
    // Используем useRef для предотвращения потери таймера при перерендере
    const oneCardOpenedTimeout = useRef();
    const twoCardOpenedTimeout = useRef();

    // Сравнение открытых карточек и выполнение дальнейших действий по результатам условия
    useEffect(() => {
        if (openedCards.length === 1) {
            oneCardOpenedTimeout.current = setTimeout(() => {
                removeFlip();
            }, 5000);
        };
        // Если количество открытых карточек - 2, то производим изменение элемента opened в массиве объектов
        if (openedCards.length === 2) {
            setDisabled(true);
            if (data[openedCards[0]].id === data[openedCards[1]].id) {
                createNewData();
            }

            clearTimeout(oneCardOpenedTimeout.current);
            // Если условия выше не выполнились и две открытые карточки - разные, то закрываем их основываясь на значении opened
            twoCardOpenedTimeout.current = setTimeout(() => {
                removeFlip();
                setDisabled(false);
            }, 2000);
        }
        // eslint-disable-next-line
    }, [openedCards])
    // Дополнительный useEffect с зависимостью от data, ввиду асинхронности выполнения сеттеров
    useEffect(() => {
        clearTimeout(twoCardOpenedTimeout.current);
        setTimeout(() => {
            //Проверяем счетчик открытых карточек на равенство с общим количеством карточек для вывода сообщения о новой игре
            if (counterOpened === CARDS) {
                setCounterOpened(0);
                setTimeout(() => {
                    dispatch(toggleAllOppened());
                }, 2000)
            }

            setOpenedCards([]);
            setDisabled(false);
        }, 2000);
        // eslint-disable-next-line
    }, [data]);


    // Динамическое построение карточек на странице
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
                        <div className='card-back'></div>
                </button>
            );
        });
        // Конструкция для центрирования спиннера загрузки
        return (
            <div className="container">
                {cards}
            </div>
        );
    };

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
    );
};

export default Cards;