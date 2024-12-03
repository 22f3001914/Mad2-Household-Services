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
        try {
          const response = await fetch('/api/get_all_requests', {
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
    computed: {
      filteredRequests() {
        return this.serviceRequests.filter((request) =>
          request.service_name?.toLowerCase().includes(this.searchQuery?.toLowerCase()) ||
          (request.customer_name && request.customer_name?.toLowerCase().includes(this.searchQuery?.toLowerCase())) ||
          (request.professional_name && request.professional_name?.toLowerCase().includes(this.searchQuery?.toLowerCase()))
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
            <th>Customer Name</th>
            <th>Request Date</th>
            <th>Professional</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in filteredRequests" :key="request.id">
            <td>{{ request.service_name }}</td>
            <td>{{ request.customer_name }}</td>
            <td>{{ new Date(request.date_of_request).toLocaleString() }}</td>
            <td>{{ request.professional_name || "Not Assigned" }}</td>
            <td>{{ request.service_status }}</td>
          </tr>
          <tr v-if="filteredRequests.length === 0">
            <td colspan="5" class="no-data-message">No service requests found.</td>
          </tr>
        </tbody>
      </table>
    </div>
    `,
  };