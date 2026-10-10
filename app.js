// --- ИГРОВОЕ СОСТОЯНИЕ (Глобальные переменные) ---
let gameData = {
    name: "Игрок",
    balance: 5000, // Стартовый капитал для тестов ($)
    inventory: [], // Карты игрока
    usedWords: []  // Список уже введенных слов
};

// Загрузка данных из браузера, если они там есть
function loadGame() {
    const saved = localStorage.getItem('wordsCardSave');
    if (saved) {
        gameData = JSON.parse(saved);
    }
    updateUI();
}

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

// --- НАВИГАЦИЯ ПО ВКЛАДКАМ ---
document.addEventListener('DOMContentLoaded', () => {
    loadGame();

    // Временная имитация входа (позже заменим на Google Auth)
    document.getElementById('google-login-btn').addEventListener('click', () => {
        document.getElementById('auth-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
    });

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

    // Ввод слов
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

        // Оценка редкости по длине и символам (простая логика для старта)
        let rarity = 'Обычная';
        let reward = 50;
        
        if (word.length > 8) {
            rarity = 'Эпическая';
            reward = 1000;
        } else if (word.length > 5) {
            rarity = 'Редкая';
            reward = 150;
        }

        gameData.usedWords.push(word);
        gameData.balance += reward;
        
        // Добавляем карту в инвентарь
        gameData.inventory.push({
            word: word,
            rarity: rarity,
            price: reward,
            date: new Date().toLocaleDateString()
        });

        saveGame();
        input.value = '';
        resultBox.innerHTML = `<p style="color: #4ade80;">Успех! Слово "${word}" (${rarity}) добавлено. Награда: ${reward} $</p>`;
    });
});

// --- ЛОГИКА ОТКРЫТИЯ ПАКОВ ---
function openPack(packName) {
    let count = 2;
    if (packName.includes('Стандартный')) count = 5;
    if (packName.includes('Элитный')) count = 10;

    const randomWords = ['apple', 'galaxy', 'quantum', 'algorithm', 'universe', 'synchronicity', 'phoenix', 'labyrinth'];
    let openedCardsText = `Вы открыли "${packName}" и получили:\n`;

    for (let i = 0; i < count; i++) {
        const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)] + Math.floor(Math.random() * 1000);
        let rarity = 'Обычная';
        let price = Math.floor(Math.random() * 40) + 10;

        // Шансы на редкость
        const roll = Math.random();
        if (roll > 0.95) { rarity = 'Легендарная'; price = 5000; }
        else if (roll > 0.8) { rarity = 'Эпическая'; price = 1200; }
        else if (roll > 0.5) { rarity = 'Редкая'; price = 100; }

        gameData.inventory.push({
            word: randomWord,
            rarity: rarity,
            price: price,
            date: new Date().toLocaleDateString()
        });

        openedCardsText += `- [${rarity}] "${randomWord}" (Ценность: ${price} $)\n`;
    }

    alert(openedCardsText);
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
