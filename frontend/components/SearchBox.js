export default {
    template: `
      <section class="search-section">
        <div class="search-container">
          <h1 class="search-title">Your One-Stop Solution for Home Services</h1>
          <p class="search-subtitle">Find trusted professionals for all your household needs</p>
          <div class="search-bar">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search for a service"
              class="search-input"
            />
            <button @click="handleSearch" class="search-button">
              <i class="bi bi-search search-icon"></i> <span class="search-text">Search</span>
            </button>
          </div>
        </div>
      </section>
    `,
    data() {
      return {
        searchQuery: "",
      };
    },
    methods: {
      handleSearch() {
        if (this.searchQuery.trim()) {
          // Handle the search action here
          console.log("Searching for:", this.searchQuery);
        }
      },
    },
  };