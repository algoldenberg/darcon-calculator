import '../css/infoModal.css';
import { IoClose } from 'react-icons/io5';

function InfoModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-icon" onClick={onClose}>
          <IoClose size={24} />
        </button>

        <h2 className="modal-title">Что такое Даркон?</h2>
        <p className="modal-paragraph">
          Даркон — это заграничный паспорт гражданина Израиля. После репатриации он выдается не сразу и с определёнными условиями.
        </p>
        <ul className="modal-list">
          <li>📌 В первый год — только <strong>Teudat Ma’avar</strong> (проездной документ).</li>
          <li>📌 Через 1 год можно получить <strong>5-летний даркон</strong>, если прожито не менее 60% времени в Израиле.</li>
          <li>📌 Через 5 лет с момента репатриации можно подать на <strong>10-летний даркон</strong>, если прожито не менее 36 месяцев.</li>
        </ul>
        <p className="modal-paragraph">
          Даже находясь за границей, можно продлить даркон, если соблюдены условия.
        </p>
        <h3 className="modal-subtitle">Полезные ссылки:</h3>
        <ul className="modal-links">
          <li>
            <a href="https://russia-israel.com/darkon" target="_blank" rel="noreferrer">
              Обзор правил и условий
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default InfoModal;
