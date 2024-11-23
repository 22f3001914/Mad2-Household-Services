import company from "../utlis/company.js"
export default{
    template: `
    <div class="promise-card">
    <div class="text-content">
      <h3 class="title">{{company.short_name}} Promise</h3>
      <ul class="promise-list">
        <li>✔ Verified Professionals</li>
        <li>✔ Safe Chemicals</li>
        <li>✔ Superior Stain Removal</li>
      </ul>
    </div>
    <div class="badge-container">
      <img src="..static/static/images/promise.png" alt="Badge" class="badge">
    </div>
  </div>`,
  data() {
    return {
      company,
    };
  }

}