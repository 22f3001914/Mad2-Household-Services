import company from "../utlis/company.js";

export default {
  props: ['userId'],
  template: `
    <div class="center-container" style="height:auto;">
      <div class="form-container">
        <h2 class="form-title">Edit Profile for {{ company.name }} - User</h2>
        <p class="form-subtitle">Update your details below</p>
        <input class="input-field" type="email" placeholder="Email" v-model="email" disabled />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        <input class="input-field" placeholder="Name" v-model="name" />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        <input class="input-field" placeholder="Location" v-model="location" />
        <span v-if="errors.location" class="error-message">{{ errors.location }}</span>
        <input class="input-field" type="file" placeholder="Image URL" @change="handleImageChange" />

        <button class="submit-button" @click="submitEdit">
          <i class="bi bi-save login-icon mr-2"></i> Save Changes
        </button>
        <p v-if="message">{{ message }}</p>
      </div>
    </div>
  `,
  data() {
    return {
      email: '',
      name: '',
      location: '',
      image: null,
      message: "",
      company,
      errors: {}
    };
  },
  methods: {
    handleImageChange(event) {
      this.image = event.target.files[0];
    },
    validateForm() {
      this.errors = {};

      if (!this.name) {
        this.errors.name = 'Name is required.';
      }
      if (!this.location) {
        this.errors.location = 'Location is required.';
      }

      return Object.keys(this.errors).length === 0;
    },
    async fetchUser() {
      try {
        const response = await fetch(`/api/users/${this.userId}`, {
          headers: {
            'Authentication-Token': this.$store.state.auth_token,
          },
        });
        if (response.ok) {
          const user = await response.json();
          this.email = user.email;
          this.name = user.name;
          this.location = user.location;
          // Ensure image is not set here as it should be handled by handleImageChange
        } else {
          console.error('Failed to fetch user:', response.statusText);
          alert('Failed to fetch user. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        alert('An error occurred. Please try again later.');
      }
    },
    async submitEdit() {
      if (!this.validateForm()) {
        return;
      }

      let payload = new FormData();
      payload.append("name", this.name);
      payload.append("location", this.location);
      if (this.image) payload.append("image", this.image);

      try {
        const res = await fetch(`/api/users/${this.userId}`, {
          method: "PUT",
          headers: {
            'Authentication-Token': this.$store.state.auth_token,
          },
          body: payload,
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
    },
    clearForm() {
      this.name = this.location = this.image = null;
    },
  },
  mounted() {
    this.fetchUser();
  }
}