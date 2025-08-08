# Bullsbet Cashback Calculator

## Overview

Cashback Calculator é uma aplicação web completa que calcula cashback diário e semanal para uma plataforma de apostas. A aplicação apresenta arquitetura de arquivos separados (HTML, CSS, JS), cores da marca BullsBet, validação abrangente de jogos, e interface moderna responsiva com tema escuro e efeitos glassmorphism.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recursos Principais

### 1. Seleção de Modo de Cashback
- **Cashback Diário**: Para jogos de slots específicos com porcentagens de 2% a 25%
- **Cashback Semanal**: Para jogos de cassino ao vivo com porcentagens de 1% a 5%
- Interface de alternância com radio buttons e descrições dinâmicas

### 2. Sistema de Cálculo Inteligente
- **Cálculo em Tempo Real**: Atualiza automaticamente conforme valores são inseridos
- **Suporte a Vírgula e Ponto**: Aceita tanto "300,00" quanto "300.00" como entrada decimal
- **Recálculo Automático**: Mantém valor GGR ao trocar entre tiers de porcentagem
- **Validação de Limites**: Mínimo R$ 0,50, máximo R$ 5.000 por dia/semana

### 3. Validação de Jogos Completa
- **Modo de Apuração**: Seção dedicada para validar elegibilidade de jogos
- **Base de Dados Completa**: Lista todos os jogos válidos por provedor
- **Busca Inteligente**: Encontra jogos mesmo com nomes parciais
- **Feedback Visual**: Mostra claramente se jogo é válido ou inválido

### 4. Interface Moderna
- **Logo BullsBet**: Logo oficial da marca com animação flutuante e efeitos visuais
- **Tema Escuro**: Design moderno com efeitos glassmorphism
- **Seleção de Tier Visual**: Efeitos de seleção com brilho e destaque
- **Responsivo**: Funciona perfeitamente em desktop e mobile

## Arquitetura Técnica

### Estrutura de Arquivos
```
├── index.html          # Estrutura HTML semântica
├── styles.css          # Estilos completos com tema BullsBet
├── script.js           # Lógica JavaScript modular
├── replit.md          # Documentação do projeto
└── attached_assets/    # Assets externos (logo)
    └── Bullsbet-app_1754611804037.png
```

### Tecnologias Utilizadas
- **HTML5**: Marcação semântica com acessibilidade
- **CSS3**: Custom properties, Grid, Flexbox, animações
- **JavaScript ES6+**: Vanilla JS com event listeners modernos
- **Deployment**: Servidor HTTP Python para desenvolvimento

## Tiers de Cashback

### Cashback Diário (Slots)
| Valor GGR | Percentual | Jogos Válidos |
|-----------|------------|---------------|
| R$ 1 - R$ 299,99 | 2% | PG Soft, Red Tiger, Pragmatic Play, PopOK |
| R$ 300 - R$ 999,99 | 4% | PG Soft, Red Tiger, Pragmatic Play, PopOK |
| R$ 1.000 - R$ 4.999,99 | 6% | PG Soft, Red Tiger, Pragmatic Play, PopOK |
| R$ 5.000 - R$ 14.999,99 | 8% | PG Soft, Red Tiger, Pragmatic Play, PopOK |
| R$ 15.000 - R$ 24.999,99 | 10% | PG Soft, Red Tiger, Pragmatic Play, PopOK |
| R$ 25.000 - R$ 29.999,99 | 15% | PG Soft, Red Tiger, Pragmatic Play, PopOK |
| R$ 30.000 - R$ 39.999,99 | 20% | PG Soft, Red Tiger, Pragmatic Play, PopOK |
| R$ 40.000+ | 25% | PG Soft, Red Tiger, Pragmatic Play, PopOK |

### Cashback Semanal (Cassino Ao Vivo)
| Valor GGR | Percentual | Jogos Válidos |
|-----------|------------|---------------|
| R$ 1 - R$ 499,99 | 1% | Todos os jogos de cassino ao vivo |
| R$ 500 - R$ 999,99 | 2% | Todos os jogos de cassino ao vivo |
| R$ 1.000 - R$ 1.499,99 | 3% | Todos os jogos de cassino ao vivo |
| R$ 1.500 - R$ 4.999,99 | 4% | Todos os jogos de cassino ao vivo |
| Acima de R$ 5.000 | 5% | Todos os jogos de cassino ao vivo |

**Jogos Excluídos do Cashback Semanal**: Dragon Tiger, Double Red Dog, Slots, Crash, Cassino Virtual, Esportes, Baccarat, Bac Bo

## Base de Dados de Jogos

### Provedor PG Soft (69 jogos)
Fortune Dragon, Fortune Tiger, Fortune Ox, Fortune Mouse, Fortune Rabbit, Fortune Snake, Dragon Hatch, Dragon Hatch 2, Midas Fortune, The Great Icescape, Wild Bandito, Dragon Tiger Luck, Piggy Gold, Hood vs Wolf, Genie's 3 Wishes, Double Fortune, Bikini Paradise, Tree of Fortune, Supermarket Spree, Win Win Fish Prawn Crab, Circus Delight, Emperor's Favour, Ganesha Gold, Alchemy Gold, Mahjong Ways 2, Mahjong Ways, Captain's Bounty, Hip Hop Panda, Heist Stakes, Legend of Perseus, Muay Thai Champion, Shaolin Soccer, Phoenix Rises, Symbols of Egypt, Leprechaun Riches, Destiny of Sun and Moon, Cash Mania, Songkran Splash, Queen of Bounty, Medusa II, Medusa, Candy Bonanza, Butterfly Blossom, Guardians of Ice and Fire, Jewels of Prosperity, Rave Party Fever, Mr. Hallow-Win, Mermaid Riches, Santa's Gift Rush, Reel Love, Raider Jane's Crypt of Fortune, Majestic Treasures, Wild Fireworks, Candy Burst, Garuda Gems, Legendary Monkey King, Ninja vs Samurai, Totem Wonders, Spirited Wonders, Emoji Riches, Vampire's Charm, Plushie Frenzy, Jungle Delight, Futebol Fever, Hawaiian Tiki, Baccarat Deluxe, Mask Carnival, Legend of Hou Yi, Hotpot, Gem Saviour, Flirting Scholar, Gem Saviour Conquest, Fortune Gods, Dragon Legend, Journey to the Wealth, Wings of Iguazu, Honey Trap of Diao Chan

### Provedor Red Tiger (12 jogos)
Golden Leprechaun Megaways, Dynamite Riches Megaways, Buffalo Mania Megaways, Gems Inferno Megaways, Gonzo's Quest Megaways, Egypt Megaways, Magic Powers Megaways, Vault Cracker Megaways, What the Fox Megaways, Risqué Megaways, NFT Megaways, Jingle Ways Megaways

### Provedor Pragmatic Play (11 jogos)
888 Dragons, Big Bass Bonanza, Big Bass Splash, Gates of Olympus, Joker's Jewels, Master Joker, Ratinho Sortudo, Sweet Bonanza, Tigre Sortudo, Touro Sortudo, Macaco Sortudo

### Provedor PopOK (3 jogos)
Fortune Panda, Rico Gorila, Yo Dragon

## Design System

### Cores da Marca BullsBet
```css
--primary-color: #00E676    /* Verde vibrante */
--secondary-color: #001F2D  /* Azul escuro/preto */
--accent-color: #004B76     /* Azul intermediário */
--background: #0A1F2E       /* Tema escuro */
```

### Componentes Visuais
- **Cards Glassmorphism**: Fundo translúcido com blur effect
- **Botões com Hover**: Transformações suaves e efeitos de brilho
- **Seleção de Tier**: Destaque visual com sombra colorida
- **Animações**: Float, fade, slide para melhor UX

## Funcionalidades Implementadas

### Cálculos Matemáticos
```javascript
// Exemplo: 300 × 4% = R$ 12,00
ggrValue * (percentage / 100) = cashbackAmount
Math.min(cashbackAmount, 5000) = finalCashback
finalCashback >= 0.50 ? finalCashback : 0 = validCashback
```

### Validação de Entrada
- Aceita vírgula (300,50) e ponto (300.50)
- Converte automaticamente para número
- Valida limites mínimos e máximos por tier
- Recalcula automaticamente ao trocar tiers

### Sistema de Eventos
- Event listeners para mudança de modo
- Seleção de tier com visual feedback
- Input em tempo real com debounce
- Validação de jogos com busca parcial

## Deployment e Configuração

### Servidor de Desenvolvimento
- **Comando**: `python -m http.server 5000`
- **Porta**: 5000 (configurada para Replit)
- **Arquivos**: Servidos estaticamente
- **Assets**: Logo carregado de attached_assets/

### Estrutura de Workflows
```yaml
name: BullsBet Calculator
command: python -m http.server 5000
wait_for_port: 5000
output_type: webview
```

## Recent Changes (2025-08-08)

### Atualizações Principais
- **Logo BullsBet**: Integrado logo oficial da marca com tamanho 80x80px e efeitos visuais
- **Cálculos Corrigidos**: Sistema de cálculo funcional com recálculo automático ao trocar tiers
- **Interface Melhorada**: Visibilidade aprimorada do dropdown de provedores com fundo escuro
- **Seleção de Tier**: Efeitos visuais modernos mantendo legibilidade
- **Validação Robusta**: Sistema completo de validação de jogos com feedback visual
- **Decimal Handling**: Suporte completo a vírgula e ponto como separadores decimais
- **Debug System**: Logs detalhados para monitoramento de cálculos
- **Responsive Design**: Layout otimizado para diferentes tamanhos de tela

### Melhorias de UX
- Animação flutuante do logo com drop-shadow
- Transições suaves em todos os elementos interativos
- Feedback visual claro para ações do usuário
- Scrolling automático para resultados de cálculo
- Mensagens de erro específicas e construtivas

### Otimizações Técnicas
- Event listeners otimizados para performance
- Função de formatação de moeda brasileira
- Sistema modular de validação de jogos
- Estrutura CSS organizada com custom properties
- JavaScript ES6+ com arrow functions e template literals
