import company from '../utlis/company.js';
export default {
  template: `
    <div class="info-section">
      <h2 class="main-title">Join {{ company.name }} to change your life</h2>
      <p class="subtitle">
        {{ company.tagline }}
      </p>
      <div class="stats-container">
        <div class="stat">
          <h3 class="stat-value">{{ company.stats.partners }}</h3>
          <p class="stat-description">Partners already on board</p>
        </div>
        <div class="stat">
          <h3 class="stat-value">{{ company.stats.totalPayout }}</h3>
          <p class="stat-description">Paid out to partners in 2022</p>
        </div>
        <div class="stat">
          <h3 class="stat-value">{{ company.stats.servicesDelivered }}</h3>
          <p class="stat-description">Services delivered each month</p>
        </div>
        <div class="stat">
          <h3 class="stat-value">{{ company.stats.yearsInBusiness }}</h3>
          <p class="stat-description">Years in business</p>
        </div>
        <div class="stat">
          <h3 class="stat-value">{{ company.stats.customerSatisfaction }}</h3>
          <p class="stat-description">Customer satisfaction rate</p>
        </div>
        <div class="stat">
          <h3 class="stat-value">{{ company.stats.serviceAreas }}</h3>
          <p class="stat-description">Service areas covered</p>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      company
    };
  }
};