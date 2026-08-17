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
    
    // 1. 驗證是否為正常網址格式
    const isUrlFormat = /^https?:\/\/[^\s]+$/i.test(trimmedLine);
    
    // 2. 驗證是否包含蝦皮網域
    const lowerLine = trimmedLine.toLowerCase();
    const isShopee = lowerLine.includes('shopee') || lowerLine.includes('shope.ee') || lowerLine.includes('shp.ee');

    // 3. 嚴格長度檢查門檻：
    // 短網址 tw.shp.ee/GEThpyPU 標準長度為 25 字元，少於 25 字一律算缺字！
    // 長網址 s.shopee.tw/xxx 標準長度至少 28 字元
    let minLength = 28;
    if (lowerLine.includes('shp.ee')) {
      minLength = 25;
    }

    // 只要格式不對、非蝦皮、或是字數少於標準，全部抓進錯誤清單
    if (!isUrlFormat || !isShopee || trimmedLine.length < minLength) {
      invalidLines.push(trimmedLine);
      return;
    }

    const connector = trimmedLine.includes('?') ? '&' : '?';
    const newUrl = `${trimmedLine}${connector}sub_id=${MY_SUB_ID}`;
    convertedLines.push(newUrl);
  });

  // 只要錯誤清單裡面有任何一筆（包含缺字），立刻中斷，絕對不轉出結果！
  if (invalidLines.length > 0) {
    alert(`⚠️ 偵測到無效或缺字連結！\n以下連結長度不足或格式錯誤：\n\n${invalidLines.join('\n')}\n\n請確認連結是否複製完整。`);
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
