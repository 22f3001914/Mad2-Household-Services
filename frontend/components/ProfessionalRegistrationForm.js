import company from "../utlis/company.js";
export default {
  template: `   
    <div class="register-form-container">
      <h2 class="form-title">Register for {{ company.name }} - Service Professional</h2>
      <p class="form-subtitle">Enter your details to create an account</p>
      <div class="form-content">
        <div class="form-column">
          <input class="input-field" type="email" placeholder="Email" v-model="email" />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          <input class="input-field" type="password" placeholder="Password" v-model="password" />
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
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
          <label> Resume: </label>
          <input class="input-field" type="file" placeholder="Resume URL" @change="handleResumeChange" />
        </div>
      </div>
      <button class="submit-button" @click="submitRegister">
        <i class="bi bi-person-add login-icon mr-2"></i> Register
      </button>
      <p v-if="message">{{ message }}</p>

      <p class="footer-text">
      Already have an account? <router-link to="/login" class="footer-link">Log in</router-link>
    </p>
    </div>`,
  data() {
    return {
      email: null,
      password: null,
      name: null,
      role: "professional",
      location: null,
      image: null,
      description: null,
      service_type: null,
      experience: null,
      resume: null,
      message: "",
      company,
      services: [],
      errors: {}
    };
  },
  async mounted() {
    try {
      const res = await fetch(location.origin + '/api/services_name');
      if (res.ok) {
        this.services = await res.json();
      } else {
        console.error('Error fetching services:', res.statusText);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
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

      if (!this.email) {
        this.errors.email = 'Email is required.';
      } else if (!this.validEmail(this.email)) {
        this.errors.email = 'Invalid email format.';
      }
      if (!this.password) {
        this.errors.password = 'Password is required.';
      }
      if (!this.name) {
        this.errors.name = 'Name is required.';
      }
      if (!this.location) {
        this.errors.location = 'Location is required.';
      }
      if (!this.description) {
        this.errors.description = 'Description is required.';
      }
      if (!this.service_type) {
        this.errors.service_type = 'Service type is required.';
      }
      if (!this.experience) {
        this.errors.experience = 'Experience is required.';
      } else if (isNaN(this.experience) || this.experience <= 0) {
        this.errors.experience = 'Experience must be a positive number.';
      }

      return Object.keys(this.errors).length === 0;
    },
    validEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
      return re.test(email);
    },
    async submitRegister() {
      if (!this.validateForm()) {
        return;
      }

      let payload = new FormData();
      payload.append("email", this.email);
      payload.append("password", this.password);
      payload.append("name", this.name);
      payload.append("roles", this.role);
      payload.append("location", this.location);
      if (this.image) payload.append("image", this.image);
      payload.append("description", this.description);
      payload.append("service_type", this.service_type);
      payload.append("experience", this.experience);
      if (this.resume) payload.append("resume", this.resume);

      try {
        const res = await fetch(location.origin + "/register", {
          method: "POST",
          body: payload,
        });
        this.message = res.ok ? "Registration successful!" : "Registration failed. Please try again.";
        if (res.ok) this.clearForm();
      } catch (error) {
        this.message = "An error occurred. Please try again.";
        console.error(error);
      }
    },
    clearForm() {
      this.email = this.password = this.name = this.location = this.image = this.description = this.service_type = this.experience = this.resume = null;
    },
  },
}