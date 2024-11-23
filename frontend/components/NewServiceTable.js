import AddServiceForm from "./AddServiceForm.js";
import EditServiceForm from "./EditServiceForm.js";
export default {
  data() {
    return {
      services: [], // Array to store service data
      searchQuery: "",
      showModal: false, // Control the visibility of the modal
      showEditModal: false,
      selectedService: null,
    };
  },
  created() {
    this.fetchServices(); // Fetch services when the component is created
  },
  methods: {
    async fetchServices() {
      try {
        const response = await fetch(location.origin + "/api/services");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        this.services = await response.json();
      } catch (error) {
        console.error("Error fetching services:", error);
        alert("Failed to fetch services. Please try again later.");
      }
    },
    editService(service) {
      this.showEditModal = true; // Show the modal when the button is clicked
      this.selectedService = service;
    },
    async deleteService(service) {
      const confirmed = confirm(
        `Are you sure you want to delete the service: ${service.name}?`
      );
      if (confirmed) {
        try {
          const response = await fetch(
            `${location.origin}/api/services/${service.id}`,
            {
              method: "DELETE",
              headers: {
                "Authentication-Token": this.$store.state.auth_token,
              },
            }
          );
          if (response.ok) {
            alert("Service deleted successfully!");
            this.services = this.services.filter((s) => s.id !== service.id);
          } else {
            alert("Error deleting service.");
          }
        } catch (error) {
          console.error("Error deleting service:", error);
          alert("An error occurred. Please try again.");
        }
      }
    },
    addService() {
      this.showModal = true; // Show the modal when the button is clicked
    },

    closeModal() {
      this.showModal = false; // Close the modal
      this.fetchServices();
    },
    closeEditModal(updatedService) {
      this.showEditModal = false;
  this.selectedService = null;

  if (updatedService) {
    const index = this.services.findIndex((s) => s.id === updatedService.id);
    if (index !== -1) {
      this.$set(this.services, index, updatedService); // Reactively update service
    }
  } this.fetchServices();
    },

  },
  computed: {
    filteredServices() {
      return this.services.filter((service) =>
        service.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  components: {
    AddServiceForm,
    EditServiceForm,
  },
  template: `
    <div class="admin-service-table">
      <div class="admin-header">
        <input
          type="text"
          placeholder="Search services..."
          v-model="searchQuery"
          class="admin-search-bar"
        />
        <button @click="addService" class="admin-add-service-btn">Add New Service</button>
      </div>
      <table class="admin-table">
        <thead>
          <tr>
            <th>Service Name</th>
            <th>Base Price</th>
            <th>Time Required</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="service in filteredServices" :key="service.id">
            <td>{{ service.name }}</td>
            <td>{{ service.base_price }}</td>
            <td>{{ service.time_required }}</td>
            <td>
              <button @click="editService(service)" class="admin-edit-btn">Edit</button>
              <button @click="deleteService(service)" class="admin-delete-btn">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Custom Modal -->
      <div v-if="showModal" class="custom-modal" >
        <div class="custom-modal-content">
        <button class="custom-modal-close" @click="closeModal">&times;</button>

          <!-- Render the AddServiceForm component here -->
          <AddServiceForm @service-added="closeModal" />
        </div>
        <div class="custom-modal-overlay" @click="closeModal"></div>
      </div>

      <!-- Custom Edit Modal -->
      <div v-if="showEditModal" class="custom-modal" >
        <div class="custom-modal-content">
          <button class="custom-modal-close" @click="closeEditModal">&times;</button>
          <!-- Render the AddServiceForm component here -->
          <EditServiceForm :service="selectedService" @service-edited="closeEditModal" />
        </div>
        <div class="custom-modal-overlay" @click="closeEditModal"></div>
      </div>



      
    </div>
    
  `,
};
