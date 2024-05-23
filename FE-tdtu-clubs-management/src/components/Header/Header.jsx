import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Avatar, Badge } from 'antd'
import { jwtDecode } from 'jwt-decode';
import './header.css';
import { getDataByParams } from '../../services/service';
import { UserContext } from '../../contexts/UserContext';
const Header = () => {
    const nav = useNavigate();
    useEffect(() => {
        const handleScroll = () => {
            requestAnimationFrame(() => {
                setNav(window.scrollY >= 200);
            });
        };
        // getStudentInfo();
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    // get student_ID / check login

    // const [studentData, setStudentData] = useState([]);
    // const token = jwtDecode(localStorage.getItem('accessToken'));
    // const getStudentInfo = async () => {
    //     await getDataByParams(`account/student-info/${token.sub}`).then(res => {
    //         setStudentData(res.data);
    //     })
    // }

    const { studentData } = useContext(UserContext)




    // toggle Menu
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDesktop, setIsOpenDesktop] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const toggleMenuDesktop = () => {
        setIsOpenDesktop(!isOpenDesktop);
    }
    const [navScroll, setNav] = useState(false);


    // services desktop




    // services mobile


    const items = [
        {
            label: <p>Hi, {studentData && studentData.full_name}</p>,
            key: '0',
        },
        {
            label: <p>Lịch Sử Tiêm</p>,
            key: '1',
        },
        {
            label: <p>Lịch Tiêm Chờ Duyệt</p>,
            key: '2',
        },
        {
            type: 'divider',
        },
        {
            label: <Link to="/login">Đăng Xuất</Link>,
            key: '3',
        },
    ];

    // news



    return (
        <header className={`${navScroll ? "fixed top-0 w-full z-50 bg-[#F1F5F9] p-2 transition-colors duration-500 ease" : "bg-[#f0f6fb] p-3"}`}>
            <div className="container mx-auto flex justify-between items-center">
                <div>
                    <img src="/logo_tdtu.webp" alt="" width={120} height={120} onClick={() => nav('/student')} className='max-[1200px]:hidden' />
                </div>
                <div className="md:hidden">
                    <button className={`${navScroll ? "text-black focus:outline-none" : "text-black focus:outline-none"}`} onClick={toggleMenu}>
                        <svg
                            className="h-6 w-6 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            {isOpen ? (
                                ''
                            ) : (
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M4 6a1 1 0 0 1 1-1h14a1 1 0 0 1 0 2H5a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 0 2H5a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 0 2H5a1 1 0 0 1-1-1z"
                                />
                            )}
                        </svg>
                    </button>
                </div>
                <div className={`md:flex md:items-center ${isOpen ? '' : 'hidden'}`}>
                    <ul className="md:flex md:space-x-4 ">
                        {/* <li className='flex justify-center items-center font-bold'>
                            <Link
                                to='/home'
                                className={`block py-2 px-4 relative ${navScroll ? "text-black" : 'text-black'} hover:text-gray-300 transition duration-300`}
                            >
                                Lịch Sinh Hoạt
                            </Link>
                        </li> */}
                        <li className='flex justify-center items-center px-4 font-bold'>
                            <Dropdown
                                menu={{
                                    items,
                                }}
                                trigger={['click']}
                                size={'large'}
                            >
                                <Badge count={2} size='medium'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M20 18.6667L20.4 19.2C20.5657 19.4209 20.5209 19.7343 20.3 19.9C20.2135 19.9649 20.1082 20 20 20H4C3.72386 20 3.5 19.7761 3.5 19.5C3.5 19.3918 3.53509 19.2865 3.6 19.2L4 18.6667V10C4 5.58172 7.58172 2 12 2C16.4183 2 20 5.58172 20 10V18.6667ZM9.5 21H14.5C14.5 22.3807 13.3807 23.5 12 23.5C10.6193 23.5 9.5 22.3807 9.5 21Z"></path></svg>
                                </Badge>
                            </Dropdown>
                        </li>
                        <li className=''>
                            {studentData && studentData.img
                                ?
                                <span>
                                    <Avatar src={studentData && studentData.img} size={'large'} onClick={toggleMenuDesktop} />
                                </span>
                                :
                                <span>
                                    <Avatar src='/logo_tdtu.webp' size={'large'} onClick={toggleMenuDesktop} />
                                </span>
                            }
                        </li>
                    </ul>
                </div>
            </div>
            <div className={`md:hidden ${isOpen ? '' : 'hidden'}`} >
                <div className="fixed inset-0 z-50 bg-black opacity-70" onClick={toggleMenu}></div>
                <div className="fixed inset-y-0 right-0 z-50 w-64 bg-white">
                    <ul className="py-4 text-center ">
                        <li className='mb-2 p-4'>
                            <a href='/' >Trang Chủ</a>
                        </li>
                        <li className='mb-2 p-4'>
                            <a href='/all-news' >Tin Tức</a>
                        </li>
                        <li className='mb-2 p-4'>
                            <a href='/tuyen-dung'>Tuyển Dụng</a>
                        </li>
                        <li className='mb-2 p-4'>
                            <a href='/contact-us'>Liên Hệ</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={`max-[1200px]:hidden ${isOpenDesktop ? '' : 'hidden'}`} >
                <div className="fixed inset-0 z-50 bg-black opacity-70" onClick={toggleMenuDesktop}></div>
                <div className="fixed inset-y-0 right-0 z-50 w-64 bg-white">
                    <ul className="py-4">
                        <li className='mb-2 p-4'>
                            <div className='flex'>
                                <div className='mr-4'>
                                    {studentData && studentData.img
                                        ?
                                        <span>
                                            <Avatar src={studentData && studentData.img} size={'large'} />
                                        </span>
                                        :
                                        <span>
                                            <Avatar src='/logo_tdtu.webp' size={'large'} />
                                        </span>
                                    }
                                </div>
                                <div className='flex items-center font-bold'>
                                    <p>Hi, {studentData && studentData.full_name}</p>
                                </div>
                            </div>
                        </li>
                        <Link to="/student">
                            <li className='mb-2 px-4 py-3 hover:bg-[#f0f0f0] flex'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center mr-2' viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.48907C3 9.18048 3.14247 8.88917 3.38606 8.69972L11.3861 2.47749C11.7472 2.19663 12.2528 2.19663 12.6139 2.47749L20.6139 8.69972C20.8575 8.88917 21 9.18048 21 9.48907V20Z"></path></svg>
                                Trang Chủ
                            </li>
                        </Link>
                        <Link to="/student/my-account">
                            <li className='mb-2 px-4 py-3 hover:bg-[#f0f0f0] flex'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center mr-2' viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13Z"></path></svg>
                                Tài Khoản
                            </li>
                        </Link>
                        {studentData && studentData.role == "2"
                            ?
                            <Link to='/login'>
                                <li className='mb-2 px-4 py-3 hover:bg-[#f0f0f0] flex'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center mr-2' viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 14V22H4C4 17.5817 7.58172 14 12 14ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM21 17H22V22H14V17H15V16C15 14.3431 16.3431 13 18 13C19.6569 13 21 14.3431 21 16V17ZM19 17V16C19 15.4477 18.5523 15 18 15C17.4477 15 17 15.4477 17 16V17H19Z"></path></svg>
                                    Trang Quản Lý CLB
                                </li>
                            </Link>
                            :
                            <div></div>
                        }

                        <Link to='/login'>
                            <li className='mb-2 px-4 py-3 hover:bg-[#f0f0f0] flex'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center mr-2' viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M5 22C4.44772 22 4 21.5523 4 21V3C4 2.44772 4.44772 2 5 2H19C19.5523 2 20 2.44772 20 3V21C20 21.5523 19.5523 22 19 22H5ZM15 16L20 12L15 8V11H9V13H15V16Z"></path></svg>
                                Đăng Xuất
                            </li>
                        </Link>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;