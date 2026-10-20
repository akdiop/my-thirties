import { ageOn, birthdayLine, daysToBirthday, splitTags } from './profile';

const on = (iso: string) => new Date(`${iso}T12:00:00`);

describe('profile', () => {
  it('computes the age around the birthday', () => {
    expect(ageOn('1995-11-02', on('2026-11-01'))).toBe(30);
    expect(ageOn('1995-11-02', on('2026-11-02'))).toBe(31);
  });

  it('counts days to the next birthday, including across the new year and on 29 February', () => {
    expect(daysToBirthday('1995-11-02', on('2026-10-20'))).toBe(13);
    expect(daysToBirthday('1995-01-05', on('2026-12-30'))).toBe(6);
    expect(daysToBirthday('1996-02-29', on('2027-02-27'))).toBe(1);
  });

  it('writes a friendly line', () => {
    expect(birthdayLine('1995-11-02', on('2026-10-20'))).toBe('30 ans · anniversaire dans 13 jours');
    expect(birthdayLine('1995-10-20', on('2026-10-20'))).toBe('Joyeux anniversaire : 31 ans aujourd’hui !');
    expect(birthdayLine(null, on('2026-10-20'))).toBe('');
  });

  it('splits tags and removes duplicates', () => {
    expect(splitTags('Tennis, Pilates ; tennis,, Tennis')).toEqual(['Tennis', 'Pilates', 'tennis']);
  });
});
