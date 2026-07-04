import './styles/Login.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
function Login() {
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [formData, setFormData] = useState({username: '', password: ''})
    const navigate = useNavigate()

    const toLogin = async(e) => {
        e.preventDefault()
        try {
            const res = await axios.post('/api/login', formData)
            console.log("res data:", res.data)
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user', JSON.stringify(res.data.user))
            navigate('/')

        } catch (error) {
            console.error('Error: ', error)
        }
    }
    const toRegistrationPage = () => {
        navigate('/registration-page')
    }
    return (

        <div className='main-login'>
            <form action="" className='login-form'>
                <h1 className='login-form-h1'>Вход</h1>


                <div className="all-rows-form">
                    <div className="form-row">
                        <label htmlFor="username" style={{marginRight: 14}}>Логин: </label>
                        <input type="text" id='username' placeholder='Введите имя пользователя...' value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required/>
                    </div>

                    <div className="form-row">
                        <label htmlFor="password">Пароль: </label>
                        <input type="password" id="password" placeholder='Введите пароль...' value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />

                    </div>

                </div>

                <div className="login-block-for-buttons">
                    <button className='button-login' onClick={toLogin}>Войти</button>
                    <button className='button-registration' onClick={toRegistrationPage}>Зарегистрироваться</button>
                </div>
            </form>
        </div>
    )

}

export default Login