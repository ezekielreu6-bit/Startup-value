async function analyzeStartup() {
  const btn = document.getElementById('mainBtn');
  const btnLoader = btn.querySelector('.btn-loader');
  const btnText = btn.querySelector('.btn-text');
  const input = document.getElementById('urlInput');
  const resultCard = document.getElementById('resultCard');
  const list = document.getElementById('breakdownList');
  const urlDisplay = document.getElementById('targetUrlDisplay');
  
  let url = input.value.trim();
  if (!url) return;
  
  
  if (!url.startsWith('http')) url = 'https://' + url;
  
  
  const displayUrl = url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '');
  urlDisplay.innerText = displayUrl;
  
  btn.disabled = true;
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');
  resultCard.classList.add('hidden');
  
  try {
    const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}&t=${Date.now()}`);
    if (!response.ok) throw new Error();
    const data = await response.json();
    const html = data.contents ? data.contents.toLowerCase() : "";
    
    let worth = 0;
    let reasons = [];
    
    if (!html) {
      worth = 1250000 + (displayUrl.length * 12345);
      document.getElementById('techLevel').innerText = "PROTECTED";
      document.getElementById('securityRank').innerText = "HIGH";
      reasons.push("Encryption Layer: ₦1.25M");
      reasons.push(`Security Obscurity Bonus: ₦${(displayUrl.length * 12345).toLocaleString()}`);
    } else {
      const isCMS = /wp-content|wordpress|wix\.com|elementor|shopify/.test(html);
      worth = isCMS ? 450000 : 1850000;
      document.getElementById('techLevel').innerText = isCMS ? "PRO CMS" : "CUSTOM JS";
      reasons.push(isCMS ? "CMS Architecture: ₦450k" : "Custom Framework: ₦1.85M");
      
      const scriptCount = (html.match(/<script/g) || []).length;
      const divCount = (html.match(/<div/g) || []).length;
      const imgCount = (html.match(/<img/g) || []).length;
      const charCount = html.length;
      
      const complexityBonus = (scriptCount * 15700) + (divCount * 1250) + (imgCount * 5400);
      const dataWeight = Math.floor(charCount / 100) * 150;
      
      worth += complexityBonus + dataWeight;
      reasons.push(`Logic & Asset Density: ₦${Math.floor(complexityBonus + dataWeight).toLocaleString()}`);
      
      const fintechs = { paystack: 'Paystack', flutterwave: 'Flutterwave', monnify: 'Monnify', stripe: 'Stripe' };
      let found = Object.keys(fintechs).filter(k => html.includes(k));
      if (found.length > 0) {
        const fBonus = 500000 + (found.length * 100000);
        worth += fBonus;
        document.getElementById('securityRank').innerText = "FINTECH";
        reasons.push(`Gateways (${found.length}): ₦${fBonus.toLocaleString()}`);
      } else {
        document.getElementById('securityRank').innerText = "STANDARD";
      }
      
      if (html.includes('whatsapp') || html.includes('wa.me')) {
        worth += 95000;
        reasons.push("WhatsApp Support: ₦95k");
      }
    }
    
    document.getElementById('totalValue').innerText = `₦${Math.floor(worth).toLocaleString()}`;
    list.innerHTML = reasons.map(r => `<li>✅ ${r}</li>`).join('');
    resultCard.classList.remove('hidden');
    resultCard.scrollIntoView({ behavior: 'smooth' });
    
  } catch (e) {
    
    const fallback = 1500000 + (displayUrl.length * 5500);
    document.getElementById('totalValue').innerText = `₦${fallback.toLocaleString()}`;
    document.getElementById('techLevel').innerText = "SECURE";
    document.getElementById('securityRank').innerText = "HIGH";
    list.innerHTML = "<li>✅ High Authority Domain</li><li>✅ Replacement Cost Estimate</li>";
    resultCard.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
  }
}

async function downloadImage() {
  const area = document.getElementById('captureArea');
  const btn = event.currentTarget;
  const originalText = btn.innerText;
  
  btn.innerText = "Generating PNG...";
  btn.disabled = true;
  
  try {
    const canvas = await html2canvas(area, {
      scale: 2,
      backgroundColor: "#000000",
      useCORS: true,
      logging: false,
      allowTaint: true
    });
    
    const link = document.createElement('a');
    const siteName = document.getElementById('targetUrlDisplay').innerText || 'Startup';
    link.download = `${siteName}-Valuation.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    alert("Download failed. Please take a screenshot manually!");
    console.error(err);
  } finally {
    btn.innerText = originalText;
    btn.disabled = false;
  }
}

function shareResult() {
  const val = document.getElementById('totalValue').innerText;
  const urlName = document.getElementById('targetUrlDisplay').innerText;
  const text = `My startup (${urlName}) is valued at ${val}! 🚀\n\nCheck yours at StartupValue-ng.vercel.app 🇳🇬 #TechNigeria #BuildInPublic`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
}