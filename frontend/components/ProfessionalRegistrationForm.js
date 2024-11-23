import company from "../utlis/company.js";;
export default{
    template : `   
    <div class="register-form-container">
    <h2 class="form-title">Register for {{ company.name }} - Service Professional</h2>
    <p class="form-subtitle">Enter your details to create an account</p>
    <div class="form-content">
        <div class="form-column">
          <input class="input-field" type="email" placeholder="Email" v-model="email" />
          <input class="input-field" type="password" placeholder="Password" v-model="password" />
          <input class="input-field" placeholder="Name" v-model="name" />
          <input class="input-field" placeholder="Location" v-model="location" />
          <input class="input-field" type="file" placeholder="Image URL" @change="handleImageChange" />
        </div>

        <div class="form-column">
          <input class="input-field" type="text" placeholder="Description" v-model="description" />
          <select class="input-field" v-model="service_type">
        <option disabled value="">Select Service Type</option>
        <option v-for="service in services" :key="service" :value="service">
          {{ service }}
        </option>
        <option value="not_listed">Not Listed</option>
      </select>
          <input class="input-field" type="number" placeholder="Experience (years)" v-model="experience" />
          <input class="input-field" type="file" placeholder="Resume URL" @change="handleResumeChange" />
        </div>
      </div>
    <button class="submit-button" @click="submitRegister">
      <i class="bi bi-person-add login-icon mr-2"></i> Register
    </button>
    <p v-if="message">{{ message }}</p>

    <p class="footer-text">
      Already have an account? <a href="/login" class="footer-link">Log in</a>
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
    };
  },
  async mounted() {
    try {
      const res = await fetch(location.origin +'/api/services_name');
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
    async submitRegister() {
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