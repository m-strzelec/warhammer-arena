import '../../styles/pages/LoadingPage.css';

const LoadingPage = ({ message = 'Loading...', spinner = true, children }) => (
    <div className="loading-page">
        <div className="loading-spinner">
            {spinner && (
                <div className="spinner-wrapper">
                    <div className="spinner spinner-main" />
                    <div className="spinner spinner-secondary" />
                </div>
            )}
            <div className="loading-text">{message}</div>
            {children && <div className="loading-extra">{children}</div>}
        </div>
    </div>
);

export default LoadingPage;
