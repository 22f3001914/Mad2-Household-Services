import CompletedCards from "./CompletedCards.js";

export default {
  template: `
    <div class="admin-page completed-services-page">
      <div v-if="serviceRequests.length === 0" class="no-services-message">
        No completed services found.
      </div>
      <div class="completed-card-main" v-else>
        <CompletedCards
          v-for="service in serviceRequests"
          :key="service.id"
          :completedService="service"
        />
      </div>
    </div>
  `,
  components: {
    CompletedCards,
  },
  data() {
    return {
      serviceRequests: [],
    };
  },
  created() {
    this.fetchServiceRequests(); // Fetch records when the component is created
  },
  methods: {
    async fetchServiceRequests() {
      try {
        const response = await fetch('/api/my_completed_services', {
          headers: {
            'Authentication-Token': this.$store.state.auth_token,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        this.serviceRequests = await response.json();
      } catch (error) {
        console.error('Error fetching records:', error);
        alert('Failed to fetch records. Please try again later.');
      }
    },
  },
};