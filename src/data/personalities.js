// STAYO Doggy Challenge - 8 Deterministic Personality Archetypes

export const personalities = {
  biryani_bandit: {
    id: "biryani_bandit",
    title: "The Biryani Bandit",
    emoji: "🍗",
    tagline: "Food comes first. Loyalty comes second. Your chicken piece is already gone.",
    description: "You possess radar vision for Swiggy and Zomato delivery partners within a 500-meter radius. If a roommate orders biryani, you have already negotiated 'just one bite' into a four-course meal before they can unpack the salan.",
    traits: [
      { name: "Stealth Nibbling", value: 99, label: "Invisible fork technique" },
      { name: "Biryani Radar", value: 98, label: "Smell range: 500 meters" },
      { name: "Dietary Self-Control", value: 12, label: "Cries at midnight snacks" }
    ],
    doggyReaction: "Doggy recommends: Keep this legend well-fed at all times! Never leave your snacks unattended on the desk!",
    doggyQuote: "Bro, Doggy saw you take that 'one bite'. That bite was half the box! Respect. 🍗",
    badge: "Food First Legend",
    accentColor: "#E26D45",
    idealHostelFeatures: ["Unlimited 4-Time Mess", "Shared Refrigerator", "Night Canteen Access", "Food Delivery Friendly"]
  },

  professional_snoozer: {
    id: "professional_snoozer",
    title: "The Professional Snoozer",
    emoji: "⏰",
    tagline: "Mornings are a social construct. My alarm is just melodic ambient music.",
    description: "You set 14 alarms spaced 3 minutes apart from 6:30 AM to 7:45 AM, only to wake up at 8:14 AM and calculate whether missing the first two lectures still keeps you above the 75% attendance threshold. You can get dressed, pack your bag, and sprint to class in 90 seconds.",
    traits: [
      { name: "Alarm Immunity", value: 100, label: "Can sleep through earthquakes" },
      { name: "Formula 1 Speed Dressing", value: 96, label: "Socks on in 1.4 seconds" },
      { name: "Attendance Probability Math", value: 98, label: "75.01% precision guaranteed" }
    ],
    doggyReaction: "Doggy barked 12 times next to your ear. You just rolled over and pulled the blanket higher. A true sleeping monarch.",
    doggyQuote: "Doggy checked: You snooze your alarm more than you check your phone notifications. Legend! 🛌",
    badge: "Master of REM Sleep",
    accentColor: "#5B7065",
    idealHostelFeatures: ["Campus Walking Distance (< 300m)", "Curtain Bed Partitions", "Sound-damped Rooms", "Late Breakfast Timing"]
  },

  budget_boss: {
    id: "budget_boss",
    title: "The Budget Boss",
    emoji: "💸",
    tagline: "Every single rupee has an Aadhaar card, a mission, and an emotional story.",
    description: "While other hostelers are crying with ₹27 in their account by the 10th of the month, you maintain an emergency fund, multiple coupon apps, and an exact mental ledger of who owes you ₹15 for photocopy prints. The Wolf of Maisammaguda.",
    traits: [
      { name: "Coupon Stacking", value: 97, label: "Saved ₹42 on ₹45 order" },
      { name: "Splitwise Surveillance", value: 100, label: "Sends QR code every 6 hours" },
      { name: "Month-End Wealth", value: 94, label: "Still has ₹3,500 on the 29th" }
    ],
    doggyReaction: "Doggy salutes your financial discipline! You can negotiate with auto drivers in three different languages.",
    doggyQuote: "Doggy knows you still have ₹500 hidden behind your hostel ID card. Safe and sound! 💰",
    badge: "Finance Minister of Wing B",
    accentColor: "#2F855A",
    idealHostelFeatures: ["All-Inclusive Rent (Zero Hidden Charges)", "3 or 4-Sharing High Value", "Free Wi-Fi & Water", "Included Daily Meals"]
  },

  wifi_warrior: {
    id: "wifi_warrior",
    title: "The Wi-Fi Warrior",
    emoji: "📶",
    tagline: "If the ping crosses 35ms, the hostel revolution begins at dawn.",
    description: "You know the exact IP address of every router on the floor, who is downloading 4K torrents during assignment submission hour, and the secret spot in the corridor where 5GHz signal reflects off the water cooler.",
    traits: [
      { name: "Router Troubleshooting", value: 99, label: "Restarts master modem remotely" },
      { name: "Ping Sensitivity", value: 98, label: "Physically feels 60ms latency" },
      { name: "Hotspot Negotiation", value: 93, label: "'Bro just 50MB for assignment'" }
    ],
    doggyReaction: "Doggy saw you fix the warden's Wi-Fi once, and now you have permanent immunity from hostel gate curfew.",
    doggyQuote: "High ping? Unacceptable! Doggy is barking directly at the server until bandwidth restores! ⚡",
    badge: "Cyber Commander",
    accentColor: "#3182CE",
    idealHostelFeatures: ["Dual Fiber Broadband (300+ Mbps)", "Mesh Wi-Fi on Every Floor", "Dedicated Inverter Power Backup", "Silent Gaming / Study Pods"]
  },

  peaceful_panda: {
    id: "peaceful_panda",
    title: "The Peaceful Panda",
    emoji: "🐼",
    tagline: "Clean room, quiet corridor, zero drama. That's the only requirement.",
    description: "You just want clean bedsheets, a working geyser with hot water in winter, a functioning study lamp, and roommates who don't blast bass-boosted remixes at 2:30 AM on a Tuesday night. The most civilized human in the entire hostel.",
    traits: [
      { name: "Zen Tolerance", value: 95, label: "Maintains inner peace amid chaos" },
      { name: "Cleanliness Standards", value: 96, label: "Makes bed every single morning" },
      { name: "Noise Cancellation", value: 99, label: "Earplugs permanently installed" }
    ],
    doggyReaction: "Doggy loves your room the most because it actually smells like lavender instead of dirty gym socks.",
    doggyQuote: "Doggy curled up on your clean rug. Please don't let anyone shout corridor cricket outside! 🌸",
    badge: "Wing Diplomat & Zen Master",
    accentColor: "#805AD5",
    idealHostelFeatures: ["Attached Western Washroom with Geyser", "Single or 2-Sharing Spacious Room", "Daily Housekeeping", "Designated Silent Study Floor"]
  },

  social_butterfly: {
    id: "social_butterfly",
    title: "The Social Butterfly",
    emoji: "🦋",
    tagline: "Knows 400 people across 4 floors. Attends 0 morning classes. Universally loved.",
    description: "Your room is not a private room — it's the wing community center. People come in to vent about their crush, borrow chargers they will never return, eat your snacks, and make Goa trip plans that will inevitably collapse by morning.",
    traits: [
      { name: "Hostel Network", value: 100, label: "Knows every guard and warden by name" },
      { name: "Chai Session Stamina", value: 98, label: "Can discuss life from 11 PM to 4 AM" },
      { name: "Wing Popularity", value: 97, label: "50 knocks on door per afternoon" }
    ],
    doggyReaction: "Doggy has met 80 people today, and every single one of them shouted your name with excitement.",
    doggyQuote: "If there's ever a hostel festival or cricket match, you're the unofficial chief guest! 🥳",
    badge: "Mayor of the Hostel",
    accentColor: "#DD6B20",
    idealHostelFeatures: ["Vibrant Student Community", "Common Recreation Lounge", "Rooftop Terrace", "Multi-Sharing Lively Atmosphere"]
  },

  midnight_maggi: {
    id: "midnight_maggi",
    title: "The Midnight Maggi Chef",
    emoji: "🍜",
    tagline: "Electric kettle, cheese slice, oregano: Michelin 3-Star cuisine unlocked.",
    description: "The hostel rulebook says electric kettles are strictly prohibited. Yet your kettle has cooked Maggi, boiled eggs, heated milk, made pasta, warmed leftover samosas, and saved 35 starving students during semester exams.",
    traits: [
      { name: "Kettle Gastronomy", value: 100, label: "Can cook 3-course meal in 0.8L kettle" },
      { name: "Spice Innovation", value: 95, label: "Crushed Kurkure as soup garnish" },
      { name: "Warden Radar Evasion", value: 92, label: "Hides kettle in under 3 seconds" }
    ],
    doggyReaction: "Doggy gives your midnight cheese Maggi a solid 10/10 tail wags! Save a spoonful for Doggy!",
    doggyQuote: "The aroma of midnight tastemaker in the corridor is the sweetest perfume in student history! 🧀",
    badge: "Michelin Kettle Master",
    accentColor: "#D69E2E",
    idealHostelFeatures: ["24/7 Kitchen / Pantry Access", "Microwave & Hot Water Stations", "Late Night Tuck Shop", "Refrigerator Storage"]
  },

  hostel_ceo: {
    id: "hostel_ceo",
    title: "The Hostel CEO",
    emoji: "👑",
    tagline: "Unofficial building coordinator, room manager, and chief problem solver.",
    description: "When the water pump fails, you know the plumber's direct WhatsApp. When the mess food tastes weird, you calmly negotiate with the supervisor. You have extra extension cords, medical first-aid kits, duplicate keys, and an answer for every crisis.",
    traits: [
      { name: "Crisis Management", value: 98, label: "Solved 14 wing emergencies this term" },
      { name: "Resource Hoarding", value: 96, label: "Has 8 charging cables and 4 adapters" },
      { name: "Leadership Charisma", value: 99, label: "Students follow your instructions instantly" }
    ],
    doggyReaction: "Doggy is ready to work as your executive deputy! You basically run this entire hostel building anyway.",
    doggyQuote: "Hostel management should put you on their official payroll! True leadership material! 🏆",
    badge: "Chief Executive Hosteler",
    accentColor: "#C0552F",
    idealHostelFeatures: ["Verified STAYO Flagship Properties", "Responsive On-Site Management", "Biometric Security", "Structured Maintenance Guarantee"]
  }
};

// Deterministic calculation function
export function calculatePersonalityResult(answers, questionsList) {
  // Personality tally map
  const tally = {
    biryani_bandit: 0,
    professional_snoozer: 0,
    budget_boss: 0,
    wifi_warrior: 0,
    peaceful_panda: 0,
    social_butterfly: 0,
    midnight_maggi: 0,
    hostel_ceo: 0
  };

  let totalScore = 0;
  let maxPossibleScore = 0;

  // Profiling preferences gathered for hostel matching
  const preferences = {
    budget: "mid",
    sharing: "3_share",
    food: "unlimited_mess",
    wifi: "fiber_ultra",
    vibe: "balanced"
  };

  answers.forEach((ansIndex, qIndex) => {
    if (ansIndex === undefined || ansIndex === null) return;
    const q = questionsList[qIndex];
    if (!q) return;

    const opt = q.options[ansIndex];
    if (!opt) return;

    // Weight score
    totalScore += opt.score;
    maxPossibleScore += 10;

    // Tally personality points
    if (tally[opt.personality] !== undefined) {
      tally[opt.personality] += 1;
    }

    // Capture preference signals
    if (q.hostelTag === "budget_pref" && opt.preferenceValue) {
      preferences.budget = opt.preferenceValue;
    }
    if (q.hostelTag === "sharing_pref" && opt.preferenceValue) {
      preferences.sharing = opt.preferenceValue;
    }
    if (q.hostelTag === "food_pref" && opt.preferenceValue) {
      preferences.food = opt.preferenceValue;
    }
    if (q.hostelTag === "wifi_pref" && opt.preferenceValue) {
      preferences.wifi = opt.preferenceValue;
    }
    if (q.hostelTag === "vibe_pref" && opt.preferenceValue) {
      preferences.vibe = opt.preferenceValue;
    }
  });

  // Calculate percentage survival score (0 - 100)
  const scorePercent = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 50;

  // Deterministic highest personality with tie-breaker
  let highestPersonality = "hostel_ceo";
  let maxCount = -1;

  // Deterministic order for tie breaking
  const priorityOrder = [
    "biryani_bandit",
    "professional_snoozer",
    "midnight_maggi",
    "wifi_warrior",
    "budget_boss",
    "peaceful_panda",
    "social_butterfly",
    "hostel_ceo"
  ];

  for (const key of priorityOrder) {
    if (tally[key] > maxCount) {
      maxCount = tally[key];
      highestPersonality = key;
    }
  }

  // Determine score tier:
  // Low: < 50% (Trigger Doggy leaving with roommate comedic ending)
  // Medium: 50% - 74% (Thoughtful / funny neutral ending)
  // High: >= 75% (Celebratory high-five + confetti ending)
  let endingType = "medium";
  if (scorePercent < 50) {
    endingType = "low";
  } else if (scorePercent >= 75) {
    endingType = "high";
  }

  return {
    scorePercent,
    rawScore: totalScore,
    maxScore: maxPossibleScore,
    personalityKey: highestPersonality,
    personality: personalities[highestPersonality],
    endingType,
    preferences,
    tally
  };
}
