export default {
    props : ['completedService'],
    template: `
    <div class="completed-service-card">
    <div class="completed-service-header">
      <div>
        <h3 class="completed-service-name">{{completedService.customer_name || "User"}}</h3>
        <p class="completed-service-date">{{completedService.date_of_completion}}</p>
      </div>
      <div class="completed-service-rating">
        <span class="completed-service-star">★</span>
        <span class="completed-service-rating-value">{{completedService.rating }}</span>
      </div>
    </div>
    <div class="completed-service-review">
      <h4>Customer Review:</h4>
      <p>{{completedService.remarks}}</p>
    </div>
  </div>`,
  data() {
    return {};
  }

}