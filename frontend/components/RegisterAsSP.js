export default{
    template:`
    <div class="register-prompt">
    <h2>Are you a Service Professional?</h2>
    <p>Register as a Service Professional to join our platform and connect with clients.</p>
    <button class="register-button" @click="navigateToCareerPage">
      Register as Service Professional
    </button>
  </div>`,
  methods: {
    navigateToCareerPage() {
      // Navigate to the career page route
      this.$router.push("/careers");
    },
  },

}