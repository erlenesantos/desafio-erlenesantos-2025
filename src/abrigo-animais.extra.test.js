import { AbrigoAnimais } from './abrigo-animais.js';

describe('Abrigo de Animais - testes extras', () => {
  test('Empate manda ao abrigo', () => {
    const r = new AbrigoAnimais().encontraPessoas('RATO,BOLA', 'RATO,BOLA', 'Rex');
    expect(r.lista).toEqual(['Rex - abrigo']);
  });

  test('Limite de 3 por pessoa (4º vai para abrigo se ninguém puder)', () => {
    const r = new AbrigoAnimais().encontraPessoas(
      'LASER,RATO,BOLA,CAIXA,NOVELO',
      'RATO',
      'Rex,Zero,Bebe,Bola'
    );
    expect(r.lista).toEqual([
      'Bebe - pessoa 1',
      'Bola - abrigo',
      'Rex - pessoa 1',
      'Zero - pessoa 1',
    ]);
  });

  test('Gatos não compartilham brinquedos na mesma pessoa', () => {
    const r = new AbrigoAnimais().encontraPessoas(
      'BOLA,RATO,LASER',
      'CAIXA',
      'Mimi,Fofo'
    );
    expect(r.lista).toEqual([
      'Fofo - abrigo',
      'Mimi - pessoa 1',
    ]);
  });

  test('Loco com companhia no resultado final', () => {
    const r = new AbrigoAnimais().encontraPessoas(
      'SKATE,RATO,BOLA',
      'NOVELO',
      'Loco,Rex'
    );
    expect(r.lista).toEqual([
      'Loco - pessoa 1',
      'Rex - pessoa 1',
    ]);
  });

  test('Loco sem companhia vai para abrigo', () => {
    const r = new AbrigoAnimais().encontraPessoas('SKATE,RATO', 'RATO', 'Loco');
    expect(r.lista).toEqual(['Loco - abrigo']);
  });

  test('Erro de brinquedo', () => {
    expect(new AbrigoAnimais().encontraPessoas('RATO,RATO', 'BOLA', 'Rex').erro).toBe('Brinquedo inválido');
  });

  test('Erro de animal', () => {
    expect(new AbrigoAnimais().encontraPessoas('RATO,BOLA', 'BOLA', 'Rex,Rex').erro).toBe('Animal inválido');
    expect(new AbrigoAnimais().encontraPessoas('RATO,BOLA', 'BOLA', 'Lulu').erro).toBe('Animal inválido');
  });
});
