// ===============================================
// EcoAgroX | JavaScript Premium - Floresta Verde
// Funcionalidades: Simulador, Quiz, Assistente, Gráfico, Temas, Acessibilidade
// Agrinho 2026 - Totalmente Conectado
// ===============================================

(function() {
    'use strict';

    // ---------- DOM Elements ----------
    const body = document.body;
    const darkModeToggle = document.getElementById('darkModeToggle');
    const increaseFontBtn = document.getElementById('increaseFont');
    const decreaseFontBtn = document.getElementById('decreaseFont');
    const readModeBtn = document.getElementById('readModeBtn');
    const calcularSimulacao = document.getElementById('calcularSimulacao');
    const areaHaInput = document.getElementById('areaHa');
    const produtividadeInput = document.getElementById('produtividade');
    const precoSacaInput = document.getElementById('precoSaca');
    const reducaoCustoInput = document.getElementById('reducaoCusto');
    const resultadoSimulacao = document.getElementById('resultadoSimulacao');
    const perguntaAssistente = document.getElementById('perguntaAssistente');
    const btnAssistente = document.getElementById('perguntarAssistente');
    const respostaAssistente = document.getElementById('respostaAssistente');
    const nextQuizBtn = document.getElementById('nextQuizBtn');
    const quizScoreSpan = document.getElementById('quizScore');
    const perguntaAtualDiv = document.getElementById('perguntaAtual');
    const opcoesQuizDiv = document.getElementById('opcoesQuiz');

    // ---------- Estado Global ----------
    let currentFontPercent = 100;
    let synth = window.speechSynthesis;
    let speaking = false;
    let currentUtterance = null;
    
    // Quiz State
    let indiceAtual = 0;
    let pontuacao = 0;
    let quizRespondido = false;
    
    // Gráfico Chart.js
    let grafico = null;
    
    // Base de conhecimento avançada do assistente
    const knowledgeBase = {
        // Palavras-chave e respostas
        herbert: ["herbert bartz", "bartz", "pai do plantio direto", "herbert"],
        rolandia: ["rolandia", "rolândia", "berço", "cidade do plantio direto"],
        beneficios: ["benefício", "vantagem", "por que usar", "vantagens", "beneficios"],
        erosao: ["erosão", "erosao", "como evitar erosão", "prevenir erosão", "solo erodindo"],
        carbono: ["carbono", "co2", "sequestro", "aquecimento global", "mudanças climáticas"],
        palha: ["palha", "palhada", "cobertura", "cobertura do solo", "restos culturais"],
        rotacao: ["rotação", "rotacao", "sucessão de culturas", "alternar culturas"],
        agua: ["água", "agua", "infiltração", "umidade do solo", "retenção hídrica"],
        produtividade: ["produtividade", "produção", "rendimento", "sacas por hectare"],
        agrinho: ["agrinho", "agrinho 2026", "tema agrinho", "programa agrinho"],
        sustentabilidade: ["sustentável", "sustentabilidade", "ecológico", "preservação"],
        solo: ["solo vivo", "saúde do solo", "matéria orgânica", "microorganismos"]
    };

    const respostasBase = {
        herbert: "🌿 <strong>Herbert Bartz</strong> é reconhecido como o 'pai do plantio direto' no Brasil. Na década de 1970, em Rolândia (PR), ele revolucionou a agricultura ao eliminar o revolvimento do solo, mantendo a palhada e promovendo a sustentabilidade. Seu legado inspira agricultores do mundo todo!",
        rolandia: "📍 <strong>Rolândia</strong>, no norte do Paraná, é considerada o berço do plantio direto brasileiro. Foi lá que Herbert Bartz iniciou seus experimentos pioneiros, transformando a cidade em referência mundial em agricultura conservacionista.",
        beneficios: "✅ <strong>Benefícios do Plantio Direto:</strong><br> • Economia de combustível (até 70%)<br> • Redução da erosão em até 90%<br> • Aumento da matéria orgânica do solo<br> • Maior infiltração de água<br> • Sequestro de carbono (2-3 ton CO₂/ha/ano)<br> • Redução de custos operacionais<br> • Solo mais saudável e produtivo",
        erosao: "♻️ <strong>Como reduzir a erosão no plantio direto:</strong><br> 1. Mantenha palhada permanente na superfície<br> 2. Faça rotação de culturas diversificada<br> 3. Utilize plantas de cobertura (braquiária, aveia, nabo)<br> 4. Evite compactação com tráfego controlado<br> 5. Construa terraços quando necessário",
        carbono: "🌍 <strong>Sequestro de Carbono:</strong> O plantio direto pode sequestrar de 2 a 3 toneladas de CO₂ por hectare por ano! Isso acontece porque o acúmulo de matéria orgânica no solo armazena carbono, combatendo o aquecimento global e melhorando a fertilidade.",
        palha: "🌾 <strong>Palhada no Plantio Direto:</strong> A palhada protege o solo contra erosão, reduz a temperatura, mantém a umidade, suprime plantas daninhas e, ao se decompor, libera nutrientes. Culturas como milho, braquiária, aveia e crotalária são excelentes para produção de palha.",
        rotacao: "🔄 <strong>Rotação de Culturas:</strong> Fundamental no plantio direto! Alternar soja, milho, trigo, feijão e plantas de cobertura: quebra ciclos de pragas, melhora a estrutura do solo, aumenta biodiversidade e otimiza nutrientes.",
        agua: "💧 <strong>Infiltração de Água:</strong> O plantio direto aumenta a infiltração de água no solo em até 300% comparado ao convencional! A palhada reduz a evaporação e a compactação, recarregando aquíferos e evitando enchentes.",
        produtividade: "📈 <strong>Produtividade no Plantio Direto:</strong> Estudos mostram que após a consolidação do sistema (3-5 anos), a produtividade se iguala ou supera o convencional, com maior estabilidade em anos de estiagem e menor custo por saca produzida.",
        agrinho: "🚜 <strong>Agrinho 2026 - Totalmente Conectado:</strong> O tema deste ano une tecnologia, sustentabilidade e inovação no campo. O EcoAgroX está alinhado com essa visão, oferecendo ferramentas digitais e conhecimento para o produtor moderno! 🌱📡",
        sustentabilidade: "🌱 <strong>Sustentabilidade no Agro:</strong> O plantio direto é um pilar da agricultura sustentável, aliando produção de alimentos com conservação ambiental. Reduz emissões, protege o solo e a água, e garante alimentos saudáveis para as futuras gerações.",
        solo: "🪴 <strong>Saúde do Solo:</strong> O solo vivo é rico em matéria orgânica, fungos e bactérias benéficas. O plantio direto promove essa vida ao não revolvê-lo, permitindo que minhocas, micorrizas e microorganismos prosperem naturalmente."
    };

    // Perguntas do Quiz (agora com mais conteúdo)
    const perguntasQuiz = [
        {
            pergunta: "🌿 Quem é considerado o 'pai do plantio direto' no Brasil?",
            opcoes: ["Herbert Bartz", "Ana Primavesi", "Evaristo de Miranda", "Alysson Paolinelli"],
            correta: 0,
            explicacao: "Herbert Bartz foi pioneiro em Rolândia (PR) na década de 1970, revolucionando a agricultura brasileira com o plantio direto."
        },
        {
            pergunta: "📍 Em qual cidade do Paraná Herbert Bartz iniciou seus experimentos?",
            opcoes: ["Londrina", "Rolândia", "Maringá", "Cascavel"],
            correta: 1,
            explicacao: "Rolândia é o berço do plantio direto brasileiro! Foi lá que Herbert Bartz começou suas experiências inovadoras."
        },
        {
            pergunta: "❌ Qual benefício NÃO está associado ao Plantio Direto?",
            opcoes: ["Redução da erosão", "Aumento da matéria orgânica", "Maior necessidade de aração", "Sequestro de carbono"],
            correta: 2,
            explicacao: "O plantio direto elimina completamente a aração, mantendo a palhada na superfície e preservando a estrutura do solo."
        },
        {
            pergunta: "🌐 Qual o tema do Agrinho 2026 apresentado no EcoAgroX?",
            opcoes: ["Conectados com o campo", "Totalmente Conectado", "Inovação Sustentável", "Agro Tech Brasil"],
            correta: 1,
            explicacao: "O tema 'Totalmente Conectado' integra sustentabilidade, tecnologia e inovação no campo, alinhado com o futuro da agricultura."
        },
        {
            pergunta: "💚 Qual o principal impacto ambiental positivo do plantio direto?",
            opcoes: ["Aumento da erosão", "Compactação do solo", "Sequestro de carbono", "Redução da biodiversidade"],
            correta: 2,
            explicacao: "O plantio direto sequestra de 2 a 3 toneladas de CO₂ por hectare ao ano, combatendo as mudanças climáticas!"
        },
        {
            pergunta: "🌾 Qual o papel da palhada no sistema plantio direto?",
            opcoes: ["Adubação química", "Proteger o solo contra erosão", "Aumentar compactação", "Reduzir produtividade"],
            correta: 1,
            explicacao: "A palhada protege o solo do impacto das chuvas, reduz erosão, mantém umidade e fornece nutrientes na decomposição."
        },
        {
            pergunta: "🚜 O plantio direto foi consolidado no Paraná em qual década?",
            opcoes: ["1950", "1960", "1970", "1980"],
            correta: 2,
            explicacao: "A partir dos anos 1970, com os experimentos de Herbert Bartz e de outros pioneiros, o sistema se consolidou no Paraná."
        }
    ];

    // ---------- Helper: Toast Notifications ----------
    function showToastMessage(message, isError = false, duration = 3000) {
        const toast = document.createElement('div');
        toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i> ${message}`;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: ${isError ? 'linear-gradient(135deg, #c0392b, #e74c3c)' : 'linear-gradient(135deg, var(--verde-jardim), var(--verde-esmeralda))'};
            color: white;
            padding: 14px 28px;
            border-radius: 60px;
            font-weight: 600;
            font-size: 0.9rem;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            font-family: 'Inter', sans-serif;
            animation: slideUpToast 0.3s ease;
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // Adicionar animação CSS para toast
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUpToast {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // ---------- Modo Claro/Escuro ----------
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark');
        }
        updateChartTheme();
    }
    
    function toggleDarkMode() {
        body.classList.toggle('dark');
        const isDark = body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateChartTheme();
        showToastMessage(isDark ? '🌙 Modo noturno ativado - Mata Atlântica' : '☀️ Modo claro ativado - Floresta Tropical');
    }
    
    // ---------- Ajuste de Fonte (Acessibilidade) ----------
    function setFontSize(percent) {
        document.documentElement.style.fontSize = percent + '%';
        currentFontPercent = percent;
        localStorage.setItem('fontSize', percent);
    }
    
    function increaseFont() {
        if (currentFontPercent < 130) {
            setFontSize(currentFontPercent + 10);
            showToastMessage(`🔤 Fonte aumentada para ${currentFontPercent}%`);
        } else {
            showToastMessage('📏 Tamanho máximo atingido', true);
        }
    }
    
    function decreaseFont() {
        if (currentFontPercent > 80) {
            setFontSize(currentFontPercent - 10);
            showToastMessage(`🔤 Fonte reduzida para ${currentFontPercent}%`);
        } else {
            showToastMessage('📏 Tamanho mínimo atingido', true);
        }
    }
    
    function initFontSize() {
        const savedFont = localStorage.getItem('fontSize');
        if (savedFont) {
            setFontSize(parseInt(savedFont));
        } else {
            setFontSize(100);
        }
    }
    
    // ---------- Leitor de Texto Melhorado ----------
    function stopReading() {
        if (synth.speaking || synth.pending) {
            synth.cancel();
            speaking = false;
        }
    }
    
    function readText(text) {
        stopReading();
        if (!text || text.trim().length === 0) return;
        
        // Limpar texto de HTML
        const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1;
        
        utterance.onstart = () => {
            speaking = true;
            showToastMessage('🔊 Leitura em andamento...');
        };
        utterance.onend = () => {
            speaking = false;
            showToastMessage('✅ Leitura finalizada');
        };
        utterance.onerror = () => {
            speaking = false;
            console.warn('Erro na leitura');
        };
        
        currentUtterance = utterance;
        synth.speak(utterance);
    }
    
    function readPageContent() {
        let content = '';
        const mainCards = document.querySelectorAll('.card');
        mainCards.forEach((card, idx) => {
            if (idx < 4) {
                const text = card.innerText.substring(0, 800);
                content += text + '. ';
            }
        });
        const introText = 'Bem-vindo ao EcoAgroX. Agricultura sustentável, plantio direto e inovação para o campo. ';
        readText(introText + content);
    }
    
    // ---------- Simulador Avançado com Cálculo de Carbono e Sustentabilidade ----------
    function calcularBeneficioEco() {
        let area = parseFloat(areaHaInput.value);
        let produtividade = parseFloat(produtividadeInput.value);
        let precoSaca = parseFloat(precoSacaInput.value);
        let reducaoCusto = parseFloat(reducaoCustoInput.value);
        
        // Validações
        if (isNaN(area) || area <= 0) {
            showToastMessage('⚠️ Por favor, informe uma área válida (hectares)', true);
            return;
        }
        if (isNaN(produtividade) || produtividade <= 0) {
            showToastMessage('⚠️ Por favor, informe a produtividade válida (sacas/ha)', true);
            return;
        }
        if (isNaN(precoSaca) || precoSaca <= 0) {
            showToastMessage('⚠️ Por favor, informe o preço por saca válido', true);
            return;
        }
        if (isNaN(reducaoCusto) || reducaoCusto < 0 || reducaoCusto > 100) {
            showToastMessage('⚠️ Redução de custo deve estar entre 0 e 100%', true);
            return;
        }
        
        // Cálculos detalhados
        const producaoTotalSacas = area * produtividade;
        const receitaBruta = producaoTotalSacas * precoSaca;
        
        // Custos referenciais (base 2024/2025)
        const custoConvencionalHa = 1950;
        const economiaPorHa = (custoConvencionalHa * reducaoCusto) / 100;
        const economiaTotal = economiaPorHa * area;
        const custoDiretoTotal = (custoConvencionalHa * area) - economiaTotal;
        const lucroLiquido = receitaBruta - custoDiretoTotal;
        
        // Benefícios ambientais
        const carbonoSequestradoTon = area * 2.7; // 2.7 ton CO2/ha/ano
        const aguaEconomizadaM3 = area * 450; // 450 m³ de água por hectare economizada
        const erosaoReduzidaTon = area * 12; // 12 ton de solo poupadas por hectare
        
        // Valor de mercado do carbono (créditos)
        const valorCreditoCarbono = carbonoSequestradoTon * 48; // ~R$ 48 por tonelada de CO2
        
        // Resultado formatado
        resultadoSimulacao.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                <i class="fas fa-leaf" style="font-size: 2rem; color: var(--verde-limao);"></i>
                <strong style="font-size: 1.2rem;">🌱 RESULTADO ECOAGROX</strong>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                <div><i class="fas fa-chart-line"></i> <strong>Produção total:</strong><br> ${producaoTotalSacas.toFixed(0)} sacas</div>
                <div><i class="fas fa-dollar-sign"></i> <strong>Receita bruta:</strong><br> R$ ${receitaBruta.toFixed(2).replace('.', ',')}</div>
                <div><i class="fas fa-coins"></i> <strong>Economia total:</strong><br> R$ ${economiaTotal.toFixed(2).replace('.', ',')}</div>
                <div><i class="fas fa-tractor"></i> <strong>Lucro estimado:</strong><br> R$ ${lucroLiquido.toFixed(2).replace('.', ',')}</div>
                <div><i class="fas fa-cloud-sun"></i> <strong>Carbono sequestrado:</strong><br> ${carbonoSequestradoTon.toFixed(1)} ton CO₂</div>
                <div><i class="fas fa-tint"></i> <strong>Água economizada:</strong><br> ${aguaEconomizadaM3.toFixed(0)} m³</div>
                <div><i class="fas fa-mountain"></i> <strong>Solo preservado:</strong><br> ${erosaoReduzidaTon.toFixed(0)} ton</div>
                <div><i class="fas fa-coins"></i> <strong>Crédito carbono:</strong><br> R$ ${valorCreditoCarbono.toFixed(2).replace('.', ',')}</div>
            </div>
            <div style="margin-top: 16px; padding: 12px; background: rgba(111, 191, 76, 0.15); border-radius: 20px; text-align: center;">
                <i class="fas fa-recycle"></i> <strong>Impacto positivo:</strong> Sua área está contribuindo ativamente para um futuro sustentável! 🌎
            </div>
        `;
        
        // Atualizar gráfico
        updateChartWithSimulation(reducaoCusto, area);
        showToastMessage('✅ Simulação atualizada com sucesso!');
    }
    
    // ---------- Gráfico Chart.js ----------
    function initChart() {
        const ctx = document.getElementById('meuGrafico').getContext('2d');
        grafico = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Custo (R$/ha)', 'Carbono (t/ha)', 'Água (m³/ha)', 'Economia (R$/ha)'],
                datasets: [
                    {
                        label: '🌿 Plantio Direto',
                        data: [1280, 2.8, 520, 580],
                        backgroundColor: '#2d8c4a',
                        borderRadius: 12,
                        barPercentage: 0.65,
                    },
                    {
                        label: '🚜 Convencional',
                        data: [1950, 0.8, 180, 0],
                        backgroundColor: '#c97e2a',
                        borderRadius: 12,
                        barPercentage: 0.65,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { size: 12, weight: 'bold' },
                            color: getComputedStyle(document.body).getPropertyValue('--text-primary'),
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        titleColor: '#fff',
                        bodyColor: '#ddd',
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                let value = context.raw;
                                if (context.datasetIndex === 0 && context.dataIndex === 1) {
                                    return `${label}: ${value} ton CO₂`;
                                }
                                if (context.datasetIndex === 0 && context.dataIndex === 2) {
                                    return `${label}: ${value} m³`;
                                }
                                return `${label}: R$ ${value}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,0.08)' },
                        ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-secondary') }
                    },
                    x: {
                        ticks: { color: getComputedStyle(document.body).getPropertyValue('--text-primary') }
                    }
                }
            }
        });
    }
    
    function updateChartWithSimulation(reducaoPercent, areaHa) {
        if (!grafico) return;
        const custoPD = 1950 * (1 - reducaoPercent / 100);
        const economiaPD = 1950 - custoPD;
        const carbonoPD = 2.8;
        const aguaPD = 520;
        
        grafico.data.datasets[0].data = [custoPD, carbonoPD, aguaPD, economiaPD];
        grafico.data.datasets[1].data = [1950, 0.8, 180, 0];
        grafico.update();
    }
    
    function updateChartTheme() {
        if (!grafico) return;
        const textColor = getComputedStyle(document.body).getPropertyValue('--text-primary');
        const gridColor = getComputedStyle(document.body).getPropertyValue('--border');
        grafico.options.scales.y.ticks.color = textColor;
        grafico.options.scales.x.ticks.color = textColor;
        grafico.options.plugins.legend.labels.color = textColor;
        grafico.update();
    }
    
    // ---------- Assistente Agro Inteligente (IA Simplificada) ----------
    function assistenteResposta(pergunta) {
        const p = pergunta.toLowerCase().trim();
        
        // Verificar correspondência com palavras-chave
        for (const [key, keywords] of Object.entries(knowledgeBase)) {
            for (const keyword of keywords) {
                if (p.includes(keyword)) {
                    return respostasBase[key] || respostasBase.beneficios;
                }
            }
        }
        
        // Respostas específicas para perguntas comuns
        if (p.includes('como funciona') || p.includes('o que é plantio direto')) {
            return "🌱 <strong>O que é Plantio Direto?</strong><br>É um sistema de cultivo que não revolve o solo, mantendo a palhada da cultura anterior na superfície. Isso protege contra erosão, aumenta matéria orgânica, economiza água e reduz custos! É a base da agricultura sustentável moderna.";
        }
        
        if (p.includes('diferença') || p.includes('convencional')) {
            return "🔄 <strong>Diferença entre Plantio Direto e Convencional:</strong><br>• Convencional: aração + gradagem → solo exposto, erosão, alto custo<br>• Plantio Direto: sem revolvimento → solo coberto, sustentável, econômico";
        }
        
        if (p.includes('olá') || p.includes('oi') || p.includes('bom dia')) {
            return "🌞 Olá! Seja bem-vindo(a) ao EcoAgroX! Estou aqui para ajudar com suas dúvidas sobre plantio direto, sustentabilidade, Herbert Bartz e muito mais. O que gostaria de saber?";
        }
        
        if (p.includes('obrigado') || p.includes('valeu')) {
            return "🙏 Por nada! Estou aqui para ajudar a construir um agro mais sustentável. Continue conectado com a natureza! 🌿";
        }
        
        return "💡 <strong>Dica EcoAgroX:</strong> O plantio direto é uma técnica revolucionária que preserva o solo, sequestra carbono e aumenta a rentabilidade. Experimente nosso simulador para ver os ganhos! Pergunte-me sobre: Herbert Bartz, Rolândia, benefícios, erosão, carbono, palhada ou rotação de culturas.";
    }
    
    function handleAssistente() {
        let pergunta = perguntaAssistente.value.trim();
        if (!pergunta) {
            respostaAssistente.innerHTML = "🤔 <strong>Digite sua pergunta</strong><br>Exemplos: 'Quem foi Herbert Bartz?', 'Benefícios do plantio direto', 'Como reduzir erosão?'";
            return;
        }
        
        // Mostrar indicador de carregamento
        respostaAssistente.innerHTML = "🌱 <em>Processando sua pergunta...</em>";
        
        setTimeout(() => {
            const resposta = assistenteResposta(pergunta);
            respostaAssistente.innerHTML = `🤖 ${resposta}`;
            
            // Perguntar se quer ouvir a resposta
            if (confirm('Deseja ouvir a resposta em voz alta?')) {
                readText(resposta.replace(/<[^>]*>/g, ' '));
            }
        }, 300);
        
        perguntaAssistente.value = '';
    }
    
    // ---------- Quiz Gamificado com Animações ----------
    function carregarPergunta() {
        const q = perguntasQuiz[indiceAtual];
        perguntaAtualDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <span style="background: var(--verde-esmeralda); color: white; padding: 6px 16px; border-radius: 60px;">
                    <i class="fas fa-question-circle"></i> Questão ${indiceAtual+1}/${perguntasQuiz.length}
                </span>
            </div>
            <div style="font-size: 1.2rem; font-weight: 600; margin-top: 8px;">
                ${q.pergunta}
            </div>
        `;
        
        opcoesQuizDiv.innerHTML = '';
        
        q.opcoes.forEach((opcao, idx) => {
            const optDiv = document.createElement('div');
            optDiv.className = 'quiz-option';
            optDiv.innerHTML = `<i class="far fa-circle"></i> ${opcao}`;
            optDiv.setAttribute('data-index', idx);
            optDiv.addEventListener('click', () => responderQuiz(idx, optDiv));
            opcoesQuizDiv.appendChild(optDiv);
        });
        
        quizRespondido = false;
        
        // Remover feedback anterior
        const oldFeedback = document.querySelector('.quiz-feedback');
        if (oldFeedback) oldFeedback.remove();
    }
    
    function responderQuiz(idxSelecionada, elemento) {
        if (quizRespondido) {
            showToastMessage('Você já respondeu esta pergunta!', true);
            return;
        }
        
        const perguntaAtualObj = perguntasQuiz[indiceAtual];
        const isCorrect = (idxSelecionada === perguntaAtualObj.correta);
        
        if (isCorrect) {
            pontuacao += 10;
            elemento.style.background = "linear-gradient(135deg, #2d8c4a, #1b6b3c)";
            elemento.style.color = "white";
            elemento.style.borderColor = "#2d8c4a";
            mostrarFeedbackQuiz(`✅ <strong>Correto!</strong> +10 pontos<br>📚 ${perguntaAtualObj.explicacao}`, false);
            criarConfete();
        } else {
            elemento.style.background = "linear-gradient(135deg, #b91c1c, #991b1b)";
            elemento.style.color = "white";
            const respostaCorretaTexto = perguntaAtualObj.opcoes[perguntaAtualObj.correta];
            mostrarFeedbackQuiz(`❌ <strong>Errado!</strong><br>Resposta correta: ${respostaCorretaTexto}<br>📚 ${perguntaAtualObj.explicacao}`, true);
        }
        
        quizRespondido = true;
        atualizarPontuacaoDisplay();
        desabilitarOpcoesQuiz();
        
        if (isCorrect) {
            showToastMessage('🎉 +10 pontos! Parabéns!');
        }
    }
    
    function mostrarFeedbackQuiz(mensagem, isError) {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'quiz-feedback';
        feedbackDiv.style.marginTop = '16px';
        feedbackDiv.style.padding = '16px 20px';
        feedbackDiv.style.borderRadius = '24px';
        feedbackDiv.style.background = isError ? 'rgba(185, 28, 28, 0.15)' : 'rgba(45, 140, 74, 0.15)';
        feedbackDiv.style.borderLeft = `4px solid ${isError ? '#b91c1c' : '#2d8c4a'}`;
        feedbackDiv.innerHTML = mensagem;
        
        const quizContainer = document.getElementById('quizContainer');
        const oldFeed = quizContainer.querySelector('.quiz-feedback');
        if (oldFeed) oldFeed.remove();
        quizContainer.appendChild(feedbackDiv);
        
        setTimeout(() => {
            if (feedbackDiv) feedbackDiv.style.opacity = '0';
            setTimeout(() => feedbackDiv.remove(), 500);
        }, 4000);
    }
    
    function desabilitarOpcoesQuiz() {
        const opts = document.querySelectorAll('.quiz-option');
        opts.forEach(opt => opt.style.pointerEvents = 'none');
    }
    
    function habilitarOpcoesQuiz() {
        const opts = document.querySelectorAll('.quiz-option');
        opts.forEach(opt => {
            opt.style.pointerEvents = 'auto';
            opt.style.background = '';
            opt.style.color = '';
            opt.style.borderColor = '';
        });
    }
    
    function atualizarPontuacaoDisplay() {
        quizScoreSpan.innerHTML = `🏆 Pontuação: ${pontuacao}`;
    }
    
    function proximaPergunta() {
        if (!quizRespondido && indiceAtual < perguntasQuiz.length) {
            showToastMessage('Responda a pergunta atual antes de continuar!', true);
            return;
        }
        
        if (indiceAtual + 1 < perguntasQuiz.length) {
            indiceAtual++;
            carregarPergunta();
            habilitarOpcoesQuiz();
        } else {
            const totalMax = perguntasQuiz.length * 10;
            let mensagemFinal = '';
            let emoji = '';
            
            if (pontuacao === totalMax) {
                mensagemFinal = "🏆 PERFEITO! Você é um especialista em Agro sustentável!";
                emoji = "🌟🌟🌟";
            } else if (pontuacao >= totalMax * 0.7) {
                mensagemFinal = "📚 Muito bom! Você tem ótimo conhecimento sobre plantio direto!";
                emoji = "🌱🌱";
            } else if (pontuacao >= totalMax * 0.5) {
                mensagemFinal = "👍 Bom trabalho! Continue aprendendo sobre sustentabilidade!";
                emoji = "🌿";
            } else {
                mensagemFinal = "💪 Continue estudando! O plantio direto é fascinante e essencial para o futuro.";
                emoji = "📖";
            }
            
            showToastMessage(`🎉 Quiz finalizado! ${mensagemFinal} Pontuação: ${pontuacao}/${totalMax} ${emoji}`);
            
            // Reiniciar quiz
            indiceAtual = 0;
            pontuacao = 0;
            atualizarPontuacaoDisplay();
            carregarPergunta();
            habilitarOpcoesQuiz();
        }
    }
    
    function criarConfete() {
        const colors = ['#2d8c4a', '#6fbf4c', '#d4a373', '#4caf50', '#8bc34a'];
        for (let i = 0; i < 30; i++) {
            const confete = document.createElement('div');
            confete.innerHTML = ['🌿', '🍃', '🌱', '✨', '⭐', '🌾'][Math.floor(Math.random() * 6)];
            confete.style.position = 'fixed';
            confete.style.left = Math.random() * 100 + '%';
            confete.style.top = '-