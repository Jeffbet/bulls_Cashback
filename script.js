// BullsBet Cashback Calculator - JavaScript
// Modern Tier Selection Interface
// Date: 2025-08-07

// Global state
let currentMode = 'daily';
let selectedTier = null;

// Valid games for daily cashback
const VALID_GAMES = {
    'PG Soft': [
        'Fortune Dragon', 'Fortune Tiger', 'Fortune Ox', 'Fortune Mouse', 'Fortune Rabbit', 
        'Fortune Snake', 'Dragon Hatch', 'Dragon Hatch 2', 'Midas Fortune', 'The Great Icescape', 
        'Wild Bandito', 'Dragon Tiger Luck', 'Piggy Gold', 'Hood vs Wolf', 'Genie\'s 3 Wishes', 
        'Double Fortune', 'Bikini Paradise', 'Tree of Fortune', 'Supermarket Spree', 
        'Win Win Fish Prawn Crab', 'Circus Delight', 'Emperor\'s Favour', 'Ganesha Gold', 
        'Alchemy Gold', 'Mahjong Ways 2', 'Mahjong Ways', 'Captain\'s Bounty', 'Hip Hop Panda', 
        'Heist Stakes', 'Legend of Perseus', 'Muay Thai Champion', 'Shaolin Soccer', 'Phoenix Rises', 
        'Symbols of Egypt', 'Leprechaun Riches', 'Destiny of Sun and Moon', 'Cash Mania', 
        'Songkran Splash', 'Queen of Bounty', 'Medusa II', 'Medusa', 'Candy Bonanza', 
        'Butterfly Blossom', 'Guardians of Ice and Fire', 'Jewels of Prosperity', 'Rave Party Fever', 
        'Mr. Hallow-Win', 'Mermaid Riches', 'Santa\'s Gift Rush', 'Reel Love', 
        'Raider Jane\'s Crypt of Fortune', 'Majestic Treasures', 'Wild Fireworks', 'Candy Burst', 
        'Garuda Gems', 'Legendary Monkey King', 'Ninja vs Samurai', 'Totem Wonders', 
        'Spirited Wonders', 'Emoji Riches', 'Vampire\'s Charm', 'Plushie Frenzy', 'Jungle Delight', 
        'Futebol Fever', 'Hawaiian Tiki', 'Baccarat Deluxe', 'Mask Carnival', 'Legend of Hou Yi', 
        'Hotpot', 'Gem Saviour', 'Flirting Scholar', 'Gem Saviour Conquest', 'Fortune Gods', 
        'Dragon Legend', 'Journey to the Wealth', 'Wings of Iguazu', 'Honey Trap of Diao Chan'
    ],
    'Red Tiger': [
        'Golden Leprechaun Megaways', 'Dynamite Riches Megaways', 'Buffalo Mania Megaways', 
        'Gems Inferno Megaways', 'Gonzo\'s Quest Megaways', 'Egypt Megaways', 'Magic Powers Megaways',
        'Vault Cracker Megaways', 'What the Fox Megaways', 'Risqué Megaways', 'NFT Megaways', 
        'Jingle Ways Megaways'
    ],
    'Pragmatic Play': [
        '888 Dragons', 'Big Bass Bonanza', 'Big Bass Splash', 'Gates of Olympus', 'Joker\'s Jewels',
        'Master Joker', 'Ratinho Sortudo', 'Sweet Bonanza', 'Tigre Sortudo', 'Touro Sortudo', 
        'Macaco Sortudo'
    ],
    'PopOK': [
        'Fortune Panda', 'Rico Gorila', 'Yo Dragon'
    ]
};

// Excluded games for weekly cashback
const WEEKLY_EXCLUDED_GAMES = [
    'Dragon Tiger', 'Double Red Dog', 'Slots', 'Crash', 'Cassino Virtual', 'Esportes', 'Baccarat', 'Bac Bo'
];

// Format currency helper function
function formatCurrency(amount) {
    return amount.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Define tier ranges for automatic reallocation
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

// Function to find correct tier based on GGR value
function findCorrectTier(ggrValue, mode = currentMode) {
    const tiers = mode === 'daily' ? DAILY_TIERS : WEEKLY_TIERS;
    return tiers.find(tier => ggrValue >= tier.min && ggrValue <= tier.max);
}

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('BullsBet Cashback Calculator initialized successfully!');
    initToggle();
    initTierSelection();
});

// Initialize toggle functionality
function initToggle() {
    const toggleOptions = document.querySelectorAll('.toggle-option');
    const dailyRadio = document.getElementById('dailyMode');
    const weeklyRadio = document.getElementById('weeklyMode');

    toggleOptions.forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                currentMode = radio.value;
                updateToggleVisual();
                updateTierDisplay();
                resetTierSelection();
            }
        });
    });

    if (dailyRadio) dailyRadio.checked = true;
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
    
    // Update game validation mode
    updateGameValidationMode();
}

// Initialize tier selection functionality
function initTierSelection() {
    const tierOptions = document.querySelectorAll('.tier-option');
    const ggrInput = document.getElementById('ggrValue');
    
    tierOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectTier(this);
        });
    });

    if (ggrInput) {
        ggrInput.addEventListener('input', function() {
            console.log('GGR input changed:', this.value);
            autoReallocateTier();
        });
        
        ggrInput.addEventListener('keyup', function() {
            console.log('GGR keyup:', this.value);
            autoReallocateTier();
        });
        
        ggrInput.addEventListener('change', function() {
            console.log('GGR change:', this.value);
            autoReallocateTier();
        });
    }
}

function selectTier(tierElement) {
    // Remove selection from all tiers
    const allTiers = document.querySelectorAll('.tier-option');
    allTiers.forEach(tier => tier.classList.remove('selected'));
    
    // Select clicked tier
    tierElement.classList.add('selected');
    
    // Store selected tier data
    selectedTier = {
        percentage: parseFloat(tierElement.dataset.tier),
        minValue: parseFloat(tierElement.dataset.min),
        maxValue: parseFloat(tierElement.dataset.max)
    };
    
    // Show GGR input section
    const ggrSection = document.getElementById('ggrInputSection');
    ggrSection.style.display = 'block';
    
    // Update input hints
    updateInputHints();
    
    // Calculate if there's already a value
    calculateTierCashback();
    
    // Smooth scroll to input
    setTimeout(() => {
        ggrSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 300);
}

function updateInputHints() {
    if (!selectedTier) return;
    
    const minValueSpan = document.getElementById('minValue');
    const maxValueSpan = document.getElementById('maxValue');
    
    if (minValueSpan && maxValueSpan) {
        minValueSpan.textContent = 'R$ ' + formatCurrency(selectedTier.minValue);
        maxValueSpan.textContent = selectedTier.maxValue >= 999999 ? 
            'sem limite' : 'R$ ' + formatCurrency(selectedTier.maxValue);
    }
}

// Auto-reallocate tier based on GGR value
function autoReallocateTier() {
    const ggrInput = document.getElementById('ggrValue');
    if (!ggrInput || !ggrInput.value.trim()) {
        hideCalculationResult();
        return;
    }
    
    // Handle both comma and period as decimal separator
    let ggrValue = parseFloat(ggrInput.value.replace(',', '.')) || 0;
    
    console.log(`Auto-reallocation check: GGR value = ${ggrValue}, current mode = ${currentMode}`);
    
    if (ggrValue <= 0) {
        hideCalculationResult();
        return;
    }
    
    // Find the correct tier for this GGR value
    const correctTier = findCorrectTier(ggrValue);
    console.log(`Correct tier found:`, correctTier);
    
    if (correctTier) {
        // Find and select the correct tier element
        const tierSelector = currentMode === 'daily' ? '#dailyTierSelector' : '#weeklyTierSelector';
        const tierElement = document.querySelector(`${tierSelector} .tier-option[data-tier="${correctTier.percentage}"]`);
        
        console.log(`Looking for tier element with selector: ${tierSelector} .tier-option[data-tier="${correctTier.percentage}"]`);
        console.log(`Tier element found:`, tierElement);
        
        if (tierElement) {
            // Check if we need to change the selection
            const currentlySelected = document.querySelector(`${tierSelector} .tier-option.selected`);
            const isNewTier = !currentlySelected || currentlySelected !== tierElement;
            
            console.log(`Currently selected:`, currentlySelected);
            console.log(`Is new tier:`, isNewTier);
            
            if (isNewTier) {
                // Show notification about tier reallocation
                showTierReallocationNotification(correctTier.percentage, ggrValue);
                
                // Auto-select the correct tier
                selectTierByElement(tierElement);
                
                console.log(`Auto-reallocated to ${correctTier.percentage}% tier for GGR value: R$ ${ggrValue.toFixed(2)}`);
            } else {
                // Same tier, just recalculate
                calculateTierCashback();
            }
        } else {
            console.error(`Tier element not found for percentage: ${correctTier.percentage}%`);
        }
    } else {
        console.error(`No correct tier found for GGR value: ${ggrValue}`);
    }
}

function calculateTierCashback() {
    if (!selectedTier) {
        hideCalculationResult();
        return;
    }
    
    const ggrInput = document.getElementById('ggrValue');
    if (!ggrInput || !ggrInput.value) {
        hideCalculationResult();
        return;
    }
    
    // Handle both comma and period as decimal separator
    let ggrValue = parseFloat(ggrInput.value.replace(',', '.')) || 0;
    
    if (ggrValue <= 0) {
        hideCalculationResult();
        return;
    }
    
    // Clear any previous validation errors
    clearValidationError();
    
    // Calculate cashback with proper decimal handling
    const cashbackMultiplier = selectedTier.percentage / 100; // Convert percentage to decimal (2% = 0.02, 10% = 0.10)
    const cashbackAmount = ggrValue * cashbackMultiplier;
    const maxCashback = currentMode === 'daily' ? 5000 : 5000;
    const finalCashback = Math.min(cashbackAmount, maxCashback);
    
    // Apply minimum cashback rule (R$ 0.50)
    const minCashback = 0.50;
    const validCashback = finalCashback >= minCashback ? finalCashback : 0;
    
    // Show result
    showCalculationResult(ggrValue, selectedTier.percentage, validCashback);
    
    console.log(`Calculation: ${ggrValue} × ${selectedTier.percentage}% = R$ ${validCashback.toFixed(2)}`);
}

// Helper function to select tier by element (used by auto-reallocation)
function selectTierByElement(tierElement) {
    // Remove selection from all tiers
    const allTiers = document.querySelectorAll('.tier-option');
    allTiers.forEach(tier => tier.classList.remove('selected'));
    
    // Select the tier
    tierElement.classList.add('selected');
    
    // Store selected tier data
    selectedTier = {
        percentage: parseFloat(tierElement.dataset.tier),
        minValue: parseFloat(tierElement.dataset.min),
        maxValue: parseFloat(tierElement.dataset.max)
    };
    
    // Show GGR input section
    const ggrSection = document.getElementById('ggrInputSection');
    ggrSection.style.display = 'block';
    
    // Update input hints
    updateInputHints();
    
    // Calculate cashback
    calculateTierCashback();
}

// Show tier reallocation notification
function showTierReallocationNotification(newPercentage, ggrValue) {
    // Remove any existing notification
    const existingNotification = document.querySelector('.tier-reallocation-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'tier-reallocation-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">🔄</span>
            <span class="notification-text">
                Tier automaticamente ajustado para <strong>${newPercentage}%</strong> 
                baseado no valor GGR de <strong>R$ ${formatCurrency(ggrValue)}</strong>
            </span>
        </div>
    `;
    
    // Insert notification before the tier selector
    const currentTierSelector = document.getElementById(currentMode === 'daily' ? 'dailyTierSelector' : 'weeklyTierSelector');
    if (currentTierSelector) {
        currentTierSelector.parentNode.insertBefore(notification, currentTierSelector);
        
        // Auto-remove notification after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

function showCalculationResult(ggr, percentage, cashback) {
    const resultSection = document.getElementById('calculationResult');
    const resultValue = document.getElementById('resultValue');
    const resultGGR = document.getElementById('resultGGR');
    const resultPercentage = document.getElementById('resultPercentage');
    const resultCashback = document.getElementById('resultCashback');
    
    if (!resultSection) {
        console.error('Calculation result section not found');
        return;
    }
    
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
        hint.innerHTML = `⚠️ Valor deve estar entre <span>R$ ${formatCurrency(selectedTier.minValue)}</span> e <span>${selectedTier.maxValue >= 999999 ? 'sem limite' : 'R$ ' + formatCurrency(selectedTier.maxValue)}</span>`;
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
    // Clear tier selection
    const allTiers = document.querySelectorAll('.tier-option');
    allTiers.forEach(tier => tier.classList.remove('selected'));
    
    selectedTier = null;
    
    // Hide GGR input section
    const ggrSection = document.getElementById('ggrInputSection');
    if (ggrSection) ggrSection.style.display = 'none';
    
    // Clear input value
    const ggrInput = document.getElementById('ggrValue');
    if (ggrInput) ggrInput.value = '';
    
    clearValidationError();
}

function clearAll() {
    // Reset tier selection
    resetTierSelection();
    
    // Clear any validation errors
    clearValidationError();
    
    // Hide calculation result
    hideCalculationResult();
    
    // Clear game validation
    const gameInput = document.getElementById('gameNameInput');
    const providerSelect = document.getElementById('gameProviderSelect');
    const validationResult = document.getElementById('validationResult');
    
    if (gameInput) gameInput.value = '';
    if (providerSelect) providerSelect.value = '';
    if (validationResult) validationResult.style.display = 'none';
    
    // Reset to daily mode
    const dailyRadio = document.getElementById('dailyMode');
    if (dailyRadio) {
        dailyRadio.checked = true;
        currentMode = 'daily';
        updateToggleVisual();
        updateTierDisplay();
        updateGameValidationMode();
    }
}

// Game validation functions
function updateGameValidationMode() {
    const providerSelect = document.getElementById('gameProviderSelect');
    const gameInput = document.getElementById('gameNameInput');
    const validationResult = document.getElementById('validationResult');
    
    if (currentMode === 'daily') {
        providerSelect.disabled = false;
        gameInput.placeholder = 'Digite o nome do jogo para cashback diário...';
    } else {
        providerSelect.disabled = true;
        providerSelect.value = '';
        gameInput.placeholder = 'Digite o nome do jogo para cashback semanal...';
    }
    
    if (validationResult) validationResult.style.display = 'none';
}

function validateGame() {
    const gameInput = document.getElementById('gameNameInput');
    const providerSelect = document.getElementById('gameProviderSelect');
    const gameName = gameInput.value.trim();
    
    if (!gameName) {
        showValidationResult(false, 'Por favor, insira o nome de um jogo.');
        return;
    }
    
    if (currentMode === 'daily') {
        validateDailyGame(gameName, providerSelect.value);
    } else {
        validateWeeklyGame(gameName);
    }
}

function validateDailyGame(gameName, provider) {
    let isValid = false;
    let foundProvider = '';
    
    // Search through all providers if none selected
    if (!provider) {
        for (const [providerName, games] of Object.entries(VALID_GAMES)) {
            if (games.some(game => game.toLowerCase().includes(gameName.toLowerCase()))) {
                isValid = true;
                foundProvider = providerName;
                break;
            }
        }
    } else {
        // Search in specific provider
        const games = VALID_GAMES[provider] || [];
        isValid = games.some(game => game.toLowerCase().includes(gameName.toLowerCase()));
        foundProvider = provider;
    }
    
    if (isValid) {
        showValidationResult(true, `✅ VÁLIDO: "${gameName}" está na lista de jogos do provedor ${foundProvider} para cashback diário.`);
    } else {
        showValidationResult(false, `❌ INVÁLIDO: "${gameName}" não foi encontrado na lista de jogos válidos para cashback diário.`);
    }
}

function validateWeeklyGame(gameName) {
    const isExcluded = WEEKLY_EXCLUDED_GAMES.some(excluded => 
        excluded.toLowerCase().includes(gameName.toLowerCase()) || 
        gameName.toLowerCase().includes(excluded.toLowerCase())
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
    
    statusElement.className = isValid ? 'status-valid' : 'status-invalid';
    statusElement.textContent = isValid ? '✅ JOGO VÁLIDO' : '❌ JOGO INVÁLIDO';
    messageElement.textContent = message;
    
    resultContainer.style.display = 'block';
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function toggleGameLists() {
    const gameListsContainer = document.getElementById('completeGameLists');
    const toggleButton = document.querySelector('.game-lists-toggle button');
    
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

// Initialize the calculator
document.addEventListener('DOMContentLoaded', function() {
    // Set up toggle event listeners
    const dailyModeRadio = document.getElementById('dailyMode');
    const weeklyModeRadio = document.getElementById('weeklyMode');
    
    if (dailyModeRadio) {
        dailyModeRadio.addEventListener('change', function() {
            if (this.checked) {
                currentMode = 'daily';
                updateToggleVisual();
                updateTierDisplay();
                resetTierSelection();
            }
        });
    }
    
    if (weeklyModeRadio) {
        weeklyModeRadio.addEventListener('change', function() {
            if (this.checked) {
                currentMode = 'weekly';
                updateToggleVisual();
                updateTierDisplay();
                resetTierSelection();
            }
        });
    }
    
    // Set up tier selection event listeners
    const allTierOptions = document.querySelectorAll('.tier-option');
    allTierOptions.forEach(tier => {
        tier.addEventListener('click', function() {
            // Remove previous selection
            const sameModeOptions = this.parentElement.querySelectorAll('.tier-option');
            sameModeOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selection to clicked tier
            this.classList.add('selected');
            
            // Store selected tier data
            selectedTier = {
                percentage: parseInt(this.getAttribute('data-tier')),
                minValue: parseFloat(this.getAttribute('data-min')),
                maxValue: parseFloat(this.getAttribute('data-max'))
            };
            
            // Show GGR input section
            const ggrSection = document.getElementById('ggrInputSection');
            if (ggrSection) {
                ggrSection.style.display = 'block';
                updateInputHints();
                
                // Recalculate if there's already a GGR value
                const ggrInput = document.getElementById('ggrValue');
                if (ggrInput && ggrInput.value) {
                    calculateTierCashback();
                }
            }
        });
    });
    
    // Set up GGR input event listener
    const ggrInput = document.getElementById('ggrValue');
    if (ggrInput) {
        ggrInput.addEventListener('input', function() {
            console.log('GGR input changed:', this.value);
            calculateTierCashback();
        });
        ggrInput.addEventListener('keyup', function() {
            console.log('GGR keyup:', this.value);
            calculateTierCashback();
        });
        ggrInput.addEventListener('change', function() {
            console.log('GGR change:', this.value);
            calculateTierCashback();
        });
    }
    
    // Initialize display
    updateTierDisplay();
    
    console.log('BullsBet Cashback Calculator initialized successfully!');
});
