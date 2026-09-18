// 1. Создаем стиль для подсветки (насыщенный желтый цвет)
const style = document.createElement('style');
style.textContent = `
  ::highlight(my-custom-highlight) {
    background-color: #ffeb3b !important;
    color: #000000 !important;
  }
`;
document.head.appendChild(style);

const trackedRanges = [];

function applyHighlights() {
  if (typeof Highlight === 'undefined') return;
  const highlight = new Highlight(...trackedRanges);
  CSS.highlights.set('my-custom-highlight', highlight);
}

function saveHighlight(url, text) {
  chrome.storage.local.get({ highlights: {} }, (data) => {
    const highlights = data.highlights;
    if (!highlights[url]) highlights[url] = [];
    highlights[url].push(text);
    chrome.storage.local.set({ highlights });
  });
}

// 2. Слушаем сообщения от фонового скрипта (клик по ПКМ)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "trigger-highlight") {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (!selectedText) return;

    // Фиксируем диапазон и красим
    const range = selection.getRangeAt(0).cloneRange();
    trackedRanges.push(range);
    applyHighlights();

    // Сохраняем в хранилище
    saveHighlight(window.location.href, selectedText);

    // Убираем синее системное выделение
    selection.removeAllRanges();
  }
});
