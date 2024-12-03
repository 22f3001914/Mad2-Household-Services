import company from "../utlis/company.js";

export default {
  template: `
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <!-- Brand -->
    <router-link class="navbar-brand fw-bolder" to="/">{{company.name}}</router-link>
    <!-- Toggler for small screens -->
    <button 
      class="navbar-toggler" 
      type="button" 
      data-bs-toggle="collapse" 
      data-bs-target="#navbarNav" 
      aria-controls="navbarNav" 
      aria-expanded="false" 
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Navbar content -->
    <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link" to="/">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="$store.state.loggedIn && $store.state.role === 'user'" class="nav-link" to="/my-services">My Services</router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="!$store.state.loggedIn" class="nav-link" to="/careers">Careers</router-link>
        </li>

        <li class="nav-item">
          <router-link class="nav-link" to="/contact">Contact</router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="$store.state.loggedIn && $store.state.role === 'user'" class="nav-link" to="/my-profile">Profile</router-link>
        </li>


      </ul>
    </div>

    <!-- Auth buttons on the right -->
    <div class="d-flex">
    
      <router-link 
        v-if="!$store.state.loggedIn" 
        to="/login" 
        class="btn btn-dark me-2 mr-2"
      >Login</router-link>
      <router-link 
        v-if="!$store.state.loggedIn" 
        to="/register" 
        class="btn btn-outline-dark"
      >Sign Up</router-link>
      <button 
        v-if="$store.state.loggedIn" 
        class="btn btn-dark" 
        @click="logout"
      >Logout</button>
    </div>
  </div>
</nav>
  `,
  methods: {
    logout() {
      this.$store.commit("logout");
      this.$router.push("/login");
    },
  },
  data() {
    return {
      company,
    };
  }
};
