import {useHttp} from '../hooks/http.hook';

const useImageService = () => {
    const {loading, error, response, clearError} = useHttp();

    const _apiBase = "https://gateway.marvel.com:443/v1/public/";
    const _apiKey = "apikey=aa6c55833c9c60f691a31b9416fc4bef";
    const _offset = (Math.random() * (1550 - 0) + 0).toFixed(0);

    const getAllCharacters = async () => {
        const res = await response(`${_apiBase}characters?limit=18&offset=${_offset}&${_apiKey}`);
        return res.data.results.map(_transormCharacter);
    }

    const _transormCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension
        }
    }

    return {getAllCharacters, loading, error, clearError};
}

export default useImageService;