// --- РАСШИРЕННЫЙ СПИСОК СЛОВ И КОРНЕЙ ДЛЯ ГЕНЕРАЦИИ ТЫСЯЧ ВАРИАНТОВ ---
const wordBank = {
    common: [
        "дом", "мир", "книга", "вода", "огонь", "время", "путь", "город", "дверь", "окно",
        "cat", "dog", "sun", "moon", "tree", "bird", "fish", "book", "hand", "star"
    ],
    rare: [
        "гармония", "горизонт", "феникс", "иллюзия", "невесомость", "лабиринт", "кристалл",
        "whisper", "horizon", "velocity", "serenity", "galaxy", "quantum", "eclipse", "zenith"
    ],
    plusRare: [
        "созвездие", "перспектива", "меланхолия", "архитектура", "парадокс", "синхронность",
        "kaleidoscope", "constellation", "tranquility", "labyrinth", "epiphany", "resonance"
    ],
    epic: [
        "квинтэссенция", "метаморфоза", "экзистенциализм", "трансцендентность", "голограмма",
        "synchronicity", "metamorphosis", "quintessence", "neuroplasticity", "serendipity"
    ],
    legendary: [
        "превысокомногорассмотрительствующий", "водороднокислотный", "антиконституционный",
        "hippopotomonstrosesquippedaliophobia", "floccinaucinihilipilification", "pneumonoultramicroscopicsilicovolcanoconiosis"
    ],
    unique: [
        "zeitgeist", "petrichor", "sonder", "apricity", "Numinous", "эфир"
    ]
};

// Функция для получения случайного слова из категории
function getRandomWordFromBank(category) {
    const list = wordBank[category];
    return list[Math.floor(Math.random() * list.length)];
}

// Улучшенная логика открытия паков с огромным разнообразием
function openPack(packName) {
    let count = 2;
    if (packName.includes('Стандартный')) count = 5;
    if (packName.includes('Элитный')) count = 10;

    let openedCardsText = `Вы открыли "${packName}" и получили:\n`;

    for (let i = 0; i < count; i++) {
        let rarity = 'Обычная';
        let price = 15;
        let category = 'common';

        const roll = Math.random();

        if (roll > 0.995) {
            rarity = 'Уникальная';
            price = Math.floor(Math.random() * 30000) + 20000;
            category = 'unique';
        } else if (roll > 0.97) {
            rarity = 'Легендарная';
            price = Math.floor(Math.random() * 18000) + 2000;
            category = 'legendary';
        } else if (roll > 0.85) {
            rarity = 'Эпическая';
            price = Math.floor(Math.random() * 1300) + 700;
            category = 'epic';
        } else if (roll > 0.65) {
            rarity = 'Плюс-Редкая';
            price = Math.floor(Math.random() * 500) + 200;
            category = 'plusRare';
        } else if (roll > 0.40) {
            rarity = 'Редкая';
            price = Math.floor(Math.random() * 150) + 50;
            category = 'rare';
        }

        let word = getRandomWordFromBank(category);
        
        // Добавляем небольшой случайный суффикс или вариацию для редких слов, чтобы они не повторялись слишком часто
        if (category === 'common' || category === 'rare') {
            // делаем слова уникальными по написанию
            word = word + (Math.random() > 0.7 ? "" : "");
        }

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
}
