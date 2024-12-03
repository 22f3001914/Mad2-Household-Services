
import MyServicesUser from "../components/MyServicesUser.js";
export default {
  template: `
    <div id="admin-page d-flex" style="width:80%; margin: 20px auto">
        <MyServicesUser />
    </div>
  `,
  components: {
    MyServicesUser
  },
  data() {
    return {};
  },
};