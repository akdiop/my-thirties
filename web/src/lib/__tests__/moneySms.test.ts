import { describe, expect, it } from 'vitest';
import { parseMoneySms } from '../../../supabase/functions/money-import/parse';

// Exemples inventés pour les tests : le format réel des SMS sera ajusté sur de vrais messages.
describe('SMS de paiement mobile', () => {
  it('paiement chez un marchand', () => {
    expect(parseMoneySms('Wave: Vous avez payé 12 500F à Auchan Mermoz. Nouveau solde: 40 000F.')).toMatchObject({ kind: 'expense', amount: 12500, label: 'Auchan Mermoz', provider: 'Wave' });
  });
  it('argent reçu', () => {
    expect(parseMoneySms('Orange Money: Vous avez reçu 25.000 FCFA de Fatou Diop. Solde 60.000 FCFA')).toMatchObject({ kind: 'income', amount: 25000, label: 'Fatou Diop', provider: 'Orange Money' });
  });
  it('ignore le solde et les frais', () => {
    expect(parseMoneySms('Solde: 90 000F. Frais 100F. Transfert de 5 000F à Awa effectué.')).toMatchObject({ kind: 'expense', amount: 5000 });
  });
  it('rien de reconnu', () => {
    expect(parseMoneySms('Votre code de vérification est 4421')).toBeNull();
    expect(parseMoneySms('')).toBeNull();
  });
});
