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
