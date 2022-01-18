const createCardsArr = (char) => {
    const indexArrData = Array.from(Array(36).keys()).sort(() => Math.random() - 0.5);

    const newChar = [...char, ...char];

    const newData = indexArrData.map(position => newChar[position]);

    return newData;
};

export default createCardsArr;