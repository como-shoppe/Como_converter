const MY_SUB_ID = "judy7898376"; 
let convertedRawText = ""; 

document.getElementById('convertBtn').addEventListener('click', function() {
  const input = document.getElementById('inputText').value.trim();
  if (!input) return alert('請輸入蝦皮連結！');

  let lines = input.split('\n').filter(line => line.trim() !== '').slice(0, 5);
  let convertedLines = [], invalidLines = [];

  lines.forEach(line => {
    const str = line.trim();
    const isUrl = /^https?:\/\/[^\s]+$/i.test(str);
    const isShopee = /shopee|shope\.ee|shp\.ee/i.test(str);

    let isValid = false;

    if (/s\.shopee\.tw/i.test(str)) {
      // 關鍵！強制 s.shopee.tw 斜線後必須滿 10 碼（含）以上！
      // 只要是 9 碼 (如 7VFg95X37)、8 碼、7 碼，一律視為複製不完整直接擋掉！
      isValid = /^https?:\/\/s\.shopee\.tw\/[a-zA-Z0-9]{10,}(\?.*)?$/i.test(str);
    } else if (/tw\.shp\.ee/i.test(str)) {
      // tw.shp.ee 斜線後必須滿 8 碼以上
      isValid = /^https?:\/\/tw\.shp\.ee\/[a-zA-Z0-9]{8,}(\?.*)?$/i.test(str);
    } else if (/shope\.ee/i.test(str)) {
      // shope.ee 斜線後必須滿 7 碼以上
      isValid = /^https?:\/\/shope\.ee\/[a-zA-Z0-9]{7,}(\?.*)?$/i.test(str);
    } else {
      isValid = str.length >= 28;
    }

    if (isUrl && isShopee && isValid) {
      try {
        const urlObj = new URL(str);
        urlObj.searchParams.set('sub_id', MY_SUB_ID);
        convertedLines.push(urlObj.toString());
      } catch (e) {
        invalidLines.push(str);
      }
    } else {
      invalidLines.push(str);
    }
  });

  // 只要有 9 碼或缺字的網址，立刻跳 Alert 警告並中斷轉換！
  if (invalidLines.length > 0) {
    return alert(`⚠️ 偵測到無效或缺字連結！\n以下連結複製不完整（少於 10 碼）：\n\n${invalidLines.join('\n')}`);
  }

  document.getElementById('inputText').value = lines.join('\n');
  const outputList = document.getElementById('outputList');
  outputList.innerHTML = convertedLines.map((link, i) => `<p class="link-item">${i + 1}. <a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a></p>`).join('');

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
