chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = tabs[0].url;
  chrome.storage.local.get({ highlights: {} }, (data) => {
    const list = document.getElementById('list');
    const pageHighlights = data.highlights[url] || [];
    
    pageHighlights.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      list.appendChild(li);
    });
  });
});
