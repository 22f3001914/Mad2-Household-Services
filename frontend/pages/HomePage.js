import SearchBox from "../components/SearchBox.js"
import ServiceListPage from "../components/ServiceListPage.js"
import SearchResults from "../components/SearchResults.js";
export default{
    template : `
    <div>
        <SearchBox @search="handleSearchQuery" />
        <SearchResults :searchQuery="searchQuery" v-if="searchQuery" />
        <ServiceListPage />
    </div>
    `,
    components : {
        SearchBox,
        ServiceListPage,
        SearchResults
    },
    data() {
        return {
          searchQuery: ''
        };
      },
      methods: {
        handleSearchQuery(query) {
          this.searchQuery = query;
        }
      }
}