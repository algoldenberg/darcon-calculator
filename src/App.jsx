import './index.css';
import Header from './assets/components/Header';
import FormBlock from './assets/components/FormBlock';
import InfoModal from './assets/components/InfoModal';
import ResultBlock from './assets/components/ResultBlock';
import { useState } from 'react';

function App() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Header />
      <main className="main-wrapper">
        <div className="card">
          <FormBlock />
          <button className="info-button" onClick={() => setModalOpen(true)}>
            Что такое даркон?
          </button>
        </div>
        {isModalOpen && <InfoModal onClose={() => setModalOpen(false)} />}
        <ResultBlock />
      </main>
      <footer className="footer">
        <a href="https://github.com/alex-goldenberg/darcon-calculator" target="_blank" rel="noreferrer">
          GitHub проекта
        </a>{' '}
        · MIT License · © 2025 Alex Goldenberg
      </footer>
    </>
  );
}

export default App;
