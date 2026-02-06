async function analyzeStartup() {
  const btn = document.getElementById('mainBtn');
  const btnLoader = btn.querySelector('.btn-loader');
  const btnText = btn.querySelector('.btn-text');
  const input = document.getElementById('urlInput');
  const resultCard = document.getElementById('resultCard');
  

  let url = input.value.trim();
  
  
  if (!url) return alert("Please enter a website link.");
  if (!url.startsWith('http')) {
    url = 'https://' + url;
  }
  
  
  btn.disabled = true;
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');
  resultCard.classList.add('hidden');
  
  try {
    
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&timestamp=${Date.now()}`;
    
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error("Could not connect to the proxy.");
    
    const data = await response.json();
    
    
    if (!data.contents) {
      throw new Error("This website is blocking our analysis. Try a different URL.");
    }
    
    const html = data.contents.toLowerCase();
    let worth = 0;
    
    
    document.getElementById('targetUrlDisplay').innerText = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  
    const isCMS = html.includes('wp-content') || html.includes('wordpress') || html.includes('wix.com') || html.includes('elementor');
    
    if (isCMS) {
      worth = 450000; 
      document.getElementById('techLevel').innerText = "PRO CMS";
    } else {
      worth = 1850000; 
      document.getElementById('techLevel').innerText = "CUSTOM JS";
    }
    
    
    const hasPaystack = html.includes('paystack');
    const hasFlutterwave = html.includes('flutterwave');
    const hasMonnify = html.includes('monnify');
    
    if (hasPaystack || hasFlutterwave || hasMonnify) {
      worth += 500000;
      document.getElementById('securityRank').innerText = "FINTECH SECURE";
    } else {
      document.getElementById('securityRank').innerText = "STANDARD";
    }
    
    
    if (html.includes('tailwind') || html.includes('framer') || html.includes('inter-bold')) {
      worth += 350000;
    }
    
    
    document.getElementById('totalValue').innerText = `₦${Math.floor(worth).toLocaleString()}`;
    
    resultCard.classList.remove('hidden');
    
    
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
  } catch (error) {
    console.error("Scraping Error:", error);
    alert(error.message || "An error occurred while analyzing the site.");
  } finally {
  
    btn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
  }
}

async function downloadImage() {
  const area = document.getElementById('captureArea');
  const downloadBtn = event.currentTarget;
  
  downloadBtn.innerText = "Generating...";
  
  try {
    const canvas = await html2canvas(area, {
      scale: 2, 
      backgroundColor: "#0a0c10",
      useCORS: true,
      logging: false
    });
    
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.download = `StartupWorth-${Date.now()}.png`;
    link.href = image;
    link.click();
  } catch (err) {
    alert("Could not generate image. Please screenshot manually.");
  } finally {
    downloadBtn.innerText = "Download Certificate";
  }
}


function shareResult() {
  const val = document.getElementById('totalValue').innerText;
  const urlName = document.getElementById('targetUrlDisplay').innerText;
  
  const tweetText = `My startup (${urlName}) has been valued at ${val}! 🚀\n\nCheck your startup's worth at StartupValue-ng.vercel.app 🇳🇬\n\n#TechNigeria #BuildInPublic`;
  
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
  window.open(twitterUrl, '_blank');
}