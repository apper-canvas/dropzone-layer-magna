import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/layouts/Root';
import { useSelector } from 'react-redux';

function Signup() {
  const { isInitialized } = useAuth();
  const { user } = useSelector(state => state.user);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isInitialized) {
      const { ApperUI } = window.ApperSDK;
      if (!user) {
        ApperUI.showSignup("#authentication");
      } else {
        const searchParams = new URLSearchParams(window.location.search);
        const redirectPath = searchParams.get('redirect');
        navigate(redirectPath ? redirectPath : "/");
      }
    }
  }, [isInitialized, user, navigate]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-green-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200">
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-500 text-white text-3xl font-bold shadow-lg">
            D
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-center text-2xl font-bold text-gray-900">
              Create Account
            </div>
            <div className="text-center text-sm text-gray-600">
              Please create an account to continue
            </div>
          </div>
        </div>
        <div id="authentication" />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;