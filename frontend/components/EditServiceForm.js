export default {
    props: {
      service: {
        type: Object,
        required: true, // Ensure a service object is provided
      },
    },
    data() {
      return {
        localService: { ...this.service }, // Create a local copy for editing
      };
    },
    template: `
      <div class="form-container">
        <h2 class="form-title">Edit Service</h2>
        <input
          type="text"
          v-model="localService.name"
          class="input-field"
          placeholder="Service Name"
          required
        />
        <input
          type="number"
          v-model="localService.base_price"
          class="input-field"
          step="0.01"
          placeholder="Base Price"
          required
        />
        <input
          type="text"
          v-model="localService.time_required"
          class="input-field"
          placeholder="Time Required (e.g., 1 hour)"
        />
        <textarea
          v-model="localService.description"
          class="input-field"
          placeholder="Enter service description"
        ></textarea>
        <input type="file" @change="onFileChange" class="input-field" />
  
        <button @click="updateService" class="submit-button">
          <i class="bi bi-check-circle login-icon mr-2"></i> Save Changes
        </button>
      </div>
    `,
    methods: {
      onFileChange(e) {
        this.localService.image = e.target.files[0];
      },
      async updateService() {
        const formData = new FormData();
        formData.append("name", this.localService.name);
        formData.append("base_price", this.localService.base_price);
        formData.append("time_required", this.localService.time_required);
        formData.append("description", this.localService.description);
        if (this.localService.image) {
          formData.append("image", this.localService.image);
        }
    
        try {
          const response = await fetch(`/api/services/${this.localService.id}`, {
            method: "PUT",
            headers: {
              "Authentication-Token": this.$store.state.auth_token,
            },
            body: formData,
          });
          if (response.ok) {
            const updatedService = await response.json(); // Assuming API returns the updated service
            alert("Service updated successfully!");
            this.$emit('service-edited', updatedService);
          } else {
            alert("Error updating service.");
          }
        } catch (error) {
          console.error(error);
          alert("An error occurred.");
        }
      },
    },
  };
  