import './styles/Registration.css'
import {useNavigate} from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
function Registration() {
    const handleChange = (e) => {
        const { name, value } = e.target 
        setFormData({...formData, [name]:value})
        setError('')
    }
    const handleFileChange = (e) => {
    const file = e.target.files[0]
    console.log('FIle: ', file)
    setFormData({...formData, avatar: file})
    setError('')
}
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        avatar: null
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const toLogin = () => {
        navigate('/login')
    }

    const registration = async (e) => {
        e.preventDefault() 
        setError('')
        setSuccess('')
        setLoading(true)
        if (!formData.username || !formData.email || !formData.password) {
            setError('Заполните все поля')
            return
        }
        const submitData = new FormData()
        submitData.append('username', formData.username)
        submitData.append('email', formData.email)
         if (formData.avatar) {
            submitData.append('avatar', formData.avatar)
        }
        submitData.append('password', formData.password)
        try {
            const res = await axios.post('http://localhost:3007/api/registration', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            console.log('Успех:', res.data)


            if (res.data.token) {
                localStorage.setItem('token', res.data.token)
                localStorage.setItem('user', JSON.stringify(res.data.user))
            }

            setSuccess('Регистрация успешна! Проверьте почту для активации.')

            setFormData({ username: '', email: '', password: '', avatar: null })

            setTimeout(() => {
                window.location.href = '/'
            }, 2000)

        } catch (error) {
            console.error('Ошибка:', error)

            if (error.response) {
                setError(error.response.data?.message || 'Ошибка при регистрации')
            } else if (error.request) {
                setError('Сервер не отвечает. Проверьте, запущен ли бэкенд.')
            } else {
                setError('Ошибка: ' + error.message)
            }
        } finally {
            setLoading(false)
        }
    }  
    return (
        <div className='main-login'>
            {error && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#ffd8d89f', borderRadius: '4px' }}>{error}</div>}
                {success && <div style={{ color: 'green', marginBottom: '10px', padding: '10px', backgroundColor: '#eeffee', borderRadius: '4px' }}>{success}</div>}
            <form action="" className='registration-form'>
                <h1 className='registration-form-h1'>Регистрация</h1>


                <div className="all-rows-form-registration">
                    <div className="form-row-registration">
                        <label htmlFor="username" style={{ marginRight: 14 }} className='label-registration'>Логин: </label>
                        <input type="text" id='username' name='username' placeholder='Введите логин...' value={formData.username} onChange={handleChange} required
                        name='username'/>
                    </div>

                    <div className="form-row-registration">
                        <label htmlFor="email" style={{ marginRight: 14 }} className='label-registration'>Почта: </label>
                        <input type="email" id='email' name='email' placeholder='Введите почту...' value={formData.email} onChange={handleChange} required
                        name='email'/>
                    </div>
                    <div className="form-row-registration">
                        <label htmlFor="file" style={{ marginRight: 14 }} className='label-registration'>Загрузите фото: </label>
                        <input type="file" id='file' name='avatar' onChange={handleFileChange}/>
                    </div>
                    <div className="form-row-registration">
                        <label htmlFor="password" className='label-registration'>Пароль: </label>
                        <input type="password" id="password" name='password'placeholder='Введите пароль...' value={formData.password} onChange={handleChange} required
                        name='password'/>

                    </div>

                </div>

                <div className="login-block-for-buttons">
                    <button className='button-login' onClick={toLogin}>Войти</button>
                    <button className='button-registration' onClick={registration} disabled={loading}>
                        {loading ? 'Регистрация': 'Зарегистрироваться'}</button>
                </div>
            </form>
        </div>
    )


}

export default Registration