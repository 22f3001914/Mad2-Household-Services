import ServiceBookCard from "../components/ServiceBookCard.js";
import PromiseCard from "../components/PromiseCard.js";
import ReviewSection from "../components/ReviewSection.js";

export default {
  props: ['id'],
  template: `
  <div>
    <!-- Main Content Wrapper -->
    <div class="content-wrapper">
      <div class="service-card-pos">
        <ServiceBookCard :service_id="id" />
      </div>
      <div class="promise-card-pos">
        <PromiseCard />
      </div>
    </div>
    <div class="review-pos">
      <!-- Pass the service id as a prop to the ReviewSection component -->
      <ReviewSection :service_id="id" />
    </div>
  </div>
  `,
  methods: {
    bookService() {
      alert("Service booked successfully!");
    },
  },
  computed: {
    formattedDate() {
      return new Date(this.service.date_created).toLocaleDateString();
    },
  },
  data() {
    return {
      service: {},
    };
  },
  async mounted() {
    console.log("mounted function called");
    const res = await fetch(location.origin + "/api/services/" + this.id, {
      headers: {
        'Authentication-Token': this.$store.state.auth_token,
      },
    });
    if (res.ok) {
      const data = await res.json();
      this.service = data;
      console.log(this.service);
    }
  },
  components: {
    ReviewSection,
    ServiceBookCard,
    PromiseCard,
  },
};
