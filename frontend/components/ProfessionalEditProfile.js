export default {
    props: ["user"],
    template: `   
      <div class="register-form-container m-0">
        <h2 class="form-title">Edit Profile for {{ user.name }}</h2>
        <p class="form-subtitle">Update your details below</p>
        <div class="form-content">
          <div class="form-column">
            <input class="input-field" type="email" placeholder="Email" v-model="email" disabled />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            <input class="input-field" placeholder="Name" v-model="name" />
            <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            <input class="input-field" placeholder="Location" v-model="location" />
            <span v-if="errors.location" class="error-message">{{ errors.location }}</span>
            <label>Profile Picture: </label>
            <input class="input-field" type="file" placeholder="Image URL" @change="handleImageChange" />
          </div>
  
          <div class="form-column">
            <input class="input-field" type="text" placeholder="Description" v-model="description" />
            <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
            <select class="input-field" v-model="service_type">
              <option disabled value="">Select Service Type</option>
              <option v-for="service in services" :key="service" :value="service">
                {{ service }}
              </option>
              <option value="not_listed">Not Listed</option>
            </select>
            <span v-if="errors.service_type" class="error-message">{{ errors.service_type }}</span>
            <input class="input-field" type="number" placeholder="Experience (years)" v-model="experience" />
            <span v-if="errors.experience" class="error-message">{{ errors.experience }}</span>
            <label>Resume: </label>
            <input class="input-field" type="file" placeholder="Resume URL" @change="handleResumeChange" />
          </div>
        </div>
        <button class="submit-button" @click="submitProfileUpdate">
          <i class="bi bi-save login-icon mr-2"></i> Save Changes
        </button>
        <p v-if="message">{{ message }}</p>
      </div>`,
    data() {
      return {
        email: this.user.email,
        name: this.user.name,
        location: this.user.location,
        image: null,
        description: this.user.description,
        service_type: this.user.service_type,
        experience: this.user.experience,
        resume: null,
        message: "",
        services: [],
        errors: {}
      };
    },
    async mounted() {
      try {
        const res = await fetch(location.origin + "/api/services_name");
        if (res.ok) {
          this.services = await res.json();
        } else {
          console.error("Error fetching services:", res.statusText);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    },
    methods: {
      handleImageChange(event) {
        this.image = event.target.files[0];
      },
      handleResumeChange(event) {
        this.resume = event.target.files[0];
      },
      validateForm() {
        this.errors = {};
  
        if (!this.name) {
          this.errors.name = "Name is required.";
        }
        if (!this.location) {
          this.errors.location = "Location is required.";
        }
        if (!this.description) {
          this.errors.description = "Description is required.";
        }
        if (!this.service_type) {
          this.errors.service_type = "Service type is required.";
        }
        if (!this.experience) {
          this.errors.experience = "Experience is required.";
        } else if (isNaN(this.experience) || this.experience <= 0) {
          this.errors.experience = "Experience must be a positive number.";
        }
  
        return Object.keys(this.errors).length === 0;
      },
      async submitProfileUpdate() {
        if (!this.validateForm()) {
          return;
        }
  
        let payload = new FormData();
        payload.append("name", this.name);
        payload.append("location", this.location);
        if (this.image) payload.append("image", this.image);
        payload.append("description", this.description);
        payload.append("service_type", this.service_type);
        payload.append("experience", this.experience);
        if (this.resume) payload.append("resume", this.resume);
  
        try {
          const res = await fetch(`${location.origin}/api/users/${this.user.id}`, {
            headers: {
              "Authentication-Token": this.$store.state.auth_token
            },
            method: "PUT",
            body: payload
          });
          if (res.ok) {
            this.message = "Profile updated successfully!";
            this.$emit('profile-updated');
          } else {
            this.message = "Profile update failed. Please try again.";
          }
          
        } catch (error) {
          this.message = "An error occurred. Please try again.";
          console.error(error);
        }
      }
    }
  };
  