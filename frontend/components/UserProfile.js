import UserEditForm from "./UserEditForm.js";

export default {
  props: ['userId'],
  template: `
  <div class="user-profile-card" style="margin:20px auto">
    <div class="user-profile-header">
      <div class="user-profile-avatar">
        <img :src="imgUrl" style="width:80px" >
      </div>
    </div>
    <div class="user-profile-body">
      <h4 class="user-profile-name">{{user.name}}</h4>
      <p class="user-profile-location">
        <i class="bi bi-geo-alt"></i> {{user.location}}
      </p>
      <p class="user-profile-email">
        <i class="bi bi-envelope"></i> {{user.email}}
      </p>
      <p class="user-profile-joined">
        <i class="bi bi-calendar"></i> Joined {{user.date_created}}
      </p>
    </div>
    <div class="user-profile-footer">
      <button class="profile-page-edit-btn btn btn-outline-secondary btn-sm" @click="openModal">
        <i class="bi bi-pencil"></i> Edit Profile
      </button>
    </div>

    <!-- Modal Section -->
    <div v-if="showModal" class="custom-modal big-modal">
      <div class="custom-modal-content">
        <button class="custom-modal-close" @click="closeModal">&times;</button>
        <UserEditForm :userId="userId" @profile-updated="handleProfileUpdated" />
      </div>
      <div class="custom-modal-overlay" @click="closeModal"></div>
    </div>
  </div>
  `,
  data() {
    return {
      user: {},
      showModal: false,
    };
  },
  methods: {
    async fetchUser() {
      try {
        const response = await fetch(`/api/users/${this.userId}`, {
          headers: {
            'Authentication-Token': this.$store.state.auth_token,
          },
        });
        if (response.ok) {
          this.user = await response.json();
        } else {
          console.error('Failed to fetch user:', response.statusText);
          alert('Failed to fetch user. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        alert('An error occurred. Please try again later.');
      }
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.fetchUser();
    },
    handleProfileUpdated() {
      alert('Profile updated successfully!');
      this.closeModal();
    },
  },
  mounted() {
    this.fetchUser();
  },
  computed: {
    imgUrl() {
      return this.user.image
        ? `../static/static/images/${this.user.image}`
        : '../static/static/images/default-profile.png';
    },
  },
  components: {
    UserEditForm,
  },
};