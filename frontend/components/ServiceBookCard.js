export default {
  props: ["service_id"],
  data() {
    return {
      serviceDetails: {}, // Object to hold the service details
      requestInProgress: false, // To disable button temporarily
    };
  },
  mounted() {
    this.fetchServiceDetails();
  },
  computed: {
    imageUrl() {
      return `../static/static/images/${this.serviceDetails.image}`;
    },
  },
  methods: {
    async fetchServiceDetails() {
      try {
        const response = await fetch(`/api/services/${this.service_id}`);
        if (response.ok) {
          const data = await response.json();
          this.serviceDetails = data; // Save the service data to serviceDetails
        } else {
          console.error("Failed to fetch service details");
        }
      } catch (error) {
        console.error("Error fetching service details:", error);
      }
    },
    async requestService() {
      if (this.requestInProgress) return; // Prevent multiple clicks
    
      this.requestInProgress = true; // Disable button immediately after click
      const customerId = this.$store.state.id; // Get the customer ID from Vuex store
    
      try {
        const response = await fetch("/api/service_requests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authentication-Token": this.$store.state.auth_token, // Use the auth token from Vuex store
          },
          body: JSON.stringify({
            service_id: this.service_id,
            customer_id: customerId,
            service_status: "requested",
          }),
        });
    
        if (response.ok) {
          alert(
            "Service requested, kindly wait for it to be allotted to a service professional."
          );
    
          // Automatically enable the button after 10 seconds
          setTimeout(() => {
            this.requestInProgress = false;
          }, 10000);
        } else {
          console.error("Failed to request service");
          alert(
            "There was an error requesting the service. Please try again later."
          );
          this.requestInProgress = false; // Re-enable button on error
        }
      } catch (error) {
        console.error("Error making service request:", error);
        alert(
          "There was an error requesting the service. Please try again later."
        );
        this.requestInProgress = false; // Re-enable button on error
      }
    },
  },
  template: `
    <div class="service-card">
      <div class="service-details">
        <h3 class="service-title">{{ serviceDetails.name || 'Service Title' }}</h3>
        <div class="rating">
          <span class="star">★</span>
          <span>{{ serviceDetails.average_rating || '0' }}</span>
          <span class="reviews">({{ serviceDetails.num_ratings || '0' }} reviews)</span>
        </div>
        <div class="price">
          <span class="discounted-price">₹{{ serviceDetails.base_price || '0' }}</span>
          <span class="original-price">₹{{ serviceDetails.mrp || '0' }}</span>
        </div>
        <div class="duration">{{ serviceDetails.time_required || 'Time Required' }}</div>
        <a href="#" class="details-link">View details</a>
      </div>
      <div class="icon-container">
        <!-- Display the service image -->
      
        <div class="component-container">
  <img :src="imageUrl" alt="Service Image" class="component-image">
  <button 
  @click="requestService" 
  class="component-button btn btn-dark" 
  :disabled="requestInProgress">
  {{ requestInProgress ? "Requested" : "Request" }}
</button>
</div>

      </div>
    </div>
  `,
};
