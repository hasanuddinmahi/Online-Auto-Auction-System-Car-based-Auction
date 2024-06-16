const rangeInput = document.querySelectorAll(".range-input input"),
      priceInput = document.querySelectorAll(".price-input input"),
      range = document.querySelector(".slider .progress");
let priceGap = 1000;

function updateRangeStyles(minPrice, maxPrice) {
  range.style.left = ((minPrice - rangeInput[0].min) / (rangeInput[0].max - rangeInput[0].min)) * 100 + "%";
  range.style.right = 100 - ((maxPrice - rangeInput[1].min) / (rangeInput[1].max - rangeInput[1].min)) * 100 + "%";
}

priceInput.forEach(input => {
  input.addEventListener("input", e => {
    let minPrice = parseInt(priceInput[0].value),
        maxPrice = parseInt(priceInput[1].value);

    if (minPrice < parseInt(priceInput[0].min)) {
      minPrice = parseInt(priceInput[0].min);
    } else if (minPrice > parseInt(priceInput[1].max) - priceGap) {
      minPrice = parseInt(priceInput[1].max) - priceGap;
    }

    if (maxPrice > parseInt(priceInput[1].max)) {
      maxPrice = parseInt(priceInput[1].max);
    } else if (maxPrice < parseInt(priceInput[0].min) + priceGap) {
      maxPrice = parseInt(priceInput[0].min) + priceGap;
    }

    priceInput[0].value = minPrice;
    priceInput[1].value = maxPrice;

    if ((maxPrice - minPrice >= priceGap) && maxPrice <= rangeInput[1].max) {
      if (e.target.className === "input-min") {
        rangeInput[0].value = minPrice;
        updateRangeStyles(minPrice, maxPrice);
      } else {
        rangeInput[1].value = maxPrice;
        updateRangeStyles(minPrice, maxPrice);
      }
    }
  });
});

rangeInput.forEach(input => {
  input.addEventListener("input", e => {
    let minVal = parseInt(rangeInput[0].value),
        maxVal = parseInt(rangeInput[1].value);

    if ((maxVal - minVal) < priceGap) {
      if (e.target.className === "range-min") {
        rangeInput[0].value = maxVal - priceGap;
      } else {
        rangeInput[1].value = minVal + priceGap;
      }
    } else {
      priceInput[0].value = minVal;
      priceInput[1].value = maxVal;
      updateRangeStyles(minVal, maxVal);
    }
  });
});