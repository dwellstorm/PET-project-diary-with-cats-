import './styles/MyProfile.css'
import Footer from "./Footer.jsx"
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
function MyProfile() {
    const token = localStorage.getItem('token')
    const [storedUser, setStoredUser] = useState(JSON.parse(localStorage.getItem('user') || {}))
    const [avatar, setAvatar] = useState(storedUser.avatar || '')
    const userId = storedUser.id
    const date = new Date(storedUser.createdAt)
    const [isEditing, setIsEditing] = useState(false)
    const [bio, setBio] = useState(storedUser.bio || '')
    const [allCards, setAllCards] = useState([])
    const [favouriteCatName, setFavouriteCatName] = useState('')
    const [favouriteMood, setFavouriteMood] = useState('')
    const entriesCount = allCards.length
    const dateForEntry = new Date()
    const navigate = useNavigate()
    const entriesMonthCount = allCards.filter((entry) => {
        const entryDate = new Date(entry.created_at)
        const isSameMonth = dateForEntry.getMonth() === entryDate.getMonth()
        const isSameYear = dateForEntry.getFullYear() === entryDate.getFullYear()
        return isSameMonth && isSameYear
    }).length
    const objectForBestCat = {}
    allCards.forEach((entry) => { objectForBestCat[entry.cat_id] = (objectForBestCat[entry.cat_id] || 0) + 1 })
    const favouriteCat = Object.keys(objectForBestCat).reduce((a, b) => objectForBestCat[a] > objectForBestCat[b] ? a : b, 'Нет записей')
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
    const headToChangeProfilePage = () => {
        navigate('/change-profile')
    }
    const saveBio = async () => {
        await axios.post(`/api/users/update-bio?id=${userId}`,
            { bio: bio }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const updatedUser = { ...storedUser, bio: bio }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setStoredUser(updatedUser)
        setIsEditing(false)
    }
    useEffect(() => {
        const fetchUserInfo = async () => {
            const res = await axios.get(`/api/users/one-user?id=${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }
        const getAllUserEntries = async () => {
            const res = await axios.get(`/api/entries/user-cards?id=${userId}`)
            setAllCards(res.data)
        }


        fetchUserInfo();
        getAllUserEntries();
    }, [])
    useEffect(() => {
        if (!favouriteCat || favouriteCat === 'Нет записей') {
            setFavouriteCatName('отсутствует');
            return;
        }
        const getBestCat = async () => {
            const res = await axios.get(`/api/cats/${favouriteCat}`)
            setFavouriteCatName(res.data.name)
            setFavouriteMood(res.data.mood)
        }
        getBestCat();
    }, [favouriteCat])

    // console.log(allCards)
    // console.log(entriesMonthCount)
    // console.log(favouriteCat)

    return (

        <>
            <div className="my-profile-main">
                <div className="transform-container">
                    <button className='change-profile-button' onClick={headToChangeProfilePage}>Изменить профиль</button>
                <div className="card-about-user">
                    <div className="block-for-photo-and-button">
                        <img src={storedUser.avatar} alt="" />
                        <input type="file" onChange={handleFileChange} className='change-photo-input' />
                    </div>
                    <div className="user-info">
                        <p className='urgent-user-info'>Никнейм: {storedUser.username} </p>
                        <p className='urgent-user-info'>Почта: {storedUser.email} </p>
                        {isEditing ? (<div className="buttons-for-user-info">
                            <textarea name="" className="textarea-for-user-info" cols={40} value={bio} onChange={(e) => setBio(e.target.value)} placeholder='Расскажи о себе...'></textarea>
                            <button className='button-save-user-info' onClick={saveBio}>❀</button>
                            <button className='button-delete-user-info' onClick={() => setIsEditing(false)}>x</button>
                        </div>) : <p className='textarea-for-user-info' onClick={() => setIsEditing(true)}>О себе: {storedUser.bio}</p>
                        }
                        <p className='user-registration-date'>С нами с: {date.toLocaleDateString('ru-RU')}</p>
                    </div>
                </div>
                </div>
                {/* <button className='change-profile-button'>Редактировать профиль</button> */}
                <div className="card-statictic">
                    <p className='statictic-text'>Всего записей: {entriesCount}</p>
                    <p className='statictic-text'>Записей в этом месяце: {entriesMonthCount} </p>
                    <p className='statictic-text'>Любимый кот/кошка: {favouriteCatName.toLowerCase()} </p>
                    <p className='statictic-text'>Больше всего настроения: {favouriteMood.toLowerCase()}</p>
                </div>


            </div>
            <Footer />
        </>
    )


}
export default MyProfile