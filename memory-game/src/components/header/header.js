import "../header/header.sass"

const Header = () => {
    return (
        <header className="header">
            <h1 className="header__label">Welcome to memory game!</h1>
            <h2 className="header__title">Here you should find correct pairs of cards.</h2>
            <h2 className="header__subtitle">Here is not time limit. Just enjoy it.</h2>
        </header>
    )
}

export default Header;