import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import './styles/MainPage.css'
import axios from 'axios'
import Footer from "./Footer.jsx";
function MainPage() {
    const [myCards, setMyCards] = useState([])
    const user = JSON.parse(localStorage.getItem('user') || {})
    const user_id = user.id
    const [sortBy, setSortBy] = useState('')
    const [search, setSearch] = useState('')
    const navigate = useNavigate()
    useEffect(() => {
        const fetchMyCards = async () => {
            const res = await axios.get(`/api/entries/user-cards?id=${user_id}&sortBy=${sortBy}&search=${search}`)
            setMyCards(res.data)
        }
        fetchMyCards()
    }, [sortBy, search])

    const toEditCatCard = (entry_id) => {
        navigate(`/entries/card/${entry_id}`)
    }
    const toDeleteCatCard = async(entry_id) => {
        if (window.confirm('Вы точно хотите это удалить?')) {
            try {
                await axios.delete(`/api/entries/${entry_id}`)
                setMyCards(myCards.filter(card => card.id !== entry_id))
            } catch(error) {
                console.error('error:', error)
            }

        }
    }
    return (
        <>
            <div className="main">
                <div className="block-for-select-and-filter">
                    <input type="text" placeholder="Поиск по названию..." value={search} onChange={(e) => setSearch(e.target.value)}/>
                 <label htmlFor="select-sorting" className="label-for-select">сортировать по: </label>
                <select name="" id="select-sorting" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="">выбрать</option>
                    <option value="cats">котам</option>
                    <option value="date">дате</option>
                </select>
                </div>
                <button 
                className="to-create-cat-card" 
                onClick={() => navigate('/cat-card')}
                    >
                    + 
                </button>
                { (myCards.length > 0) ? (myCards.map(card => (
                    <div className="card" key={card.id}>
                        <div className="mainpage-block-cat-name-and-mood-and-etc">
                            <div className="mainpage-block-cat-name-and-mood">
                                <p>{card.cat.name}</p>
                                <p>❀</p>
                                <p>{card.cat.mood}</p>
                            </div>
                            <div className="mainpage-block-date">
                                <p>{new Date(card.createdAt).toLocaleDateString('ru-RU')}</p>
                            </div>
                            <div className="mainpage-for-user-text">
                                <h1>{card.user_text}</h1>
                            </div>
                            <p className="mainpage-card-quote">{card.quote_text}</p>
                            <div className="mainpage-card-buttons">
                                <button onClick={() => toEditCatCard(card.id)}>Редактировать</button>
                                <button onClick={()=> toDeleteCatCard(card.id)}>Удалить</button>
                            </div>
                        </div>
                        <img src="https://i.pinimg.com/736x/dd/0f/1c/dd0f1c0e6b37302b39d0238208766875.jpg" alt="" />

                    </div>
                )))
                : 'Нет записей'}
            </div>
            <Footer />
        </>
    )

}

export default MainPage