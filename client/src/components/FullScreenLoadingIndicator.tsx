import spinner from '../assets/spinner.svg';
import '../styling/FullScreenLoadingIndicator.scss';
const FullScreenLoadingIndicator = () => {
  return (
    <div className="FullScreenLoadingIndicator">
      <img style={{ height: '24px' }} src={spinner} alt="spinner"></img>
    </div>
  );
};

export default FullScreenLoadingIndicator;
