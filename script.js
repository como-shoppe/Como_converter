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
  let invalidUrls = []; // 紀錄無效的網址

  lines.forEach(line => {
    const urls = line.match(urlRegex);
    if (urls) {
      let convertedLine = line;
      urls.forEach(url => {
        const isShopee = url.includes('shopee') || url.includes('shope.ee');
        
        // 嚴格檢查：完整的蝦皮短網址通常在 28 字元以上（例如 https://s.shopee.tw/60Qs0w6LiU 長度為 29）
        if (isShopee && url.length < 28) {
          invalidUrls.push(url);
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

  // 如果發現有缺字的殘缺網址，直接中斷執行並跳出警告！
  if (invalidUrls.length > 0) {
    alert(`⚠️ 偵測到網址不完整或缺字：\n${invalidUrls.join('\n')}\n\n請確認連結複製完整再試一次！`);
    return; // 阻斷程式，底下不生成結果
  }

  // 同步更新輸入框為前 5 行
  document.getElementById('inputText').value = lines.join('\n');

  // 渲染為帶編號的超連結畫面
  const outputList = document.getElementById('outputList');
  outputList.innerHTML = '';
  
  convertedLines.forEach((line, index) => {
    const p = document.createElement('p');
    p.className = 'link-item';
    
    const match = line.match(urlRegex);
    if (match) {
      let htmlContent = line;
      match.forEach(link => {
        htmlContent = htmlContent.replace(link, `<a href="${link}" target="_blank">${link}</a>`);
      });
      p.innerHTML = `${index + 1}. ${htmlContent}`;
    } else {
      p.innerText = `${index + 1}. ${line}`;
    }
    
    outputList.appendChild(p);
  });

  convertedRawText = convertedLines.join('\n');
  document.getElementById('resultArea').classList.remove('hidden');
});

// 清除按鈕功能
document.getElementById('clearBtn').addEventListener('click', function() {
  document.getElementById('inputText').value = '';
  document.getElementById('outputList').innerHTML = '';
  convertedRawText = "";
  document.getElementById('resultArea').classList.add('hidden');
});

// 一鍵複製功能
document.getElementById('copyBtn').addEventListener('click', function() {
  if (!convertedRawText) return;
  navigator.clipboard.writeText(convertedRawText).then(() => {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  });
});
