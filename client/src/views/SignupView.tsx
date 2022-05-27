import Signup from './../components/Signup';
import "bootstrap/dist/css/bootstrap.min.css";
import '../styling/Authentication.scss';
import Header from '../components/Header';
export default function SignupView() {

  return (
    <>
      <Header buttonFree/>
      <Signup />
    </>
  )
}
