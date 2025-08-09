// BullsBet Cashback Calculator - JavaScript
// Modern Tier Selection Interface
// Data: 2025-08-09 (fix validação de jogos + cálculo mantido)

// ======== Estado Global ========
let currentMode = 'daily';
let selectedTier = null;

// ======== Bases de Dados ========
const VALID_GAMES = {
  'PG Soft': [
    'Fortune Dragon','Fortune Tiger','Fortune Ox','Fortune Mouse','Fortune Rabbit',
    'Fortune Snake','Dragon Hatch','Dragon Hatch 2','Midas Fortune','The Great Icescape',
    'Wild Bandito','Dragon Tiger Luck','Piggy Gold','Hood vs Wolf',"Genie's 3 Wishes",
    'Double Fortune','Bikini Paradise','Tree of Fortune','Supermarket Spree',
    'Win Win Fish Prawn Crab','Circus Delight',"Emperor's Favour",'Ganesha Gold',
    'Alchemy Gold','Mahjong Ways 2','Mahjong Ways',"Captain's Bounty",'Hip Hop Panda',
    'Heist Stakes','Legend of Perseus','Muay Thai Champion','Shaolin Soccer','Phoenix Rises',
    'Symbols of Egypt','Leprechaun Riches','Destiny of Sun and Moon','Cash Mania',
    'Songkran Splash','Queen of Bounty','Medusa II','Medusa','Candy Bonanza',
    'Butterfly Blossom','Guardians of Ice and Fire','Jewels of Prosperity','Rave Party Fever',
    "Mr. Hallow-Win",'Mermaid Riches',"Santa's Gift Rush",'Reel Love',
    "Raider Jane's Crypt of Fortune",'Majestic Treasures','Wild Fireworks','Candy Burst',
    'Garuda Gems','Legendary Monkey King','Ninja vs Samurai','Totem Wonders',
    'Spirited Wonders','Emoji Riches',"Vampire's Charm",'Plushie Frenzy','Jungle Delight',
    'Futebol Fever','Hawaiian Tiki','Baccarat Deluxe','Mask Carnival','Legend of Hou Yi',
    'Hotpot','Gem Saviour','Flirting Scholar','Gem Saviour Conquest','Fortune Gods',
    'Dragon Legend','Journey to the Wealth','Wings of Iguazu','Honey Trap of Diao Chan'
  ],
  'Red Tiger': [
    'Golden Leprechaun Megaways','Dynamite Riches Megaways','Buffalo Mania Megaways',
    'Gems Inferno Megaways',"Gonzo's Quest Megaways",'Egypt Megaways','Magic Powers Megaways',
    'Vault Cracker Megaways','What the Fox Megaways','Risqué Megaways','NFT Megaways',
    'Jingle Ways Megaways'
  ],
  'Pragmatic Play': [
    '888 Dragons','Big Bass Bonanza','Big Bass Splash','Gates of Olympus',"Joker's Jewels",
    'Master Joker','Ratinho Sortudo','Sweet Bonanza','Tigre Sortudo','Touro Sortudo',
    'Macaco Sortudo'
  ],
  'PopOK': ['Fortune Panda','Rico Gorila','Yo Dragon']
};

const WEEKLY_EXCLUDED_GAMES = [
  'Dragon Tiger','Double Red Dog','Slots','Crash','Cassino Virtual','Esportes','Baccarat','Bac Bo'
];

const DAILY_TIERS = [
  { min: 1, max: 299.99, percentage: 2 },
  { min: 300, max: 999.99, percentage: 4 },
  { min: 1000, max: 4999.99, percentage: 6 },
  { min: 5000, max: 14999.99, percentage: 8 },
  { min: 15000, max: 24999.99, percentage: 10 },
  { min: 25000, max: 29999.99, percentage: 15 },
  { min: 30000, max: 39999.99, percentage: 20 },
  { min: 40000, max: Infinity, percentage: 25 }
];

const WEEKLY_TIERS = [
  { min: 1, max: 499.99, percentage: 1 },
  { min: 500, max: 999.99, percentage: 2 },
  { min: 1000, max: 1499.99, percentage: 3 },
  { min: 1500, max: 4999.99, percentage: 4 },
  { min: 5000, max: Infinity, percentage: 5 }
];

// ======== Utils ========
function formatCurrency(amount) {
  return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Parser robusto para números no padrão BR (aceita "20", "20,5", "20.5", "1.234,56")
function parseBRNumber(raw) {
  if (raw == null) return NaN;
  let str = String(raw).trim();
  if (str === '' && typeof raw !== 'number') return NaN;

  // Mantém dígitos, vírgula, ponto e sinal
  str = str.replace(/[^\d.,-]/g, '');

  const hasComma = str.includes(',');
  const hasDot = str.includes('.');

  if (hasComma && hasDot) {
    // "1.234,56" -> "1234.56"
    str = str.replace(/\./g, '').replace(',', '.');
  } else if (hasComma && !hasDot) {
    // "20,50" -> "20.50"
    str = str.replace(',', '.');
  }
  const num = parseFloat(str);
  return Number.isFinite(num) ? num : NaN;
}

function getGgrValue() {
  const ggrInput = document.getElementById('ggrValue');
  if (!ggrInput) return 0;

  let val = Number.isFinite(ggrInput.valueAsNumber) ? ggrInput.valueAsNumber : NaN;
  if (!Number.isFinite(val)) val = parseBRNumber(ggrInput.value);

  return Number.isFinite(val) ? val : 0;
}

function findCorrectTier(ggrValue, mode = currentMode) {
  const tiers = mode === 'daily' ? DAILY_TIERS : WEEKLY_TIERS;
  // Permite valores entre 0 e 1 caírem no menor tier
  if (ggrValue > 0 && ggrValue < tiers[0].min) return tiers[0];
  return tiers.find(tier => ggrValue >= tier.min && ggrValue <= tier.max);
}

// Normaliza texto para matching (casefold + sem acento/apóstrofo)
function normalizeText(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')                    // separa acentos
    .replace(/[\u0300-\u036f]/g, '')    // remove acentos
    .replace(/['’`´]/g, '')             // remove apóstrofos/acentos soltos
    .replace(/\s+/g, ' ')               // colapsa espaços
    .trim();
}

// ======== Inicialização ========
document.addEventListener('DOMContentLoaded', () => {
  initToggle();
  initTierSelection();
  initGameValidationBindings(); // <— NOVO: garante Enter/alteração de provedor
  updateTierDisplay();
});

// ======== Toggle Diário/Semanal ========
function initToggle() {
  const toggleOptions = document.querySelectorAll('.toggle-option');
  const dailyRadio = document.getElementById('dailyMode');
  const weeklyRadio = document.getElementById('weeklyMode');

  toggleOptions.forEach(option => {
    option.addEventListener('click', function () {
      const radio = this.querySelector('input[type="radio"]');
      if (!radio) return;
      radio.checked = true;
      currentMode = radio.value;
      updateToggleVisual();
      updateTierDisplay();
      resetTierSelection();
    });
  });

  if (dailyRadio) {
    dailyRadio.checked = true;
    dailyRadio.addEventListener('change', function () {
      if (this.checked) {
        currentMode = 'daily';
        updateToggleVisual();
        updateTierDisplay();
        resetTierSelection();
      }
    });
  }

  if (weeklyRadio) {
    weeklyRadio.addEventListener('change', function () {
      if (this.checked) {
        currentMode = 'weekly';
        updateToggleVisual();
        updateTierDisplay();
        resetTierSelection();
      }
    });
  }

  updateToggleVisual();
  updateTierDisplay();
}

function updateToggleVisual() {
  const dailyOption = document.querySelector('label[for="dailyMode"]');
  const weeklyOption = document.querySelector('label[for="weeklyMode"]');
  if (currentMode === 'daily') {
    dailyOption?.classList.add('active');
    weeklyOption?.classList.remove('active');
  } else {
    dailyOption?.classList.remove('active');
    weeklyOption?.classList.add('active');
  }
}

function updateTierDisplay() {
  const dailyTierSelector = document.getElementById('dailyTierSelector');
  const weeklyTierSelector = document.getElementById('weeklyTierSelector');
  const dailyDescription = document.getElementById('dailyDescription');
  const weeklyDescription = document.getElementById('weeklyDescription');

  if (currentMode === 'daily') {
    dailyTierSelector.style.display = 'block';
    weeklyTierSelector.style.display = 'none';
    dailyDescription.classList.add('active');
    weeklyDescription.classList.remove('active');
  } else {
    dailyTierSelector.style.display = 'none';
    weeklyTierSelector.style.display = 'block';
    dailyDescription.classList.remove('active');
    weeklyDescription.classList.add('active');
  }
  updateGameValidationMode();
}

// ======== Seleção de Tier ========
function initTierSelection() {
  const tierOptions = document.querySelectorAll('.tier-option');
  const ggrInput = document.getElementById('ggrValue');

  tierOptions.forEach(option => {
    option.addEventListener('click', function () {
      selectTier(this);
    });
  });

  if (ggrInput) {
    ['input', 'keyup', 'change'].forEach(evt =>
      ggrInput.addEventListener(evt, () => {
        autoReallocateTier();
      })
    );
  }
}

function selectTier(tierElement) {
  document.querySelectorAll('.tier-option').forEach(t => t.classList.remove('selected'));
  tierElement.classList.add('selected');

  selectedTier = {
    percentage: parseFloat(tierElement.dataset.tier),
    minValue: parseFloat(tierElement.dataset.min),
    maxValue: parseFloat(tierElement.dataset.max)
  };

  const ggrSection = document.getElementById('ggrInputSection');
  ggrSection.style.display = 'block';
  updateInputHints();
  calculateTierCashback();

  setTimeout(() => ggrSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 300);
}

function updateInputHints() {
  if (!selectedTier) return;
  const minValueSpan = document.getElementById('minValue');
  const maxValueSpan = document.getElementById('maxValue');

  if (minValueSpan && maxValueSpan) {
    minValueSpan.textContent = 'R$ ' + formatCurrency(selectedTier.minValue);
    maxValueSpan.textContent =
      selectedTier.maxValue >= 999999 ? 'sem limite' : 'R$ ' + formatCurrency(selectedTier.maxValue);
  }
}

// ======== Regras de Cálculo ========
function autoReallocateTier() {
  const ggrValue = getGgrValue();

  if (!ggrValue || ggrValue <= 0) {
    hideCalculationResult();
    return;
  }

  const correctTier = findCorrectTier(ggrValue);
  if (!correctTier) {
    hideCalculationResult();
    return;
  }

  const tierSelector = currentMode === 'daily' ? '#dailyTierSelector' : '#weeklyTierSelector';
  const tierElement = document.querySelector(
    `${tierSelector} .tier-option[data-tier="${correctTier.percentage}"]`
  );

  const currentlySelected = document.querySelector(`${tierSelector} .tier-option.selected`);
  const isNewTier = !currentlySelected || currentlySelected !== tierElement;

  if (tierElement && isNewTier) {
    showTierReallocationNotification(correctTier.percentage, ggrValue);
    selectTierByElement(tierElement);
  } else {
    calculateTierCashback();
  }
}

function calculateTierCashback() {
  if (!selectedTier) {
    hideCalculationResult();
    return;
  }

  const ggrValue = getGgrValue();
  if (!ggrValue || ggrValue <= 0) {
    hideCalculationResult();
    return;
  }

  clearValidationError();

  const cashbackMultiplier = selectedTier.percentage / 100;
  const cashbackAmount = ggrValue * cashbackMultiplier;

  const maxCashback = 5000; // teto diário/semanal
  const finalCashback = Math.min(cashbackAmount, maxCashback);

  // Sem mínimo — exibir qualquer valor positivo
  const validCashback = finalCashback;

  showCalculationResult(ggrValue, selectedTier.percentage, validCashback);

  console.log(`Calculation: ${ggrValue} × ${selectedTier.percentage}% = R$ ${validCashback.toFixed(2)}`);
}

function selectTierByElement(tierElement) {
  document.querySelectorAll('.tier-option').forEach(t => t.classList.remove('selected'));
  tierElement.classList.add('selected');

  selectedTier = {
    percentage: parseFloat(tierElement.dataset.tier),
    minValue: parseFloat(tierElement.dataset.min),
    maxValue: parseFloat(tierElement.dataset.max)
  };

  const ggrSection = document.getElementById('ggrInputSection');
  ggrSection.style.display = 'block';
  updateInputHints();
  calculateTierCashback();
}

function showTierReallocationNotification(newPercentage, ggrValue) {
  const existing = document.querySelector('.tier-reallocation-notification');
  if (existing) existing.remove();

  const n = document.createElement('div');
  n.className = 'tier-reallocation-notification';
  n.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">🔄</span>
      <span class="notification-text">
        Tier automaticamente ajustado para <strong>${newPercentage}%</strong>
        baseado no valor GGR de <strong>R$ ${formatCurrency(ggrValue)}</strong>
      </span>
    </div>
  `;

  const currentTierSelector = document.getElementById(
    currentMode === 'daily' ? 'dailyTierSelector' : 'weeklyTierSelector'
  );
  if (currentTierSelector) {
    currentTierSelector.parentNode.insertBefore(n, currentTierSelector);
    setTimeout(() => {
      n.style.opacity = '0';
      setTimeout(() => n.remove(), 300);
    }, 4000);
  }
}

function showCalculationResult(ggr, percentage, cashback) {
  const resultSection = document.getElementById('calculationResult');
  const resultValue = document.getElementById('resultValue');
  const resultGGR = document.getElementById('resultGGR');
  const resultPercentage = document.getElementById('resultPercentage');
  const resultCashback = document.getElementById('resultCashback');

  if (!resultSection) return;

  if (resultValue) resultValue.textContent = 'R$ ' + formatCurrency(cashback);
  if (resultGGR) resultGGR.textContent = 'R$ ' + formatCurrency(ggr);
  if (resultPercentage) resultPercentage.textContent = percentage + '%';
  if (resultCashback) resultCashback.textContent = 'R$ ' + formatCurrency(cashback);

  resultSection.style.display = 'block';
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  console.log('Result displayed successfully');
}

function hideCalculationResult() {
  const resultSection = document.getElementById('calculationResult');
  if (resultSection) resultSection.style.display = 'none';
}

function showValidationError() {
  const ggrInput = document.getElementById('ggrValue');
  const hint = document.getElementById('inputHint');

  if (ggrInput) ggrInput.style.borderColor = '#ff4757';
  if (hint && selectedTier) {
    hint.style.color = '#ff4757';
    hint.innerHTML = `⚠️ Valor deve estar entre <span>R$ ${formatCurrency(selectedTier.minValue)}</span> e <span>${
      selectedTier.maxValue >= 999999 ? 'sem limite' : 'R$ ' + formatCurrency(selectedTier.maxValue)
    }</span>`;
  }
  hideCalculationResult();
}

function clearValidationError() {
  const ggrInput = document.getElementById('ggrValue');
  const hint = document.getElementById('inputHint');
  if (ggrInput) ggrInput.style.borderColor = '';
  if (hint) {
    hint.style.color = '';
    updateInputHints();
  }
}

function resetTierSelection() {
  document.querySelectorAll('.tier-option').forEach(t => t.classList.remove('selected'));
  selectedTier = null;

  const ggrSection = document.getElementById('ggrInputSection');
  if (ggrSection) ggrSection.style.display = 'none';

  const ggrInput = document.getElementById('ggrValue');
  if (ggrInput) ggrInput.value = '';

  clearValidationError();
}

// ======== Validação de Jogos ========
function updateGameValidationMode() {
  const providerSelect = document.getElementById('gameProviderSelect');
  const gameInput = document.getElementById('gameNameInput');
  const validationResult = document.getElementById('validationResult');

  if (currentMode === 'daily') {
    if (providerSelect) providerSelect.disabled = false;
    if (gameInput) gameInput.placeholder = 'Digite o nome do jogo para cashback diário...';
  } else {
    if (providerSelect) {
      providerSelect.disabled = true;
      providerSelect.value = '';
    }
    if (gameInput) gameInput.placeholder = 'Digite o nome do jogo para cashback semanal...';
  }
  if (validationResult) validationResult.style.display = 'none';
}

// Ligações de eventos para validação (Enter/alteração de provedor)
function initGameValidationBindings() {
  const gameInput = document.getElementById('gameNameInput');
  const providerSelect = document.getElementById('gameProviderSelect');

  if (gameInput) {
    gameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        validateGame();
      }
    });
  }
  if (providerSelect) {
    providerSelect.addEventListener('change', () => {
      // Se já tem nome no input, revalida ao trocar provedor
      if (gameInput && gameInput.value.trim()) validateGame();
    });
  }
}

// Chamada pelo botão (onclick no HTML)
function validateGame() {
  const gameInput = document.getElementById('gameNameInput');
  const providerSelect = document.getElementById('gameProviderSelect');
  const gameName = (gameInput?.value || '').trim();

  if (!gameName) {
    showValidationResult(false, 'Por favor, insira o nome de um jogo.');
    return;
  }

  if (currentMode === 'daily') {
    validateDailyGame(gameName, providerSelect?.value || '');
  } else {
    validateWeeklyGame(gameName);
  }
}

function validateDailyGame(gameName, provider) {
  const q = normalizeText(gameName);
  let isValid = false;
  let foundProvider = '';

  // Se não houver provedor selecionado, busca em todos
  if (!provider) {
    outer:
    for (const [providerName, games] of Object.entries(VALID_GAMES)) {
      for (const game of games) {
        if (normalizeText(game).includes(q)) {
          isValid = true;
          foundProvider = providerName;
          break outer;
        }
      }
    }
  } else {
    const games = VALID_GAMES[provider] || [];
    isValid = games.some(game => normalizeText(game).includes(q));
    foundProvider = provider;
  }

  if (isValid) {
    showValidationResult(true, `✅ VÁLIDO: "${gameName}" está na lista de jogos do provedor ${foundProvider} para cashback diário.`);
  } else {
    showValidationResult(false, `❌ INVÁLIDO: "${gameName}" não foi encontrado na lista de jogos válidos para cashback diário.`);
  }
}

function validateWeeklyGame(gameName) {
  const q = normalizeText(gameName);
  const isExcluded = WEEKLY_EXCLUDED_GAMES.some(excluded =>
    normalizeText(excluded).includes(q) || q.includes(normalizeText(excluded))
  );

  if (isExcluded) {
    showValidationResult(false, `❌ INVÁLIDO: "${gameName}" está na lista de jogos excluídos do cashback semanal.`);
  } else {
    showValidationResult(true, `✅ VÁLIDO: "${gameName}" é elegível para cashback semanal (jogos de cassino ao vivo).`);
  }
}

function showValidationResult(isValid, message) {
  const resultContainer = document.getElementById('validationResult');
  const statusElement = document.getElementById('resultStatus');
  const messageElement = document.getElementById('resultMessage');

  if (!resultContainer || !statusElement || !messageElement) {
    // Failsafe: loga no console se a estrutura não existir
    console.warn('Bloco de resultado de validação não encontrado.');
    return;
  }

  statusElement.className = isValid ? 'status-valid' : 'status-invalid';
  statusElement.textContent = isValid ? '✅ JOGO VÁLIDO' : '❌ JOGO INVÁLIDO';
  messageElement.textContent = message;

  resultContainer.style.display = 'block';
  resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function toggleGameLists() {
  const gameListsContainer = document.getElementById('completeGameLists');
  const toggleButton = document.querySelector('.game-lists-toggle button');

  if (!gameListsContainer || !toggleButton) return;

  if (gameListsContainer.style.display === 'none') {
    generateGameLists();
    gameListsContainer.style.display = 'block';
    toggleButton.textContent = '🔼 Ocultar Lista de Jogos';
  } else {
    gameListsContainer.style.display = 'none';
    toggleButton.textContent = '📋 Ver Lista Completa de Jogos';
  }
}

function generateGameLists() {
  const container = document.getElementById('dailyGamesList');
  if (!container) return;

  container.innerHTML = '';

  Object.entries(VALID_GAMES).forEach(([provider, games]) => {
    const providerSection = document.createElement('div');
    providerSection.className = 'provider-section';
    providerSection.innerHTML = `
      <h6>${provider}</h6>
      <div class="games-grid">
        ${games.map(game => `<span class="game-tag">${game}</span>`).join('')}
      </div>
    `;
    container.appendChild(providerSection);
  });
}

// ======== Limpar ========
function clearAll() {
  resetTierSelection();
  clearValidationError();
  hideCalculationResult();

  const gameInput = document.getElementById('gameNameInput');
  const providerSelect = document.getElementById('gameProviderSelect');
  const validationResult = document.getElementById('validationResult');

  if (gameInput) gameInput.value = '';
  if (providerSelect) providerSelect.value = '';
  if (validationResult) validationResult.style.display = 'none';

  const dailyRadio = document.getElementById('dailyMode');
  if (dailyRadio) {
    dailyRadio.checked = true;
    currentMode = 'daily';
    updateToggleVisual();
    updateTierDisplay();
    updateGameValidationMode();
  }
}
