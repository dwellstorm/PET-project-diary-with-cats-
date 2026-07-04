import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import './styles/CatCard.css'
function CatCard() {
    const [storedUser, setStoredUser] = useState(JSON.parse(localStorage.getItem('user') || {}))
    const userId = storedUser.id
    const [cats, setCats] = useState([])
    const [quote, setQuote] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [entry, setEntry] = useState('')
    const navigate = useNavigate()
    const displayOneCatRight = () => {
        if (cats.length === 0) return
        let newCurrentIndex = currentIndex + 1
        if (newCurrentIndex <= cats.length - 1) {
            setCurrentIndex(newCurrentIndex)
        }
        else {
            newCurrentIndex = 0
            setCurrentIndex(newCurrentIndex)
        }
    }
    const displayOneCatLeft = () => {
        if (cats.length === 0) return
        let newCurrentIndex = currentIndex - 1
        if (newCurrentIndex >= 0) {
            setCurrentIndex(newCurrentIndex)
        }
        else {
            newCurrentIndex += cats.length
            setCurrentIndex(newCurrentIndex)
        }
    }
    const toPrevPage = () => {
        navigate(-1)
    }
    const saveUserEntry = async () => {
        try {
            const res = await axios.post(`/api/entries?id=${userId}`, {
                cat_id: cats[currentIndex].id,
                user_id: userId,
                user_text: entry,
                quote_text: quote.quote_text
            })
            setEntry('')
            navigate('/')

        } catch (error) {
            console.error('error:', error)
            alert('Не удалось сохранить запись')
        }
    }
    useEffect(() => {
        const fetchCats = async () => {
            const res = await axios.get('/api/cats')
            setCats(res.data)
        }
        fetchCats()
    }, [])
    useEffect(() => {
        const fetchQuote = async () => {
            if (cats.length === 0) return
            const res = await axios.get(`/api/quotes/cat/${cats[currentIndex]?.id}/random`)
            setQuote(res.data)
        }
        fetchQuote()
    }, [currentIndex, cats])

    return (
        <div className="main-cat-card">
            <div className="block-card-and-x">
                <div className="cat-card">
                    <div className="cat-card-h1-block">
                    </div>
                    <h1 className="cat-card-h1">Сегодня ты:</h1>
                    <div className="cat-card-buttons-and-image">
                        <button onClick={displayOneCatLeft} className="cat-card-button">←</button>
                        <img src="https://i.pinimg.com/736x/13/79/7a/13797ac519b89fe0879bc9deea91cfca.jpg" alt="" className="cat-card-image" />
                        <button onClick={displayOneCatRight} className="cat-card-button">→</button>
                    </div>
                    <div className="cat-card-quote-and-entry">
                        <div className="cat-card-cat-name">
                            {cats[currentIndex]?.name}
                        </div>
                        <div className="cat-card-quote">
                            {quote?.quote_text}
                        </div>
                        <textarea name="userEntry" id="" value={entry} className='user-entry' placeholder="Опишите свой день..." onChange={(e) => setEntry(e.target.value)}></textarea>
                        <button onClick={saveUserEntry} className="save-button">Сохранить</button>
                    </div>

                </div>
                <button onClick={toPrevPage} className='button-X'>X</button>
            </div>


        </div>
    )
}
export default CatCard;