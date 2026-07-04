import './styles/Footer.css'
function Footer() {

    return (
        <div className="footer">
            <div className="footer-left-block">

                <div className="footer-header">
                    <img src="https://i.pinimg.com/736x/4e/c9/e6/4ec9e640f46e1a8198d981f7ea968d56.jpg" alt="" />
                    <h2>MeowMood</h2>
                </div>
                <hr />
                <p>«MeowMood» — это не просто трекер настроения. Это уютное пространство, где вы можете найти поддержку, лучше понять себя и, конечно же, насладиться компанией милых котиков. </p>
                <p>Присоединяйтесь к нам, и пусть каждый ваш день будет наполнен теплом, уютом и довольным мурлыканьем!</p>

            </div>
            <div className="footer-right-block">
                <div className="footer-right-block-header">
                <input type="search" name="" id=""placeholder='Поиск...' className='footer-search'/>
                <button className='footer-button-submit'>❀</button>
                </div>
                <div className="footer-right-block-footer">
                    <div className="footer-right-block-footer-block-for-icons">
                        <img src="https://cdn-icons-png.flaticon.com/512/87/87390.png" alt="" className='footer-logo'/>
                        <img src="https://cdn-icons-png.flaticon.com/512/87/87390.png" alt="" className='footer-logo'/>
                        <img src="https://cdn-icons-png.flaticon.com/512/87/87390.png" alt="" className='footer-logo'/>
                        <img src="https://cdn-icons-png.flaticon.com/512/87/87390.png" alt="" className='footer-logo'/>
                    </div>
                    <div className="footer-right-block-footer-block-for-p">
                    <p>Остались вопросы? Свяжитесь с нами!</p>
                    <p>7-999-999-99-99</p>
                    </div>
                </div>
            </div>
        </div>

    )

}
export default Footer