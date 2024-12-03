export default {
  template: `
    <div class="admin-user-modal">
      <div class="admin-user-modal-content">
        <h2>Add New User</h2>
        <form @submit.prevent="validateForm">
          <label>
            Name:
            <input type="text" v-model="newUser.name" required />
            <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
          </label>
          <label>
            Role:
            <select v-model="newUser.role" required>
              <option value="Customer">Customer</option>
              <option value="Service Professional">Service Professional</option>
            </select>
            <span v-if="errors.role" class="error-message">{{ errors.role }}</span>
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
      },
      errors: {}
    };
  },
  methods: {
    validateForm() {
      this.errors = {};

      if (!this.newUser.name) {
        this.errors.name = 'Name is required.';
      }
      if (!this.newUser.role) {
        this.errors.role = 'Role is required.';
      }

      if (Object.keys(this.errors).length === 0) {
        this.addUser();
      }
    },
    addUser() {
      // Logic to handle adding the user (e.g., calling an API or updating data)
      alert(`User ${this.newUser.name} added as ${this.newUser.role}`);
      this.$emit('close-modal'); // Close modal after adding the user
    }
  }
};