export default {
    template: `
    <div class="sp-profile-card">
    <div class="sp-profile-header">
      <div class="sp-avatar"></div>
      <div class="sp-profile-info">
        <h2 class="sp-name">Sarah Johnson</h2>
        <span class="sp-profession">Professional Cleaning</span>
        <div class="sp-rating">
          <span class="sp-star">⭐</span>
          <span class="sp-rating-value">4.8</span>
          <span class="sp-reviews">(156)</span>
        </div>
        <div class="sp-stats">
          <div class="sp-stat">
            <i class="sp-icon-check">✔️</i> 230 jobs completed
          </div>
          <div class="sp-stat">
            <i class="sp-icon-clock">⏱️</i> Responds in 1 hour
          </div>
          <div class="sp-stat">
            <i class="sp-icon-location">📍</i> New York City
          </div>
        </div>
      </div>
    </div>
    
    <div class="sp-reviews-section">
      <h3>Top Reviews</h3>
      <div class="sp-review" v-for="(review, index) in topReviews" :key="index">
        <div class="sp-review-header">
          <span class="sp-reviewer">{{ review.name }}</span>
          <span class="sp-time">{{ review.time }}</span>
        </div>
        <p class="sp-review-text">{{ review.text }}</p>
        <div class="sp-like">
          <i class="sp-icon-thumb-up">👍</i> {{ review.likes }}
        </div>
      </div>
      <button class="sp-view-reviews-button">View All Reviews</button>
    </div>

    <button class="sp-book-now-button">Book Now</button>
  </div>
    `,
    data() {
        return {
          topReviews: [
            { name: "Emily R.", time: "2 weeks ago", text: "Sarah did an amazing job! My house has never been cleaner. Highly recommended!", likes: 24 },
            { name: "Michael T.", time: "1 month ago", text: "Punctual, thorough, and professional. Will definitely book again.", likes: 18 }
          ]
        };
      }
}