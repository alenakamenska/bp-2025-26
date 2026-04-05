import './EmptyState.css';

const EmptyState = ({ title = "Nic jsme nenašli", message = "Zkuste změnit vyhledávání nebo přidat novou položku" }) => {
  return (
    <div className="empty-state-wrapper">
      <div className="empty-state-content">
        <h2 className="empty-state-title">{title}</h2>
        <p className="empty-state-text">{message}</p>
      </div>
    </div>
  );
};

export default EmptyState;