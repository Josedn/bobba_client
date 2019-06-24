const defaultState = {
    gameLoaded: false,
    loggedIn: false,
};

const login = (state = defaultState, action: any) => {
    switch (action.type) {
        case 'LOAD_GAME':
            return {
                gameLoaded: true,
                loggedIn: false,
            };
        case 'LOG_IN':
            return {
                gameLoaded: state.gameLoaded,
                loggedIn: true,
            };
        default:
            return state;

    }
};

export default login;