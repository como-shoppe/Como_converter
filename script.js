// 你的蝦皮推廣/分潤帳號識別參數
const MY_SUB_ID = "judy7898376"; 

document.getElementById('convertBtn').addEventListener('click', function() {
  const input = document.getElementById('inputText').value;
  if (!input.trim()) {
    alert('請貼上連結！');
    return;
  }

  // 利用正則表達式擷取文字中的網址
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = input.match(urlRegex);

  if (!urls) {
    alert('未偵測到有效的 URL 網址');
    return;
  }

  let convertedText = input;
  urls.forEach(url => {
    let newUrl = url;
    // 判斷是否為蝦皮商品網址並自動附加你的 Sub ID 追蹤參數
    if (newUrl.includes('shopee.tw') || newUrl.includes('shope.ee')) {
      const connector = newUrl.includes('?') ? '&' : '?';
      newUrl = `${newUrl}${connector}sub_id=${MY_SUB_ID}`;
    }
    convertedText = convertedText.replace(url, newUrl);
  });

  // 顯示轉換結果
  document.getElementById('outputText').value = convertedText;
  document.getElementById('resultArea').classList.remove('hidden');
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

