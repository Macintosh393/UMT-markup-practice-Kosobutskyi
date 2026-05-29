import Swiper from "swiper";
import { A11y, Navigation, Pagination } from "swiper/modules";

import "swiper/css";

import { apiClient } from "./apiClient";
import { showErrorNotification } from "./notifications";
import { extractErrorMessage, formatPriceUsd } from "./utils";

const bestsellersSliderStage = document.getElementById("bestsellers-slider-stage");
const bestsellersSliderTrack = document.getElementById("bestsellers-slider-list");
const bestsellersLoader = document.getElementById("bestsellers-loader");
const bestsellersSliderViewport = document.getElementById("bestsellers-slider-viewport");
const bestsellersPagination = document.getElementById("bestsellers-pagination");

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function buildBestsellersCardMarkup() {
  const markup = `
    <img loading="lazy" class="bestsellers-item-image" alt="">
    <h3 class="bestsellers-item-title"></h3>
    <p class="bestsellers-item-text"></p>
    <p class="bestsellers-item-price"></p>`;
  return markup;
}

function buildBestsellersSliderShellMarkup() {
  const markup = `
    <li class="swiper-slide bestsellers-slider-slide">
        <div class="bestsellers-slide-row"></div>
    </li>`;
  return markup;
}

function buildBestsellersCard(bestseller) {
  const card = document.createElement("div");
  card.className = "bestsellers-list-item";
  const markup = buildBestsellersCardMarkup();
  card.insertAdjacentHTML("beforeend", markup);

  const image = card.querySelector(".bestsellers-item-image");
  image.src = bestseller.img;
  image.alt = bestseller.title;
  card.querySelector(".bestsellers-item-title").textContent = bestseller.title ?? "";
  card.querySelector(".bestsellers-item-text").textContent = bestseller.desc ?? "";
  card.querySelector(".bestsellers-item-price").textContent = bestseller.price ? formatPriceUsd(bestseller.price) : "";

  return card;
}

function setBestsellersLoading(isLoading) {
  if (bestsellersLoader) {
    bestsellersLoader.hidden = !isLoading;
  }
  if (bestsellersSliderViewport) {
    bestsellersSliderViewport.setAttribute("aria-busy", isLoading ? "true" : "false");
  }
}

async function bootBestsellersSlider() {
  if (!bestsellersSliderStage || !bestsellersSliderTrack) {
    setBestsellersLoading(false);
    return;
  }

  try {
    const response = await apiClient.get("/products");
    const body = response.data;
    let bestsellerItems = Array.isArray(body) ? body : (body?.data ?? []);

    bestsellerItems = bestsellerItems.filter((bestseller) => bestseller.category === "top");

    bestsellersSliderTrack.replaceChildren();

    if (bestsellerItems.length === 0) {
      return;
    }

    for (const item of bestsellerItems) {
      const slideMarkup = buildBestsellersSliderShellMarkup();
      bestsellersSliderTrack.insertAdjacentHTML("beforeend", slideMarkup);
      const row = bestsellersSliderTrack.lastChild.querySelector(".bestsellers-slide-row");
      row.append(buildBestsellersCard(item));
    }

    const enableLoop = false;

    new Swiper(bestsellersSliderStage, {
      modules: [Navigation, A11y, Pagination],
      slidesPerView: 1,
      spaceBetween: 24,
      slidesPerGroup: 1,
      loop: enableLoop,
      speed: prefersReducedMotion() ? 0 : 480,
      pagination: {
        el: bestsellersPagination,
        type: "bullets",
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 3,
      },
      navigation: {
        prevEl: "[data-bestsellers-prev]",
        nextEl: "[data-bestsellers-next]",
      },
      a11y: {
        prevSlideMessage: "Previous bestseller",
        nextSlideMessage: "Next bestseller",
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1440: {
          slidesPerView: 3,
          spaceBetween: 32,
        },
      },
    });
  } catch (error) {
    showErrorNotification(extractErrorMessage(error, "Couldn't load bestsellers."));
  } finally {
    setBestsellersLoading(false);
  }
}

bootBestsellersSlider();
