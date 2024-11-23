import SideBar from "../components/SideBar.js"
import AddServiceForm from "../components/AddServiceForm.js"
import ServiceTable from "../components/ServiceTable.js"
import NewServiceTable from "../components/NewServiceTable.js"
import Usertable from "../components/Usertable.js"
export default {
    template : `
        <div>
            <h1> this is admin dashboard </h1>
            <AddServiceForm />
            <NewServiceTable />
            <Usertable />
            <button @click="create_csv"> Get Blog Data </button>
        </div>
    `, 
    methods : {
        async create_csv(){
            const res = await fetch(location.origin + '/create-csv')
            const task_id = (await res.json()).task_id

            const interval = setInterval(async() => {
                const res = await fetch(`${location.origin}/get-celery-data/${task_id}`)
                if (res.ok){
                    console.log('data is ready')
                    window.open(`${location.origin}/get-celery-data/${task_id}`)
                    clearInterval(interval)
                }

            }, 100)
            
        },
    },
    components : {
        SideBar,
        AddServiceForm,
        ServiceTable,
        NewServiceTable,
        Usertable,
    }
}