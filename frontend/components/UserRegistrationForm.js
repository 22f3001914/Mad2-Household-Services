import company from "../utlis/company.js";

export default {
  template: `
    <div class="center-container">
      <div class="form-container">
        <h2 class="form-title">Register for {{ company.name }} - User</h2>
        <p class="form-subtitle">Enter your details to create an account</p>
        <input class="input-field" type="email" placeholder="Email" v-model="email" />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        <input class="input-field" type="password" placeholder="Password" v-model="password" />
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        <input class="input-field" placeholder="Name" v-model="name" />
        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        <input class="input-field" placeholder="Location" v-model="location" />
        <span v-if="errors.location" class="error-message">{{ errors.location }}</span>
        <input class="input-field" type="file" placeholder="Image URL" @change="handleImageChange" />

        <button class="submit-button" @click="submitRegister">
          <i class="bi bi-person-add login-icon mr-2"></i> Register
        </button>
        <p v-if="message">{{ message }}</p>

        <p class="footer-text">
  Already have an account? <router-link to="/login" class="footer-link">Log in</router-link>
</p>
      </div>
    </div>
  `,
  data() {
    return {
      email: null,
      password: null,
      name: null,
      role: "user",
      location: null,
      image: null,
      message: "",
      company,
      errors: {},
    };
  },
  methods: {
    handleImageChange(event) {
      this.image = event.target.files[0];
    },
    validateForm() {
      this.errors = {};

      if (!this.email) {
        this.errors.email = "Email is required.";
      } else if (!this.validEmail(this.email)) {
        this.errors.email = "Invalid email format.";
      }
      if (!this.password) {
        this.errors.password = "Password is required.";
      }
      if (!this.name) {
        this.errors.name = "Name is required.";
      }
      if (!this.location) {
        this.errors.location = "Location is required.";
      }

      return Object.keys(this.errors).length === 0;
    },
    validEmail(email) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
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

      try {
        const res = await fetch(location.origin + "/register", {
          method: "POST",
          body: payload,
        });
        this.message = res.ok
          ? "Registration successful!"
          : "Registration failed. Please try again.";
        if (res.ok) this.clearForm();
      } catch (error) {
        this.message = "An error occurred. Please try again.";
        console.error(error);
      }
    },
    clearForm() {
      this.email =
        this.password =
        this.name =
        this.location =
        this.image =
          null;
    },
  },
};
