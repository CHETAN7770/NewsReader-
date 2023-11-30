
import Login from '../components/Login';
import '../src/app/globals.css'
import AuthDetail from '../components/FireBaseDetail'

const LoginPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-gray-700">User Login Page</h1>
     
      <Login />
      <AuthDetail/>
    </div>
  );
};

export default LoginPage;
