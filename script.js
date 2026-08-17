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
  let nonUrlLines = [];

  lines.forEach(line => {
    const urls = line.match(urlRegex);
    if (!urls) {
      nonUrlLines.push(line);
    } else {
      let convertedLine = line;
      urls.forEach(url => {
        const isShopee = url.includes('shopee') || url.includes('shope.ee') || url.includes('shp.ee');
        if (isShopee) {
          const connector = url.includes('?') ? '&' : '?';
          const newUrl = `${url}${connector}sub_id=${MY_SUB_ID}`;
          convertedLine = convertedLine.replace(url, newUrl);
        }
      });
      convertedLines.push(convertedLine);
    }
  });

  if (nonUrlLines.length > 0) {
    alert(`⚠️ 請確認輸入的內容是否皆為有效連結！\n以下非有效網址：\n${nonUrlLines.join('\n')}`);
    return;
  }

  document.getElementById('inputText').value = lines.join('\n');

  const outputList = document.getElementById('outputList');
  if (!outputList) return;
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
    }
    
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
