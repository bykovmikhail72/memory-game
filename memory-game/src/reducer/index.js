const initialState = [
    {started: false},
    {allOppened: false},
    {playAgain: null}
]

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case "TIMER_STARTED":
            return {
                ...state,
                started: true
            }
        case "ALL_CARDS_OPPENED":
            return {
                ...state,
                allOppened: true,
                started: false
            }
        case "PLAY_AGAIN":
            return {
                ...state,
                playAgain: true,
                allOppened: false
            }
        default:
            return initialState
    }
}

export default reducer;