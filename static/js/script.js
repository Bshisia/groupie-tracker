const cardsPerPage = 18; // Number of artist cards per page
let currentPage = 1; // Current page
const artistCards = document.querySelectorAll(".artist-card");
const totalPages = Math.ceil(artistCards.length / cardsPerPage);
// Display the current page of artist cards
const showPage = (page) => {
  const start = (page - 1) * cardsPerPage;
  const end = page * cardsPerPage;
  artistCards.forEach((card, index) => {
    card.style.display = index >= start && index < end ? "block" : "none";
  });
  document.getElementById(
    "page-info"
  ).textContent = `Page ${page} of ${totalPages}`;
  document.getElementById("prev-page").disabled = page === 1;
  document.getElementById("next-page").disabled = page === totalPages;
};
// Change page function (prev or next)
const changePage = (direction) => {
  currentPage += direction;
  showPage(currentPage);
};
// Initially display the first page
showPage(currentPage);
const filterArtists = () => {
  const searchQuery = document
    .getElementById("search-bar")
    .value.toLowerCase();
  const container = document.querySelector(".suggestions");
  container.innerHTML = "";
  if (searchQuery === "") {
    container.style.display = "none";
    showPage(currentPage);
    return;
  }
  container.style.display = "block";
  let suggestionsAdded = false;
  artistCards.forEach((card) => {
    const artistName = card.querySelector("h2").textContent;
    const artistId = card.getAttribute("data-id");
    const artistMembers = card
      .getAttribute("data-members")
      .split(",")
      .map((member) => member.trim())
      .filter((member) => member !== ""); // Filter out empty strings
    const artistLocations = card
      .getAttribute("data-locations")
      .split(",")
      .map((location) => location.trim())
      .filter((location) => location !== ""); // Filter out empty strings
    const artistFirstAlbum = card.getAttribute("data-firstalbum");
    const artistCreationDate = card.getAttribute("data-creationdate");
    // Check artist name
    if (artistName.toLowerCase().includes(searchQuery)) {
      createSuggestion(container, `${artistName} - artist/band`, artistId);
      suggestionsAdded = true;
    }
    // Check creation date
    if (artistCreationDate.toLowerCase().includes(searchQuery)) {
      createSuggestion(
        container,
        `${artistCreationDate} - creation date of ${artistName}`,
        artistId
      );
      suggestionsAdded = true;
    }
    // Check first album
    if (artistFirstAlbum.toLowerCase().includes(searchQuery)) {
      createSuggestion(
        container,
        `${artistFirstAlbum} - first album of ${artistName}`,
        artistId
      );
      suggestionsAdded = true;
    }
    // Check members
    artistMembers.forEach((member) => {
      if (member.toLowerCase().includes(searchQuery)) {
        createSuggestion(
          container,
          `${member} - member of ${artistName}`,
          artistId
        );
        suggestionsAdded = true;
      }
    });
    // Check locations
    artistLocations.forEach((location) => {
      if (location.toLowerCase().includes(searchQuery)) {
        createSuggestion(
          container,
          `${location} - location of ${artistName}`,
          artistId
        );
        suggestionsAdded = true;
      }
    });
  });
  if (!suggestionsAdded) {
    container.innerHTML = "<p>No matches found</p>";
  }
};
const createSuggestion = (container, textContent, artistId) => {
  const button = document.createElement("button");
  button.textContent = textContent;
  button.className = "suggestion-button";
  button.addEventListener("click", () => {
    window.location.href = `/details/${artistId}`;
  });
  container.appendChild(button);
};
// Close suggestions when clicking outside
document.addEventListener("click", function (event) {
  const container = document.querySelector(".suggestions");
  const searchBar = document.getElementById("search-bar");
  if (!container.contains(event.target) && event.target !== searchBar) {
    container.style.display = "none";
  }
});

// Update range display
function updateCreationRangeLabel(value) {
  document.getElementById("creationRangeLabel").textContent = value;
}
// Toggle filter menu visibility
function toggleFilters() {
  document.getElementById("filterMenu").classList.toggle("active");
}

// Close filters when clicking outside
document.addEventListener('click', (event) => {
  const filterMenu = document.getElementById('filterMenu');
  const filterButton = event.target.closest('.filter-button');
  const filterMenuElement = event.target.closest('.filter-menu');
  
  if (!filterButton && !filterMenuElement && filterMenu.classList.contains('active')) {
      filterMenu.classList.remove('active');
  }
});

// Populate years in filter (add this to your initialization code)
function populateYearFilter() {
  const yearFilter = document.getElementById('yearFilter');
  const currentYear = new Date().getFullYear();
  const startYear = 1960; // You can adjust this

  for (let year = currentYear; year >= startYear; year--) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearFilter.appendChild(option);
  }
}

// Modified filterArtists function to include filter criteria
// Apply filters based on selected values
function applyFilters() {
  const creationYear = document.getElementById("creationRange").value;
  const memberCount = document.getElementById("membersFilter").value;
  const locations = Array.from(document.querySelectorAll("input[name='location']:checked")).map(loc => loc.value);
  
  artistCards.forEach(card => {
      let displayCard = true;
      
      // Filter by creation date
      if (creationYear) {
          displayCard = card.dataset.creationdate <= creationYear;
      }
      
      // Filter by number of members
      if (displayCard && memberCount) {
          const cardMemberCount = parseInt(card.dataset.members.split(",").length);
          displayCard = (memberCount === "5+" ? cardMemberCount >= 5 : cardMemberCount === parseInt(memberCount));
      }
      
      // Filter by locations
      if (displayCard && locations.length > 0) {
          const cardLocations = card.dataset.locations.split(",");
          displayCard = locations.some(location => cardLocations.includes(location));
      }
      
      // Toggle card display based on filters
      card.style.display = displayCard ? "block" : "none";
  });
  
  // Hide filter menu after applying filters
  document.getElementById("filterMenu").classList.remove("active");
}

// Add this to your initialization
document.addEventListener('DOMContentLoaded', () => {
  initializeArtists();
  populateYearFilter();
});