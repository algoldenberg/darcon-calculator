import './index.css';
import Header from './assets/components/Header';
import FormBlock from './assets/components/FormBlock';
import LongAbsenceBlock from './assets/components/LongAbsenceBlock';
import InfoModal from './assets/components/InfoModal';
import ResultBlock from './assets/components/ResultBlock';
import { useState } from 'react';

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [calcResult, setCalcResult] = useState(null);
  const [activeTab, setActiveTab] = useState('residence'); // 'residence' или 'absence'
  const [tooltipVisible, setTooltipVisible] = useState(false);

  return (
    <>
      <Header />
      <main className="main-wrapper">
        <div className="card">
          <div className="tab-container">
            <div className="tab-switcher">
              <button
                className={`tab-button ${activeTab === 'residence' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('residence');
                  setCalcResult(null);
                }}
              >
                Я живу в Израиле с момента репатриации
              </button>

              <div
                className="tooltip-button-wrapper"
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
              >
                <button
                  className={`tab-button ${activeTab === 'absence' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('absence');
                    setCalcResult(null);
                  }}
                >
                  Я уезжал из Израиля на длительный период
                  <span className="tooltip-icon-inline"></span>
                </button>
                {tooltipVisible && (
                    <div className="tooltip-box-inline">
                      <button
                        className="tooltip-close-button"
                        onClick={() => setTooltipVisible(false)}
                      >
                        ×
                      </button>
                      Выберите этот режим, если вы надолго уезжали из Израиля и теперь вернулись.
                      <br /><br />
                      Этот режим подходит для тех, кто <strong>не соответствует критерию 60%</strong> пребывания в Израиле за последние годы — например:
                      <ul>
                        <li>жили за границей более года сразу после репатриации,</li>
                        <li>часто и подолгу покидали Израиль,</li>
                        <li>получили 5-летний даркон, но затем уехали.</li>
                      </ul>
                      В этом режиме учитывается только время с момента возвращения, как требует МВД.
                      <br /><br />
                      В случае, если вы не уверены в вашем кейсе, или он сложный - рекомендуем обратиться к юристу или советнику по абсорбции, так как сложные случаи могут быть индивидуальны и не поддаваться логике математических рассчётов, представленных МВД Израиля
                    </div>
                  )}

              </div>
            </div>

            <div className="form-wrapper">
              {activeTab === 'residence' && (
                <div className="same-size-form">
                  <FormBlock onCalculate={setCalcResult} />
                </div>
              )}
              {activeTab === 'absence' && (
                <div className="same-size-form">
                  <LongAbsenceBlock onCalculate={setCalcResult} />
                </div>
              )}
            </div>
          </div>

          <button className="info-button" onClick={() => setModalOpen(true)}>
            Что такое даркон?
          </button>

          <div className="external-projects">
            <span className="project-title">Другие наши проекты:</span>
            <ul>
              <li>
                <a
                  href="https://nekudot-calculator.netlify.app/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Калькулятор налоговых льгот (некудот зикуй)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <InfoModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

        {activeTab === 'residence' && calcResult && (
          <ResultBlock result={calcResult} />
        )}
      </main>

      <footer className="footer">
        <a
          href="https://github.com/algoldenberg/darcon-calculator"
          target="_blank"
          rel="noreferrer"
        >
          GitHub проекта
        </a>{' '}
        · MIT License · © 2025 Alex Goldenberg
      </footer>
    </>
  );
}

export default App;
