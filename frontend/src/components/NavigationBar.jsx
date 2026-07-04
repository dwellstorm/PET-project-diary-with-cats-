import { Link } from "react-router-dom"
import './styles/NavigationBar.css'
import { useNavigate } from 'react-router-dom';

function NavigationBar() {
    const navigate = useNavigate()

    const toLogin = () => {
        navigate('/login')
    }
    return (
        <div className="navbar">
            <Link to='/'>Главная</Link>
            <Link to='/my-profile'>Мой профиль</Link>
            <Link to='about-me'>Обо мне</Link>
            <button className="button-for-login" onClick={toLogin}>Выйти</button>
        </div>

    )

}
export default NavigationBar