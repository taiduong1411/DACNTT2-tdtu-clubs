import { useForm } from "react-hook-form";
import { axiosCli } from "../../../interceptor/axios";
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
function Login() {
    const {
        register,
        handleSubmit,
    } = useForm();
    useEffect(() => {
        AOS.init();
    }, []);
    const [error, setError] = useState('');
    // chuc nang Dang xuat
    localStorage.removeItem('accessToken');
    const onSubmit = async (data) => {
        await axiosCli().post('account/login', data).then(res => {
            if (res.status == 200) {
                localStorage.setItem("accessToken", res.data.token);
                let userInfo = jwtDecode(localStorage.getItem("accessToken"));
                // console.log(userInfo);
                if (userInfo.role == '1' || userInfo.role == '2') return window.location.href = '/student'
                if (userInfo.role == '3') return window.location.href = '/admin/dashboard'
            } else {
                setError(res.data);
                setTimeout(() => {
                    setError('')
                }, 2000)
            }
        })
    }
    return (
        <div className="min-h-svh flex container m-auto">
            <div className="flex justify-center w-1/2 max-[1200px]:hidden" data-aos='fade-up' data-aos-duration="2000">
                <div className="flex items-center justify-center">
                    <img src="/logo_tdtu.webp" alt="" className="object-cover w-[400px] h-auto" />
                </div>
            </div>
            <div className="overflow-hidden flex justify-center items-center w-1/2 max-[1200px]:w-full" data-aos='fade-down' data-aos-duration="2000">
                <div className='w-3/4 max-[1200px]:w-5/6 bg-[#171E42] p-8 rounded-2xl'>
                    <div className="mb-6">
                        <h1 className="text-3xl text-white py-2">Đăng Nhập</h1>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-6">
                            <label htmlFor="student_Id" className="block mb-2 text-sm text-gray-900 ">MSSV</label>
                            <input type="text" {...register('student_Id')} placeholder="Nhập MSSV ..." id="student_Id" className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5" required />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block mb-2 text-sm text-gray-900 ">Password</label>
                            <input type="password" {...register('password')} placeholder="Nhập password ..." id="password" className="border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5" required />
                        </div>
                        <div className="mb-6 text-red-500 text-sm">
                            {error}
                        </div>
                        <div className="mb-6 text-blue-600 text-sm">
                            <span className="">
                                <Link to="/register">Chưa có tài khoản ?</Link>
                            </span>
                            <span className="float-right">
                                <Link to="/forgot-password">Quên mật khẩu ?</Link>
                            </span>
                        </div>

                        <button type="submit" className="text-white mb-4 float-right bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center flex items-center">
                            <div className="flex items-center text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                    <path d="M1.94607 9.31543C1.42353 9.14125 1.4194 8.86022 1.95682 8.68108L21.043 2.31901C21.5715 2.14285 21.8746 2.43866 21.7265 2.95694L16.2733 22.0432C16.1223 22.5716 15.8177 22.59 15.5944 22.0876L11.9999 14L17.9999 6.00005L9.99992 12L1.94607 9.31543Z"></path>
                                </svg>
                                <span className="ml-2 text-center">Login</span>
                            </div>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;