import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function ProtectedRoute({ userId, children }) {
    if (!userId) {
        return <Navigate to="/" replace />;
    }
    return children;
}

ProtectedRoute.propTypes = {
    userId: PropTypes.number,
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;