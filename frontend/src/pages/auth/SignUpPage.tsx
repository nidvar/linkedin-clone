import { Link } from "react-router-dom"
import SignUpForm from "../../components/auth/SignUpForm"

const SignUpPage = () => {
  return (
    <div className="signup-page">
      <h1>SignUpPage</h1>
      <SignUpForm />
      <p>Already have an account?</p>
      <Link to='/login' className="link">Login</Link>
    </div>
  )
}

export default SignUpPage