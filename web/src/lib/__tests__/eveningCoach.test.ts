import { describe, expect, it } from 'vitest';
import { coachPrompt, parseCoach } from '../../features/EveningCoach';

describe('coach du soir', () => {
  it('lit la réponse JSON de l’assistant', () => {
    const c = parseCoach('Voici : {"pistes":["Rappelle ta sœur demain midi","Prévois 10 min de marche"],"question":"Qu’est-ce qui t’a le plus aidée ?"}');
    expect(c.pistes).toEqual(['Rappelle ta sœur demain midi', 'Prévois 10 min de marche']);
    expect(c.question).toBe('Qu’est-ce qui t’a le plus aidée ?');
  });
  it('se rabat sur une piste par ligne', () => {
    const c = parseCoach('1. Bois de l’eau au réveil\n2. Range ton bureau avant 18 h');
    expect(c.pistes).toHaveLength(2);
    expect(c.question).toBe('');
  });
  it('n’envoie que le débriefing, sous 1 200 caractères', () => {
    const p = coachPrompt({ mood: 'Bien', win: 'x'.repeat(900), different: '', question: 'Qu’est-ce qui m’a fait sourire ?', answer: 'Le rire de ma nièce', letgo: '' });
    expect(p.length).toBeLessThanOrEqual(1190);
    expect(p).toContain('Humeur du jour : Bien');
  });
});

import { compassFacts } from '../../screens/Compass';
import type { Entry } from '../cloud';

const entry = (kind: string, title: string, data: Record<string, unknown>, date: string | null = null) =>
  ({ id: kind + title, kind, title, data, module: 'equilibre', entry_date: date, created_at: '', updated_at: '' }) as unknown as Entry;

describe('coach de la boussole', () => {
  const goal = entry('objectif', 'Courir 5 km', { why: 'Pour ma santé', steps: [{ id: 'a', text: 'Acheter des baskets', done: true }, { id: 'b', text: 'Courir 2 km', done: false }] });
  const all = [entry('vision', 'Ma vision', { words: 'sereine, audacieuse', year1: 'Je vis à mon rythme' }), goal, entry('roue', 'Roue', { scores: { Santé: 4, Argent: 7 } }, '2026-11-01')];
  it('envoie seulement l’objectif choisi pour le débloquer', () => {
    const f = compassFacts('objectif', all, ['Foi'], goal);
    expect(f).toContain('Étapes restantes : Courir 2 km');
    expect(f).not.toContain('sereine');
  });
  it('envoie la vision et la roue pour faire le point', () => {
    const f = compassFacts('point', all, ['Foi']);
    expect(f).toContain('Mes valeurs : Foi');
    expect(f).toContain('Santé 4');
  });
});
