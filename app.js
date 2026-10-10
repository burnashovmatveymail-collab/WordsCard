// --- ИГРОВОЕ СОСТОЯНИЕ (Глобальные переменные) ---
let gameData = {
    name: "Игрок",
    balance: 1000, // Начальный капитал: 1000 $
    inventory: [], // Карты игрока
    usedWords: []  // Список уже введенных слов
};

// Загрузка данных из браузера
function loadGame() {
    const saved = localStorage.getItem('wordsCardSave');
    if (saved) {
        gameData = JSON.parse(saved);
    }
    updateUI();
}

// Сохранение данных в localStorage
function saveGame() {
    localStorage.setItem('wordsCardSave', JSON.stringify(gameData));
    updateUI();
}

// --- ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ---
function updateUI() {
    document.getElementById('user-balance').textContent = gameData.balance;
    document.getElementById('user-name').textContent = gameData.name;
    renderInventory();
}

// --- ИНИЦИАЛИЗАЦИЯ СОБЫТИЙ (Без DOMContentLoaded для модулей) ---
// Кнопка входа
document.getElementById('google-login-btn').addEventListener('click', () => {
    document.getElementById('auth-screen').classList.remove('active');
    document.getElementById('game-screen').classList.add('active');
});

// Кнопка выхода
document.getElementById('logout-btn').addEventListener('click', () => {
    document.getElementById('game-screen').classList.remove('active');
    document.getElementById('auth-screen').classList.add('active');
});

// Переключение вкладок меню
const navButtons = document.querySelectorAll('.nav-btn');
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        navButtons.forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

        btn.classList.add('active');
        const tabId = btn.getAttribute('data-tab') + '-tab';
        document.getElementById(tabId).classList.add('active');
    });
});

// Покупка паков
document.querySelectorAll('.buy-pack-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const packCard = e.target.closest('.pack-card');
        const price = parseInt(packCard.getAttribute('data-price'));
        
        if (gameData.balance < price) {
            alert('Недостаточно средств!');
            return;
        }

        gameData.balance -= price;
        openPack(packCard.querySelector('h3').textContent);
        saveGame();
    });
});

// Ввод слов (промо-механика)
document.getElementById('submit-word-btn').addEventListener('click', () => {
    const input = document.getElementById('word-input');
    const word = input.value.trim().toLowerCase();
    const resultBox = document.getElementById('word-result');

    if (!word) {
        resultBox.innerHTML = '<p style="color: #ef4444;">Введите слово!</p>';
        return;
    }

    if (gameData.usedWords.includes(word)) {
        resultBox.innerHTML = '<p style="color: #ef4444;">Вы уже вводили это слово! Одно слово на аккаунт.</p>';
        return;
    }

    let rarity = 'Обычная';
    let reward = 50;
    
    if (word.length > 10) {
        rarity = 'Эпическая';
        reward = 1000;
    } else if (word.length > 6) {
        rarity = 'Редкая';
        reward = 150;
    }

    gameData.usedWords.push(word);
    gameData.balance += reward;
    
    gameData.inventory.push({
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        word: word,
        rarity: rarity,
        price: reward,
        date: new Date().toLocaleDateString()
    });

    saveGame();
    input.value = '';
    resultBox.innerHTML = `<p style="color: #4ade80;">Успех! Слово "${word}" (${rarity}) добавлено. Награда: ${reward} $</p>`;
});

// --- ПРОЦЕДУРНЫЙ ГЕНЕРАТОР СЛОВ ---
function generateProceduralWord(rarity) {
    const prefixes = ["sub", "trans", "hyper", "meta", "crypto", "neo", "syn", "poly", "tele", "inter", "про", "гипер", "ультра", "анти", "мега"];
    const roots = ["chron", "graph", "morph", "path", "lum", "flux", "nexus", "Aether", "vortex", "genesis", "пра", "мир", "свет", "тьма", "код", "цель", "дух", "вихрь"];
    const suffixes = ["ism", "ity", "ium", "esis", "oid", "ion", "ex", "is", "ость", "ение", "ика", "арь", "ент"];

    let word = "";
    
    if (rarity === 'Обычная') {
        word = roots[Math.floor(Math.random() * roots.length)] + suffixes[Math.floor(Math.random() * suffixes.length)];
    } else if (rarity === 'Редкая') {
        word = prefixes[Math.floor(Math.random() * prefixes.length)] + "-" + roots[Math.floor(Math.random() * roots.length)];
    } else if (rarity === 'Плюс-Редкая') {
        word = prefixes[Math.floor(Math.random() * prefixes.length)] + roots[Math.floor(Math.random() * roots.length)] + suffixes[Math.floor(Math.random() * suffixes.length)];
    } else if (rarity === 'Эпическая') {
        word = "Omni-" + prefixes[Math.floor(Math.random() * prefixes.length)] + roots[Math.floor(Math.random() * roots.length)];
    } else if (rarity === 'Легендарная') {
        word = "Absolute_" + prefixes[Math.floor(Math.random() * prefixes.length)] + "_" + roots[Math.floor(Math.random() * roots.length)] + "_" + Math.floor(Math.random() * 9999);
    } else if (rarity === 'Уникальная') {
        word = "UNIQUE_1of1_" + Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    return word;
}

// --- ЛОГИКА ОТКРЫТИЯ ПАКОВ ---
function openPack(packName) {
    let count = 2;
    if (packName.includes('Стандартный')) count = 5;
    if (packName.includes('Элитный')) count = 10;

    let openedCardsText = `Вы открыли "${packName}" и получили:\n`;

    for (let i = 0; i < count; i++) {
        let rarity = 'Обычная';
        let price = 10;

        const roll = Math.random();

        if (roll > 0.9999) {
            rarity = 'Уникальная';
            price = Math.floor(Math.random() * 30000) + 20000;
        } else if (roll > 0.99) {
            rarity = 'Легендарная';
            price = Math.floor(Math.random() * 18000) + 2000;
        } else if (roll > 0.93) {
            rarity = 'Эпическая';
            price = Math.floor(Math.random() * 1300) + 700;
        } else if (roll > 0.80) {
            rarity: rarity = 'Плюс-Редкая';
            price = Math.floor(Math.random() * 500) + 200;
        } else if (roll > 0.50) {
            rarity = 'Редкая';
            price = Math.floor(Math.random() * 150) + 50;
        } else {
            rarity = 'Обычная';
            price = Math.floor(Math.random() * 40) + 10;
        }

        let word = generateProceduralWord(rarity);

        gameData.inventory.push({
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            word: word,
            rarity: rarity,
            price: price,
            date: new Date().toLocaleDateString()
        });

        openedCardsText += `- [${rarity}] "${word}" (${price} $)\n`;
    }

    alert(openedCardsText);
    saveGame();
}

// --- ОТРИСОВКА ИНВЕНТАРЯ ---
function renderInventory() {
    const container = document.getElementById('cards-container');
    
    if (gameData.inventory.length === 0) {
        container.innerHTML = '<p class="empty-text">У вас пока нет карт. Купите пак или введите слово!</p>';
        return;
    }

    container.innerHTML = '';
    gameData.inventory.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = `pack-card card-item ${card.rarity.toLowerCase()}`;
        cardEl.innerHTML = `
            <span class="rarity-badge">${card.rarity}</span>
            <h3 style="margin-top: 10px;">${card.word}</h3>
            <span class="price">Оценка: ${card.price} $</span>
            <button class="btn secondary" onclick="sellCard(${index})" style="margin-top: 10px; width: 100%;">Продать скупщику</button>
        `;
        container.appendChild(cardEl);
    });
}

// Продажа карты скупщику
window.sellCard = function(index) {
    const card = gameData.inventory[index];
    gameData.balance += card.price;
    gameData.inventory.splice(index, 1);
    saveGame();
    alert(`Вы продали карту "${card.word}" за ${card.price} $!`);
};

// Первичный запуск загрузки при старте скрипта
loadGame();
