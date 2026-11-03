import { describe, expect, it } from 'vitest';
import { parseQuick } from '../quickparse';

const now = new Date(2026, 10, 3, 10, 0); // mardi 3 novembre 2026

describe('parseQuick', () => {
  it('jour de la semaine + heure', () => expect(parseQuick('dentiste jeudi 15h', now)).toEqual({ title: 'Dentiste', date: '2026-11-05', time: '15:00', kind: 'event' }));
  it('demain sans heure = tâche', () => expect(parseQuick('appeler maman demain', now)).toEqual({ title: 'Appeler maman', date: '2026-11-04', time: '', kind: 'task' }));
  it('le 12 à 9h30', () => expect(parseQuick('réunion projet le 12 à 9h30', now)).toEqual({ title: 'Réunion projet', date: '2026-11-12', time: '09:30', kind: 'event' }));
  it('date en toutes lettres', () => expect(parseQuick('mariage Fatou 20 décembre 16h', now)).toEqual({ title: 'Mariage Fatou', date: '2026-12-20', time: '16:00', kind: 'event' }));
  it('jj/mm', () => expect(parseQuick('payer loyer 01/12', now)).toEqual({ title: 'Payer loyer', date: '2026-12-01', time: '', kind: 'task' }));
  it('plage horaire', () => expect(parseQuick('sport samedi de 9h à 10h30', now)).toEqual({ title: 'Sport', date: '2026-11-07', time: '09:00', endTime: '10:30', kind: 'event' }));
  it('même jour = semaine prochaine', () => expect(parseQuick('yoga mardi 18h', now)?.date).toBe('2026-11-10'));
  it('sans date = aujourd’hui', () => expect(parseQuick('acheter du pain', now)).toEqual({ title: 'Acheter du pain', date: '2026-11-03', time: '', kind: 'task' }));
  it('midi', () => expect(parseQuick('déjeuner Awa demain midi', now)).toEqual({ title: 'Déjeuner Awa', date: '2026-11-04', time: '12:00', kind: 'event' }));
});
