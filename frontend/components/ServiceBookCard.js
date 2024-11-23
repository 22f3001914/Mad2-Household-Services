export default {
  props: ['service_id'],
  data() {
    return {
      serviceDetails: {}, // Object to hold the service details
    };
  },
  mounted() {
    this.fetchServiceDetails();
  },
  methods: {
    async fetchServiceDetails() {
      try {
        const response = await fetch(`/api/services/${this.service_id}`);
        if (response.ok) {
          const data = await response.json();
          this.serviceDetails = data; // Save the service data to serviceDetails
        } else {
          console.error('Failed to fetch service details');
        }
      } catch (error) {
        console.error('Error fetching service details:', error);
      }
    },
    async requestService() {
      const customerId = this.$store.state.id; // Get the customer ID from Vuex store

      try {
        const response = await fetch('/api/service_requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.$store.state.auth_token, // Use the auth token from Vuex store
          },
          body: JSON.stringify({
            service_id: this.service_id,
            customer_id: customerId,
            service_status: 'requested',
          }),
        });

        if (response.ok) {
          alert('Service requested, kindly wait for it to be allotted to a service professional.');
        } else {
          console.error('Failed to request service');
          alert('There was an error requesting the service. Please try again later.');
        }
      } catch (error) {
        console.error('Error making service request:', error);
        alert('There was an error requesting the service. Please try again later.');
      }
    },
  },
  template: `
    <div class="service-card">
      <div class="service-details">
        <h3 class="service-title">{{ serviceDetails.name || 'Service Title' }}</h3>
        <div class="rating">
          <span class="star">★</span>
          <span>{{ serviceDetails.rating || '0' }}</span>
          <span class="reviews">({{ serviceDetails.reviews || '0' }} reviews)</span>
        </div>
        <div class="price">
          <span class="discounted-price">₹{{ serviceDetails.base_price || '0' }}</span>
          <span class="original-price">₹{{ serviceDetails.original_price || '0' }}</span>
        </div>
        <div class="duration">{{ serviceDetails.time_required || 'Time Required' }}</div>
        <a href="#" class="details-link">View details</a>
      </div>
      <div class="icon-container">
        <!-- Display the service image -->
        <img :src="serviceDetails.image || '/path/to/default/image.jpg'" alt="Service Image" class="service-image"/>
        <div class="icon">2<br/>BATHROOMS</div>
        <button @click="requestService" class="add-button">Request</button>
      </div>
    </div>
  `,
};
