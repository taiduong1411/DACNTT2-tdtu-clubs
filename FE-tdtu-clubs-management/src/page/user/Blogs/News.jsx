import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDataByParams } from "../../../services/service";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import './News.css';
import { Button, Divider } from "antd";
import CarouselNews from "../../../components/CarouselNews/CarouselNews";
function News() {
    const { slug } = useParams();
    const [newsDetail, setNewsDetail] = useState([]);
    const [newsCarousel, setNewsCarousel] = useState([]);
    const nav = useNavigate();
    useEffect(() => {
        getNewsDetail();
    }, [slug]);
    const getNewsDetail = async () => {
        await getDataByParams(`news/${slug}`).then(res => {
            setNewsDetail(res.data.news);
            const data = {
                slug: res.data.news.slug,
                hashTag: res.data.news.hashTag
            }
            setNewsCarousel(data)
        })
    }
    const handleClickTag = async (e) => {
        const text = e.target.textContent.replace("#", "");
        // console.log(text);
        nav(`/student/news/tag/${text}`)
    }
    return (
        <>
            <div>
                <Header />
            </div>
            <div className="overflow-hidden container m-auto">
                <div className="mt-10">
                    <div className="grid grid-cols-12 gap-4 content">
                        <div className="col-start-2 col-span-10">
                            <div className="m-auto mb-20">
                                <span className="text-red-500 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM11 13V17H6V13H11ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path></svg>
                                    {new Date(newsDetail.updatedAt).toLocaleDateString('en-GB')}</span>
                                <h1 className="text-4xl max-[1200px]:text-3xl font-bold title-color mt-4 mb-20 leading-snug">
                                    {newsDetail.title}
                                </h1>
                                <img src={newsDetail.imgUrl} alt="" width={500} height={500} className="object-cover" />
                            </div>
                            <div className="font-Lexend-content" dangerouslySetInnerHTML={{ __html: newsDetail.content }} />
                            <div className="mt-10 flex-1 m-auto">
                                <div className="flex bg-[#F5F5F5] p-4 max-[1200px]:flex-col">
                                    <div className="text-sm flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM11 13V17H6V13H11ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path></svg>
                                        Cập nhật vào: {new Date(newsDetail.updatedAt).toLocaleDateString('en-GB')}
                                    </div>
                                    <div className="flex items-center text-sm xl:m-auto">
                                        Tag:
                                        {newsDetail.hashTag?.map((tag, index) => (
                                            <Button key={index} className="ml-2" onClick={handleClickTag}>#{tag}</Button>
                                        ))}
                                    </div>

                                    <div className="flex items-center">
                                        <p className="flex items-center text-sm">Share:</p>
                                        <a
                                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-2 text-blue-500 hover:text-blue-700"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="rgba(22,137,255,1)"><path d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 16.9913 5.65783 21.1283 10.4385 21.8785V14.8906H7.89941V12H10.4385V9.79688C10.4385 7.29063 11.9314 5.90625 14.2156 5.90625C15.3097 5.90625 16.4541 6.10156 16.4541 6.10156V8.5625H15.1931C13.9509 8.5625 13.5635 9.33334 13.5635 10.1242V12H16.3369L15.8936 14.8906H13.5635V21.8785C18.3441 21.1283 22.001 16.9913 22.001 12C22.001 6.47715 17.5238 2 12.001 2Z"></path></svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Divider className="pt-10">
                                    <h1 className="text-3xl">Tin Cùng Chủ Đề</h1>
                                </Divider>
                            </div>
                            <div className="mb-10">
                                <CarouselNews newsCarousel={newsCarousel} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div>
                <Footer />
            </div>
        </>
    );
}

export default News;