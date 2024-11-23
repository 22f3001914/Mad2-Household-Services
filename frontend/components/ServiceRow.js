export default {
    template: `
      <tr>
        <td>{{ service.name }}</td>
        <td>{{ service.base_price | currency }}</td>
        <td>{{ service.time_required }}</td>
        <td>
          <button class="btn btn-update" @click="updateService">Update</button>
          <button class="btn btn-delete" @click="deleteService">Delete</button>
        </td>
      </tr>
    `,
    props: {
      service: {
        type: Object,
        required: true
      }
    },
    methods: {
      async updateService() {
        // Implement the update functionality here
      },
      async deleteService() {
        const confirmed = confirm(`Are you sure you want to delete the service: ${this.service.name}?`);
        if (confirmed) {
          try {
            const response = await fetch(`${location.origin}/api/services/${this.service.id}`, {
              method: 'DELETE',
              headers: {
                'Authentication-Token': this.$store.state.auth_token,
              },
            });
            if (response.ok) {
              alert('Service deleted successfully!');
              this.$emit('service-deleted', this.service.id); // Emit an event to notify the parent component
            } else {
              alert('Error deleting service.');
            }
          } catch (error) {
            console.error('Error deleting service:', error);
            alert('An error occurred. Please try again.');
          }
        }
      }
    },
    filters: {
      currency(value) {
        return `$${parseFloat(value).toFixed(2)}`;
      }
    }
  };