export default {
    props: ['service_id'],
    data() {
      return {
        reviews: [],
      };
    },
    async mounted() {
      const res = await fetch(`/api/reviews/${this.service_id}`);
      if (res.ok) {
        this.reviews = await res.json();
      }
    },
    template: `
      <div class="review-section">
        <h2>Customer Reviews</h2>
        <div v-if="reviews.length === 0">No reviews available.</div>
        <div v-else v-for="(review, index) in reviews" :key="index" class="review-card">
          <div class="review-header">
            <span class="user-name">{{ review.name }}</span>
            <div class="rating">
              <span v-for="star in 5" :key="star" class="star">
                <i :class="star <= review.rating ? 'fas fa-star filled' : 'far fa-star'"></i>
              </span>
              <span class="rating-value">{{ review.rating }}</span>
            </div>
          </div>
          <p class="review-text">{{ review.remark }}</p>
        </div>
      </div>
    `,
  };
  