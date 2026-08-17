const MY_SUB_ID = "judy7898376"; 
let convertedRawText = ""; 

// 檢查 8-9 碼短網址是否能在網路線上連通（抓出少一字但長度剛好 8-9 碼的無效連結）
async function validateUrlExist(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500); // 2.5秒超時保護

    await fetch(url, { 
      method: 'HEAD', 
      mode: 'no-cors',
      signal: controller.signal 
    });
    
    clearTimeout(timeout);
    return true; 
  } catch (e) {
    return false; // 網址無法解析或連線失敗，判斷為壞連結
  }
}

document.getElementById('convertBtn').addEventListener('click', async function() {
  const convertBtn = document.getElementById('convertBtn');
  const input = document.getElementById('inputText').value.trim();
  if (!input) return alert('請輸入蝦皮連結！');

  let lines = input.split('\n').map(line => line.trim()).filter(line => line !== '').slice(0, 5);
  let convertedLines = [], invalidLines = [];

  // 改變按鈕 UI 狀態
  convertBtn.disabled = true;
  convertBtn.innerText = "正在進行 9 碼以下偵錯與轉換...";

  for (let str of lines) {
    const isUrl = /^https?:\/\/[^\s]+$/i.test(str);
    const isShopee = /shopee|shope\.ee|shp\.ee/i.test(str);

    if (!isUrl || !isShopee) {
      invalidLines.push({ url: str, reason: "非蝦皮網址格式" });
      continue;
    }

    let isValid = false;
    let isNeedDeepCheck = false; // 是否需要進行深度連線偵錯 (8-9碼)

    if (/s\.shopee\.tw/i.test(str)) {
      // 擷取斜線後的 Hash 碼
      const match = str.match(/s\.shopee\.tw\/([a-zA-Z0-9]+)/);
      const code = match ? match[1] : "";

      if (code.length < 8) {
        // 小於 8 碼（包含 7 碼）一律判定缺字！
        invalidLines.push({ url: str, reason: "字數少於 8 碼 (嚴重複製不完整)" });
        continue;
      } else if (code.length <= 9) {
        // 8 碼與 9 碼列為重點偵錯目標，標記為需要深度驗證
        isValid = true;
        isNeedDeepCheck = true;
      } else {
        // 10 碼（含）以上直接通過基本驗證
        isValid = true;
      }

    } else if (/tw\.shp\.ee/i.test(str)) {
      const match = str.match(/tw\.shp\.ee\/([a-zA-Z0-9]+)/);
      const code = match ? match[1] : "";

      if (code.length < 8) {
        invalidLines.push({ url: str, reason: "tw.shp.ee 字數少於 8 碼" });
        continue;
      }
      isValid = true;
      if (code.length <= 9) isNeedDeepCheck = true;

    } else if (/shope\.ee/i.test(str)) {
      isValid = /^https?:\/\/shope\.ee\/[a-zA-Z0-9]{7,}(\?.*)?$/i.test(str);
    } else {
      isValid = str.length >= 25;
    }

    // 進行 8-9 碼高風險區間的線上連線測試
    if (isValid && isNeedDeepCheck) {
      const isReachable = await validateUrlExist(str);
      if (!isReachable) {
        invalidLines.push({ url: str, reason: "9碼(含)以下連結連線失敗，疑為缺字壞連結" });
        continue;
      }
    }

    // 通過驗證，安全導出帶有 sub_id 的連結
    if (isValid) {
      try {
        const urlObj = new URL(str);
        urlObj.searchParams.set('sub_id', MY_SUB_ID);
        convertedLines.push(urlObj.toString());
      } catch (e) {
        invalidLines.push({ url: str, reason: "URL 解析異常" });
      }
    } else {
      invalidLines.push({ url: str, reason: "格式不合規" });
    }
  }

  // 還原按鈕 UI 狀態
  convertBtn.disabled = false;
  convertBtn.innerText = "開始轉換";

  // 偵錯與錯誤提示
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
