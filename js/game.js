// Game State
const gameState = {
    coins: 500,
    xp: 0,
    level: 1,
    xpToNextLevel: 100,
    selectedFurniture: null,
    cafeLayout: {},
    gridSize: { cols: 6, rows: 8 }
};

// Furniture definitions
const furnitureTypes = {
    'table': { cost: 50, name: 'Table' },
    'chair': { cost: 25, name: 'Chair' },
    'counter': { cost: 100, name: 'Counter' },
    'coffee-machine': { cost: 150, name: 'Coffee Machine' },
    'display-case': { cost: 75, name: 'Display Case' },
    'plant': { cost: 30, name: 'Plant' }
};

// Menu items (baked goods)
const menuItems = {
    'croissant': { price: 5, xp: 2 },
    'muffin': { price: 4, xp: 1 },
    'cake': { price: 8, xp: 4 },
    'cookie': { price: 3, xp: 1 },
    'donut': { price: 4, xp: 2 },
    'coffee': { price: 6, xp: 3 }
};

// DOM Elements
const cafeFloor = document.getElementById('cafe-floor');
const coinCount = document.getElementById('coin-count');
const levelNumber = document.getElementById('level-number');
const xpBar = document.getElementById('xp-bar');
const xpText = document.getElementById('xp-text');
const menuBtn = document.getElementById('menu-btn');
const furnitureBtn = document.getElementById('furniture-btn');
const decorBtn = document.getElementById('decor-btn');
const menuModal = document.getElementById('menu-modal');
const furnitureModal = document.getElementById('furniture-modal');
const closeMenuBtn = document.getElementById('close-menu');
const closeFurnitureBtn = document.getElementById('close-furniture');
const toast = document.getElementById('toast');

// Initialize the game
function initGame() {
    createGrid();
    updateUI();
    setupEventListeners();
    loadGame();
    startCustomerSimulation();
}

// Create the cafe grid
function createGrid() {
    cafeFloor.innerHTML = '';
    const totalCells = gameState.gridSize.cols * gameState.gridSize.rows;

    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        cafeFloor.appendChild(cell);
    }

    // Restore placed furniture
    Object.keys(gameState.cafeLayout).forEach(index => {
        const cell = cafeFloor.children[index];
        if (cell) {
            placeFurnitureInCell(cell, gameState.cafeLayout[index]);
        }
    });
}

// Handle cell click
function handleCellClick(index) {
    const cell = cafeFloor.children[index];

    // If we have selected furniture, try to place it
    if (gameState.selectedFurniture) {
        if (gameState.cafeLayout[index]) {
            showToast('This spot is already occupied!');
            return;
        }

        const furniture = furnitureTypes[gameState.selectedFurniture];
        if (gameState.coins < furniture.cost) {
            showToast('Not enough coins!');
            return;
        }

        // Place the furniture
        gameState.coins -= furniture.cost;
        gameState.cafeLayout[index] = gameState.selectedFurniture;
        placeFurnitureInCell(cell, gameState.selectedFurniture);

        // Add some XP for placing furniture
        addXP(5);

        updateUI();
        saveGame();
        showToast(`Placed ${furniture.name}!`);

        // Clear selection
        clearFurnitureSelection();
    } else if (gameState.cafeLayout[index]) {
        // Tap on existing furniture - show option to remove
        if (confirm(`Remove ${furnitureTypes[gameState.cafeLayout[index]].name}? (Refund: $${Math.floor(furnitureTypes[gameState.cafeLayout[index]].cost / 2)})`)) {
            const refund = Math.floor(furnitureTypes[gameState.cafeLayout[index]].cost / 2);
            gameState.coins += refund;
            delete gameState.cafeLayout[index];
            cell.innerHTML = '';
            cell.classList.remove('occupied');
            updateUI();
            saveGame();
            showToast(`Removed! +$${refund}`);
        }
    }
}

// Place furniture in a cell
function placeFurnitureInCell(cell, furnitureType) {
    cell.innerHTML = '';
    cell.classList.add('occupied');

    const item = document.createElement('div');
    item.className = `placed-item placed-${furnitureType}`;
    cell.appendChild(item);
}

// Clear furniture selection
function clearFurnitureSelection() {
    gameState.selectedFurniture = null;
    document.querySelectorAll('.furniture-item').forEach(item => {
        item.classList.remove('selected');
    });
}

// Update UI elements
function updateUI() {
    coinCount.textContent = gameState.coins;
    levelNumber.textContent = gameState.level;
    xpBar.style.width = `${(gameState.xp / gameState.xpToNextLevel) * 100}%`;
    xpText.textContent = `${gameState.xp}/${gameState.xpToNextLevel}`;
}

// Add XP and handle leveling
function addXP(amount) {
    gameState.xp += amount;

    while (gameState.xp >= gameState.xpToNextLevel) {
        gameState.xp -= gameState.xpToNextLevel;
        gameState.level++;
        gameState.xpToNextLevel = Math.floor(gameState.xpToNextLevel * 1.5);
        showToast(`Level Up! Now Level ${gameState.level}!`);
    }

    updateUI();
    saveGame();
}

// Add coins
function addCoins(amount) {
    gameState.coins += amount;
    updateUI();
    saveGame();
}

// Show toast notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Setup event listeners
function setupEventListeners() {
    // Menu button
    menuBtn.addEventListener('click', () => {
        menuModal.classList.add('active');
    });

    // Furniture button
    furnitureBtn.addEventListener('click', () => {
        furnitureModal.classList.add('active');
    });

    // Decor button (placeholder)
    decorBtn.addEventListener('click', () => {
        showToast('Decor coming soon!');
    });

    // Close buttons
    closeMenuBtn.addEventListener('click', () => {
        menuModal.classList.remove('active');
    });

    closeFurnitureBtn.addEventListener('click', () => {
        furnitureModal.classList.remove('active');
        clearFurnitureSelection();
    });

    // Close modals on backdrop click
    menuModal.addEventListener('click', (e) => {
        if (e.target === menuModal) {
            menuModal.classList.remove('active');
        }
    });

    furnitureModal.addEventListener('click', (e) => {
        if (e.target === furnitureModal) {
            furnitureModal.classList.remove('active');
            clearFurnitureSelection();
        }
    });

    // Furniture item selection
    document.querySelectorAll('.furniture-item').forEach(item => {
        item.addEventListener('click', () => {
            const furnitureType = item.dataset.furniture;
            const cost = parseInt(item.dataset.cost);

            if (gameState.coins < cost) {
                showToast('Not enough coins!');
                return;
            }

            // Toggle selection
            if (gameState.selectedFurniture === furnitureType) {
                clearFurnitureSelection();
            } else {
                clearFurnitureSelection();
                gameState.selectedFurniture = furnitureType;
                item.classList.add('selected');
                showToast(`Selected ${furnitureTypes[furnitureType].name}. Tap a cell to place!`);
            }
        });
    });

    // Menu item click (simulate sale)
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const itemType = item.dataset.item;
            const menuItem = menuItems[itemType];

            // Check if we have necessary furniture for serving
            const hasTable = Object.values(gameState.cafeLayout).includes('table');
            const hasCounter = Object.values(gameState.cafeLayout).includes('counter');

            if (!hasTable && !hasCounter) {
                showToast('Place a table or counter first!');
                return;
            }

            if (itemType === 'coffee' && !Object.values(gameState.cafeLayout).includes('coffee-machine')) {
                showToast('You need a coffee machine!');
                return;
            }

            // Simulate a sale
            addCoins(menuItem.price);
            addXP(menuItem.xp);
            showToast(`Sold! +$${menuItem.price} +${menuItem.xp}XP`);
        });
    });
}

// Customer simulation (passive income based on furniture)
function startCustomerSimulation() {
    setInterval(() => {
        // Count service furniture
        const tables = Object.values(gameState.cafeLayout).filter(f => f === 'table').length;
        const counters = Object.values(gameState.cafeLayout).filter(f => f === 'counter').length;
        const coffeeMachines = Object.values(gameState.cafeLayout).filter(f => f === 'coffee-machine').length;
        const displayCases = Object.values(gameState.cafeLayout).filter(f => f === 'display-case').length;

        // Calculate earnings based on furniture
        let baseEarnings = 0;
        baseEarnings += tables * 2;
        baseEarnings += counters * 3;
        baseEarnings += coffeeMachines * 4;
        baseEarnings += displayCases * 2;

        if (baseEarnings > 0) {
            // Random customer event
            if (Math.random() < 0.3) {  // 30% chance every 5 seconds
                const earnings = Math.floor(baseEarnings * (0.5 + Math.random()));
                const xpGain = Math.max(1, Math.floor(earnings / 3));

                addCoins(earnings);
                addXP(xpGain);

                // Show customer served message
                const messages = [
                    'Customer served!',
                    'Great service!',
                    'Happy customer!',
                    'Another satisfied visitor!'
                ];
                showToast(`${messages[Math.floor(Math.random() * messages.length)]} +$${earnings}`);
            }
        }
    }, 5000);
}

// Save game to localStorage
function saveGame() {
    const saveData = {
        coins: gameState.coins,
        xp: gameState.xp,
        level: gameState.level,
        xpToNextLevel: gameState.xpToNextLevel,
        cafeLayout: gameState.cafeLayout
    };
    localStorage.setItem('cozyCafeSave', JSON.stringify(saveData));
}

// Load game from localStorage
function loadGame() {
    const saveData = localStorage.getItem('cozyCafeSave');
    if (saveData) {
        const data = JSON.parse(saveData);
        gameState.coins = data.coins || 500;
        gameState.xp = data.xp || 0;
        gameState.level = data.level || 1;
        gameState.xpToNextLevel = data.xpToNextLevel || 100;
        gameState.cafeLayout = data.cafeLayout || {};

        // Re-render the grid with loaded layout
        createGrid();
        updateUI();
    }
}

// Initialize the game when DOM is ready
document.addEventListener('DOMContentLoaded', initGame);
