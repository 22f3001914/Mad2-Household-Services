
import UserProfile from "../components/UserProfile.js";
export default {
  template: `
    <div id="admin-page m-20">
    <UserProfile :userId="userId" />
    </div>
  `,
  components: {
    UserProfile
  },
  data() {
    return {
        userId: JSON.parse(localStorage.getItem('user')).id 

    };
  },
};