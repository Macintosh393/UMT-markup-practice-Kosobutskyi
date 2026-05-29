import Swiper from "swiper";
import { A11y, Navigation } from "swiper/modules";

import "swiper/css";

import { apiClient } from "./apiClient";
import { showErrorNotification } from "./notifications";
import { extractErrorMessage } from "./utils";

const feedbackSliderStage = document.getElementById("feedback-slider-stage");
const feedbackSliderTrack = document.getElementById("feedback-slider-list");
const feedbackLoader = document.getElementById("feedback-loader");
const feedbackSliderViewport = document.getElementById("feedback-slider-viewport");

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function buildFeedbackCardMarkup() {
  const markup = `
    <p class="text feedback-text"></p>
    <p class="feedback-person-name"></p>`;
  return markup;
}

function buildFeedbackSliderShellMarkup() {
  const markup = `
    <li class="swiper-slide feedback-slider-slide">
        <div class="feedback-slide-row"></div>
    </li>`;
  return markup;
}

function buildFeedbackCard(feedback) {
  const card = document.createElement("div");
  card.className = "feedback-item";
  // card.setAttribute("data-feedback-id", String(feedback.id ?? ""))
  const markup = buildFeedbackCardMarkup();
  card.insertAdjacentHTML("beforeend", markup);
  card.querySelector(".feedback-text").textContent = feedback.text ?? "";
  card.querySelector(".feedback-person-name").textContent = feedback.author ?? "";
  return card;
}

function setFeedbackLoading(isLoading) {
  if (feedbackLoader) {
    feedbackLoader.hidden = !isLoading;
  }
  if (feedbackSliderViewport) {
    feedbackSliderViewport.setAttribute("aria-busy", isLoading ? "true" : "false");
  }
}

async function bootFeedbackSlider() {
  if (!feedbackSliderStage || !feedbackSliderTrack) {
    setFeedbackLoading(false);
    return;
  }

  try {
    const response = await apiClient.get("/reviews");
    const body = response.data;
    const feedbackItems = Array.isArray(body) ? body : (body?.data ?? []);

    feedbackSliderTrack.replaceChildren();

    if (feedbackItems.length === 0) {
      return;
    }

    for (const item of feedbackItems) {
      const slideMarkup = buildFeedbackSliderShellMarkup();
      feedbackSliderTrack.insertAdjacentHTML("beforeend", slideMarkup);
      const row = feedbackSliderTrack.lastChild.querySelector(".feedback-slide-row");
      row.append(buildFeedbackCard(item));
    }

    const enableLoop = feedbackItems.length >= 4;

    new Swiper(feedbackSliderStage, {
      modules: [Navigation, A11y],
      slidesPerView: 1,
      spaceBetween: 24,
      slidesPerGroup: 1,
      loop: enableLoop,
      speed: prefersReducedMotion() ? 0 : 480,
      navigation: {
        prevEl: "[data-feedback-prev]",
        nextEl: "[data-feedback-next]",
      },
      a11y: {
        prevSlideMessage: "Previous review",
        nextSlideMessage: "Next review",
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
    showErrorNotification(extractErrorMessage(error, "Couldn't load reviews."));
  } finally {
    setFeedbackLoading(false);
  }
}

bootFeedbackSlider();
