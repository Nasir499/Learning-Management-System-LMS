import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import axiosInstance from '../Helpers/axiosinstance';
import HomeLayout from '../Layouts/HomeLayout';

function ResetPassword() {
    const { resetToken } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    async function onFormSubmit(e) {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast.error('All fields are required');
            return;
        }
        if (password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const res = axiosInstance.post(`user/reset/${resetToken}`, { password });
            toast.promise(res, {
                loading: 'Resetting password...',
                success: 'Password reset successfully! Please login.',
                error: 'Failed to reset password',
            });
            await res;
            navigate('/login');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to reset password');
        }
    }

    return (
        <HomeLayout>
            <div className="flex items-center justify-center h-[100vh]">
                <form
                    onSubmit={onFormSubmit}
                    className="flex flex-col justify-center gap-5 rounded-md p-4 text-white w-80 min-h-[26rem] shadow-[0_0_10px_black]"
                >
                    <h1 className="text-center text-2xl font-semibold">Reset Password</h1>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-lg font-semibold">
                            New Password
                        </label>
                        <input
                            type="password"
                            required
                            id="password"
                            placeholder="Enter new password"
                            className="bg-transparent px-2 py-1 border rounded-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="confirmPassword" className="text-lg font-semibold">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            required
                            id="confirmPassword"
                            placeholder="Confirm new password"
                            className="bg-transparent px-2 py-1 border rounded-sm"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 text-lg cursor-pointer font-semibold"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </HomeLayout>
    );
}

export default ResetPassword;
