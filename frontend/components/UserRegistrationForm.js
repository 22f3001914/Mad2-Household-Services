import company from "../utlis/company.js";

export default {
    template: `
    <div class="form-container">
    <h2 class="form-title">Register for {{ company.name }} - User</h2>
    <p class="form-subtitle">Enter your details to create an account</p>

    <input class="input-field" type="email" placeholder="Email" v-model="email" />
    <input class="input-field" type="password" placeholder="Password" v-model="password" />
    <input class="input-field" placeholder="Name" v-model="name" />
    <input class="input-field" placeholder="Location" v-model="location" />
    <input class="input-field" type="file" placeholder="Image URL" @change="handleImageChange" />

    <button class="submit-button" @click="submitRegister">
      <i class="bi bi-person-add login-icon mr-2"></i> Register
    </button>
    <p v-if="message">{{ message }}</p>

    <p class="footer-text">
      Already have an account? <a href="/login" class="footer-link">Log in</a>
    </p>
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
    };
  },
  methods: {
    handleImageChange(event) {
      this.image = event.target.files[0];
    },
    async submitRegister() {
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
        this.message = res.ok ? "Registration successful!" : "Registration failed. Please try again.";
        if (res.ok) this.clearForm();
      } catch (error) {
        this.message = "An error occurred. Please try again.";
        console.error(error);
      }
    },
    clearForm() {
      this.email = this.password = this.name = this.location = this.image = null;
    },
  },
}