import '../css/formBlock.css';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { parse, isValid } from 'date-fns';
import { calculateDarconStatus } from '../../utils/calculateDarconStatus';

function FormBlock({ onCalculate }) {
  const [aliyahDate, setAliyahDate] = useState(null);
  const [trips, setTrips] = useState([{ from: null, to: null }]);

  const handleTripChange = (index, field, value) => {
    const updatedTrips = [...trips];
    updatedTrips[index][field] = value;
    setTrips(updatedTrips);
  };

  const addTrip = () => {
    setTrips([...trips, { from: null, to: null }]);
  };

  const removeTrip = (index) => {
    const updatedTrips = [...trips];
    updatedTrips.splice(index, 1);
    setTrips(updatedTrips);
  };

  const handleCalculate = () => {
    const aliyah = aliyahDate ? aliyahDate.toISOString().split('T')[0] : '';
    const normalizedTrips = trips.map((trip) => ({
      from: trip.from ? trip.from.toISOString().split('T')[0] : '',
      to: trip.to ? trip.to.toISOString().split('T')[0] : '',
    }));
    const result = calculateDarconStatus(aliyah, normalizedTrips);
    if (result) onCalculate(result);
  };

  const handleRawInput = (e, setter) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    if (raw.length === 8) {
      const parsed = parse(raw, 'ddMMyyyy', new Date());
      if (isValid(parsed)) {
        setter(parsed);
      }
    }
  };

  return (
    <div className="form-block">
      <label>Дата репатриации:</label>
      <DatePicker
        selected={aliyahDate}
        onChange={(date) => setAliyahDate(date)}
        onChangeRaw={(e) => handleRawInput(e, setAliyahDate)}
        dateFormat="dd.MM.yyyy"
        placeholderText="дд.мм.гггг"
        className="datepicker"
      />

      <div className="trips-section">
        <label>Выезды из Израиля:</label>
        {trips.map((trip, index) => (
          <div className="trip-row" key={index}>
            <DatePicker
              selected={trip.from}
              onChange={(date) => handleTripChange(index, 'from', date)}
              onChangeRaw={(e) => handleRawInput(e, (val) => handleTripChange(index, 'from', val))}
              dateFormat="dd.MM.yyyy"
              placeholderText="Дата выезда"
              className="datepicker"
            />
            <span className="dash">—</span>
            <DatePicker
              selected={trip.to}
              onChange={(date) => handleTripChange(index, 'to', date)}
              onChangeRaw={(e) => handleRawInput(e, (val) => handleTripChange(index, 'to', val))}
              dateFormat="dd.MM.yyyy"
              placeholderText="Дата возвращения"
              className="datepicker"
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

      <button className="calculate-btn" onClick={handleCalculate}>
        Рассчитать
      </button>
    </div>
  );
}

export default FormBlock;
