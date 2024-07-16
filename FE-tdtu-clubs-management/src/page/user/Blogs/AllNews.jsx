
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { useEffect, useState } from "react";
import { getDataByParams } from "../../../services/service";
import { Breadcrumb, Pagination, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { HomeOutlined } from '@ant-design/icons';
import AOS from 'aos';
import 'aos/dist/aos.css';
const { Search } = Input;
function AllNews() {
    const nav = useNavigate();
    const [allNews, setAllNews] = useState([]);
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(9);
    useEffect(() => {
        getAllNews();
        AOS.init();
    }, [currentPage]);

    const getAllNews = async () => {
        await getDataByParams(`news/all-news-pagination?pageNumber=${currentPage}`).then(res => {
            setAllNews(res.data.data);
            setTotalItems(res.data.totalItems);
        })
    }

    const handleClickPage = (pageNumber) => {
        console.log(pageNumber);
        setCurrentPage(pageNumber);
    }
    // Search
    const onSearch = async (value) => {
        await getDataByParams(`news/search-news/${value}`).then(res => {
            if (res.data.success == false) {
                setAllNews([]);
                // setMsg({
                //     type: res.status == 200 ? 'success' : 'error',
                //     content: res.data.msg || res.data,
                // });
                // setSignal(true);
            } else {
                setAllNews(res.data.data)
            }
        })
    }
    const handleChangeInput = async (e) => {
        if (e.target.value.length < 1) {
            getAllNews();
        }
    }



    return (
        <>
            <div>
                <Header />
            </div>
            <div className="container mx-auto mt-8 max-[1200px]:px-4 min-h-svh">
                <div className="flex justify-between items-center">
                    <div className="flex justify-start">
                        <Breadcrumb
                            items={[
                                {
                                    href: '/student',
                                    title: <HomeOutlined />,
                                },
                                {
                                    title: 'Tin tức',
                                },
                                {
                                    title: 'Tất cả tin tức',
                                },
                            ]}
                        />
                    </div>
                    <div className="flex justify-end">
                        {/* <input type="text" className="border" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                            <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                        </svg> */}
                        <Search
                            placeholder="Tìm Kiếm Bài Viết ..."
                            onSearch={onSearch}
                            style={{
                                width: 200,
                            }}
                            onChange={handleChangeInput}
                        />
                    </div>
                </div>

                <div>

                </div>
                <div className="mt-10 min-h-svh">
                    {allNews.length === 0
                        ? (
                            <p>Không có tin tức !</p>
                        )
                        :
                        (
                            <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-3 max-[1200px]:px-4">
                                {allNews && allNews?.map((data, index) => (
                                    <div
                                        key={index}
                                        className="col-span-4 md:col-span-1 lg:col-span-2 xl:col-span-1 bg-white shadow-md hover:shadow-lg"
                                        data-aos="fade-up"
                                        data-aos-duration="1500"
                                    >
                                        <div className="relative">
                                            <div className="transition duration-300 transform card-container md:h-full flex flex-col justify-center">
                                                <div className="flex justify-center items-center relative">
                                                    <Link to={`/student/news/${data.slug}`} className="w-full">
                                                        <div className="flex justify-center items-center relative">
                                                            <div className="relative overflow-hidden w-[680px] h-[250px] max-w-[680px] max-h-[300px]">
                                                                <img
                                                                    src={data.imgUrl}
                                                                    alt={data.imgUrl}
                                                                    className="object-cover absolute hover:scale-125 duration-300 ease-out w-full h-full"
                                                                />
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                                <div className="p-4">
                                                    <Link to={`/student/news/${data.slug}`}>
                                                        <strong className="text-[16px] title-color">
                                                            {data.title}
                                                        </strong>
                                                    </Link>
                                                    <br />
                                                    <div className="flex mt-2 mb-2">
                                                        {data?.hashTag?.map((d, index) => (
                                                            <span key={index} className="text-white text-sm px-2 py-1 bg-red-500 rounded-xl mr-2 flex cursor-pointer" onClick={() => nav(`/student/news/tag/${d}`)}>
                                                                {d}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <p className="font-Lexend-content text-[14px] max-[1200px]:truncate line-clamp-6">{data.sub_Content}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    }
                    <div className="mt-10 mb-10 flex justify-center items-center">
                        <Pagination defaultCurrent={currentPage} total={totalItems} onChange={handleClickPage} pageSize={pageSize} />
                    </div>
                </div>
            </div>
            <div>
                <Footer />
            </div>
        </>
    );
}

export default AllNews;