import Login from '../components/Login';
import '../styling/Authentication.scss';
import Header from '../components/Header';

export default function LoginView() {
  return (
    <>
      <Header buttonFree />
      <Login />
    </>
  )
}
