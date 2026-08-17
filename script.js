const MY_SUB_ID = "judy7898376"; 

document.getElementById('convertBtn').addEventListener('click', function() {
  const input = document.getElementById('inputText').value.trim();
  if (!input) {
    alert('請輸入蝦皮連結！');
    return;
  }

  let lines = input.split('\n').filter(line => line.trim() !== '');

  if (lines.length > 5) {
    alert('一次最多只能處理 5 個連結！已自動為您保留前 5 行。');
    lines = lines.slice(0, 5);
  }

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let convertedLines = [];
  let hasInvalidUrl = false;

  lines.forEach(line => {
    const urls = line.match(urlRegex);
    if (urls) {
      let convertedLine = line;
      urls.forEach(url => {
        // 檢查是否為蝦皮網址，且長度是否過短（一般蝦皮短連結最少會超過 20 個字元）
        const isShopee = url.includes('shopee') || url.includes('shope.ee');
        
        if (isShopee && url.length < 20) {
          hasInvalidUrl = true; // 標記發現疑似殘缺的網址
        }

        if (isShopee) {
          const connector = url.includes('?') ? '&' : '?';
          const newUrl = `${url}${connector}sub_id=${MY_SUB_ID}`;
          convertedLine = convertedLine.replace(url, newUrl);
        }
      });
      convertedLines.push(convertedLine);
    } else {
      convertedLines.push(line);
    }
  });

  if (hasInvalidUrl) {
    alert('⚠️ 偵測到部分網址可能過短或不完整，請再次確認連結是否複製完整喔！');
  }

  document.getElementById('inputText').value = lines.join('\n');
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
