import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types'

export default function LogoutButton({ onLogout }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        // localStorage.removeItem("user_id");
        // navigate("/");
        onLogout(); 
        navigate('/', { replace: true });
      }}
      className="absolute top-4 right-4 z-50           
                 px-3 py-1 rounded-md bg-coffee-dark
                 text-white text-sm hover:bg-coffee-light
                 transition"
    >
      Logout
    </button>
  );
}

LogoutButton.propTypes = { onLogout: PropTypes.func.isRequired };
