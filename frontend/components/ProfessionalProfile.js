import MyCompletedService from "./MyCompletedService.js";
import ProfessionalEditProfile from "./ProfessionalEditProfile.js";

export default {
  props: ['userId'],
  template: `
    <div class="profile-page-container mt-4">
      <div class="profile-page-card">
        <div class="profile-page-card-body">
          <!-- Header Section -->
          <div class="profile-page-header d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <img :src="imgUrl" class="profile-page-image bg-secondary rounded-circle me-3" />
              <div>
                <h5 class="profile-page-name mb-0">{{user.name}}</h5>
                <p class="profile-page-role text-muted mb-0">{{user.service_type}}</p>
                <div class="profile-page-location-experience d-flex align-items-center text-muted">
                  <i class="bi bi-geo-alt-fill me-1"></i> {{user.location}}
                  <span class="mx-2">|</span>
                  <i class="bi bi-briefcase-fill me-1"></i> {{user.experience}} years exp.
                </div>
              </div>
            </div>
            <!-- Edit Profile Button -->
            <button class="profile-page-edit-btn btn btn-outline-secondary btn-sm" @click="openModal">
              <i class="bi bi-pencil"></i> Edit Profile
            </button>
          </div>

          <!-- Rating Section -->
          <div class="profile-page-rating mt-3">
            <div class="d-flex align-items-center">
              <span class="text-warning fs-4 me-2"><i class="bi bi-star-fill"></i></span>
              <h4 class="profile-page-rating-score mb-0">{{formattedRating}}</h4>
            </div>
          </div>

          <!-- Tabs Section -->
          <ul class="profile-page-tabs nav nav-tabs mt-4" id="profileTabs">
            <li class="nav-item">
              <button class="nav-link" :class="{ active: currentTab === 'details' }" @click="currentTab = 'details'">Details</button>
            </li>
            <li class="nav-item">
              <button class="nav-link" :class="{ active: currentTab === 'resume' }" @click="currentTab = 'resume'">Resume</button>
            </li>
            <li class="nav-item">
              <button class="nav-link" :class="{ active: currentTab === 'reviews' }" @click="currentTab = 'reviews'">Reviews</button>
            </li>
          </ul>

          <!-- Tab Content -->
          <div class="profile-page-tab-content mt-4">
            <div v-if="currentTab === 'details'">
              <h6 class="profile-page-section-title">Description</h6>
              <p class="profile-page-description">{{user.description}}</p>
              <h6 class="profile-page-section-title">Contact Information</h6>
              <p class="profile-page-contact"><i class="bi bi-envelope-fill me-2"></i> {{user.email}}</p>
              <h6 class="profile-page-section-title">Professional Details</h6>
              <p class="profile-page-professional-details">
                <i class="bi bi-calendar-event me-2"></i> Joined on {{user.date_created}}
              </p>
              <p class="profile-page-professional-details">
                <i class="bi bi-briefcase-fill me-2"></i> {{user.experience}} years of experience
              </p>
              <h6 class="profile-page-section-title">Service Type</h6>
              <p class="profile-page-service-type">{{user.service_type}}</p>
            </div>
            <div v-if="currentTab === 'resume'">
              <h6 class="profile-page-section-title">Professional Resume</h6>
              <p class="profile-page-resume-text">
                View or download the professional's detailed resume to learn more about their qualifications and experience.
              </p>
              <a v-if="user.resume" :href="resumeUrl" target="_blank" class="btn btn-dark btn-sm">
                <i class="bi bi-file-earmark-text-fill me-2"></i>View Resume
              </a>
              <p v-else class="text-muted">No resume uploaded</p>
            </div>
            <div v-if="currentTab === 'reviews'">
              <h6 class="profile-page-section-title">Customer Reviews</h6>
              <MyCompletedService :userId="userId" />
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Section -->
      <div v-if="showModal" class="custom-modal big-modal">
        <div class="custom-modal-content">
          <button class="custom-modal-close" @click="closeModal">&times;</button>
          <ProfessionalEditProfile :user="user" @profile-updated="handleProfileUpdated" />
        </div>
        <div class="custom-modal-overlay" @click="closeModal"></div>
      </div>
    </div>
  `,
  components: {
    MyCompletedService,
    ProfessionalEditProfile,
  },
  data() {
    return {
      user: {},
      currentTab: 'details',
      showModal: false,
    };
  },
  computed: {
    formattedRating() {
      return this.user.rating ? Number(this.user.rating).toFixed(2) : '0.00';
    },
    imgUrl() {
      return this.user.image 
        ? `../static/static/images/${this.user.image}`
        : '../static/static/images/default-profile.png';
    },
    resumeUrl() {
      return this.user.resume 
        ? `../static/static/resume/${this.user.resume}`
        : '#';
    }
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
  }
};