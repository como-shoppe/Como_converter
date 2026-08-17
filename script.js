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

    if (/tw\.shp\.ee/i.test(str)) {
      // 強制 tw.shp.ee 斜線後必須滿 8 碼以上，少於 8 碼（包含 7 碼）一律判定缺字！
      isValid = /^https?:\/\/tw\.shp\.ee\/[a-zA-Z0-9]{8,}(\?.*)?$/i.test(str);
    } else if (/s\.shopee\.tw/i.test(str)) {
      // 強制 s.shopee.tw 斜線後必須滿 10 碼以上
      isValid = /^https?:\/\/s\.shopee\.tw\/[a-zA-Z0-9]{10,}(\?.*)?$/i.test(str);
    } else {
      isValid = str.length >= 28;
    }

    if (isUrl && isShopee && isValid) {
      const connector = str.includes('?') ? '&' : '?';
      convertedLines.push(`${str}${connector}sub_id=${MY_SUB_ID}`);
    } else {
      invalidLines.push(str);
    }
  });

  if (invalidLines.length > 0) {
    return alert(`⚠️ 偵測到無效或缺字連結！\n以下連結複製不完整：\n\n${invalidLines.join('\n')}`);
  }

  document.getElementById('inputText').value = lines.join('\n');
  const outputList = document.getElementById('outputList');
  outputList.innerHTML = convertedLines.map((link, i) => `<p class="link-item">${i + 1}. <a href="${link}" target="_blank">${link}</a></p>`).join('');

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
