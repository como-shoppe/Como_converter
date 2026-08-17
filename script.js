const MY_SUB_ID = "judy7898376"; 
let convertedRawText = ""; 

// 利用免費的 CORS Proxy 獲取真實 HTTP 狀態碼 (能精準判定 404 壞連結)
async function validateUrlExist(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000); // 4秒超時保護

    // 使用 corsproxy.io 解析真實的 HTTP 回傳狀態
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl, { 
      method: 'GET',
      signal: controller.signal 
    });
    
    clearTimeout(timeout);

    // 蝦皮壞連結或少一字的網址會回傳 404 或導向失敗，只要 response.ok 不是 true 就判定為壞連結
    return response.ok; 
  } catch (e) {
    return false; // 連線失敗或超時，直接判定為無效連結
  }
}

document.getElementById('convertBtn').addEventListener('click', async function() {
  const convertBtn = document.getElementById('convertBtn');
  const input = document.getElementById('inputText').value.trim();
  if (!input) return alert('請輸入蝦皮連結！');

  let lines = input.split('\n').map(line => line.trim()).filter(line => line !== '').slice(0, 5);
  let convertedLines = [], invalidLines = [];

  convertBtn.disabled = true;
  convertBtn.innerText = "驗證連結真實性中...";

  for (let str of lines) {
    const isUrl = /^https?:\/\/[^\s]+$/i.test(str);
    const isShopee = /shopee|shope\.ee|shp\.ee/i.test(str);

    if (!isUrl || !isShopee) {
      invalidLines.push({ url: str, reason: "非蝦皮網址格式" });
      continue;
    }

    let isValidSyntax = false;
    let isShortUrl = false;

    if (/s\.shopee\.tw/i.test(str)) {
      const match = str.match(/s\.shopee\.tw\/([a-zA-Z0-9]+)/);
      const code = match ? match[1] : "";

      if (code.length < 8) {
        invalidLines.push({ url: str, reason: "長度少於 8 碼 (嚴重缺字)" });
        continue;
      }
      
      isValidSyntax = true;
      isShortUrl = true; // 標記為短網址，全部送往真實性驗證

    } else if (/tw\.shp\.ee/i.test(str)) {
      const match = str.match(/tw\.shp\.ee\/([a-zA-Z0-9]+)/);
      const code = match ? match[1] : "";

      if (code.length < 8) {
        invalidLines.push({ url: str, reason: "tw.shp.ee 字數少於 8 碼" });
        continue;
      }
      isValidSyntax = true;
      isShortUrl = true;

    } else if (/shope\.ee/i.test(str)) {
      isValidSyntax = /^https?:\/\/shope\.ee\/[a-zA-Z0-9]{7,}(\?.*)?$/i.test(str);
      isShortUrl = true;
    } else {
      isValidSyntax = str.length >= 25;
    }

    // 進行強效線上驗證：只要是短網址，就去確認蝦皮伺服器是不是真的有這個頁面
    if (isValidSyntax && isShortUrl) {
      const isRealAndActive = await validateUrlExist(str);
      if (!isRealAndActive) {
        invalidLines.push({ url: str, reason: "網址無效/缺字 (蝦皮伺服器回傳 404 頁面不存在)" });
        continue;
      }
    }

    // 通過驗證，加上 sub_id
    if (isValidSyntax) {
      try {
        const urlObj = new URL(str);
        urlObj.searchParams.set('sub_id', MY_SUB_ID);
        convertedLines.push(urlObj.toString());
      } catch (e) {
        invalidLines.push({ url: str, reason: "網址解析失敗" });
      }
    } else {
      invalidLines.push({ url: str, reason: "格式不合規" });
    }
  }

  convertBtn.disabled = false;
  convertBtn.innerText = "開始轉換";

  if (invalidLines.length > 0) {
    const errorDetails = invalidLines.map(item => `❌ ${item.url}\n   └ 原因: ${item.reason}`).join('\n\n');
    return alert(`⚠️ 偵測到無效或缺字連結！\n\n${errorDetails}`);
  }

  // 渲染結果
  document.getElementById('inputText').value = lines.join('\n');
  const outputList = document.getElementById('outputList');
  outputList.innerHTML = convertedLines.map((link, i) => 
    `<p class="link-item">${i + 1}. <a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a></p>`
  ).join('');

  convertedRawText = convertedLines.join('\n');
  document.getElementById('resultArea')?.classList.remove('hidden');
});

document.getElementById('clearBtn').addEventListener('click', function() {
  document.getElementById('inputText').value = '';
  document.getElementById('outputList').innerHTML = '';
  convertedRawText = "";
  document.getElementById('resultArea')?.classList.add('hidden');
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
