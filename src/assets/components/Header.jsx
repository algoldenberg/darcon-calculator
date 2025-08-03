import '../css/header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
      <img src="/emblem.png" alt="Emblem" className="emblem" />
        <div className="header-text">
          <h1 className="title">Калькулятор Даркона</h1>
          <p className="subtitle">Для новых репатриантов — просто и понятно</p>
        </div>
      </div>
      <div className="header-right">
        <button className="lang-button" disabled>RU ▾</button>
      </div>
    </header>
  );
}

export default Header;

