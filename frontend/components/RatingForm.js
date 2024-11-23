export default {
    props: {
        request: {
          type: Object,
          required: true
        }
      },
    data() {
      return {
        userRating: 0,
        userReview: "",
      };
    },
    methods: {
      setRating(rating) {
        this.userRating = rating;
      },
      async submitReview() {
        if (!this.userRating || !this.userReview.trim()) {
          alert("Please provide both a rating and a review.");
          return;
        }
  
        try {
          const response = await fetch(`/api/reviews/${this.request.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': this.$store.state.auth_token,
            },
            body: JSON.stringify({
              rating: this.userRating,
              remarks: this.userReview
            })
          });
  
          if (response.ok) {
            alert("Thank you for your feedback!");
            this.$emit("review-submitted");
          } else {
            alert("Error submitting review.");
          }
        } catch (error) {
          console.error('Error submitting review:', error);
          alert('An error occurred. Please try again.');
        }
      }
    },
    template: `
      <div>
        <div class="rating-modal">
          <div class="rating-modal-header">
            <h2 class="rating-modal-title">Rate Our Service</h2>
          </div>
          <div class="rating-modal-body">
            <p class="rating-modal-description">
              Please provide your rating and review for our service. Your feedback is valuable to us!
            </p>
            <div class="rating-stars">
              <span
                v-for="star in 5"
                :key="star"
                class="rating-star"
                :class="{ 'rating-star-filled': star <= userRating }"
                @click="setRating(star)"
              >
                ★
              </span>
            </div>
            <textarea
              v-model="userReview"
              placeholder="Tell us about your experience..."
              class="rating-textarea"
            ></textarea>
          </div>
          <div class="rating-modal-footer">
            <button class="rating-submit-btn" @click="submitReview">Submit Review</button>
          </div>
        </div>
      </div>
    `,
  };
  