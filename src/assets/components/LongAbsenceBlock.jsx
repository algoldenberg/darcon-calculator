import '../css/formBlock.css';
import { useState } from 'react';
import { parse, isValid, isAfter, isBefore } from 'date-fns';
import { calculateAfterAbsence } from '../../utils/calculateAfterAbsence';
import AfterAbsenceResultBlock from './AfterAbsenceResultBlock';

function LongAbsenceBlock({ onCalculate }) {
  const [returnDate, setReturnDate] = useState('');
  const [hadFiveYearDarcon, setHadFiveYearDarcon] = useState(false);
  const [darcon5Date, setDarcon5Date] = useState('');
  const [trips, setTrips] = useState([{ from: '', to: '' }]);
  const [errors, setErrors] = useState([]);
  const [result, setResult] = useState(null);

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

  const handleAddTrip = () => setTrips([...trips, { from: '', to: '' }]);

  const handleRemoveTrip = (index) => {
    const updated = [...trips];
    updated.splice(index, 1);
    setTrips(updated);
  };

  const handleCalculate = () => {
    const today = new Date();
    const newErrors = [];

    const parsedReturnDate = parseDate(returnDate);
    const parsedDarcon5Date = darcon5Date ? parseDate(darcon5Date) : null;

    if (!parsedReturnDate) {
      newErrors.push('Укажите корректную дату возвращения в Израиль.');
    } else if (isAfter(parsedReturnDate, today)) {
      newErrors.push('Дата возвращения не может быть в будущем.');
    }

    if (hadFiveYearDarcon) {
      if (!parsedDarcon5Date) {
        newErrors.push('Укажите корректную дату получения 5-летнего даркона.');
      } else if (isAfter(parsedDarcon5Date, today)) {
        newErrors.push('Дата получения 5-летнего даркона не может быть в будущем.');
      }
    }

    const parsedTrips = [];

    trips.forEach((trip, i) => {
      const from = parseDate(trip.from);
      const to = parseDate(trip.to);

      if (trip.from && trip.to) {
        if (!from || !to) {
          newErrors.push(`Поездка #${i + 1} содержит некорректную дату.`);
        } else {
          if (isAfter(from, to)) newErrors.push(`В поездке #${i + 1} дата возвращения раньше даты выезда.`);
          if (isAfter(from, today) || isAfter(to, today)) newErrors.push(`В поездке #${i + 1} указаны будущие даты.`);
          if (parsedReturnDate && isBefore(from, parsedReturnDate)) newErrors.push(`В поездке #${i + 1} дата выезда раньше даты возвращения в Израиль.`);
          parsedTrips.push({ from, to });
        }
      } else if (trip.from || trip.to) {
        newErrors.push(`Поездка #${i + 1} заполнена не полностью.`);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);

    const returnDateStr = parsedReturnDate.toISOString().split('T')[0];
    const darcon5DateStr = parsedDarcon5Date ? parsedDarcon5Date.toISOString().split('T')[0] : null;

    const normalizedTrips = parsedTrips.map((trip) => ({
      from: trip.from.toISOString().split('T')[0],
      to: trip.to.toISOString().split('T')[0],
    }));

    const result = calculateAfterAbsence(
      returnDateStr,
      hadFiveYearDarcon,
      normalizedTrips,
      darcon5DateStr
    );

    setResult(result);
    onCalculate?.(result);
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

      <div className="form-section">
        <label>Дата возвращения в Израиль:</label>
        <input
          type="text"
          inputMode="numeric"
          value={returnDate}
          onChange={(e) => setReturnDate(formatInputDate(e.target.value))}
          placeholder="дд.мм.гггг"
          className="datepicker"
        />
      </div>

      <div className="checkbox-wrapper">
        <input
          type="checkbox"
          checked={hadFiveYearDarcon}
          onChange={() => setHadFiveYearDarcon(!hadFiveYearDarcon)}
        />
        <label>У меня уже был 5-летний даркон</label>
      </div>

      {hadFiveYearDarcon && (
        <div className="form-section">
          <label>Дата получения 5-летнего даркона:</label>
          <input
            type="text"
            inputMode="numeric"
            value={darcon5Date}
            onChange={(e) => setDarcon5Date(formatInputDate(e.target.value))}
            placeholder="дд.мм.гггг"
            className="datepicker"
          />
        </div>
      )}

      <div className="trips-section">
        <label>Поездки за границу после возвращения:</label>
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
            <button type="button" className="remove-btn" onClick={() => handleRemoveTrip(index)}>
              ✕
            </button>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={handleAddTrip}>
          + Добавить поездку
        </button>
      </div>

      <button className="calculate-btn" onClick={handleCalculate}>
        Рассчитать
      </button>

      {result && <AfterAbsenceResultBlock result={result} />}
    </div>
  );
}

export default LongAbsenceBlock;
