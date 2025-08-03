import '../css/infoModal.css';
import { IoClose } from 'react-icons/io5';
import { useEffect } from 'react';

function InfoModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEsc);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="info-modal-overlay" onClick={onClose}>
      <div className="info-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="info-close-btn" onClick={onClose}>
          <IoClose size={22} />
        </button>

        <h2 className="info-title">Что такое Даркон?</h2>
        <p>
          Даркон — это заграничный паспорт гражданина Израиля. После репатриации он выдается не сразу и с определёнными условиями.
        </p>
        <ul>
          <li>📌 В первый год — только <strong>Teudat Ma’avar</strong> (проездной документ).</li>
          <li>📌 Через 1 год можно получить <strong>5-летний даркон</strong>, если прожито не менее 60% времени в Израиле.</li>
          <li>📌 Через 5 лет с момента репатриации можно подать на <strong>10-летний даркон</strong>, если прожито не менее 36 месяцев.</li>
        </ul>
        <p>
          Даже находясь за границей, можно продлить даркон, если соблюдены условия.
        </p>
        <h3 className="info-subtitle">Полезные ссылки:</h3>
        <ul>
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
