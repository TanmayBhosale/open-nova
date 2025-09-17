import LeadGenNavbar from "./LeadGenNavbar"
import Navbar from "./Navbar"

type WithNavbarType = {
    children : React.ReactNode,
    navBarName : "app" | "leadGen"
}

const WithNavbar = ({ children , navBarName } : WithNavbarType)=>{
    return(
        <div className="flex flex-row">
            {navBarName == "app" ? <Navbar /> : <LeadGenNavbar />}
            <div className="w-1/5" />
            {children}
        </div>
    )
}

export default WithNavbar