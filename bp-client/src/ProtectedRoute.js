import { Navigate } from 'react-router-dom';
import { useAuthContext } from './Providers/AuthProvider';

export const ProtectedRoute = ({ children }) => {
    const [state] = useAuthContext();

    if (!state.accessToken) {
        return <Navigate to="/login" replace />;
    }

    return children;
};