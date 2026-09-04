import { useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';

import axiosInstance from '../../Helpers/axiosinstance';
import HomeLayout from '../../Layouts/HomeLayout';

function ChangePassword() {
    const navigate = useNavigate();
    const [userPassword, setUserPassword] = useState({
        oldPassword: '',
        newPassword: '',
    });

    function handleInputChange(e) {
        const { name, value } = e.target;
        setUserPassword({
            ...userPassword,
            [name]: value,
        });
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        if (!userPassword.oldPassword || !userPassword.newPassword) {
            toast.error('All fields are mandatory');
            return;
        }

        if (userPassword.newPassword.length < 8) {
            toast.error('New password must be at least 8 characters long');
            return;
        }

        try {
            const res = axiosInstance.post('user/change-password', userPassword);
            toast.promise(res, {
                loading: 'Changing password...',
                success: 'Password changed successfully',
                error: 'Failed to change password',
            });
            await res;
            navigate('/user/profile');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to change password');
        }
    }

    return (
        <HomeLayout>
            <div className="flex items-center justify-center min-h-[90vh] py-10 px-4">
                <form
                    onSubmit={onFormSubmit}
                    className="flex flex-col justify-center gap-5 rounded-md p-5 text-white w-full max-w-sm min-h-[26rem] shadow-[0_0_10px_black]"
                >
                    <h1 className="text-center text-2xl font-semibold">Change Password</h1>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="oldPassword" className="text-lg font-semibold">
                            Old Password
                        </label>
                        <input
                            type="password"
                            required
                            name="oldPassword"
                            id="oldPassword"
                            placeholder="Enter your old password"
                            className="bg-transparent px-2 py-1.5 border rounded-sm w-full"
                            value={userPassword.oldPassword}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="newPassword" className="text-lg font-semibold">
                            New Password
                        </label>
                        <input
                            type="password"
                            required
                            name="newPassword"
                            id="newPassword"
                            placeholder="Enter your new password"
                            className="bg-transparent px-2 py-1.5 border rounded-sm w-full"
                            value={userPassword.newPassword}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 text-lg cursor-pointer font-semibold">
                        Change Password
                    </button>
                    <Link to="/user/profile">
                        <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
                            <AiOutlineArrowLeft /> Go back to Profile
                        </p>
                    </Link>
                </form>
            </div>
        </HomeLayout>
    );
}

export default ChangePassword;
