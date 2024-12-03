import RatingForm from "./RatingForm.js";

export default {
  data() {
    return {
      serviceRequests: [],
      searchQuery: "",
      showModal: false, // Control the visibility of the modal
      selectedRequest: null,
    };
  },
  created() {
    this.fetchServiceRequests(); // Fetch records when the component is created
  },
  methods: {
    async fetchServiceRequests() {
      try {
        const response = await fetch('/api/my_requested_services', {
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
    async reviewRequest(request) {
      this.showModal = true; // Show the modal
      this.selectedRequest = request;
    },
    async closeRequest(request) {
      try {
        const response = await fetch(`/api/service_request_records/`+request.id +"/completed", {
          method: 'PUT',
          headers: {
            'Authentication-Token': this.$store.state.auth_token,
          },
        });
        if (response.ok) {
          alert(`Request for ${request.service_name} closed.`);
          request.status = "closed"; // Update status locally
          this.fetchServiceRequests(); // Refresh the list
        } else {
          alert('Error closing service request.');
        }
      } catch (error) {
        console.error('Error closing service request:', error);
        alert('An error occurred. Please try again.');
      }

    },
    async cancelRequest(request) {
      const confirmed = confirm(
        `Are you sure you want to cancel the service request for: ${request.service_name}?`
      );
      if (confirmed) {
        try {
          const response = await fetch(`/api/service_request_records/${request.id}/cancel`, {
            method: 'PUT',
            headers: {
              'Authentication-Token': this.$store.state.auth_token,
            },
          });
          if (response.ok) {
            alert(`Request for ${request.service_name} canceled.`);
            request.status = "Canceled"; // Update status locally
            this.fetchServiceRequests(); // Refresh the list
          } else {
            alert('Error canceling service request.');
          }
        } catch (error) {
          console.error('Error canceling service request:', error);
          alert('An error occurred. Please try again.');
        }
      }
    },
    closeModal() {
      this.showModal = false; // Close the modal
      this.fetchServiceRequests(); // Refresh the list
    },
  },
  computed: {
    filteredRequests() {
      return this.serviceRequests.filter((request) =>
        request.service_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (request.professional_name && request.professional_name.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    },
  },
  components: {
    RatingForm,
  },
  template: `
  <div class="admin-service-table">
    <div class="admin-header">
      <input
        type="text"
        placeholder="Search requests..."
        v-model="searchQuery"
        class="admin-search-bar"
      />
    </div>
    <table class="admin-table">
      <thead>
        <tr>
          <th>Service Name</th>
          <th>Request Date</th>
          <th>Professional</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="request in filteredRequests" :key="request.id">
          <td>{{ request.service_name }}</td>
          <td>{{ new Date(request.date_of_request).toLocaleString() }}</td>
          <td>{{ request.professional_name || "Not Assigned" }}</td>
          <td>{{ request.service_status }}</td>
          <td>
            <button
              v-if="request.service_status === 'Ongoing'"
              @click="closeRequest(request)"
              class="admin-edit-btn"
            >
              Close
            </button>
            <button
              v-if="request.service_status === 'requested'"
              @click="cancelRequest(request)"
              class="admin-delete-btn"
            >
              Cancel
            </button>
            <button
              v-if="request.service_status === 'Completed'"
              @click="reviewRequest(request)"
              class="admin-edit-btn"
            >
              Review
            </button>
          </td>
        </tr>
        <tr v-if="filteredRequests.length === 0">
          <td colspan="6" class="no-data-message">No service requests found.</td>
        </tr>
      </tbody>
    </table>

    <!-- Custom Modal -->
    <div v-if="showModal" class="custom-modal">
      <div class="custom-modal-content">
        <button class="custom-modal-close" @click="closeModal">&times;</button>
        <!-- Render the RatingForm component here -->
        <RatingForm :request="selectedRequest" @review-submitted="closeModal" />
      </div>
      <div class="custom-modal-overlay" @click="closeModal"></div>
    </div>
  </div>
  `,
};