import '../css/formBlock.css';
import { useState } from 'react';
import { parse, isValid, isAfter, isBefore } from 'date-fns';
import { calculateDarconStatus } from '../../utils/calculateDarconStatus';

function FormBlock({ onCalculate }) {
  const [aliyahDate, setAliyahDate] = useState('');
  const [trips, setTrips] = useState([{ from: '', to: '' }]);
  const [errors, setErrors] = useState([]);

  const formatInputDate = (value) => {
    const raw = value.replace(/\D/g, '').slice(0, 8);
    if (raw.length >= 5) return `${raw.slice(0, 2)}.${raw.slice(2, 4)}.${raw.slice(4, 8)}`;
    if (raw.length >= 3) return `${raw.slice(0, 2)}.${raw.slice(2, 4)}`;
    return raw;
  };

  const parseDate = (str) => {
    const parsed = parse(str, 'dd.MM.yyyy', new Date());
    return isValid(parsed) ? parsed : null;
  };

  const handleTripChange = (index, field, value) => {
    const updated = [...trips];
    updated[index][field] = formatInputDate(value);
    setTrips(updated);
  };

  const addTrip = () => setTrips([...trips, { from: '', to: '' }]);
  const removeTrip = (index) => {
    const updated = [...trips];
    updated.splice(index, 1);
    setTrips(updated);
  };

  const handleCalculate = () => {
    const today = new Date();
    const newErrors = [];

    const parsedAliyah = parseDate(aliyahDate);
    if (!parsedAliyah) newErrors.push('Укажите корректную дату репатриации.');
    else if (isAfter(parsedAliyah, today)) newErrors.push('Дата репатриации не может быть в будущем.');

    const parsedTrips = [];
    trips.forEach((trip, i) => {
      const from = parseDate(trip.from);
      const to = parseDate(trip.to);

      if (trip.from && trip.to) {
        if (!from || !to) newErrors.push(`Выезд #${i + 1} содержит некорректную дату.`);
        else {
          if (isAfter(from, to)) newErrors.push(`В выезде #${i + 1} дата возвращения раньше даты выезда.`);
          if (isAfter(from, today) || isAfter(to, today)) newErrors.push(`В выезде #${i + 1} указаны будущие даты.`);
          if (parsedAliyah && isBefore(from, parsedAliyah)) newErrors.push(`В выезде #${i + 1} дата выезда раньше репатриации.`);
          parsedTrips.push({ from, to });
        }
      } else if (trip.from || trip.to) {
        newErrors.push(`Выезд #${i + 1} заполнен не полностью.`);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);
    const aliyah = parsedAliyah.toISOString().split('T')[0];
    const normalizedTrips = parsedTrips.map((trip) => ({
      from: trip.from.toISOString().split('T')[0],
      to: trip.to.toISOString().split('T')[0],
    }));

    const result = calculateDarconStatus(aliyah, normalizedTrips);

    const israelMonths = result.israelMonths;
    const monthsTo5 = Math.max(0, 12 - israelMonths);
    const monthsTo10 = Math.max(0, 36 - israelMonths);

    result.remainingTo5 = monthsTo5 > 0 ? monthsTo5.toFixed(1) : null;
    result.remainingTo10 = monthsTo10 > 0 ? monthsTo10.toFixed(1) : null;

    if (result) onCalculate(result);
  };

  return (
    <div className="form-block">
      {errors.length > 0 && (
        <div className="error-block">
          <ul>{errors.map((err, i) => <li key={i}>{err}</li>)}</ul>
        </div>
      )}

      <label>Дата репатриации:</label>
      <input
        type="text"
        inputMode="numeric"
        value={aliyahDate}
        onChange={(e) => setAliyahDate(formatInputDate(e.target.value))}
        placeholder="дд.мм.гггг"
        className="datepicker"
      />

      <div className="trips-section">
        <label>Выезды из Израиля:</label>
        {trips.map((trip, index) => (
          <div className="trip-row" key={index}>
            <input
              type="text"
              inputMode="numeric"
              value={trip.from}
              onChange={(e) => handleTripChange(index, 'from', e.target.value)}
              placeholder="Дата выезда"
              className="datepicker"
            />
            <span className="dash">—</span>
            <input
              type="text"
              inputMode="numeric"
              value={trip.to}
              onChange={(e) => handleTripChange(index, 'to', e.target.value)}
              placeholder="Дата возвращения"
              className="datepicker"
            />
            <button type="button" className="remove-btn" onClick={() => removeTrip(index)}>✕</button>
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
