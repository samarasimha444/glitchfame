import { useOutletContext } from "react-router-dom";
import SeasonForm from "./SeasonForm";

const Admin = () => {
  const { profile } = useOutletContext();

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome {profile.username}</p>
      <SeasonForm />
    </div>
  );
};

export default Admin;