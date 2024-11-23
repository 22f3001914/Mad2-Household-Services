import company from "../utlis/company.js";

export default {
  template: `
  <div class="login-container ">
    <h2 class="login-title">Login to {{company.name}}</h2>
    <p class="login-subtitle">Enter your credentials to access your account</p>
    
    <input class="login-input" type="email" placeholder="Email" v-model="email" />
    <input class="login-input" type="password" placeholder="Password" v-model="password" />
    
    <button @click="submitLogin" class="login-button">
    <i class="bi bi-box-arrow-in-right login-icon mr-1"></i> Log In
  </button>

    <p class="signup-text">Don’t have an account? <a href="/signup" class="signup-link">Sign up</a></p>
  </div>
      `,
  data() {
    return {
      email: null,
      password: null,
      company,
    };
  },
  methods: {
    async submitLogin() {
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
      }
    },
  },
};
