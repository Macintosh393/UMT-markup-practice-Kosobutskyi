const catalogueList = document.getElementById("catalogue-list");
const detailModal = document.getElementById("detail-modal");
const closeDetailButton = document.getElementById("close-detail-modal-button");
const detailModalContent = document.getElementById("detail-modal-content");

const orderModal = document.getElementById("order-modal");
const closeOrderButton = document.getElementById("close-order-modal-button");
const orderModalForm = document.getElementById("order-modal-form");

function syncModalOpenState() {
  const anyModalOpen = detailModal.classList.contains("is-open") || orderModal.classList.contains("is-open");

  document.body.classList.toggle("modal-open", anyModalOpen);
  document.documentElement.classList.toggle("modal-open", anyModalOpen);
}

function isOverlayScrollLockActive() {
  const html = document.documentElement;
  return html.classList.contains("modal-open") || html.classList.contains("menu-open");
}

function trapScrollBehindOverlays(event) {
  if (!isOverlayScrollLockActive()) {
    return;
  }
  if (event.target.closest(".modal-container") || event.target.closest("[data-menu]")) {
    return;
  }
  event.preventDefault();
}

document.addEventListener("touchmove", trapScrollBehindOverlays, { passive: false });
document.addEventListener("wheel", trapScrollBehindOverlays, { passive: false });

function openDetailModal() {
  detailModal.classList.add("is-open");
  syncModalOpenState();
}

function openOrderModal() {
  orderModal.classList.add("is-open");
  syncModalOpenState();
  orderModalForm.reset();
}

function closeDetailModal() {
  detailModal.classList.remove("is-open");
  syncModalOpenState();
}

function closeOrderModal() {
  orderModal.classList.remove("is-open");
  syncModalOpenState();
}

function buildDetailModalMarkup() {
  const markup = `
    <img class="detail-modal-image" alt="">
    <div class="detail-modal-texts-block">
      <h3 class="detail-modal-title"></h3>
      <p class="detail-modal-price"></p>
      <p class="detail-modal-text"></p>
      <div class="detail-modal-actions">
        <button type="button" id="detail-modal-cta" class="primary-button detail-modal-button">Buy now</button>
        <input type="number" class="detail-order-count" value="1" min="1">
      </div>
    </div>`;

  return markup;
}

function openDetailModalFromCatalogueItem(parentItem) {
  const imgElement = parentItem.querySelector(".catalogue-item-image");
  const src = imgElement.getAttribute("src");
  const rawSrcset = imgElement.getAttribute("srcset");
  const title = parentItem.querySelector(".catalogue-item-title").textContent;
  const descriptionFromCard = parentItem.querySelector(".catalogue-item-text").textContent;
  const price = parentItem.querySelector(".catalogue-item-price").textContent;

  detailModalContent.replaceChildren();
  detailModalContent.insertAdjacentHTML("beforeend", buildDetailModalMarkup());

  const detailImage = detailModalContent.querySelector(".detail-modal-image");
  detailImage.src = src;
  if (rawSrcset) {
    detailImage.setAttribute("srcset", rawSrcset);
  }
  detailImage.alt = title;

  detailModalContent.querySelector(".detail-modal-title").textContent = title;
  detailModalContent.querySelector(".detail-modal-text").textContent = descriptionFromCard;
  detailModalContent.querySelector(".detail-modal-price").textContent = price;

  openDetailModal();
}

catalogueList?.addEventListener("click", (event) => {
  const parentItem = event.target.closest(".catalogue-list-item");
  if (!parentItem) {
    return;
  }

  openDetailModalFromCatalogueItem(parentItem);
});

closeDetailButton.addEventListener("click", () => {
  closeDetailModal();
});

closeOrderButton.addEventListener("click", () => {
  closeOrderModal();
});

detailModal.addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    closeDetailModal();
  }
});

orderModal.addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    closeOrderModal();
  }
});

detailModalContent.addEventListener("click", (e) => {
  if (e.target.id === "detail-modal-cta" || e.target.closest("#detail-modal-cta")) {
    closeDetailModal();
    openOrderModal();
  }
});
