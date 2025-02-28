// languageSwitcher.js v 1.2

const menuDropdown = document.querySelector(".p-menu-dd");
document.addEventListener("DOMContentLoaded", function () {
  var languageSwitcher = document.querySelector(".languageSwitcher");

  if (languageSwitcher) {
    var toggle = languageSwitcher.querySelector(".toggle");
    var dropdown = languageSwitcher.querySelector(".dropdown");

    toggle.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent the click from being immediately caught by the document listener
      dropdown.classList.toggle("active");
      if (menuDropdown) {
        menuDropdown.classList.remove("show");
      }
    });

    document.addEventListener("click", function (event) {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("active");
      }
    });
  }

  // Function to set a cookie
  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  // Function to get a cookie by name
  function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      while (cookie.charAt(0) === " ")
        cookie = cookie.substring(1, cookie.length);
      if (cookie.indexOf(nameEQ) === 0)
        return cookie.substring(nameEQ.length, cookie.length);
    }
    return null;
  }

  // Function to change language and save the preference in a cookie
  function changeLanguage(lang, toggle) {
    setCookie("i18n", lang, 30); // Set the language preference in a cookie for 30 days
    toggle.querySelector("img").src = `/public/flags/${lang}.svg`; // Update the toggle image
    window.location.reload(); // Reload the page
  }

  var items = document.querySelectorAll(".languageSwitcher .item");
  var toggle = document.querySelector(".languageSwitcher .toggle");

  items.forEach(function (item) {
    item.addEventListener("click", function () {
      var lang = this.getAttribute("data-value");
      changeLanguage(lang, toggle);
    });
  });

  // Highlight the currently selected language and update the toggle image
  const currentLang = getCookie("i18n") || "en";
  document.querySelectorAll(".languageSwitcher .item").forEach(function (item) {
    if (item.getAttribute("data-value") === currentLang) {
      item.classList.add("active"); // Add 'active' class to highlight the current language
    } else {
      item.classList.remove("active");
    }
  });
  toggle.querySelector("img").src = `/public/flags/${currentLang}.svg`; // Set the toggle image to the current language flag
});
