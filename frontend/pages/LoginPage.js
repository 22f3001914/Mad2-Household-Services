import company from "../utlis/company.js";

export default {
  template: `
  <div class="login-container">
    <h2 class="login-title">Login to {{ company.name }}</h2>
    <p class="login-subtitle">Enter your credentials to access your account</p>
    
    <input class="login-input" type="email" placeholder="Email" v-model="email" />
    <input class="login-input" type="password" placeholder="Password" v-model="password" />
    
    <button @click="submitLogin" class="login-button">
      <i class="bi bi-box-arrow-in-right login-icon mr-1"></i> Log In
    </button>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <p class="signup-text">Don’t have an account? <router-link to="/register" class="signup-link">Sign up</router-link></p>
  </div>
  `,
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      company,
    };
  },
  methods: {
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    },
    async submitLogin() {
      // Clear previous error message
      this.errorMessage = '';

      // Validate email and password
      if (!this.email || !this.password) {
        this.errorMessage = 'Email and password are required.';
        return;
      }

      if (!this.validateEmail(this.email)) {
        this.errorMessage = 'Please enter a valid email address.';
        return;
      }

      try {
        const res = await fetch(location.origin + "/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });
        if (res.ok) {
          console.log("We are logged in");
          const data = await res.json();
          console.log(data);

          localStorage.setItem("user", JSON.stringify(data));
          this.$store.commit("setUser");
          this.$router.push("/");
        } else {
          this.errorMessage = 'Invalid email or password.';
        }
      } catch (error) {
        this.errorMessage = 'An error occurred. Please try again.';
        console.error(error);
      }
    },
  },
};