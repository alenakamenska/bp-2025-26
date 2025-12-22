import "./footer.css";

export const Footer = () => {
    return (
    <footer className="footer">
        <div className="footer-content">
            <p>&copy; {new Date().getFullYear()}</p>
                <p>
                <a href="/contact">Kontakt</a> | <a href="/about">O nás</a>
            </p>
        </div>
    </footer>
    );
}