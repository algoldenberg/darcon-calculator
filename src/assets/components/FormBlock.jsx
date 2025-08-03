import '../css/formBlock.css';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { parse, isValid, isAfter, isBefore } from 'date-fns';
import { calculateDarconStatus } from '../../utils/calculateDarconStatus';

function FormBlock({ onCalculate }) {
  const [aliyahDate, setAliyahDate] = useState(null);
  const [trips, setTrips] = useState([{ from: null, to: null }]);
  const [errors, setErrors] = useState([]);

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

  const handleRawInput = (e, setter) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    if (raw.length === 8) {
      const parsed = parse(raw, 'ddMMyyyy', new Date());
      if (isValid(parsed)) {
        setter(parsed);
      }
    }
  };

  const handleCalculate = () => {
    const today = new Date();
    const newErrors = [];

    if (!aliyahDate) {
      newErrors.push('Укажите дату репатриации.');
    } else if (isAfter(aliyahDate, today)) {
      newErrors.push('Дата репатриации не может быть в будущем.');
    }

    trips.forEach((trip, i) => {
      if (trip.from && trip.to) {
        if (isAfter(trip.from, trip.to)) {
          newErrors.push(`В выезде #${i + 1} дата возвращения раньше даты выезда.`);
        }
        if (isAfter(trip.from, today) || isAfter(trip.to, today)) {
          newErrors.push(`В выезде #${i + 1} указаны будущие даты.`);
        }
        if (aliyahDate && isBefore(trip.from, aliyahDate)) {
          newErrors.push(`В выезде #${i + 1} дата выезда раньше даты репатриации.`);
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
    const aliyah = aliyahDate.toISOString().split('T')[0];
    const normalizedTrips = trips
      .filter((trip) => trip.from && trip.to)
      .map((trip) => ({
        from: trip.from.toISOString().split('T')[0],
        to: trip.to.toISOString().split('T')[0],
      }));

    const result = calculateDarconStatus(aliyah, normalizedTrips);

    // Расчёт оставшегося времени для даркона
    const totalMonths = (Date.now() - aliyahDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
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
          <ul>
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

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
