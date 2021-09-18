"use strict";
// 14 - Timeline JS

// Get HTML <li> elements
const listItems = document.querySelectorAll(".timeline li");
console.log(listItems);

// Function to check if an element is in the viewport
// See also: http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
function isElementInViewport(el){
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 && 
    rect.left >= 0 && 
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Callback function that loops through the <li> elements and adds the "in-view" class if they are in the viewport
function checkView() {
  listItems.forEach((listItem) => {
    if (isElementInViewport(listItem)) {
      listItem.classList.add("in-view");
    }
  });
}

// Add events that trigger above callbackFn on windows load, resize and scroll
window.addEventListener("load", checkView);
window.addEventListener("resize", checkView);
window.addEventListener("scroll", checkView);
