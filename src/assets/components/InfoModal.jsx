import '../css/infoModal.css';


function InfoModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Что такое Даркон?</h2>
        <p>Даркон — это заграничный паспорт гражданина Израиля. После репатриации он выдается не сразу и с определёнными условиями.</p>
        <ul>
          <li>📌 В первый год — только <strong>Teudat Ma’avar</strong> (проездной документ).</li>
          <li>📌 Через 1 год можно получить <strong>5-летний даркон</strong>, если прожито не менее 60% времени в Израиле.</li>
          <li>📌 Через 5 лет с момента репатриации можно подать на <strong>10-летний даркон</strong>, если прожито не менее 36 месяцев.</li>
        </ul>
        <p>Даже находясь за границей, можно продлить даркон, если соблюдены условия.</p>
        <h3>Полезные ссылки:</h3>
        <ul className="links">
          <li><a href="https://www.gov.il/he/service/passport_for_new_immigrant" target="_blank">Официальная страница МВД</a></li>
          <li><a href="https://pravoisrael.us/darkon-rules-and-conditions-of-issuance/" target="_blank">Обзор правил на русском</a></li>
          <li><a href="https://www.nbn.org.il/" target="_blank">Nefesh B’Nefesh</a></li>
        </ul>
        <button className="close-btn" onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
}

export default InfoModal;
