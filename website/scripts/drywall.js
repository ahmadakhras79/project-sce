// Fetch drywalls from the API and display them
async function fetchDrywalls() {
    try {
      const response = await fetch("/api/drywalls"); // Fetch drywalls from the server
      const drywalls = await response.json(); // Parse the JSON response
      const container = document.getElementById("drywall-container");

      // Clear container before rendering
      container.innerHTML = "";

      // Render each drywall product
      drywalls.forEach((drywall) => {
        const drywallCard = document.createElement("div");
        drywallCard.classList.add("content");
        drywallCard.innerHTML = `
          <img src="${drywall.image || "images/default-drywall.jpg"}" alt="${
          drywall.name
        }" />
          <h3>${drywall.name}</h3>
          <p>Quality: ${drywall.quality}</p>
          <h6>$${drywall.price}</h6>
          <div class="rating"
          ${getStars(drywall.rating)}
          </div>
          <button>Add to Cart</button>
        `;
        container.appendChild(drywallCard);
      });
    } catch (error) {
      console.error("Failed to fetch drywalls:", error);
    }
  }
  function getStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += `<i class="fa fa-star ${i <= rating ? 'checked': ''}"></i>`;
    }
    return stars;
  }
  
  // Load drywalls on page load
  window.onload = fetchDrywalls;