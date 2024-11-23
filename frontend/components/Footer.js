import company from '../utlis/company.js';

export default {
  template: `
    <footer class="footer">
      <div class="footer-section">
        <h3>{{company.name}}</h3>
        <ul>
          <li><a href="#">About us</a></li>
          <li><a href="#">Anti Discrimination Policy</a></li>
          <li><a href="#">Information Security Policy Statement & Objective</a></li>
          <li><a href="#">Careers</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>For Professionals</h3>
        <ul>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Partner Welfare Policy</a></li>
          <li><a href="#">Terms & Conditions</a></li>
          <li><a href="#">Community</a></li>
          <li><a href="#">Blog</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h3>For Customers</h3>
        <ul>
          <li><a href="#">Book a service</a></li>
        </ul>
      </div>

      <div class="footer-section social-links">
        <h3>Social Links</h3>
        <ul>
          <li><a :href="company.socialLinks.facebook"><i class="fab fa-facebook"></i></a></li>
          <li><a :href="company.socialLinks.twitter"><i class="fab fa-twitter"></i></a></li>
          <li><a :href="company.socialLinks.instagram"><i class="fab fa-instagram"></i></a></li>
          <li><a :href="company.socialLinks.linkedin"><i class="fab fa-linkedin"></i></a></li>
        </ul>
      </div>
      
      <div class="footer-bottom">
        <p>© 2014-2024 {{ company.name }}. All rights reserved.</p>
        <p>{{ company.address }} | Phone: {{ company.phone }} | Email: <a :href="'mailto:' + company.email">{{ company.email }}</a></p>
      </div>
    </footer>
  `,
  data() {
    return {
      company
    };
  }
};