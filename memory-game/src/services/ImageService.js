import {useHttp} from '../hooks/http.hook';

const useImageService = () => {
    const {loading, response} = useHttp();

    const getAllCharacters = async () => {
        const res = await response("http://localhost:3001/cards");
        return res.map(_transormCharacter);
    }

    const _transormCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            path: char.path,
            opened: char.opened
        }
    }

    return {getAllCharacters, loading};
}

export default useImageService;