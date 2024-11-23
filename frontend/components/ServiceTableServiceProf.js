export default {
    data() {
      return {
        serviceRequests: [], 
        searchQuery: "",
      };
    },
    created() {
        this.fetchServiceRequests(); // Fetch records when the component is created
      },
    methods: {
      async fetchServiceRequests() {
        // Simulated fetch using demo data
        try {
            const response = await fetch('/api/service_request_records', {
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
        console.log("Demo data loaded for service requests.");
      },
      acceptRequest(request) {
        alert(`Request for ${request.service_name} accepted!`);
        request.status = "Accepted"; // Update status locally
      },
      rejectRequest(request) {
        const confirmed = confirm(
          `Are you sure you want to reject the service request for: ${request.service_name}?`
        );
        if (confirmed) {
          alert(`Request for ${request.service_name} rejected.`);
          request.status = "Rejected"; // Update status locally
        }
      },
    },
    computed: {
      filteredRequests() {
        return this.serviceRequests.filter((request) =>
          request.service_name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        );
      },
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
              <th>Customer</th>
              <th>Request Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in filteredRequests" :key="request.id">
              <td>{{ request.service_name }}</td>
              <td>{{ request.customer_name }}</td>
              <td>{{ request.request_date }}</td>
              <td>{{ request.status }}</td>
              <td>
                <button
                  v-if="request.status === 'Pending'"
                  @click="acceptRequest(request)"
                  class="admin-edit-btn"
                >
                  Accept
                </button>
                <button
                  v-if="request.status === 'Pending'"
                  @click="rejectRequest(request)"
                  class="admin-delete-btn"
                >
                  Reject
                </button>
                <span v-else>
                  {{ request.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  };
  