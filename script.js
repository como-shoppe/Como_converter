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

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let convertedLines = [];
  let invalidLines = [];

  lines.forEach(line => {
    const urls = line.match(urlRegex);
    
    // 如果整行找不到網址，或是整行不完全是網址（夾雜其他文字）
    if (!urls || line.trim() !== urls[0].trim()) {
      invalidLines.push(line);
      return;
    }

    const url = urls[0];
    const isShopee = url.includes('shopee') || url.includes('shope.ee') || url.includes('shp.ee');

    if (!isShopee) {
      invalidLines.push(line);
      return;
    }

    const connector = url.includes('?') ? '&' : '?';
    const newUrl = `${url}${connector}sub_id=${MY_SUB_ID}`;
    convertedLines.push(newUrl);
  });

  // 只要有任何非純網址或非蝦皮連結，立刻跳出通知並阻斷
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
  if (outputList) outputList.innerHTML = '';
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
