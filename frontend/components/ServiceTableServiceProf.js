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
    },
    async acceptRequest(request) {
      try {
        const response = await fetch(`/api/service_request_records/${request.id}/accept`, {
          method: 'PUT',
          headers: {
            'Authentication-Token': this.$store.state.auth_token,
          },
        });
        if (response.ok) {
          alert(`Request for ${request.service_name} accepted!`);
          request.status = "Accepted"; // Update status locally
          this.fetchServiceRequests(); // Refresh the list
        } else {
          alert('Error accepting service request.');
        }
      } catch (error) {
        console.error('Error accepting service request:', error);
        alert('An error occurred. Please try again.');
      }
    },
    async rejectRequest(request) {
      const confirmed = confirm(
        `Are you sure you want to reject the service request for: ${request.service_name}?`
      );
      if (confirmed) {
        try {
          const response = await fetch(`/api/service_request_records/${request.id}/reject`, {
            method: 'PUT',
            headers: {
              'Authentication-Token': this.$store.state.auth_token,
            },
          });
          if (response.ok) {
            alert(`Request for ${request.service_name} rejected.`);
            request.status = "Rejected"; // Update status locally
            this.fetchServiceRequests(); // Refresh the list
          } else {
            alert('Error rejecting service request.');
          }
        } catch (error) {
          console.error('Error rejecting service request:', error);
          alert('An error occurred. Please try again.');
        }
      }
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
            <td>{{ new Date(request.date_of_request).toLocaleString() }}</td>
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
              <button
                v-if="request.status === 'Accepted'"
                @click="closeRequest(request)"
                class="admin-edit-btn"
              >
                Close
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