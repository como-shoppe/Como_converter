const MY_SUB_ID = "judy7898376"; 
let convertedRawText = ""; 

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

  let convertedLines = [];
  let invalidLines = [];

  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    // 1. 檢查是否為正確的 http/https 網址格式
    const isUrlFormat = /^https?:\/\/[^\s]+$/i.test(trimmedLine);
    
    // 2. 檢查是否為蝦皮域名
    const lowerLine = trimmedLine.toLowerCase();
    const isShopee = lowerLine.includes('shopee') || lowerLine.includes('shope.ee') || lowerLine.includes('shp.ee');

    // 3. 門檻設為 23 字元（tw.shp.ee/fLRrNL8c 長 24 字元，低於 23 絕對是缺字）
    const minLength = lowerLine.includes('shp.ee') ? 23 : 28;

    if (!isUrlFormat || !isShopee || trimmedLine.length < minLength) {
      invalidLines.push(trimmedLine);
      return;
    }

    const connector = trimmedLine.includes('?') ? '&' : '?';
    const newUrl = `${trimmedLine}${connector}sub_id=${MY_SUB_ID}`;
    convertedLines.push(newUrl);
  });

  // 只要有缺字或非蝦皮網址，立刻跳警告阻斷
  if (invalidLines.length > 0) {
    alert(`⚠️ 請確認輸入的內容是否皆為有效連結！\n以下為非有效網址：\n${invalidLines.join('\n')}`);
    return;
  }

  document.getElementById('inputText').value = lines.join('\n');

  const outputList = document.getElementById('outputList');
  if (!outputList) return;
  outputList.innerHTML = '';
  
  convertedLines.forEach((line, index) => {
    const p = document.createElement('p');
    p.className = 'link-item';
    p.innerHTML = `${index + 1}. <a href="${line}" target="_blank">${line}</a>`;
    outputList.appendChild(p);
  });

  convertedRawText = convertedLines.join('\n');
  
  const resultArea = document.getElementById('resultArea');
  if (resultArea) {
    resultArea.classList.remove('hidden');
  }
});

document.getElementById('clearBtn').addEventListener('click', function() {
  document.getElementById('inputText').value = '';
  const outputList = document.getElementById('outputList');
  if (!outputList) outputList.innerHTML = '';
  convertedRawText = "";
  
  const resultArea = document.getElementById('resultArea');
  if (resultArea) {
    resultArea.classList.add('hidden');
  }
});

document.getElementById('copyBtn').addEventListener('click', function() {
  if (!convertedRawText) return;
  navigator.clipboard.writeText(convertedRawText).then(() => {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    }
  });
});
