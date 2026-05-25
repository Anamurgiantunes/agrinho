// ===========================================
// SIMULADOR DE PLANTIO DIRETO - AGRINHO 2026
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
  
  // Elementos do DOM
  const palhadaInput = document.getElementById('palhada');
  const palhadaValor = document.getElementById('palhada-valor');
  const btnSimular = document.getElementById('btn-simular');
  const resultadosDiv = document.getElementById('resultados');

  // Atualizar valor da palhada em tempo real
  palhadaInput.addEventListener('input', function() {
    palhadaValor.textContent = `${this.value} ton/ha`;
  });

  // Dados de referência para cálculos
  const dadosCulturas = {
    soja: { nome: 'Soja', produtividadeMedia: 3500, preco: 180 },
    milho: { nome: 'Milho', produtividadeMedia: 6000, preco: 85 },
    trigo: { nome: 'Trigo', produtividadeMedia: 3000, preco: 120 },
    feijao: { nome: 'Feijão', produtividadeMedia: 1800, preco: 350 }
  };

  const dadosSolo = {
    argiloso: { erosaoBase: 25, infiltracao: 0.85 },
    arenoso: { erosaoBase: 40, infiltracao: 0.70 },
    medio: { erosaoBase: 30, infiltracao: 0.78 }
  };

  // Função principal de simulação
  btnSimular.addEventListener('click', function() {
    
    // Obter valores dos inputs
    const area = parseFloat(document.getElementById('area').value) || 50;
    const solo = document.getElementById('solo').value;
    const cultura = document.getElementById('cultura').value;
    const palhada = parseFloat(document.getElementById('palhada').value) || 6;
    const anos = parseInt(document.getElementById('anos').value) || 0;

    // Validações
    if (area <= 0 || area > 10000) {
      mostrarErro('Por favor, insira uma área válida (1 a 10.000 hectares).');
      return;
    }

    // Calcular benefícios
    const resultados = calcularBeneficios(area, solo, cultura, palhada, anos);
    
    // Exibir resultados
    exibirResultados(resultados);
  });

  // Função de cálculos
  function calcularBeneficios(area, solo, cultura, palhada, anos) {
    const dadosCultura = dadosCulturas[cultura];
    const dadosSoloAtual = dadosSolo[solo];

    // 1. Redução de erosão
    // Cada tonelada de palhada reduz erosão em aproximadamente 5%
    const reducaoErosaoPercentual = Math.min(palhada * 5, 90);
    const erosaoEvitada = (dadosSoloAtual.erosaoBase * area * reducaoErosaoPercentual / 100).toFixed(1);

    // 2. Economia de água
    // Plantio direto pode economizar até 200mm/ano de água
    const economiaAguaMm = palhada * 15 + (anos * 5);
    const economiaAguaLitros = (economiaAguaMm * area * 10000).toFixed(0); // litros

    // 3. Sequestro de carbono
    // Em média, 0.5 ton CO2/ha/ano para cada tonelada de palhada
    const sequestroCarbono = (palhada * 0.5 * area * (anos > 0 ? anos : 1)).toFixed(1);

    // 4. Aumento de produtividade
    // Até 15% de aumento após 5 anos de SPD
    const aumentoProdutividadePercentual = Math.min(anos * 3, 15);
    const produtividadeBase = dadosCultura.produtividadeMedia;
    const produtividadeComSPD = produtividadeBase * (1 + aumentoProdutividadePercentual / 100);
    const aumentoSacas = ((produtividadeComSPD - produtividadeBase) * area / 60).toFixed(0);

    // 5. Economia financeira
    // Menos combustível, menos manutenção, menos insumos
    const economiaCombustivel = area * 25; // R$/ha
    const economiaInsumos = area * 80; // R$/ha
    const economiaTotal = economiaCombustivel + economiaInsumos;
    const ganhoProdutividade = aumentoSacas * dadosCultura.preco;
    const beneficioFinanceiro = economiaTotal + parseFloat(ganhoProdutividade);

    // 6. Biodiversidade (índice de 0 a 100)
    const indiceBiodiversidade = Math.min(30 + (palhada * 3) + (anos * 2), 95);

    // 7. Saúde do solo (índice de 0 a 100)
    const indiceSaudeSolo = Math.min(40 + (palhada * 2) + (anos * 3), 98);

    return {
      erosaoEvitada,
      economiaAguaLitros,
      sequestroCarbono,
      aumentoSacas,
      aumentoProdutividadePercentual,
      beneficioFinanceiro,
      indiceBiodiversidade,
      indiceSaudeSolo,
      cultura: dadosCultura.nome,
      area
    };
  }

  // Função para exibir resultados
  function exibirResultados(dados) {
    const formatarNumero = (num) => {
      return parseFloat(num).toLocaleString('pt-BR');
    };

    resultadosDiv.innerHTML = `
      <h3>📊 Resultados da Simulação</h3>
      <p style="text-align: center; color: #28a745; font-weight: 600; margin-bottom: 20px;">
        ✅ Simulação para ${formatarNumero(dados.area)} ha de ${dados.cultura}
      </p>
      
      <div class="resultado-grid">
        <div class="resultado-item positivo">
          <h4>🌍 Erosão evitada</h4>
          <span class="valor">${formatarNumero(dados.erosaoEvitada)} ton/ano</span>
          <p class="descricao">Solo preservado graças à cobertura de palhada</p>
        </div>

        <div class="resultado-item positivo">
          <h4>💧 Economia de água</h4>
          <span class="valor">${formatarNumero(dados.economiaAguaLitros)} L</span>
          <p class="descricao">Água retida no solo por melhor infiltração</p>
        </div>

        <div class="resultado-item positivo">
          <h4>🌿 Sequestro de carbono</h4>
          <span class="valor">${formatarNumero(dados.sequestroCarbono)} ton CO₂</span>
          <p class="descricao">Contribuição para reduzir gases de efeito estufa</p>
        </div>

        <div class="resultado-item positivo">
          <h4>📈 Aumento de produtividade</h4>
          <span class="valor">+${dados.aumentoProdutividadePercentual}%</span>
          <p class="descricao">Aprox. ${formatarNumero(dados.aumentoSacas)} sacas a mais</p>
        </div>

        <div class="resultado-item positivo">
          <h4>💰 Benefício financeiro estimado</h4>
          <span class="valor">R$ ${formatarNumero(dados.beneficioFinanceiro.toFixed(0))}</span>
          <p class="descricao">Economia + aumento de produção</p>
        </div>

        <div class="resultado-item">
          <h4>🐝 Índice de biodiversidade</h4>
          <span class="valor">${dados.indiceBiodiversidade}%</span>
          <div class="barra-progresso">
            <div class="barra-progresso-fill" style="width: ${dados.indiceBiodiversidade}%; background: linear-gradient(90deg, #28a745, #20c997);"></div>
          </div>
        </div>

        <div class="resultado-item">
          <h4>🦠 Saúde do solo</h4>
          <span class="valor">${dados.indiceSaudeSolo}%</span>
          <div class="barra-progresso">
            <div class="barra-progresso-fill" style="width: ${dados.indiceSaudeSolo}%; background: linear-gradient(90deg, #8B4513, #D2691E);"></div>
          </div>
        </div>
      </div>

      <p style="text-align: center; font-size: 0.85rem; color: #777; margin-top: 20px;">
        ⚠️ Valores estimados baseados em pesquisas científicas. Resultados reais podem variar conforme condições locais.
      </p>
    `;
  }

  // Função para mostrar erro
  function mostrarErro(mensagem) {
    resultadosDiv.innerHTML = `
      <h3>📊 Resultados da Simulação</h3>
      <p style="text-align: center; color: #dc3545; font-weight: 600;">
        ❌ ${mensagem}
      </p>
    `;
  }

  // Animação suave ao scrollar para a seção
  const linksSimulador = document.querySelectorAll('a[href="#simulador"]');
  linksSimulador.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('simulador').scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

});