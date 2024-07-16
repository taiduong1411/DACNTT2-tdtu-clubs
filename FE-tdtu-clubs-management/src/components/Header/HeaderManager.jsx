import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown, Avatar, Badge } from 'antd'
import { jwtDecode } from 'jwt-decode';
import './header.css';
import { getDataByParams } from '../../services/service';
import { UserContext } from '../../contexts/UserContext';
const HeaderManager = (isLogo) => {
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
    // CLICK DROPDOWN CLB
    const [isClickDropdown, setIsClickDropdown] = useState(false);
    const handleDropdown = () => {
        setIsClickDropdown(!isClickDropdown);
    }

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





    return (
        <header className={`${navScroll ? "w-full z-50 p-2 transition-colors duration-500 ease" : "p-3"}`}>
            <div className="container mx-auto flex justify-between items-center">
                <div>
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
                            <li className='mb-2 px-4 py-3 hover:bg-[#f0f0f0] flex items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center mr-4' viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.48907C3 9.18048 3.14247 8.88917 3.38606 8.69972L11.3861 2.47749C11.7472 2.19663 12.2528 2.19663 12.6139 2.47749L20.6139 8.69972C20.8575 8.88917 21 9.18048 21 9.48907V20ZM19 19V9.97815L12 4.53371L5 9.97815V19H19Z"></path></svg>
                                Trang Chủ
                            </li>
                        </Link>
                        <Link to="/student/my-account">
                            <li className='mb-2 px-4 py-3 hover:bg-[#f0f0f0] flex items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center mr-4' viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"></path></svg>
                                Tài Khoản
                            </li>
                        </Link>
                        <li className='mb-2 px-4 py-3 hover:bg-[#f0f0f0] cursor-pointer' onClick={handleDropdown}>
                            <div className='flex items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center mr-4' viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 11C14.7614 11 17 13.2386 17 16V22H15V16C15 14.4023 13.7511 13.0963 12.1763 13.0051L12 13C10.4023 13 9.09634 14.2489 9.00509 15.8237L9 16V22H7V16C7 13.2386 9.23858 11 12 11ZM5.5 14C5.77885 14 6.05009 14.0326 6.3101 14.0942C6.14202 14.594 6.03873 15.122 6.00896 15.6693L6 16L6.0007 16.0856C5.88757 16.0456 5.76821 16.0187 5.64446 16.0069L5.5 16C4.7203 16 4.07955 16.5949 4.00687 17.3555L4 17.5V22H2V17.5C2 15.567 3.567 14 5.5 14ZM18.5 14C20.433 14 22 15.567 22 17.5V22H20V17.5C20 16.7203 19.4051 16.0796 18.6445 16.0069L18.5 16C18.3248 16 18.1566 16.03 18.0003 16.0852L18 16C18 15.3343 17.8916 14.694 17.6915 14.0956C17.9499 14.0326 18.2211 14 18.5 14ZM5.5 8C6.88071 8 8 9.11929 8 10.5C8 11.8807 6.88071 13 5.5 13C4.11929 13 3 11.8807 3 10.5C3 9.11929 4.11929 8 5.5 8ZM18.5 8C19.8807 8 21 9.11929 21 10.5C21 11.8807 19.8807 13 18.5 13C17.1193 13 16 11.8807 16 10.5C16 9.11929 17.1193 8 18.5 8ZM5.5 10C5.22386 10 5 10.2239 5 10.5C5 10.7761 5.22386 11 5.5 11C5.77614 11 6 10.7761 6 10.5C6 10.2239 5.77614 10 5.5 10ZM18.5 10C18.2239 10 18 10.2239 18 10.5C18 10.7761 18.2239 11 18.5 11C18.7761 11 19 10.7761 19 10.5C19 10.2239 18.7761 10 18.5 10ZM12 2C14.2091 2 16 3.79086 16 6C16 8.20914 14.2091 10 12 10C9.79086 10 8 8.20914 8 6C8 3.79086 9.79086 2 12 2ZM12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4Z"></path></svg>
                                Câu Lạc Bộ
                                {isClickDropdown
                                    ?
                                    <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center ml-8' viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path></svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center ml-8' viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M11.9999 10.8284L7.0502 15.7782L5.63599 14.364L11.9999 8L18.3639 14.364L16.9497 15.7782L11.9999 10.8284Z"></path></svg>
                                }
                            </div>
                            <div>
                            </div>
                        </li>
                        {isClickDropdown
                            ?
                            <ul className='text-center'>
                                <li className='hover:bg-[#f0f0f0] p-3 flex items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center mx-4' viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M15 4H5V20H19V8H15V4ZM3 2.9918C3 2.44405 3.44749 2 3.9985 2H16L20.9997 7L21 20.9925C21 21.5489 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918ZM11 11V8H13V11H16V13H13V16H11V13H8V11H11Z"></path></svg>
                                    Yêu Cầu Mở CLB</li>
                                <li className='hover:bg-[#f0f0f0] p-3 flex items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center mx-4' viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path></svg>
                                    Lịch Sinh Hoạt</li>
                            </ul>
                            :
                            ''
                        }
                        {studentData && studentData.role == "2"
                            ?
                            <Link to='/login'>
                                <li className='mb-2 px-4 py-3 hover:bg-[#f0f0f0] flex items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center mr-4' viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 14V22H4C4 17.5817 7.58172 14 12 14ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM21 17H22V22H14V17H15V16C15 14.3431 16.3431 13 18 13C19.6569 13 21 14.3431 21 16V17ZM19 17V16C19 15.4477 18.5523 15 18 15C17.4477 15 17 15.4477 17 16V17H19Z"></path></svg>
                                    Trang Quản Lý CLB
                                </li>
                            </Link>
                            :
                            <div></div>
                        }

                        <Link to='/login'>
                            <li className='mb-2 px-4 py-3 hover:bg-[#f0f0f0] flex items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center mr-4' viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.2713 2 18.1757 3.57078 20.0002 5.99923L17.2909 5.99931C15.8807 4.75499 14.0285 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C14.029 20 15.8816 19.2446 17.2919 17.9998L20.0009 17.9998C18.1765 20.4288 15.2717 22 12 22ZM19 16V13H11V11H19V8L24 12L19 16Z"></path></svg>
                                Đăng Xuất
                            </li>
                        </Link>
                    </ul>
                </div>
            </div>
            <div className={`${isOpenDesktop ? '' : 'hidden'}`} >
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
                            <li className='mb-2 px-4 py-3 hover:bg-[#f0f0f0] flex items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center mr-4' viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.48907C3 9.18048 3.14247 8.88917 3.38606 8.69972L11.3861 2.47749C11.7472 2.19663 12.2528 2.19663 12.6139 2.47749L20.6139 8.69972C20.8575 8.88917 21 9.18048 21 9.48907V20ZM19 19V9.97815L12 4.53371L5 9.97815V19H19Z"></path></svg>
                                Trang Chủ
                            </li>
                        </Link>
                        <Link to="/student/my-account">
                            <li className='mb-2 px-4 py-3 hover:bg-[#f0f0f0] flex items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center mr-4' viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"></path></svg>
                                Tài Khoản
                            </li>
                        </Link>
                        <li className='mb-2 px-4 py-3 hover:bg-[#f0f0f0] cursor-pointer' onClick={handleDropdown}>
                            <div className='flex items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center mr-4' viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 11C14.7614 11 17 13.2386 17 16V22H15V16C15 14.4023 13.7511 13.0963 12.1763 13.0051L12 13C10.4023 13 9.09634 14.2489 9.00509 15.8237L9 16V22H7V16C7 13.2386 9.23858 11 12 11ZM5.5 14C5.77885 14 6.05009 14.0326 6.3101 14.0942C6.14202 14.594 6.03873 15.122 6.00896 15.6693L6 16L6.0007 16.0856C5.88757 16.0456 5.76821 16.0187 5.64446 16.0069L5.5 16C4.7203 16 4.07955 16.5949 4.00687 17.3555L4 17.5V22H2V17.5C2 15.567 3.567 14 5.5 14ZM18.5 14C20.433 14 22 15.567 22 17.5V22H20V17.5C20 16.7203 19.4051 16.0796 18.6445 16.0069L18.5 16C18.3248 16 18.1566 16.03 18.0003 16.0852L18 16C18 15.3343 17.8916 14.694 17.6915 14.0956C17.9499 14.0326 18.2211 14 18.5 14ZM5.5 8C6.88071 8 8 9.11929 8 10.5C8 11.8807 6.88071 13 5.5 13C4.11929 13 3 11.8807 3 10.5C3 9.11929 4.11929 8 5.5 8ZM18.5 8C19.8807 8 21 9.11929 21 10.5C21 11.8807 19.8807 13 18.5 13C17.1193 13 16 11.8807 16 10.5C16 9.11929 17.1193 8 18.5 8ZM5.5 10C5.22386 10 5 10.2239 5 10.5C5 10.7761 5.22386 11 5.5 11C5.77614 11 6 10.7761 6 10.5C6 10.2239 5.77614 10 5.5 10ZM18.5 10C18.2239 10 18 10.2239 18 10.5C18 10.7761 18.2239 11 18.5 11C18.7761 11 19 10.7761 19 10.5C19 10.2239 18.7761 10 18.5 10ZM12 2C14.2091 2 16 3.79086 16 6C16 8.20914 14.2091 10 12 10C9.79086 10 8 8.20914 8 6C8 3.79086 9.79086 2 12 2ZM12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4Z"></path></svg>
                                Câu Lạc Bộ
                                {isClickDropdown
                                    ?
                                    <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center ml-8' viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path></svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center ml-8' viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M11.9999 10.8284L7.0502 15.7782L5.63599 14.364L11.9999 8L18.3639 14.364L16.9497 15.7782L11.9999 10.8284Z"></path></svg>
                                }
                            </div>
                            <div>
                            </div>
                        </li>
                        {isClickDropdown
                            ?
                            <ul className='text-center pt-1 pb-4'>
                                <Link to="/student/my-club">
                                    <li className='hover:bg-[#f0f0f0] p-3 flex items-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center mx-4' viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18.0004 17V22H16.0004V17C16.0004 12.5487 18.6444 8.71498 22.4475 6.98352L23.2753 8.8047C20.1637 10.2213 18.0004 13.3581 18.0004 17ZM8.00045 17V22H6.00045V17C6.00045 13.3581 3.83723 10.2213 0.725586 8.8047L1.55339 6.98352C5.35651 8.71498 8.00045 12.5487 8.00045 17ZM12.0004 12C9.23902 12 7.00045 9.76142 7.00045 7C7.00045 4.23858 9.23902 2 12.0004 2C14.7619 2 17.0004 4.23858 17.0004 7C17.0004 9.76142 14.7619 12 12.0004 12ZM12.0004 10C13.6573 10 15.0004 8.65685 15.0004 7C15.0004 5.34315 13.6573 4 12.0004 4C10.3436 4 9.00045 5.34315 9.00045 7C9.00045 8.65685 10.3436 10 12.0004 10Z"></path></svg>
                                        CLB Của Tôi</li>
                                </Link>
                                <li className='hover:bg-[#f0f0f0] p-3 flex items-center cursor-pointer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center mx-4' viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M15 4H5V20H19V8H15V4ZM3 2.9918C3 2.44405 3.44749 2 3.9985 2H16L20.9997 7L21 20.9925C21 21.5489 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918ZM11 11V8H13V11H16V13H13V16H11V13H8V11H11Z"></path></svg>
                                    Yêu Cầu Mở CLB</li>
                                <li className='hover:bg-[#f0f0f0] p-3 flex items-center cursor-pointer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center mx-4' viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20.0049 2C21.1068 2 22 2.89821 22 3.9908V20.0092C22 21.1087 21.1074 22 20.0049 22H4V18H2V16H4V13H2V11H4V8H2V6H4V2H20.0049ZM8 4H6V20H8V4ZM20 4H10V20H20V4Z"></path></svg>
                                    Học Vụ</li>
                            </ul>
                            :
                            ''
                        }
                        {studentData && studentData.role == "2"
                            ?
                            <Link to='/manager/dashboard'>
                                <li className='mb-2 px-4 py-3 hover:bg-[#f0f0f0] flex items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center mr-4' viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 14V16C8.68629 16 6 18.6863 6 22H4C4 17.5817 7.58172 14 12 14ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11ZM21 17H22V22H14V17H15V16C15 14.3431 16.3431 13 18 13C19.6569 13 21 14.3431 21 16V17ZM19 17V16C19 15.4477 18.5523 15 18 15C17.4477 15 17 15.4477 17 16V17H19Z"></path></svg>
                                    Trang Quản Lý
                                </li>
                            </Link>
                            :
                            <div></div>
                        }
                        <Link to="/student/mailbox">
                            <li className='mb-2 px-4 py-3 hover:bg-[#f0f0f0] flex items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center mr-4' viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M14 22.5L11.2 19H6C5.44772 19 5 18.5523 5 18V7.10256C5 6.55028 5.44772 6.10256 6 6.10256H22C22.5523 6.10256 23 6.55028 23 7.10256V18C23 18.5523 22.5523 19 22 19H16.8L14 22.5ZM15.8387 17H21V8.10256H7V17H11.2H12.1613L14 19.2984L15.8387 17ZM2 2H19V4H3V15H1V3C1 2.44772 1.44772 2 2 2Z"></path></svg>
                                Hòm Thư Góp Ý
                            </li>
                        </Link>
                        <Link to='/login'>
                            <li className='mb-4 px-4 py-3 hover:bg-[#f0f0f0] flex items-center absolute bottom-0 w-full'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='flex items-center mr-4' viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.2713 2 18.1757 3.57078 20.0002 5.99923L17.2909 5.99931C15.8807 4.75499 14.0285 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C14.029 20 15.8816 19.2446 17.2919 17.9998L20.0009 17.9998C18.1765 20.4288 15.2717 22 12 22ZM19 16V13H11V11H19V8L24 12L19 16Z"></path></svg>
                                Đăng Xuất
                            </li>
                        </Link>
                    </ul>
                </div>
            </div>
        </header >
    );
};

export default HeaderManager;