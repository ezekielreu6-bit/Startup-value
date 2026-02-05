async function analyzeStartup() {
  let url = document.getElementById('urlInput').value.trim();
  const btn = document.getElementById('mainBtn');
  const resultCard = document.getElementById('resultCard');
  const loader = document.getElementById('loader');
  
  if (!url) return alert("Please enter a URL!");
  if (!url.startsWith('http')) url = 'https://' + url;
  
  
  btn.disabled = true;
  loader.classList.remove('hidden');
  resultCard.classList.add('hidden');
  
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&t=${Date.now()}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    const html = data.contents ? data.contents.toLowerCase() : "";
    
    let worth = 0;
    let reasons = [];
    
    
    if (html.includes('wp-content') || html.includes('wordpress')) {
      worth += 400000;
      reasons.push("CMS Platform Architecture: ₦400,000");
      document.getElementById('techLevel').innerText = "Standard CMS";
    } else {
      worth += 800000;
      reasons.push("Custom Engineering/React: ₦800,000");
      document.getElementById('techLevel').innerText = "High-End Custom";
    }
    
    
    const gateways = ['paystack', 'flutterwave', 'monnify', 'korapay'];
    if (gateways.some(g => html.includes(g))) {
      worth += 450000;
      reasons.push("Naija Payment Integration: ₦450,000");
      document.getElementById('securityRank').innerText = "Fintech Secure";
    }
    
    
    if (html.includes('tailwind') || html.includes('jakarta') || html.includes('flex')) {
      worth += 300000;
      reasons.push("Premium Design Framework: ₦300,000");
    }
    
    displayResults(worth, reasons);
  } catch (e) {
    alert("Failed to scan. The site might be blocking our crawler.");
  } finally {
    loader.classList.add('hidden');
    btn.disabled = false;
  }
}

function displayResults(total, reasons) {
  document.getElementById('totalValue').innerText = `₦${Math.floor(total).toLocaleString()}`;
  const list = document.getElementById('breakdownList');
  list.innerHTML = reasons.map(r => `<li>✅ ${r}</li>`).join('');
  document.getElementById('resultCard').classList.remove('hidden');
}

function shareResult() {
  const val = document.getElementById('totalValue').innerText;
  const tweet = `My startup website is worth ${val}! Estimate yours at StartupValue-ng.vercel.app 🚀 #TechNigeria`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
}