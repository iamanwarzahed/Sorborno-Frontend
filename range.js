document.addEventListener("DOMContentLoaded", () => {
  const sliderWrapper = document.querySelector(".range-slider");
  const rangeMin = document.getElementById("rangeMin");
  const rangeMax = document.getElementById("rangeMax");
  const minVal = document.getElementById("minVal");
  const maxVal = document.getElementById("maxVal");
  const highlight = document.querySelector(".range-highlight");

  const rangeMinAttr = parseInt(sliderWrapper.dataset.start || 0);
  const rangeMaxAttr = parseInt(sliderWrapper.dataset.end || 1000);

  // Set initial values from data-attrs
  rangeMin.value = rangeMinAttr;
  rangeMax.value = rangeMaxAttr;

  const rangeMinLimit = parseInt(rangeMin.min);
  const rangeMaxLimit = parseInt(rangeMax.max);

  function updateValues() {
    let minValue = parseInt(rangeMin.value);
    let maxValue = parseInt(rangeMax.value);

    if (minValue > maxValue) [minValue, maxValue] = [maxValue, minValue];

    minVal.textContent = minValue;
    maxVal.textContent = maxValue;

    const percentMin = ((minValue - rangeMinLimit) / (rangeMaxLimit - rangeMinLimit)) * 100;
    const percentMax = ((maxValue - rangeMinLimit) / (rangeMaxLimit - rangeMinLimit)) * 100;

    highlight.style.left = `${percentMin}%`;
    highlight.style.width = `${percentMax - percentMin}%`;
  }

  rangeMin.addEventListener("input", updateValues);
  rangeMax.addEventListener("input", updateValues);

  updateValues(); // initial setup
});
