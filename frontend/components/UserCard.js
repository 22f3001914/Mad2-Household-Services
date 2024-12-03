export default {
    props: ["user"],
    template: `
      <div class="professional-card">
        <div class="professional-card-header">User Details</div>
        <div class="professional-card-profile">
          <img :src="imgUrl(user)" class="professional-card-profile-img">
          <div>
            <h4 class="professional-card-name">{{ user.name }}</h4>
            <p class="professional-card-email">{{ user.email }}</p>
          </div>
        </div>
        <div class="professional-card-section">
          <div class="professional-card-badge">User</div>
          <p class="professional-card-location"><i class="bi bi-geo-alt-fill"></i> {{ user.location }}</p>
        </div>
      </div>
    `,
    methods: {
      imgUrl(user) {
        return `../static/static/images/${user.image}`;
      },
    },
  };