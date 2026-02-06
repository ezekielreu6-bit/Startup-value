async function analyzeStartup() {
  const btn = document.getElementById('mainBtn');
  const btnText = btn.querySelector('.btn-text');
  const btnLoader = btn.querySelector('.btn-loader');
  const resultCard = document.getElementById('resultCard');
  const input = document.getElementById('urlInput');
  
  let url = input.value.trim();
  if (!url) return alert("Please enter a URL!");
  if (!url.startsWith('http')) url = 'https://' + url;
  

  btn.disabled = true;
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');
  resultCard.classList.add('hidden');
  
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&t=${Date.now()}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    const html = data.contents ? data.contents.toLowerCase() : "";
    
    let worth = 0;
    let reasons = [];
    document.getElementById('targetUrlDisplay').innerText = url.replace('https://', '');
    
  
    if (html.includes('wp-content') || html.includes('wordpress') || html.includes('wix.com')) {
      worth += 450000;
      reasons.push("CMS Platform Base: ₦450k");
      document.getElementById('techLevel').innerText = "Standard CMS";
    } else {
      worth += 1000000;
      reasons.push("Custom Framework (React/Next): ₦1.0M");
      document.getElementById('techLevel').innerText = "High-End Custom";
    }
    
    
    const gateways = ['paystack', 'flutterwave', 'monnify', 'korapay'];
    if (gateways.some(g => html.includes(g))) {
      worth += 400000;
      reasons.push("Fintech Integration: ₦400k");
      document.getElementById('securityRank').innerText = "PCI-DSS Ready";
    }
    
    
    if (html.includes('tailwind') || html.includes('jakarta') || html.includes('framer')) {
      worth += 300000;
      reasons.push("Premium UI/UX System: ₦300k");
    }
    
    displayResults(worth, reasons);
  } catch (e) {
    alert("Verification failed. The target site may be blocking crawlers.");
  } finally {
    btn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
  }
}

function displayResults(total, reasons) {
  document.getElementById('totalValue').innerText = `₦${Math.floor(total).toLocaleString()}`;
  const list = document.getElementById('breakdownList');
  list.innerHTML = reasons.map(r => `<li>✅ ${r}</li>`).join('');
  document.getElementById('resultCard').classList.remove('hidden');
}


async function downloadImage() {
  const captureArea = document.getElementById('captureArea');
  const canvas = await html2canvas(captureArea, {
    backgroundColor: '#0d1117',
    scale: 2,
    logging: false
  });
  
  const image = canvas.toDataURL("image/png");
  const link = document.createElement('a');
  link.download = `StartupWorth-${Date.now()}.png`;
  link.href = image;
  link.click();
}

function shareResult() {
  const val = document.getElementById('totalValue').innerText;
  const tweet = `My startup is worth ${val}! Check yours at StartupValue-ng.vercel.app 🚀 #TechNigeria`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
}