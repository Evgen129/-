import { useEffect, useState } from 'react';
import { API, Aircraft } from './db';

export function formatAircraftLabel(aircraft: Aircraft) {
  return `${aircraft.registration} (${aircraft.type})`;
}

export function useAircrafts() {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);

  useEffect(() => {
    API.getAllAircrafts().then(items => {
      setAircrafts(items.sort((a, b) => a.registration.localeCompare(b.registration)));
    });
  }, []);

  return aircrafts;
}

export function useAircraftOptions() {
  const aircrafts = useAircrafts();

  return {
    aircrafts,
    aircraftOptions: aircrafts,
    defaultBoard: aircrafts[0]?.registration ?? '',
  };
}

type AircraftSelectProps = {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
};

export function AircraftSelect({ value, onChange, required, className }: AircraftSelectProps) {
  const aircrafts = useAircrafts();

  return (
    <select value={value} onChange={event => onChange(event.target.value)} required={required} className={className}>
      <option value="">Выбрать борт...</option>
      {aircrafts.map(aircraft => (
        <option key={aircraft.id ?? aircraft.registration} value={aircraft.registration}>
          {formatAircraftLabel(aircraft)}
        </option>
      ))}
    </select>
  );
}
