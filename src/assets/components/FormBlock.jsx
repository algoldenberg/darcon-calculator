import '../css/formBlock.css';
import { useState } from 'react';

function FormBlock() {
  const [aliyahDate, setAliyahDate] = useState('');
  const [trips, setTrips] = useState([{ from: '', to: '' }]);

  const handleTripChange = (index, field, value) => {
    const updatedTrips = [...trips];
    updatedTrips[index][field] = value;
    setTrips(updatedTrips);
  };

  const addTrip = () => {
    setTrips([...trips, { from: '', to: '' }]);
  };

  const removeTrip = (index) => {
    const updatedTrips = [...trips];
    updatedTrips.splice(index, 1);
    setTrips(updatedTrips);
  };

  return (
    <div className="form-block">
      <label htmlFor="aliyah-date">Дата репатриации:</label>
      <input
        type="date"
        id="aliyah-date"
        value={aliyahDate}
        onChange={(e) => setAliyahDate(e.target.value)}
      />

      <div className="trips-section">
        <label>Выезды из Израиля:</label>
        {trips.map((trip, index) => (
          <div className="trip-row" key={index}>
            <input
              type="date"
              value={trip.from}
              onChange={(e) => handleTripChange(index, 'from', e.target.value)}
              placeholder="Дата выезда"
            />
            <span className="dash">—</span>
            <input
              type="date"
              value={trip.to}
              onChange={(e) => handleTripChange(index, 'to', e.target.value)}
              placeholder="Дата возвращения"
            />
            <button type="button" className="remove-btn" onClick={() => removeTrip(index)}>
              ✕
            </button>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addTrip}>
          + Добавить выезд
        </button>
      </div>

      <button className="calculate-btn">Рассчитать</button>
    </div>
  );
}

export default FormBlock;

