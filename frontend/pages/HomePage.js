import SearchBox from "../components/SearchBox.js"
import ServiceListPage from "../components/ServiceListPage.js"
import ProfessionalCard from "../components/ProfessionalCard.js"

export default{
    template : `
    <div>
        <SearchBox />
        <ServiceListPage />
        <ProfessionalCard />
        <h1> Home </h1>
    </div>
    `,
    components : {
        SearchBox,
        ServiceListPage,
        ProfessionalCard
    },
}