import SearchBox from "../components/SearchBox.js"
import ServiceListPage from "../components/ServiceListPage.js"

export default{
    template : `
    <div>
        <SearchBox />
        <ServiceListPage />
        <h1> Home </h1>
    </div>
    `,
    components : {
        SearchBox,
        ServiceListPage,
    },
}