const ANIMAIS = {
  Rex:  { tipo: 'cao',   brinquedos: ['RATO', 'BOLA'] },
  Mimi: { tipo: 'gato',  brinquedos: ['BOLA', 'LASER'] },
  Fofo: { tipo: 'gato',  brinquedos: ['BOLA', 'RATO', 'LASER'] },
  Zero: { tipo: 'gato',  brinquedos: ['RATO', 'BOLA'] },
  Bola: { tipo: 'cao',   brinquedos: ['CAIXA', 'NOVELO'] },
  Bebe: { tipo: 'cao',   brinquedos: ['LASER', 'RATO', 'BOLA'] },
  Loco: { tipo: 'jabuti',brinquedos: ['SKATE', 'RATO'] },
};
const BRINQUEDOS_VALIDOS = new Set(Object.values(ANIMAIS).flatMap(a => a.brinquedos));

function ehSubsequencia(needle, haystack) {
  let i = 0;
  for (const x of haystack) {
    if (x === needle[i]) i++;
    if (i === needle.length) return true;
  }
  return i === needle.length;
}

class AbrigoAnimais {
  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    const p1 = this.parseBrinquedos(brinquedosPessoa1);
    const p2 = this.parseBrinquedos(brinquedosPessoa2);
    const ordem = this.parseOrdemAnimais(ordemAnimais);

    if (this.temBrinquedoInvalidoOuDuplicado(p1) || this.temBrinquedoInvalidoOuDuplicado(p2)) {
      return { erro: 'Brinquedo inválido' };
    }
    if (!this.ordemValidaSemDuplicatas(ordem)) {
      return { erro: 'Animal inválido' };
    }

    const e1 = { lista: p1, adotados: 0, gatosUsados: new Set() };
    const e2 = { lista: p2, adotados: 0, gatosUsados: new Set() };

    const saida = [];
    for (const nome of ordem) {
      const a = ANIMAIS[nome];
      const ok1 = this.podeAdotarNaoLoco(a, e1);
      const ok2 = this.podeAdotarNaoLoco(a, e2);

      let destino = 'abrigo';
      if (ok1 && ok2) destino = 'abrigo';
      else if (ok1) { destino = 'pessoa 1'; this.efetivaAdocao(a, e1); }
      else if (ok2) { destino = 'pessoa 2'; this.efetivaAdocao(a, e2); }

      saida.push({ nome, destino });
    }

    saida.sort((a, b) => a.nome.localeCompare(b.nome));
    return { lista: saida.map(x => `${x.nome} - ${x.destino}`) };
  }

  podeAdotarNaoLoco(animal, estado) {
    if (estado.adotados >= 3) return false;
    if (!ehSubsequencia(animal.brinquedos, estado.lista)) return false;
    if (animal.tipo === 'gato') {
      for (const b of animal.brinquedos) if (estado.gatosUsados.has(b)) return false;
    }
    return true;
  }
  efetivaAdocao(animal, estado) {
    estado.adotados += 1;
    if (animal.tipo === 'gato') {
      for (const b of animal.brinquedos) estado.gatosUsados.add(b);
    }
  }

  parseBrinquedos(str) {
    if (typeof str !== 'string') return [];
    return str.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
  }
  parseOrdemAnimais(str) {
    if (typeof str !== 'string') return [];
    const nomes = str.split(',').map(s => s.trim()).filter(Boolean);
    return nomes.map(raw => {
      const alvo = raw.toLowerCase();
      const achado = Object.keys(ANIMAIS).find(n => n.toLowerCase() === alvo);
      return achado || '###INVALIDO###';
    });
  }
  temBrinquedoInvalidoOuDuplicado(lista) {
    const vistos = new Set();
    for (const b of lista) {
      if (!BRINQUEDOS_VALIDOS.has(b) || vistos.has(b)) return true;
      vistos.add(b);
    }
    return false;
  }
  ordemValidaSemDuplicatas(ordemCanonica) {
    if (ordemCanonica.some(n => n === '###INVALIDO###')) return false;
    return new Set(ordemCanonica).size === ordemCanonica.length;
  }
}

export { AbrigoAnimais as AbrigoAnimais };
