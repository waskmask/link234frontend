document.addEventListener("DOMContentLoaded", () => {
  const menuBurger = document.querySelector(".menu_burger");
  const menu = document.querySelector(".menu");
  const menuOverlay = document.querySelector(".menu_overlay");
  const menuClose = document.querySelector(".menu_close");

  // Check if elements exist
  if (menuBurger && menu && menuOverlay) {
    // Show menu and overlay
    menuBurger.addEventListener("click", () => {
      menu.classList.add("show");
      menuOverlay.style.display = "block";
    });

    // Hide menu and overlay
    const hideMenu = () => {
      menu.classList.remove("show");
      menuOverlay.style.display = "none";
    };

    if (menuOverlay) {
      menuOverlay.addEventListener("click", hideMenu);
    }

    if (menuClose) {
      menuClose.addEventListener("click", hideMenu);
    }
  }

  const menuHeader = document.querySelector(".p-menu-header");
  const menuDropdown = document.querySelector(".p-menu-dd");

  const languageSwitcher = document.querySelector(".languageSwitcher");
  const lDropdown = languageSwitcher.querySelector(".dropdown");
  if (menuHeader && menuDropdown) {
    // Add "show" class on clicking the header
    menuHeader.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent the event from propagating to the document
      menuDropdown.classList.toggle("show"); // Toggle the "show" class

      lDropdown.classList.remove("active");
    });

    // Remove "show" class when clicking outside the dropdown
    document.addEventListener("click", (event) => {
      if (
        !menuDropdown.contains(event.target) &&
        !menuHeader.contains(event.target)
      ) {
        menuDropdown.classList.remove("show");
      }
    });
  }

  const copyLinkElement = document.querySelector(".copy-mylink");

  if (copyLinkElement) {
    copyLinkElement.addEventListener("click", () => {
      const urlToCopy = copyLinkElement.getAttribute("data-value");

      // Copy the URL to the clipboard
      navigator.clipboard
        .writeText(urlToCopy)
        .then(() => {
          // Temporarily replace the content with "Link Copied"
          const originalContent = copyLinkElement.innerHTML;
          copyLinkElement.innerHTML = "Link Copied!";

          // Revert back to the original content after 2 seconds
          setTimeout(() => {
            copyLinkElement.innerHTML = originalContent;
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy text:", err);
        });
    });
  }

  // Get the buttons
  const downloadSVGButton = document.getElementById("downloadSVG");
  const downloadPNGButton = document.getElementById("downloadPNG");

  // Download function
  const downloadImage = async (url) => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    // Extract the filename from the URL
    const urlParts = url.split("/");
    const filename = urlParts[urlParts.length - 1];

    // Construct the API endpoint URL with the dynamic filename query parameter
    // const downloadUrl = `http://localhost:3000/api/download?filename=${encodeURIComponent(
    //   filename
    // )}`;
    const downloadUrl = `https://api.link234.com/api/download?filename=${encodeURIComponent(
      filename
    )}`;
    try {
      // Fetch the file from your API as a blob
      const response = await fetch(downloadUrl, {
        method: "GET",
        // If you're serving this endpoint from the same domain, mode can be omitted.
        mode: "cors",
        credentials: "include", // include cookies if required
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch file.");
      }
      const blob = await response.blob();

      // Create a temporary object URL for the blob
      const objectURL = URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const anchor = document.createElement("a");
      anchor.href = objectURL;
      anchor.download = filename; // Set the download attribute to the filename
      document.body.appendChild(anchor); // Append to the DOM
      anchor.click(); // Trigger the download
      document.body.removeChild(anchor); // Remove the anchor element

      // Revoke the object URL to free memory
      URL.revokeObjectURL(objectURL);
    } catch (error) {
      console.error("Error downloading image:", error.message);
    }
  };

  // Attach event listeners
  if (downloadSVGButton) {
    downloadSVGButton.addEventListener("click", () => {
      const url = downloadSVGButton.getAttribute("data-value");
      downloadImage(url); // Download the SVG using the API endpoint
    });
  }

  if (downloadPNGButton) {
    downloadPNGButton.addEventListener("click", () => {
      const url = downloadPNGButton.getAttribute("data-value");
      downloadImage(url); // Download the PNG using the API endpoint
    });
  }

  const toDashboardButton = document.getElementById("toDashboard");
  const toLoginButton = document.getElementById("toLogin");
  const toRegisterButton = document.getElementById("toRegister");
  const toLogoutButton = document.getElementById("logoutButton");
  if (toDashboardButton) {
    toDashboardButton.addEventListener("click", () => {
      window.location.href = "/dashboard";
    });
  }

  if (toLoginButton) {
    toLoginButton.addEventListener("click", () => {
      window.location.href = "/login";
    });
  }
  if (toRegisterButton) {
    toRegisterButton.addEventListener("click", () => {
      window.location.href = "/signup";
    });
  }

  if (toLogoutButton) {
    toLogoutButton.addEventListener("click", () => {
      document.cookie =
        "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

      // Redirect to the login page or home page
      window.location.href = "/login";
    });
  }
});
