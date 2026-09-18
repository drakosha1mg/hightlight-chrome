// Функция создания меню
function createMenu() {
  // На всякий случай очищаем старое меню перед созданием, чтобы избежать дубликатов
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "highlight-text",
      title: "Выделить текст маркером",
      contexts: ["selection"] // Появится ТОЛЬКО если на странице выделен текст!
    });
  });
}

// Создаем меню при первой установке или обновлении расширения
chrome.runtime.onInstalled.addListener(createMenu);

// Важно для Manifest V3: пробуждаем меню, если Service Worker заснул
chrome.runtime.onStartup.addListener(createMenu);

// Слушатель клика должен быть СТРОГО на самом верхнем уровне файла
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "highlight-text" && tab.id) {
    chrome.tabs.sendMessage(tab.id, { action: "trigger-highlight" });
  }
});
