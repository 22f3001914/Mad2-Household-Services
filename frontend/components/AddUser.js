export default {
    template: `
      <div class="admin-user-modal">
        <div class="admin-user-modal-content">
          <h2>Add New User</h2>
          <form @submit.prevent="addUser">
            <label>
              Name:
              <input type="text" v-model="newUser.name" required />
            </label>
            <label>
              Role:
              <select v-model="newUser.role" required>
                <option value="Customer">Customer</option>
                <option value="Service Professional">Service Professional</option>
              </select>
            </label>
            <button type="submit" class="admin-user-submit-btn">Add User</button>
          </form>
          <button @click="$emit('close-modal')" class="admin-user-close-btn">Close</button>
        </div>
      </div>
    `,
    data() {
      return {
        newUser: {
          name: '',
          role: ''
        }
      };
    },
    methods: {
      addUser() {
        // Logic to handle adding the user (e.g., calling an API or updating data)
        alert(`User ${this.newUser.name} added as ${this.newUser.role}`);
        this.$emit('close-modal'); // Close modal after adding the user
      }
    }
  };
  