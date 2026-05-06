const catalogueList = document.getElementById("catalogue-list");
const detailModal = document.getElementById("detail-modal");
const closeDetailButtons = document.querySelectorAll("#close-detail-modal-button");
const detailModalContent = document.getElementById("detail-modal-content");

const orderModal = document.getElementById("order-modal");
const closeOrderButton = document.getElementById("close-order-modal-button");

function toggleDetailModal() {
  detailModal.classList.toggle("is-open");
  document.body.classList.toggle("modal-open");
}

function closeDetailModal() {
  detailModal.classList.remove("is-open");
  document.body.classList.remove("modal-open");
}

function toggleOrderModal() {
  orderModal.classList.toggle("is-open");
  document.body.classList.toggle("modal-open");
}

function closeOrderModal() {
  orderModal.classList.remove("is-open");
  document.body.classList.remove("modal-open");
}

catalogueList.addEventListener("click", (e) => {
  const item = e.target.closest(".catalogue-list-item");
  if (item) {
    const title = item.querySelector(".catalogue-item-title").textContent;
    const price = item.querySelector(".catalogue-item-price").textContent;
    const text = item.querySelector(".catalogue-item-text").textContent;

    const imgElement = item.querySelector(".catalogue-item-image");
    const src = imgElement.getAttribute("src");
    const srcset = imgElement.getAttribute("srcset");

    const markup = `
            <img
              class="detail-modal-image"
              src="${src}"
              srcset="${srcset}"
              alt="${title}"
            />
            <div class="detail-modal-texts-block">
              <h3 class="detail-modal-title">${title}</h3>
              <p class="detail-modal-price">${price}</p>
              <p class="detail-modal-text">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum corrupti laboriosam nulla, repellat
                labore ipsam eveniet, enim non officia iusto esse vel sit accusamus alias fugiat amet fugit, maxime
                iste. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, inventore quisquam? Earum,
                numquam aliquam eaque consequatur corrupti facere, nulla eum culpa sequi doloribus quibusdam quasi
                laboriosam provident dignissimos molestias fugiat.
              </p>
              <div class="detail-modal-actions">
                <button type="button" class="primary-button detail-modal-button" id="detail-modal-button">Buy now</button>
                <input type="number" class="detail-order-count" value="1" min="1">
              </div>
            </div>`;

    detailModalContent.innerHTML = "";
    detailModalContent.insertAdjacentHTML("afterbegin", markup);

    detailModalContent.querySelector("#detail-modal-button").addEventListener("click", () => {
      closeDetailModal();
      toggleOrderModal();
    });

    toggleDetailModal();
  }
});

closeDetailButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeDetailModal();
  });
});

detailModal.addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    closeDetailModal();
  }
});

closeOrderButton.addEventListener("click", () => {
  closeOrderModal();
});

orderModal.addEventListener("click", (e) => {
  if (e.target === e.currentTarget) {
    closeOrderModal();
  }
});
