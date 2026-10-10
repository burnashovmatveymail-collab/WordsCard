// --- ГЕНЕРАТОР СЛОВ (Без статических таблиц) ---
// Комбинирует слоги для создания бесконечного разнообразия уникальных слов
function generateProceduralWord(rarity) {
    const prefixes = ["sub", "trans", "hyper", "meta", "crypto", "neo", "syn", "poly", "tele", "inter", "про", "гипер", "ультра", "анти", "мега"];
    const roots = ["chron", "graph", "morph", "path", "lum", "flux", "nexus", "Aether", "vortex", "genesis", "пра", "мир", "свет", "тьма", "код", "цель", "дух", "вихрь"];
    const suffixes = ["ism", "ity", "ium", "esis", "oid", "ion", "ex", "is", "ость", "ение", "ика", "арь", "ент"];

    let word = "";
    
    // Длина и сложность зависит от редкости
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

// --- СБАЛАНСИРОВАННОЕ ОТКРЫТИЕ ПАКОВ ---
function openPack(packName) {
    let count = 2;
    if (packName.includes('Стандартный')) count = 5;
    if (packName.includes('Элитный')) count = 10;

    let openedCardsText = `Вы открыли "${packName}" и получили:\n`;

    for (let i = 0; i < count; i++) {
        let rarity = 'Обычная';
        let price = 10;

        // Честные и суровые шансы (вероятности от 0 до 1)
        const roll = Math.random();

        if (roll > 0.9999) {
            rarity = 'Уникальная'; // Шанс 0.01% (1 на 10000)
            price = Math.floor(Math.random() * 30000) + 20000;
        } else if (roll > 0.99) {
            rarity = 'Легендарная'; // Шанс 0.9% (очень редко!)
            price = Math.floor(Math.random() * 18000) + 2000;
        } else if (roll > 0.93) {
            rarity = 'Эпическая'; // Шанс 6%
            price = Math.floor(Math.random() * 1300) + 700;
        } else if (roll > 0.80) {
            rarity = 'Плюс-Редкая'; // Шанс 13%
            price = Math.floor(Math.random() * 500) + 200;
        } else if (roll > 0.50) {
            rarity = 'Редкая'; // Шанс 30%
            price = Math.floor(Math.random() * 150) + 50;
        } else {
            rarity = 'Обычная'; // Шанс 50%
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
