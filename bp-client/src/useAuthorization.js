import { useNavigate } from "react-router-dom";

export const useAuthorization = () => {
    const navigate = useNavigate();

    const checkAccess = (resource, currentUserId, type = "business") => {
        let hasAccess = false;
        if (type === "business") {
            hasAccess = resource.owners?.some(owner => owner.id === currentUserId);
        } else if (type === "tip") {
            hasAccess = resource.userId === currentUserId;
        }
        if (!hasAccess) {
            navigate("/pristup-odmitnut");
            return false;
        }
        return true;
    };
    return { checkAccess };
};