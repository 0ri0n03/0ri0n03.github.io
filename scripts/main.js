const button = document.getElementById("cv");
const popupBackground = document.querySelector(".backgroundpopup");

button.addEventListener("click", () => {
  popupBackground.classList.add("visible");
});

popupBackground.addEventListener("click", (event) => {
  if (event.target === popupBackground) {
    popupBackground.classList.remove("visible");
  }
});
