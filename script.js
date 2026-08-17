const MY_SUB_ID = "judy7898376"; 

// 產生推廣連結功能
document.getElementById('convertBtn').addEventListener('click', function() {
  const input = document.getElementById('inputText').value.trim();
  if (!input) {
    alert('請輸入蝦皮連結！');
    return;
  }

  // 以換行切割連結並過濾空行
  let lines = input.split('\n').filter(line => line.trim() !== '');

  // 若超過 5 行，跳出提示並強制只保留前 5 行
  if (lines.length > 5) {
    alert('一次最多只能處理 5 個連結！已自動為您保留前 5 行。');
    lines = lines.slice(0, 5); // 嚴格只留前 5 行
  }

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let convertedLines = [];

  // 只針對過濾後的這 5 行進行轉換
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

  // 更新輸入框內容為前 5 行，讓使用者直觀看到後面的被裁掉了
  document.getElementById('inputText').value = lines.join('\n');
  
  // 輸出轉換結果
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
