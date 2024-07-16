import { useEffect, useState, useRef } from 'react';
import { getDataByParams } from '../../services/service';
import { useNavigate, Link } from 'react-router-dom';
import Glide from "@glidejs/glide";
function CarouselNews({ newsCarousel }) {
    const nav = useNavigate();
    const [dataNews, setDataNews] = useState([]);
    const glideRef = useRef(null);

    useEffect(() => {
        getNewsCarousel();
    }, [newsCarousel]);

    useEffect(() => {
        if (glideRef.current && dataNews.length > 0) {
            const slider = new Glide(glideRef.current, {
                type: "carousel",
                focusAt: "center",
                perView: 3,
                autoplay: 3000,
                animationDuration: 700,
                gap: 24,
                classNames: {
                    nav: {
                        active: "[&>*]:bg-wuiSlate-700",
                    },
                },
                breakpoints: {
                    1024: {
                        perView: 2,
                    },
                    640: {
                        perView: 1,
                    },
                },
            }).mount();

            return () => {
                slider.destroy();
            };
        }
    }, [dataNews]);

    const getNewsCarousel = async () => {
        try {
            const res = await getDataByParams('news/all-news');
            const data = res.data;
            const otherNews = data.filter(e => {
                const hashTagArray = Array.isArray(e.hashTag) ? e.hashTag : [];
                const hasMatchingHashTag = hashTagArray.some(tag => newsCarousel.hashTag?.includes(tag));
                return e.slug !== newsCarousel.slug && hasMatchingHashTag;
            });
            setDataNews(otherNews);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };
    return (
        <>
            {dataNews.length < 1
                ?
                <div className='text-center text-gray-400'>
                    Không tìm thấy tin tức cùng chủ đề !
                </div>
                :
                <div ref={glideRef} className="glide-01 relative w-full">
                    <div className="overflow-hidden" data-glide-el="track">
                        <ul className="whitespace-no-wrap flex-no-wrap [backface-visibility: hidden] [transform-style: preserve-3d] [touch-action: pan-Y] [will-change: transform] relative flex w-full overflow-hidden p-0">
                            {dataNews.map((news) => (
                                <li key={news.id} className="mr-4 list-none" onClick={() => nav(`/student/news/${news.slug}`)}>
                                    <div className="col-span-4 md:col-span-1 lg:col-span-2 xl:col-span-1 bg-white flex flex-col h-full border">
                                        <div className="relative flex-grow">
                                            <div className="transition duration-300 transform card-container md:h-full flex flex-col justify-center h-full">
                                                <div className="flex justify-center items-center relative">
                                                    <Link to={`/student/news/${news.slug}`} className="w-full">
                                                        <div className="flex justify-center items-center relative">
                                                            <div className="relative overflow-hidden w-[680px] h-[250px] max-w-[680px] max-h-[300px]">
                                                                <img
                                                                    src={news.imgUrl}
                                                                    alt={news.title}
                                                                    className="object-cover absolute hover:scale-125 duration-300 ease-out"
                                                                />
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 flex flex-col">
                                            <Link to={`/student/news/${news.slug}`}>
                                                <strong className="text-[14px] title-color">
                                                    {news.title}
                                                </strong>
                                                <div className="flex mt-1">
                                                    {news?.hashTag?.map((d, index) => (
                                                        <span key={index} className="text-white text-sm px-2 py-1 bg-red-500 rounded-xl mr-2 flex">
                                                            {d}
                                                        </span>
                                                    ))}
                                                </div>
                                            </Link>
                                            <br />
                                            <p className="text-[14px] max-[1200px]:truncate line-clamp-2 flex-grow">{news.sub_Content}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="absolute left-0 top-1/2 flex h-0 w-full items-center justify-between px-4 " data-glide-el="controls">
                        <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-white/20 text-slate-700 transition duration-300 hover:border-slate-900 hover:text-slate-900 focus-visible:outline-none lg:h-12 lg:w-12" data-glide-dir="<" aria-label="prev slide">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                                <title>prev slide</title>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                            </svg>
                        </button>
                        <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-white/20 text-slate-700 transition duration-300 hover:border-slate-900 hover:text-slate-900 focus-visible:outline-none lg:h-12 lg:w-12" data-glide-dir=">" aria-label="next slide">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                                <title>next slide</title>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            }
        </>
    );
}

export default CarouselNews;
