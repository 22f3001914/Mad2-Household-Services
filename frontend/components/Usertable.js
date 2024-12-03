import AddUser from "./AddUser.js";
import ProfessionalCard from "./ProfessionalCard.js";
import UserCard from "./UserCard.js";

export default {
  data() {
    return {
      users: [], // Initialize as an empty array
      searchQuery: "",
      selectedRole: "",
      showModal: false, // Control the visibility of the modal
      selectedUser: null, // Store the selected user
    };
  },
  components: {
    AddUser,
    ProfessionalCard,
    UserCard,
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) => {
        const matchesSearch =
          user.name?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesRole = this.selectedRole
          ? user.role === this.selectedRole
          : true;
        return matchesSearch && matchesRole;
      });
    },
  },
  methods: {
    async fetchUsers() {
      try {
        const res = await fetch(location.origin + "/api/users", {
          headers: {
            "Authentication-Token": this.$store.state.auth_token,
          },
        });
        const data = await res.json();
        this.users = data.map((user) => {
          console.log(`User ID: ${user.id}, Active: ${user.active}, Role: ${user.role}`); // Debugging line
    
          return {
            id: user.id, // Ensure unique identifier
            name: user.name || user.email, // Fallback to email if name is null
            email: user.email,
            role: user.role,
            active: user.active,
            status: user.status,
            date_created: user.date_created,
            description : user.description,
            experience : user.experience,
            location : user.location,
            resume : user.resume,
            service_type : user.service_type,
            status : user.status,
            rating : user.rating || 0,
            image : user.image,
          };
        });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    viewUser(user) {
      this.selectedUser = user; // Set the selected user
      this.showModal = true; // Show the modal
    },
    closeModal() {
      this.showModal = false; // Close the modal
      this.selectedUser = null; // Clear the selected user
      this.fetchUsers();
    },
    async blockUser(user) {
      try {
        const res = await fetch(
          location.origin + `/api/block_user/${user.id}`,
          {
            method: "PUT",
            headers: {
              "Authentication-Token": this.$store.state.auth_token,
            },
          }
        );
        if (res.ok) {
          user.status = "Blocked";
          user.active = false; // Update local state
        } else {
          console.error("Failed to block user");
        }
      } catch (error) {
        console.error("Error blocking user:", error);
      }
    },
    async unblockUser(user) {
      try {
        const res = await fetch(
          location.origin + `/api/unblock_user/${user.id}`,
          {
            method: "PUT",
            headers: {
              "Authentication-Token": this.$store.state.auth_token,
            },
          }
        );
        if (res.ok) {
          user.status = "Active";
          user.active = true; // Update local state
        } else {
          console.error("Failed to unblock user");
        }
      } catch (error) {
        console.error("Error unblocking user:", error);
      }
    },
    async approveUser(user) {
      try {
        const res = await fetch(
          location.origin + `/api/unblock_user/${user.id}`,
          {
            method: "PUT",
            headers: {
              "Authentication-Token": this.$store.state.auth_token,
            },
          }
        );
        if (res.ok) {
          user.status = "Active";
          user.active = true; // Update local state
        } else {
          console.error("Failed to approve user");
        }
      } catch (error) {
        console.error("Error approving user:", error);
      }
    },
    addUser() {
      alert("Add new user functionality");
    },
  },
  created() {
    this.fetchUsers(); // Fetch users when the component is created
  },
  template: `
    <div class="admin-user-table-container">
      <div class="admin-user-header">
        <input
          type="text"
          placeholder="Search users..."
          v-model="searchQuery"
          class="admin-user-search-bar"
        />
        <select v-model="selectedRole" class="admin-user-role-filter">
          <option value="">Filter by role</option>
          <option value="User">Customer</option>
          <option value="Service Professional">Service Professional</option>
        </select>
      </div>
      <table class="admin-user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.status }}</td>
            <td>{{ user.role === 'Service Professional' ? user.rating.toFixed(2) : 'Not applicable' }}</td>
            <td>
              <button @click="viewUser(user)" class="admin-user-view-btn">View</button>
              <button
                v-if="user.status === 'Active'"
                @click="blockUser(user)"
                class="admin-user-block-btn"
              >
                Block
              </button>
              <button
                v-if="user.status === 'Blocked'"
                @click="unblockUser(user)"
                class="admin-user-unblock-btn"
              >
                Unblock
              </button>
              <button
                v-if="user.role == 'Service Professional' && user.status === 'Pending Approval'"
                @click="approveUser(user)"
                class="admin-user-approve-btn"
              >
                Approve
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Custom Modal -->
      <div v-if="showModal" class="custom-modal">
        <div class="custom-modal-content">
          <button class="custom-modal-close" @click="closeModal">&times;</button>

          <!-- Conditionally render the ProfessionalCard or UserCard component based on the user's role -->
          <ProfessionalCard v-if="selectedUser && selectedUser.role === 'Service Professional'" :user="selectedUser" @modal-closed="closeModal"/>
          <UserCard v-else-if="selectedUser && selectedUser.role === 'User'" :user="selectedUser" @modal-closed="closeModal"/>
        </div>
        <div class="custom-modal-overlay" @click="closeModal"></div>
      </div>
    </div>
  `,
};