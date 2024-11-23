import CompanyStats from "../components/CompanyStats.js";
import JoinNowHero from "../components/JoinNowHero.js";
import ProfessionalRegistrationForm from "../components/ProfessionalRegistrationForm.js";
export default {
    template : `
    <div>
        <JoinNowHero />
        <ProfessionalRegistrationForm />
        <CompanyStats />
    </div>`,
    components : {
        CompanyStats,
        JoinNowHero,
        ProfessionalRegistrationForm,
    },
}