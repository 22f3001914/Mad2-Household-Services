export default {
  props: ['image', 'title', 'id'],
  template: `
    <div class="card" @click="navigateToService">
      <img :src="imageUrl" alt="Card image" class="card-image" />
      <div class="card-content">
        <h3 class="card-title">{{ truncatedTitle }}</h3>
      </div>
    </div>
  `,
  computed: {
    imageUrl() {
      return `../static/static/images/${this.image}`;
    },
    truncatedTitle() {
      if (this.title.length > 20) {
        return this.title.substring(0, 14) + '...';
      }
      return this.title;
    }
  },
  methods: {
    navigateToService() {
      this.$router.push(`/services/${this.id}`);
    }
  }
};