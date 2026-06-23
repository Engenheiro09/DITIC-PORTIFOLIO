/**
 * ==============================================================================================
 * SCRIPT DE COMPORTAMENTO DINÂMICO - PORTFÓLIO DITEC
 * ==============================================================================================
 */

// Garante que o interpretador dispare as automações apenas após o carregamento completo da árvore DOM
document.addEventListener("DOMContentLoaded", () => {
    
    // Inicialização das rotinas internas
    inicializarCarrosselDinamico();
    inicializarContadoresEstatisticos();
});

/**
 * MÓDULO 1: GERENCIAMENTO E CONTROLO DO CARROSSEL DE PARCEIROS
 */
function inicializarCarrosselDinamico() {
    // Captura as referências estruturais dos elementos HTML do slider
    const trilho = document.getElementById("trilhoParceiros");
    const btnAnterior = document.getElementById("btnAnterior");
    const btnProximo = document.getElementById("btnProximo");
    
    // Validação preventiva para evitar a quebra do script caso os elementos não existam na DOM
    if (!trilho || !btnAnterior || !btnProximo) return;

    // Declaração de variáveis mutáveis de controle de posicionamento e largura
    let indexAtual = 0;
    const itensVisiveis = obterQuantidadeItensVisiveis();
    const totalItens = trilho.children.length;
    const maxIndex = totalItens - itensVisiveis;

    // Escuta o evento de clique para avançar o carrossel para a direita
    btnProximo.addEventListener("click", () => {
        if (indexAtual < maxIndex) {
            indexAtual++; // Incrementa o marcador de posição
        } else {
            indexAtual = 0; // Reseta e volta ao início se atingir o limite (Loop infinito simples)
        }
        atualizarPosicaoTrilho();
    });

    // Escuta o evento de clique para retroceder o carrossel para a esquerda
    btnAnterior.addEventListener("click", () => {
        if (indexAtual > 0) {
            indexAtual--; // Decrementa o marcador de posição
        } else {
            indexAtual = maxIndex; // Salta para a última marca caso clique em voltar estando no início
        }
        atualizarPosicaoTrilho();
    });

    // Função interna responsável por aplicar a transição matemática de deslocamento horizontal
    function atualizarPosicaoTrilho() {
        const itemProporcao = trilho.children[0].getBoundingClientRect().width + 50; // Calcula largura somando o gap de 50px
        trilho.style.transform = `translateX(-${indexAtual * itemProporcao}px)`; // Desloca o trilho usando transform em pixels
    }

    // Função auxiliar adaptável responsável por mapear a quantidade de elementos conforme a largura atual da janela
    function obterQuantidadeItensVisiveis() {
        const larguraJanela = window.innerWidth;
        if (larguraJanela <= 768) return 2;  // Exibe apenas 2 marcas em telemóveis
        if (larguraJanela <= 1024) return 3; // Exibe 3 marcas em tablets
        return 5;                            // Exibe 5 marcas em telas de alta resolução padrão
    }

    // Otimização responsiva: recalcula a posição do trilho caso o utilizador mude a orientação ou tamanho da tela
    window.addEventListener("resize", () => {
        indexAtual = 0; // Reseta o ponteiro para o início para evitar quebras visuais
        atualizarPosicaoTrilho(); // Força o reposicionamento matemático imediato
    });
}

/**
 * MÓDULO 2: EXECUÇÃO DOS CONTADORES CRESCENTES DE AUTO-IMPACTO (ESTATÍSTICAS)
 */
function inicializarContadoresEstatisticos() {
    // Seleciona todos os elementos de texto que contêm os números estatísticos da DITEC
    const contadores = document.querySelectorAll(".numero-contador");
    const velocidadeContagem = 200; // Define o coeficiente de velocidade da animação incremental

    // Implementação da API IntersectionObserver para disparar os números apenas quando estiverem visíveis no ecrã
    const observadorEstatisticas = new IntersectionObserver((entradas, self) => {
        entradas.forEach(entrada => {
            // Verifica se a seção cruzou a linha de visibilidade ativa do ecrã
            if (entrada.isIntersecting) {
                const elementoAlvo = entrada.target;
                const valorFinalDesejado = +elementoAlvo.getAttribute("data-target"); // Converte o texto do atributo para inteiro nativo
                
                // Função recursiva interna de incremento fracionado
                const executarIncremento = () => {
                    const contagemAtual = +elementoAlvo.innerText;
                    const incrementoFixo = valorFinalDesejado / velocidadeContagem;

                    if (contagemAtual < valorFinalDesejado) {
                        // Faz a soma progressiva arredondando para cima para evitar casas decimais quebradas
                        elementoAlvo.innerText = Math.ceil(contagemAtual + incrementoFixo);
                        setTimeout(executarIncremento, 15); // Dispara novamente a cada 15 milissegundos
                    } else {
                        // Garante a fixação exata do valor alvo e anexa o sufixo apropriado para cada caso
                        if (valorFinalDesejado === 4 || valorFinalDesejado === 3) {
                            elementoAlvo.innerText = valorFinalDesejado + "+";
                        } else if (valorFinalDesejado === 100) {
                            elementoAlvo.innerText = valorFinalDesejado + "%";
                        } else if (valorFinalDesejado === 24) {
                            elementoAlvo.innerText = "24/7";
                        }
                    }
                };

                executarIncremento(); // Inicializa o loop matemático interno
                self.unobserve(elementoAlvo); // Desativa o observador deste elemento para não repetir a contagem desnecessariamente
            }
        });
    }, { threshold: 0.5 }); // Dispara quando pelo menos 50% da seção de contagem estiver legível no visor

    // Aplica o registro do observador individualmente para cada contador da lista mapeada
    contadores.forEach(contador => observadorEstatisticas.observe(contador));
}
// ========================================================
// CONTROLO DO CARROSSEL DINÂMICO - DITEC
// ========================================================
document.addEventListener("DOMContentLoaded", function() {
    const slides = document.querySelectorAll(".carousel-slide");
    const dots = document.querySelectorAll(".dot");
    const prevBtn = document.querySelector(".carousel-arrow.prev");
    const nextBtn = document.querySelector(".carousel-arrow.next");
    
    let currentSlide = 0;
    const slideInterval = 5000; // Tempo de rotação automática (5 segundos)
    let autoSlideTimer;

    // Função para atualizar o slide visível
    function showSlide(index) {
        // Remove a classe ativa de todos os slides e pontos
        slides[currentSlide].classList.remove("active");
        dots[currentSlide].classList.remove("active");

        // Atualiza o índice atual tratando os limites (looping)
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        // Ativa o novo slide e respetivo ponto indicador
        slides[currentSlide].classList.add("active");
        dots[currentSlide].classList.add("active");
    }

    // Função para avançar o slide automaticamente
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // Inicia o temporizador automático
    function startAutoSlide() {
        autoSlideTimer = setInterval(nextSlide, slideInterval);
    }

    // Reinicia o temporizador ao interagir manualmente (evita saltos bruscos)
    function resetTimer() {
        clearInterval(autoSlideTimer);
        startAutoSlide();
    }

    // Eventos dos botões de navegação lateral (Setas)
    nextBtn.addEventListener("click", () => {
        showSlide(currentSlide + 1);
        resetTimer();
    });

    prevBtn.addEventListener("click", () => {
        showSlide(currentSlide - 1);
        resetTimer();
    });

    // Eventos ao clicar nos Indicadores (Pontos)
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index);
            resetTimer();
        });
    });

    // Inicializa a rotação automática
    startAutoSlide();
});