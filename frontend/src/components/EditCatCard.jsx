import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import './styles/CatCard.css'
function EditCatCard() {
    const [cats, setCats] = useState([])
    const [myCard, setMyCard] = useState({})
    const [currentIndex, setCurrentIndex] = useState(0)
    const [quote, setQuote] = useState('')
    const [isInitialized, setIsInitialized] = useState(false)
    const { entry_id } = useParams()
    const navigate = useNavigate()

    const [entry, setEntry] = useState('')
    const displayOneCatRight = () => {
        if (cats.length === 0) return
        let newCurrentIndex = currentIndex + 1
        if (newCurrentIndex <= cats.length - 1) {
            setCurrentIndex(newCurrentIndex)
            setIsInitialized(true)

        }
        else {
            newCurrentIndex = 0
            setCurrentIndex(newCurrentIndex)
            setIsInitialized(true)

        }
    }
    const displayOneCatLeft = () => {
        if (cats.length === 0) return
        let newCurrentIndex = currentIndex - 1
        if (newCurrentIndex >= 0) {
            setCurrentIndex(newCurrentIndex)
            setIsInitialized(true)

        }
        else {
            newCurrentIndex += cats.length
            setCurrentIndex(newCurrentIndex)
            setIsInitialized(true)

        }
    }
    const saveUserEntry = async () => {
        try {
            const res = await axios.put(`/api/entries/edit/${myCard.id}`, {
                cat_id: cats[currentIndex].id,
                user_text: entry,
                quote_text: quote
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
            setQuote(res.data.quote_text)
        }
        if (isInitialized == true) {

            fetchQuote()
        }
    }, [currentIndex, cats])
    useEffect(() => {
        if (cats.length > 0 && myCard.cat_id) {
            const index = cats.findIndex(cat => cat.id === myCard.cat_id)
            if (index !== -1) setCurrentIndex(index)
        }
    }, [cats, myCard.cat_id])
    useEffect(() => {
        const fetchMyCard = async () => {
            try {
                const res = await axios.get(`/api/entries/card/${entry_id}`)
                setMyCard(res.data)
                setEntry(res.data.user_text)
                setQuote(res.data.quote_text)
            } catch (error) {
                console.error('error:', error)
            }
        }
        fetchMyCard()
    }, [])
    if (!myCard.cat) {
        return <div>Загрузка...</div>
    }
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
                            {quote}
                        </div>
                        <textarea name="userEntry" id="" value={entry} className='user-entry' placeholder="Опишите свой день..." onChange={(e) => setEntry(e.target.value)}></textarea>
                        <button onClick={saveUserEntry} className="save-button">Сохранить</button>
                    </div>
                </div>
                <button onClick={() => navigate(-1)} className='button-X'>X</button>

            </div>


        </div>
    )

}

export default EditCatCard