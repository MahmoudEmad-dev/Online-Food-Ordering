export default function LoadingSpinner() {
  return (
    <div className="loading-screen">
      <div className="spinner-container">
        <div className="spinner">
          <div className="spinner-ring" />
          <div className="spinner-ring" />
          <div className="spinner-ring" />
        </div>
      </div>
    </div>
  );
}
