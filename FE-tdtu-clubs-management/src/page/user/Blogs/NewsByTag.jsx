import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDataByParams } from "../../../services/service";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { Link } from "react-router-dom";
import { Pagination, Breadcrumb } from "antd";
import { HomeOutlined } from '@ant-design/icons';
function NewsByTag() {
    const { tag } = useParams();

    const [dataTag, setDataTag] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [newNews, setNewNews] = useState([]);
    useEffect(() => {
        getNewsByTag();
    }, [currentPage]);
    const getNewsByTag = async () => {
        const encodedTag = encodeURIComponent(tag);
        await getDataByParams(`news/tag/${encodedTag}?pageNumber=${currentPage}`).then(res => {
            // console.log(res.data);
            setDataTag(res.data.data);
            setTotalItems(res.data.totalItems);
            setNewNews(res.data.newNews);
        })
    }
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <>
            <div>
                <Header />
            </div>
            <div className="min-h-svh">
                <div className="container mx-auto mt-8 mb-10 max-[1200px]:px-4">
                    <Breadcrumb
                        items={[
                            {
                                href: '/student',
                                title: <HomeOutlined />,
                            },
                            {
                                title: 'tag',
                            },
                            {
                                title: `${tag}`,
                            },
                        ]}
                    />
                    {dataTag?.length === 0 ? (
                        <p>No blogs found for this tag.</p>
                    ) : (
                        <div className="flex mt-10 max-[1200px]:flex-col">
                            <div className="">
                                {dataTag?.map((data, index) => (
                                    <div className="transition-transform flex mb-4" key={index}>
                                        <div className="flex w-1/3 max-[1200px]:pr-2 justify-center items-center mr-4">
                                            <Link to={`/student/news/${data.slug}`} className="w-full">
                                                <div className="flex justify-left items-center relative">
                                                    <div className="relative w-[300px] h-[200px] max-w-[380px] max-h-[150px] max-[1200px]:max-h-[100px] max-[1200px]:max-w-[400px] overflow-hidden flex justify-center items-center">
                                                        <img
                                                            src={data.imgUrl}
                                                            alt="acc"
                                                            className="object-cover absolute hover:scale-125 duration-300 ease-out w-full h-full"
                                                        />
                                                        {newNews.includes(data.id) && (
                                                            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                                                Tin tức mới
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="w-full">
                                            <Link to={`/student/news/${data.slug}`}>
                                                <h2 className="text-lg max-[1200px]:text-[14px] font-semibold max-[1200px]:mb-0 mb-2 overflow-hidden hover:text-gray-600">{data.title}</h2>
                                            </Link>
                                            <span className="text-red-500 max-[1200px]:text-[10px] font-Lexend-content flex items-center text-[12px] mb-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM11 13V17H6V13H11ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path></svg>
                                                {new Date(data.createdAt).toLocaleDateString('en-GB')}
                                            </span>
                                            <p className="text-sm max-[1200px]:text-[12px] text-gray-600 overflow-hidden overflow-ellipsis font-Lexend-content line-clamp-2">{data.sub_Content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="mt-4 flex justify-center items-center mb-10">
                        <Pagination
                            defaultCurrent={currentPage}
                            total={totalItems}
                            pageSize={5}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>

            </div>
            <div>
                <Footer />
            </div>
        </>
    );
}

export default NewsByTag;