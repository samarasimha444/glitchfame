import { Outlet, useOutletContext } from "react-router-dom";
import Seasons from "./Seasons/SeasonList";


export default function Dashboard(){
   const { profile } = useOutletContext();
  return(
    <div>
      <Outlet context={{ profile }} />
       <Seasons />
    </div>
  )
}