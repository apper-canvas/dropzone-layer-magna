import { useEffect } from 'react';

const ResetPassword = () => {
    useEffect(() => {
        const { ApperUI } = window.ApperSDK;
        ApperUI.showResetPassword('#authentication-reset-password');
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-green-50">
            <div id="authentication-reset-password" className="w-full max-w-md p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200"></div>
        </div>
    );
};

export default ResetPassword;