const MY_SUB_ID = "judy7898376"; 

// 產生推廣連結
document.getElementById('convertBtn').addEventListener('click', function() {
  const input = document.getElementById('inputText').value.trim();
  if (!input) {
    alert('請輸入蝦皮連結！');
    return;
  }

  // 以換行切割連結
  let lines = input.split('\n').filter(line => line.trim() !== '');

  // 限制最多 5 個連結
  if (lines.length > 5) {
    alert('一次最多只能貼上 5 個連結喔！已自動為您取前 5 個。');
    lines = lines.slice(0, 5);
  }

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let convertedLines = [];

  lines.forEach(line => {
    const urls = line.match(urlRegex);
    if (urls) {
      let convertedLine = line;
      urls.forEach(url => {
        let newUrl = url;
        if (newUrl.includes('shopee') || newUrl.includes('shope.ee')) {
          const connector = newUrl.includes('?') ? '&' : '?';
          newUrl = `${newUrl}${connector}sub_id=${MY_SUB_ID}`;
        }
        convertedLine = convertedLine.replace(url, newUrl);
      });
      convertedLines.push(convertedLine);
    } else {
      convertedLines.push(line);
    }
  });

  document.getElementById('outputText').value = convertedLines.join('\n');
  document.getElementById('resultArea').classList.remove('hidden');
});

// 清除按鈕功能
document.getElementById('clearBtn').addEventListener('click', function() {
  document.getElementById('inputText').value = '';
  document.getElementById('outputText').value = '';
  document.getElementById('resultArea').classList.add('hidden');
});

// 一鍵複製功能
document.getElementById('copyBtn').addEventListener('click', function() {
  const outputText = document.getElementById('outputText');
  outputText.select();
  navigator.clipboard.writeText(outputText.value).then(() => {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  });
});
