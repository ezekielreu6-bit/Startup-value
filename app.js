async function analyzeStartup() {
  const btn = document.getElementById('mainBtn');
  const btnLoader = btn.querySelector('.btn-loader');
  const btnText = btn.querySelector('.btn-text');
  const input = document.getElementById('urlInput');
  const resultCard = document.getElementById('resultCard');
  
  let url = input.value.trim();
  if (!url) return alert("Enter a URL");
  if (!url.startsWith('http')) url = 'https://' + url;
  
  
  btn.disabled = true;
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');
  resultCard.classList.add('hidden');
  
  try {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}&t=${Date.now()}`);
    const data = await response.json();
    const html = data.contents ? data.contents.toLowerCase() : "";
    
    let worth = 0;
    document.getElementById('targetUrlDisplay').innerText = url.replace('https://', '').replace('www.', '');
    
    
    if (html.includes('wp-content')) {
      worth = 450000;
      document.getElementById('techLevel').innerText = "WORDPRESS";
    } else {
      worth = 1850000;
      document.getElementById('techLevel').innerText = "CUSTOM JS";
    }
    
    if (html.includes('paystack') || html.includes('flutterwave')) {
      worth += 400000;
      document.getElementById('securityRank').innerText = "FINTECH";
    } else {
      document.getElementById('securityRank').innerText = "STANDARD";
    }
    
    document.getElementById('totalValue').innerText = `₦${Math.floor(worth).toLocaleString()}`;
    resultCard.classList.remove('hidden');
    
    
    resultCard.scrollIntoView({ behavior: 'smooth' });
    
  } catch (e) {
    alert("Scrutiny failed. Try a different site.");
  } finally {
    btn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
  }
}

async function downloadImage() {
  const area = document.getElementById('captureArea');
  const canvas = await html2canvas(area, {
    scale: 2, 
    backgroundColor: "#000000"
  });
  
  const image = canvas.toDataURL("image/png");
  const link = document.createElement('a');
  link.download = `MyStartupWorth.png`;
  link.href = image;
  link.click();
}

function shareResult() {
  const val = document.getElementById('totalValue').innerText;
  const urlName = document.getElementById('targetUrlDisplay').innerText;
  
  
  const text = `My startup (${urlName}) is valued at ${val}! 🚀 

Check yours at StartupValue-ng.vercel.app 🇳🇬 #TechNigeria #BuildInPublic`;
  
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
}