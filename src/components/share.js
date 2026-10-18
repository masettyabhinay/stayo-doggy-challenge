// STAYO Social Share & Friend Challenge System
// Supports WhatsApp sharing, native device share, clipboard copy, and HTML5 Canvas result card generation.

export class ShareSystem {
  constructor() {
    this.baseUrl = window.location.origin + window.location.pathname;
  }

  generateChallengeUrl(playerName, scorePercent, personalityId) {
    const params = new URLSearchParams();
    params.set("mode", "challenge");
    params.set("challenger", playerName || "Hostel Legend");
    params.set("targetScore", scorePercent);
    params.set("personality", personalityId);
    params.set("id", "STY-" + Math.random().toString(36).substring(2, 8).toUpperCase());
    return `${this.baseUrl}?${params.toString()}`;
  }

  getShareText(playerName, scorePercent, personalityTitle) {
    const url = this.generateChallengeUrl(playerName, scorePercent, "");
    return `I just took the STAYO Doggy Challenge! 🐶😂\nApparently, I scored ${scorePercent}% and unlocked "${personalityTitle}".\nDare to beat my hostel survival score? Take the challenge:\n${url}`;
  }

  shareToWhatsApp(playerName, scorePercent, personalityTitle, personalityId) {
    const text = this.getShareText(playerName, scorePercent, personalityTitle);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  }

  async copyLink(url, onSuccess) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers
        const input = document.createElement("input");
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  }

  async nativeShare(playerName, scorePercent, personalityTitle, url) {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "STAYO Doggy Challenge 🐶",
          text: `I scored ${scorePercent}% and got "${personalityTitle}" on the STAYO Doggy Challenge! Can you beat me?`,
          url: url
        });
        return true;
      } catch (e) {
        // User cancelled or unsupported
        return false;
      }
    }
    return false;
  }

  generateResultImage(resultData, playerName, onComplete) {
    const { scorePercent, personality } = resultData;
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350; // Instagram story / WhatsApp portrait ratio 4:5
    const ctx = canvas.getContext("2d");

    // Background Gradient (Warm Stayo Terracotta Cream)
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, "#FBF7F1");
    bgGrad.addColorStop(0.5, "#F5E9DA");
    bgGrad.addColorStop(1, "#EED8C2");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative Terracotta Top Banner
    ctx.fillStyle = "#C0552F";
    ctx.fillRect(0, 0, canvas.width, 36);

    // Header Badge: STAYO LOGO
    ctx.fillStyle = "#2B1B17";
    ctx.font = "800 48px 'Manrope', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("STAYO DOGGY CHALLENGE 🐶", canvas.width / 2, 130);

    ctx.font = "500 28px 'Inter', sans-serif";
    ctx.fillStyle = "#7A5243";
    ctx.fillText("Hostel Survival & Personality Certification", canvas.width / 2, 175);

    // Card Container
    ctx.shadowColor = "rgba(180, 106, 85, 0.18)";
    ctx.shadowBlur = 35;
    ctx.shadowOffsetY = 15;
    ctx.fillStyle = "#FFFFFF";
    roundRect(ctx, 80, 220, canvas.width - 160, 960, 36);
    ctx.fill();
    ctx.shadowColor = "transparent"; // Reset shadow

    // Player Name
    ctx.fillStyle = "#C0552F";
    ctx.font = "700 32px 'Manrope', sans-serif";
    ctx.fillText(`PLAYER: ${playerName ? playerName.toUpperCase() : "HOSTEL LEGEND"}`, canvas.width / 2, 290);

    // Load Doggy Image
    const doggyImg = new Image();
    doggyImg.src = "/assets/doggy_official.png";
    doggyImg.onload = () => {
      // Draw Doggy Mascot
      const dogW = 320;
      const dogH = 320;
      ctx.drawImage(doggyImg, (canvas.width - dogW) / 2, 320, dogW, dogH);

      // Score Badge Circle
      ctx.fillStyle = "#C0552F";
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 690, 85, 0, Math.PI * 2);
      ctx.fill();

      // Score Text
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "800 68px 'Manrope', sans-serif";
      ctx.fillText(`${scorePercent}%`, canvas.width / 2, 705);
      ctx.font = "600 20px 'Inter', sans-serif";
      ctx.fillText("SURVIVAL", canvas.width / 2, 735);

      // Personality Title
      ctx.fillStyle = "#2B1B17";
      ctx.font = "800 52px 'Manrope', sans-serif";
      ctx.fillText(`${personality.emoji} ${personality.title}`, canvas.width / 2, 840);

      // Tagline
      ctx.fillStyle = "#7A5243";
      ctx.font = "italic 500 26px 'Inter', sans-serif";
      ctx.fillText(`"${personality.tagline}"`, canvas.width / 2, 890);

      // Traits summary
      ctx.fillStyle = "#F5EFEB";
      roundRect(ctx, 130, 940, canvas.width - 260, 160, 20);
      ctx.fill();

      ctx.font = "600 24px 'Inter', sans-serif";
      ctx.fillStyle = "#2B1B17";
      ctx.textAlign = "left";
      personality.traits.forEach((trait, i) => {
        ctx.fillText(`• ${trait.name}:`, 170, 990 + i * 40);
        ctx.fillText(`${trait.value}%`, canvas.width - 240, 990 + i * 40);
      });

      // Footer Call to Action
      ctx.textAlign = "center";
      ctx.fillStyle = "#2B1B17";
      ctx.font = "700 30px 'Manrope', sans-serif";
      ctx.fillText("Discover Verified Hostels & Challenge Friends at", canvas.width / 2, 1240);
      ctx.fillStyle = "#C0552F";
      ctx.font = "800 36px 'Manrope', sans-serif";
      ctx.fillText("yourstayo.com", canvas.width / 2, 1290);

      // Convert to image download
      const dataUrl = canvas.toDataURL("image/png");
      if (onComplete) onComplete(dataUrl);
    };
  }
}

// Canvas helper
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export const share = new ShareSystem();
