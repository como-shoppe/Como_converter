const MY_SUB_ID = "judy7898376"; 
let convertedRawText = ""; 

document.getElementById('convertBtn').addEventListener('click', function() {
  const input = document.getElementById('inputText').value.trim();
  if (!input) return alert('請輸入蝦皮連結！');

  let lines = input.split('\n').filter(line => line.trim() !== '').slice(0, 5);
  let convertedLines = [], invalidLines = [];

  lines.forEach(line => {
    const str = line.trim();
    // 超精簡防呆：必須是 http/https、包含 shopee/shp.ee，且斜線後代碼或總長度至少要有 8 碼/25字
    const isUrl = /^https?:\/\/[^\s]+$/i.test(str);
    const isShopee = /shopee|shope\.ee|shp\.ee/i.test(str);
    const isValid = /tw\.shp\.ee/i.test(str) ? /^https?:\/\/tw\.shp\.ee\/[a-zA-Z0-9]{8,}/i.test(str) : str.length >= 25;

    if (isUrl && isShopee && isValid) {
      const connector = str.includes('?') ? '&' : '?';
      convertedLines.push(`${str}${connector}sub_id=${MY_SUB_ID}`);
    } else {
      invalidLines.push(str);
    }
  });

  if (invalidLines.length > 0) {
    return alert(`⚠️ 偵測到無效或缺字連結：\n${invalidLines.join('\n')}`);
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
