// STAYO Real Hostel Matching & Discovery Modal
// Connects quiz results directly to verified STAYO student hostel listings and real photos.

import { findMatchingHostels } from "../data/hostels.js";
import { sound } from "./audio.js";

export class HostelModal {
  constructor() {
    this.modalEl = null;
    this.activeHostel = null;
    this.activePhotoIdx = 0;
    this.createDom();
  }

  createDom() {
    this.modalEl = document.createElement("div");
    this.modalEl.className = "stayo-modal-backdrop";
    this.modalEl.id = "hostelDiscoveryModal";
    this.modalEl.setAttribute("role", "dialog");
    this.modalEl.setAttribute("aria-modal", "true");
    this.modalEl.innerHTML = `
      <div class="stayo-modal-sheet">
        <!-- Modal Top Bar -->
        <div class="modal-header">
          <div class="modal-header-branding">
            <span class="stayo-badge-verified">VERIFIED STAYO HOSTELS</span>
            <h2 class="modal-title" id="hostelModalTitle">Hostel Recommendations For You</h2>
            <p class="modal-subtitle" id="hostelModalSubtitle">Based on your quiz personality and hostel lifestyle preferences</p>
          </div>
          <button class="modal-close-btn" id="closeHostelModal" aria-label="Close modal">✕</button>
        </div>

        <!-- Matching Hostels List Container -->
        <div class="modal-body" id="hostelListContainer"></div>

        <!-- Detail Drawer / Lightbox (Nested) -->
        <div class="hostel-detail-overlay" id="hostelDetailOverlay" style="display: none;">
          <div class="hostel-detail-panel" id="hostelDetailPanel"></div>
        </div>
      </div>
    `;

    document.body.appendChild(this.modalEl);

    // Event listeners
    this.modalEl.querySelector("#closeHostelModal").addEventListener("click", () => this.close());
    this.modalEl.addEventListener("click", (e) => {
      if (e.target === this.modalEl) this.close();
    });
  }

  open(personalityId, preferences) {
    sound.playPop();
    const matches = findMatchingHostels(personalityId, preferences);
    const container = this.modalEl.querySelector("#hostelListContainer");

    container.innerHTML = `
      <div class="hostel-cards-grid">
        ${matches.map(hostel => `
          <div class="hostel-card" data-hostel-id="${hostel.id}">
            <div class="hostel-card-media">
              <img src="${hostel.coverImage}" alt="${hostel.name}" class="hostel-card-img" loading="lazy" />
              <div class="hostel-match-pill">${hostel.dynamicMatch}% Profile Match</div>
              <div class="hostel-gender-tag">${hostel.gender}</div>
              <div class="hostel-photos-count">📷 ${hostel.gallery.length} Photos</div>
            </div>

            <div class="hostel-card-info">
              <div class="hostel-card-title-row">
                <h3 class="hostel-name">${hostel.name}</h3>
                <span class="hostel-rating">★ ${hostel.rating}</span>
              </div>
              <p class="hostel-location">📍 ${hostel.location} • <span class="hostel-dist">${hostel.distanceFromCampus}</span></p>
              
              <!-- Quick Amenity Badges -->
              <div class="hostel-amenity-chips">
                ${hostel.amenities.slice(0, 4).map(a => `
                  <span class="amenity-chip">${a.icon} ${a.name}</span>
                `).join("")}
              </div>

              <!-- Pricing and CTA -->
              <div class="hostel-card-footer">
                <div class="hostel-price-box">
                  <span class="price-from">Starts from</span>
                  <div class="price-val">₹${hostel.startingPrice.toLocaleString("en-IN")}<span class="price-period">/mo</span></div>
                </div>
                <div class="hostel-action-btns">
                  <button class="btn-hostel-view" data-action="view-details" data-id="${hostel.id}">View Real Photos & Rooms</button>
                  <a href="https://wa.me/917675080090?text=${encodeURIComponent(`Hi STAYO, I took the Doggy Challenge and want to enquire about ${hostel.name} near campus!`)}" 
                     target="_blank" 
                     class="btn-hostel-enquire">
                     💬 Enquire on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `;

    // Attach click listeners to cards
    container.querySelectorAll('[data-action="view-details"]').forEach(btn => {
      btn.addEventListener("click", () => {
        const hId = btn.getAttribute("data-id");
        const found = matches.find(h => h.id === hId);
        if (found) this.showHostelDetails(found);
      });
    });

    this.modalEl.classList.add("is-active");
    document.body.style.overflow = "hidden";
  }

  showHostelDetails(hostel) {
    sound.playPop();
    this.activeHostel = hostel;
    this.activePhotoIdx = 0;

    const overlay = this.modalEl.querySelector("#hostelDetailOverlay");
    const panel = this.modalEl.querySelector("#hostelDetailPanel");

    panel.innerHTML = `
      <div class="detail-header">
        <button class="detail-back-btn" id="closeDetailDrawer">← Back to Listings</button>
        <span class="detail-title-badge">STAYO VERIFIED PARTNER</span>
      </div>

      <div class="detail-content-scroll">
        <!-- Interactive Photo Gallery -->
        <div class="detail-gallery-section">
          <div class="main-photo-frame">
            <img src="${hostel.gallery[0].url}" alt="${hostel.gallery[0].title}" id="galleryMainImg" class="gallery-main-img" />
            <div class="photo-caption-bar" id="galleryCaption">${hostel.gallery[0].title}</div>
          </div>
          <div class="gallery-thumbnails-strip">
            ${hostel.gallery.map((g, idx) => `
              <button class="thumb-btn ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
                <img src="${g.url}" alt="${g.title}" />
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Property Description & Specs -->
        <div class="detail-info-section">
          <div class="detail-headline-row">
            <div>
              <h2 class="detail-name">${hostel.name}</h2>
              <p class="detail-loc">📍 ${hostel.location}, ${hostel.city}</p>
            </div>
            <div class="detail-rating-pill">
              <span class="rating-num">★ ${hostel.rating}</span>
              <span class="rating-reviews">(${hostel.reviewsCount} reviews)</span>
            </div>
          </div>

          <!-- Room Sharing Options Grid -->
          <div class="detail-section-block">
            <h4 class="section-block-title">Room Options & Pricing</h4>
            <div class="room-options-grid">
              ${hostel.roomOptions.map(r => `
                <div class="room-option-card">
                  <div class="room-opt-header">
                    <span class="room-opt-type">${r.type}</span>
                    <span class="room-opt-price">₹${r.price.toLocaleString("en-IN")}/mo</span>
                  </div>
                  <p class="room-opt-desc">${r.desc}</p>
                  <div class="room-opt-deposit">Security deposit: ₹${r.deposit} (Refundable)</div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Verified Amenities List -->
          <div class="detail-section-block">
            <h4 class="section-block-title">Verified Amenities Included in Rent</h4>
            <div class="full-amenities-grid">
              ${hostel.amenities.map(a => `
                <div class="amenity-full-card ${a.highlight ? 'is-highlight' : ''}">
                  <span class="amenity-full-icon">${a.icon}</span>
                  <span class="amenity-full-name">${a.name}</span>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Contact & Booking CTA Bar -->
          <div class="detail-contact-bar">
            <div class="contact-numbers-col">
              <span class="contact-lbl">Direct Hostel Helpline:</span>
              <div class="contact-links">
                ${hostel.phoneNumbers.map(p => `
                  <a href="tel:${p.replace(/\s+/g, '')}" class="tel-link">📞 ${p}</a>
                `).join(" • ")}
              </div>
            </div>
            <a href="https://wa.me/917675080090?text=${encodeURIComponent(`Hi STAYO, I would like to schedule a room visit for ${hostel.name}!`)}" 
               target="_blank" 
               class="btn-detail-whatsapp">
               Schedule Visit via WhatsApp
            </a>
          </div>
        </div>
      </div>
    `;

    // Handle thumbnail clicks
    panel.querySelectorAll(".thumb-btn").forEach(tBtn => {
      tBtn.addEventListener("click", () => {
        const idx = parseInt(tBtn.getAttribute("data-idx"));
        const mainImg = panel.querySelector("#galleryMainImg");
        const caption = panel.querySelector("#galleryCaption");
        mainImg.src = hostel.gallery[idx].url;
        caption.textContent = hostel.gallery[idx].title;

        panel.querySelectorAll(".thumb-btn").forEach(b => b.classList.remove("active"));
        tBtn.classList.add("active");
      });
    });

    panel.querySelector("#closeDetailDrawer").addEventListener("click", () => {
      overlay.style.display = "none";
    });

    overlay.style.display = "block";
  }

  close() {
    this.modalEl.classList.remove("is-active");
    const overlay = this.modalEl.querySelector("#hostelDetailOverlay");
    if (overlay) overlay.style.display = "none";
    document.body.style.overflow = "";
  }
}

export const hostelModal = new HostelModal();
