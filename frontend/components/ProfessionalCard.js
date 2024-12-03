export default {
  props: ["user"],
  template: `
    <div class="professional-card">
      <div class="professional-card-header">Professional Details</div>
      <div class="professional-card-profile">
        <img :src="imgUrl(user)" class="professional-card-profile-img">
        <div>
          <h4 class="professional-card-name">{{ user.name }}</h4>
          <p class="professional-card-email">{{ user.email }}</p>
        </div>
      </div>
      <div class="professional-card-section">
        <div class="professional-card-badge">{{ user.service_type }}</div>
        <p class="professional-card-location"><i class="bi bi-geo-alt-fill"></i> {{ user.location }}</p>
      </div>
      <p class="professional-card-description">
        {{ user.description }}
      </p>
      <p class="professional-card-experience">
        <strong>Experience:</strong> {{ user.experience }} years
      </p>
      <div class="professional-card-resume">
        <a :href="resumeUrl(user)" target="_blank" class="professional-card-link"><i class="bi bi-file-earmark-text"></i> View Resume</a>
      </div>
      <div class="professional-card-actions">
        <div v-if="user.status == 'Pending Approval'">
          <button class="btn btn-outline-dark reject" @click="rejectUser(user)">Reject</button>
          <button class="btn btn-dark approve" @click="approveUser(user)">Approve</button>
        </div>
      </div>
    </div>
  `,
  methods: {
    imgUrl(user) {
      return `../static/static/images/${user.image}`;
    },
    resumeUrl(user) {
      return `../static/static/resume/${user.resume}`;
    },
    async approveUser(user) {
      try {
        const res = await fetch(
          location.origin + `/api/unblock_user/${user.id}`,
          {
            method: "PUT",
            headers: {
              "Authentication-Token": this.$store.state.auth_token,
            },
          }
        );
        if (res.ok) {
          user.status = "Active";
          user.active = true; // Update local state
        } else {
          console.error("Failed to approve user");
        }
      } catch (error) {
        console.error("Error approving user:", error);
      }
    },
    async rejectUser(user) {
      // show confirmation dialog
      const confirmed = (
        `Are you sure you want to reject the service professional: ${user.name}?`
      );
      if (!confirmed) {
        return;
      }

      try {
        const res = await fetch(
          location.origin + `/api/reject_service_professional/${user.id}`,
          {
            method: "PUT",
            headers: {
              "Authentication-Token": this.$store.state.auth_token,
            },
          }
        );
        if (res.ok) {
          user.status = "Rejected";
        } else {
          console.error("Failed to reject user");
        }
      } catch (error) {
        console.error("Error rejecting user:", error);
      }
    },
  },
}