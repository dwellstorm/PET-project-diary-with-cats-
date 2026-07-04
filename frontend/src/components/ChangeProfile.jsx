import Footer from './Footer'
import './styles/ChangeProfile.css'
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react'
import axios from 'axios'
function ChangeProfile() {
    const token = localStorage.getItem('token')
    const [storedUser, setStoredUser] = useState(JSON.parse(localStorage.getItem('user') || {}))
    const userId = storedUser.id
    const [username, setUsername] = useState(storedUser.username)
    const [password, setPassword] = useState(storedUser.password)

    const [bio, setBio] = useState(storedUser.bio || '')
    const navigate = useNavigate()
    const saveChanges = async () => {
        try {

            if (password && password.trim() !== '') {
                await axios.post(`/api/reset-password-request?id=${userId}`, { newPassword: password}, 
                    {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
                )
                alert('Проверьте почту!')
            }
    
            await axios.post(`/api/users/update-info?id=${userId}`,
                { username: username, bio: bio }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const updatedUser = { ...storedUser, username: username, bio: bio }
            localStorage.setItem('user', JSON.stringify(updatedUser))
            setStoredUser(updatedUser)
            navigate('/my-profile')
        } catch (error) {
            console.error('Error: ', error)
        }
    }
    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const formData = new FormData()
        formData.append('avatar', file)

        try {
            const res = await axios.post(`/api/users/update-photo?id=${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            })
            const updatedUser = { ...storedUser, avatar: res.data.avatar }
            setStoredUser(updatedUser)
            localStorage.setItem('user', JSON.stringify(updatedUser))
        } catch (error) {
            console.error('Ошибка: ', error)
            alert('Не удалось обновить фото')
        }
    }
    useEffect(() => {
        const fetchUserInfo = async () => {
            await axios.get(`/api/users/one-user?id=${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }
        fetchUserInfo();
    }, [])
    return (
        <>
            <div className='change-profile-main'>
                <div className="block-card-and-x">
                    <div className="card-for-change-profile">
                        <h1 className='h1-card-for-change-profile'>Изменить профиль</h1>
                        <div className="change-profile-with-photo">
                            <div className="block-for-all-inputs">
                                <div className="block-for-input-change-profile">
                                    <label htmlFor="username" className='label-change-profile'>Имя пользователя: </label>
                                    <input type="text" id="username" placeholder='Введите имя пользователя...' className='change-profile-input' value={username} onChange={(e) => setUsername(e.target.value)} />
                                </div>
                                <div className="block-for-input-change-profile">
                                    <label htmlFor="password" className='label-change-profile'>Пароль: </label>
                                    <input type="password" id="password" placeholder='Введите новый пароль...' className='change-profile-input' value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="block-for-input-change-profile">
                                    <label htmlFor="user-info" className='label-change-profile'>О себе: </label>
                                    <textarea type="text" id="user-info" placeholder='Расскажи о себе...' className='change-profile-input' value={bio} onChange={(e) => setBio(e.target.value)} />
                                </div>
                                <button className='button-change-photo-change-profile' onClick={saveChanges}>Cохранить</button>
                            </div>
                            <div className="block-for-photo-change-profile">
                                <img src={storedUser.avatar} alt="" />
                                <input type="file" onChange={handleFileChange} className='button-change-photo-change-profile' />
                            </div>
                        </div>
                    </div>

                    <button onClick={() => navigate(-1)} className='button-X-change-profile'>X</button>
                </div>


            </div>
            <Footer />
        </>
    )


}

export default ChangeProfile