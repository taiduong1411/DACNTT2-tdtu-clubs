import CarouselHome from "../../../components/Carousel/Carousel";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import { Divider, Pagination } from "antd";
import { Link } from "react-router-dom";
import StickyBox from "react-sticky-box";

function LazyImage({ src, alt }) {
    return <img src={src} alt={alt} className="w-full h-full hover:scale-125 duration-300 ease-out" loading="lazy" />;
}
function Home() {
    return (
        <div className="">
            <div>
                <Header />
            </div>
            <div>
                <CarouselHome />
            </div>
            <div className="min-h-svh container m-auto">
                <div>
                    <Divider className="pt-10">
                        <h1 className="text-3xl">Câu Lạc Bộ Nổi Bật</h1>
                    </Divider>
                </div>
                <div className="flex">
                    <div className="flex items-center ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="flex items-center mr-2" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M10 14L4 5V3H20V5L14 14V20L10 22V14Z"></path></svg>
                        Sắp xếp theo
                    </div>
                    <select name="" id="" className="border ml-4 p-2 rounded-lg flex items-center">
                        <option value="week">Tuần</option>
                        <option value="month">Tháng</option>
                    </select>
                </div>
                <div className="flex container m-auto pt-10">
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 max-[1200px]:px-4">
                        {/*  */}
                        <div className="col-span-4 rounded-xl md:col-span-1 lg:col-span-2 xl:col-span-1 bg-white shadow-md hover:shadow-lg">
                            <div className="relative">
                                <div className="transition duration-300 transform card-container md:h-full flex flex-col justify-center">
                                    <div className="flex justify-center items-center relative">
                                        <div className="relative overflow-hidden w-[500px] h-[350px] max-w-[500px] max-h-[350px]">
                                            <LazyImage
                                                src='https://fss.tdtu.edu.vn/sites/default/files/FSS/C%C3%A2u%20l%E1%BA%A1c%20b%E1%BB%99/CLB%20B%C3%B3ng%20%C4%91%C3%A1.jpg'
                                                alt='/team.png'
                                            />
                                        </div>
                                    </div>
                                    <div className="py-6 px-8 bg-[#171E42] text-white rounded-b-xl min-h-[254px]">
                                        <strong className="font-Lexend-title text-[24px] text-red-500">
                                            CLB Bóng Đá
                                        </strong>
                                        <br />
                                        <p className="font-Lexend-content text-[18px] mt-8">
                                            <span className="overflow-hidden overflow-ellipsis">
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos ut ducimus dignissimos nostrum assumenda molestiae sit, nisi fugiat officiis in repellat commodi ex? Culpa voluptatibus facilis quaerat incidunt accusantium ipsam.
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*  */}
                        <div className="col-span-4 rounded-xl md:col-span-1 lg:col-span-2 xl:col-span-1 bg-white shadow-md hover:shadow-lg">
                            <div className="relative">
                                <div className="transition duration-300 transform card-container md:h-full flex flex-col justify-center">
                                    <div className="flex justify-center items-center relative">
                                        <div className="relative overflow-hidden w-[500px] h-[350px] max-w-[500px] max-h-[350px]">
                                            <LazyImage
                                                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgpbtO_8E6akOhZEXe3aKz7crEJLGe5BOUgP56RPfiIQ&s'
                                                alt='/team.png'

                                            />
                                        </div>
                                    </div>
                                    <div className="py-6 px-8 bg-[#171E42] text-white rounded-b-xl min-h-[254px]">
                                        <strong className="font-Lexend-title text-[24px] text-red-500">
                                            Kênh hỗ trợ & chăm sóc KH
                                        </strong>
                                        <br />
                                        <p className="font-Lexend-content text-[18px] mt-8">
                                            <span className="overflow-hidden overflow-ellipsis">
                                                Website cung cấp một cách liên lạc thuận tiện và nhanh chóng giữa doanh nghiệp và khách hàng, đồng thời hỗ trợ khách hàng trong việc giải đáp thắc mắc và yêu cầu hỗ trợ.
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*  */}
                        <div className="col-span-4 rounded-xl md:col-span-1 lg:col-span-2 xl:col-span-1 bg-white shadow-md hover:shadow-lg">
                            <div className="relative">
                                <div className="transition duration-300 transform card-container md:h-full flex flex-col justify-center">
                                    <div className="flex justify-center items-center relative">
                                        <div className="relative overflow-hidden w-[500px] h-[350px] max-w-[500px] max-h-[350px]">
                                            <LazyImage
                                                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC2_bkmIMp8SQovi5HcEhXkDBIMLlbJaVbPCNTe4MxnA&s'
                                                alt='/team.png'

                                            />
                                        </div>
                                    </div>
                                    <div className="py-6 px-8 bg-[#171E42] text-white rounded-b-xl min-h-[254px]">
                                        <strong className="font-Lexend-title text-[24px] text-red-500">
                                            Luôn luôn hiện diện
                                        </strong>
                                        <br />
                                        <p className="font-Lexend-content text-[18px] mt-8">
                                            <span className="overflow-hidden overflow-ellipsis">
                                                Trang web giúp bạn có mặt trực tuyến 24/7, giới thiệu và quảng bá sản phẩm/dịch vụ của bạn cho khách hàng mọi lúc, mọi nơi.
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*  */}
                        <div className="col-span-4 rounded-xl md:col-span-1 lg:col-span-2 xl:col-span-1 bg-white shadow-md hover:shadow-lg">
                            <div className="relative">
                                <div className="transition duration-300 transform card-container md:h-full flex flex-col justify-center">
                                    <div className="flex justify-center items-center relative">
                                        <div className="relative overflow-hidden w-[500px] h-[350px] max-w-[500px] max-h-[350px]">
                                            <LazyImage
                                                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1e270kd0CKLsg1hKDkMow5KSrDpxmxifOqrUHeWKIQg&s'
                                                alt='/team.png'

                                            />
                                        </div>
                                    </div>
                                    <div className="py-6 px-8 bg-[#171E42] text-white rounded-b-xl min-h-[254px]">
                                        <strong className="font-Lexend-title text-[24px] text-red-500">
                                            Phát triển trong dài hạn
                                        </strong>
                                        <br />
                                        <p className="font-Lexend-content text-[18px] mt-8">
                                            <span className="overflow-hidden overflow-ellipsis">
                                                Sở hữu website với nguồn khách hàng đều đặn chính là giải pháp giúp doanh nghiệp của bạn phát triển trong dài hạn mà không phải phụ thuộc vào các kênh quảng cáo trả phí.
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*  */}
                        <div className="col-span-4 rounded-xl md:col-span-1 lg:col-span-2 xl:col-span-1 bg-white shadow-md hover:shadow-lg">
                            <div className="relative">
                                <div className="transition duration-300 transform card-container md:h-full flex flex-col justify-center">
                                    <div className="flex justify-center items-center relative">
                                        <div className="relative overflow-hidden w-[500px] h-[350px] max-w-[500px] max-h-[350px]">
                                            <LazyImage
                                                src='https://fss.tdtu.edu.vn/sites/default/files/FSS/C%C3%A2u%20l%E1%BA%A1c%20b%E1%BB%99/CLB%20Yoga.jpg'
                                                alt='/team.png'
                                            />
                                        </div>
                                    </div>
                                    <div className="py-6 px-8 bg-[#171E42] text-white rounded-b-xl min-h-[254px]">
                                        <strong className="font-Lexend-title text-[24px] text-red-500">
                                            Tăng trải nghiệm khách hàng
                                        </strong>
                                        <br />
                                        <p className="font-Lexend-content text-[18px] mt-8">
                                            <span className="overflow-hidden overflow-ellipsis">
                                                Website cung cấp một cách liên lạc thuận tiện và nhanh chóng giữa doanh nghiệp và khách hàng, đồng thời hỗ trợ khách hàng trong việc giải đáp thắc mắc và yêu cầu hỗ trợ.
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*  */}
                        <div className="col-span-4 rounded-xl md:col-span-1 lg:col-span-2 xl:col-span-1 bg-white shadow-md hover:shadow-lg">
                            <div className="relative">
                                <div className="transition duration-300 transform card-container md:h-full flex flex-col justify-center">
                                    <div className="flex justify-center items-center relative">
                                        <div className="relative overflow-hidden w-[500px] h-[350px] max-w-[500px] max-h-[350px]">
                                            <LazyImage
                                                src='https://image.sggp.org.vn/1200x630/Uploaded/2024/aekxqdrkxq/2022_04_30/giai-bong-chuyen-7_OHHJ.jpg.webp'
                                                alt='/team.png'
                                            />
                                        </div>
                                    </div>
                                    <div className="py-6 px-8 bg-[#171E42] text-white rounded-b-xl min-h-[254px]">
                                        <strong className="font-Lexend-title text-[24px] text-red-500">
                                            Dễ dàng cập nhật thông tin

                                        </strong>
                                        <br />
                                        <p className="font-Lexend-content text-[18px] mt-8">
                                            <span className="overflow-hidden overflow-ellipsis">
                                                Trang web cho phép bạn dễ dàng cập nhật thông tin mới nhất về sản phẩm, dịch vụ, tin tức và chương trình khuyến mãi.
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <Divider className="pt-10">
                        <h1 className="text-3xl">Tin Tức</h1>
                    </Divider>
                </div>
                <div className="flex min-h-svh">
                    <div className="w-2/3 max-[1200px]:w-full px-4 pt-8">
                        {/*  */}
                        <div className="transition-transform flex mb-4">
                            <div className="flex w-1/3 max-[1200px]:pr-2 justify-center items-center mr-4">
                                <Link to={`/news/`} className="w-full">
                                    <div className="flex justify-left items-center relative">
                                        <div className="relative w-[300px] h-[200px] max-w-[380px] max-h-[150px] max-[1200px]:max-h-[100px] max-[1200px]:max-w-[400px] overflow-hidden flex justify-center items-center">
                                            <img src="https://o.vdoc.vn/data/image/2022/08/25/avatar-cute-meo-con-than-chet.jpg" alt="acc" className="object-cover absolute hover:scale-125 duration-300 ease-out w-full h-full"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="w-2/3">
                                <Link to={`/news/`}>
                                    <h2 className="text-lg max-[1200px]:text-[14px] font-semibold max-[1200px]:mb-0 mb-2 overflow-hidden font-Lexend-title hover:text-gray-600">Sáng này 22/9/2018, ngày Hội truyền thống Khoa Khoa học thể thao đã diễn ra hết sức sôi nổi.</h2>
                                </Link>
                                <span className="text-red-500 max-[1200px]:text-[10px] font-Lexend-content flex items-center text-[12px] mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM11 13V17H6V13H11ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path></svg>
                                    14/11/2023
                                </span>
                                <p className="text-sm max-[1200px]:text-[12px] text-gray-600 overflow-hidden overflow-ellipsis font-Lexend-content line-clamp-2">Sáng này 22/9/2018, ngày Hội truyền thống Khoa Khoa học thể thao đã diễn ra hết sức sôi nổi.</p>
                            </div>
                        </div>
                        {/*  */}
                        <div className="transition-transform flex mb-4">
                            <div className="flex w-1/3 max-[1200px]:pr-2 justify-center items-center mr-4">
                                <Link to={`/news/`} className="w-full">
                                    <div className="flex justify-left items-center relative">
                                        <div className="relative w-[300px] h-[200px] max-w-[380px] max-h-[150px] max-[1200px]:max-h-[100px] max-[1200px]:max-w-[400px] overflow-hidden flex justify-center items-center">
                                            <img src="https://o.vdoc.vn/data/image/2022/08/25/avatar-cute-meo-con-than-chet.jpg" alt="acc" className="object-cover absolute hover:scale-125 duration-300 ease-out w-full h-full"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="w-2/3">
                                <Link to={`/news/`}>
                                    <h2 className="text-lg max-[1200px]:text-[14px] font-semibold max-[1200px]:mb-0 mb-2 overflow-hidden font-Lexend-title hover:text-gray-600">Sáng này 22/9/2018, ngày Hội truyền thống Khoa Khoa học thể thao đã diễn ra hết sức sôi nổi.</h2>
                                </Link>
                                <span className="text-red-500 max-[1200px]:text-[10px] font-Lexend-content flex items-center text-[12px] mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM11 13V17H6V13H11ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path></svg>
                                    14/11/2023
                                </span>
                                <p className="text-sm max-[1200px]:text-[12px] text-gray-600 overflow-hidden overflow-ellipsis font-Lexend-content line-clamp-2">Sáng này 22/9/2018, ngày Hội truyền thống Khoa Khoa học thể thao đã diễn ra hết sức sôi nổi.</p>
                            </div>
                        </div>
                        {/*  */}
                        <div className="transition-transform flex mb-4">
                            <div className="flex w-1/3 max-[1200px]:pr-2 justify-center items-center mr-4">
                                <Link to={`/news/`} className="w-full">
                                    <div className="flex justify-left items-center relative">
                                        <div className="relative w-[300px] h-[200px] max-w-[380px] max-h-[150px] max-[1200px]:max-h-[100px] max-[1200px]:max-w-[400px] overflow-hidden flex justify-center items-center">
                                            <img src="https://o.vdoc.vn/data/image/2022/08/25/avatar-cute-meo-con-than-chet.jpg" alt="acc" className="object-cover absolute hover:scale-125 duration-300 ease-out w-full h-full"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="w-2/3">
                                <Link to={`/news/`}>
                                    <h2 className="text-lg max-[1200px]:text-[14px] font-semibold max-[1200px]:mb-0 mb-2 overflow-hidden font-Lexend-title hover:text-gray-600">Sáng này 22/9/2018, ngày Hội truyền thống Khoa Khoa học thể thao đã diễn ra hết sức sôi nổi.</h2>
                                </Link>
                                <span className="text-red-500 max-[1200px]:text-[10px] font-Lexend-content flex items-center text-[12px] mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM11 13V17H6V13H11ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path></svg>
                                    14/11/2023
                                </span>
                                <p className="text-sm max-[1200px]:text-[12px] text-gray-600 overflow-hidden overflow-ellipsis font-Lexend-content line-clamp-2">Sáng này 22/9/2018, ngày Hội truyền thống Khoa Khoa học thể thao đã diễn ra hết sức sôi nổi.</p>
                            </div>
                        </div>
                        {/*  */}
                        <div className="transition-transform flex mb-4">
                            <div className="flex w-1/3 max-[1200px]:pr-2 justify-center items-center mr-4">
                                <Link to={`/news/`} className="w-full">
                                    <div className="flex justify-left items-center relative">
                                        <div className="relative w-[300px] h-[200px] max-w-[380px] max-h-[150px] max-[1200px]:max-h-[100px] max-[1200px]:max-w-[400px] overflow-hidden flex justify-center items-center">
                                            <img src="https://o.vdoc.vn/data/image/2022/08/25/avatar-cute-meo-con-than-chet.jpg" alt="acc" className="object-cover absolute hover:scale-125 duration-300 ease-out w-full h-full"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="w-2/3">
                                <Link to={`/news/`}>
                                    <h2 className="text-lg max-[1200px]:text-[14px] font-semibold max-[1200px]:mb-0 mb-2 overflow-hidden font-Lexend-title hover:text-gray-600">Sáng này 22/9/2018, ngày Hội truyền thống Khoa Khoa học thể thao đã diễn ra hết sức sôi nổi.</h2>
                                </Link>
                                <span className="text-red-500 max-[1200px]:text-[10px] font-Lexend-content flex items-center text-[12px] mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM11 13V17H6V13H11ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path></svg>
                                    14/11/2023
                                </span>
                                <p className="text-sm max-[1200px]:text-[12px] text-gray-600 overflow-hidden overflow-ellipsis font-Lexend-content line-clamp-2">Sáng này 22/9/2018, ngày Hội truyền thống Khoa Khoa học thể thao đã diễn ra hết sức sôi nổi.</p>
                            </div>
                        </div>
                        {/*  */}
                        <div className="transition-transform flex mb-4">
                            <div className="flex w-1/3 max-[1200px]:pr-2 justify-center items-center mr-4">
                                <Link to={`/news/`} className="w-full">
                                    <div className="flex justify-left items-center relative">
                                        <div className="relative w-[300px] h-[200px] max-w-[380px] max-h-[150px] max-[1200px]:max-h-[100px] max-[1200px]:max-w-[400px] overflow-hidden flex justify-center items-center">
                                            <img src="https://o.vdoc.vn/data/image/2022/08/25/avatar-cute-meo-con-than-chet.jpg" alt="acc" className="object-cover absolute hover:scale-125 duration-300 ease-out w-full h-full"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="w-2/3">
                                <Link to={`/news/`}>
                                    <h2 className="text-lg max-[1200px]:text-[14px] font-semibold max-[1200px]:mb-0 mb-2 overflow-hidden font-Lexend-title hover:text-gray-600">Sáng này 22/9/2018, ngày Hội truyền thống Khoa Khoa học thể thao đã diễn ra hết sức sôi nổi.</h2>
                                </Link>
                                <span className="text-red-500 max-[1200px]:text-[10px] font-Lexend-content flex items-center text-[12px] mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M9 1V3H15V1H17V3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9ZM20 11H4V19H20V11ZM11 13V17H6V13H11ZM7 5H4V9H20V5H17V7H15V5H9V7H7V5Z"></path></svg>
                                    14/11/2023
                                </span>
                                <p className="text-sm max-[1200px]:text-[12px] text-gray-600 overflow-hidden overflow-ellipsis font-Lexend-content line-clamp-2">Sáng này 22/9/2018, ngày Hội truyền thống Khoa Khoa học thể thao đã diễn ra hết sức sôi nổi.</p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-center items-center">
                            <Pagination defaultCurrent={1} total={20} />
                        </div>
                    </div>
                    <div className="w-[1/3] max-[1200px]:w-[100%] px-16 max-[1200px]:px-2 max-[1200px]:mt-10 pt-8">
                        <StickyBox offsetTop={90} offsetBottom={90}>
                            <div className="">
                                <p className="font-bold text-2xl max-[1200px]:text-xl">
                                    Tin tức - Sự Kiện</p>
                            </div>
                            <div className="">
                                <div className="py-8">
                                    <div className="pb-4">
                                        <Link className="text-blue-500 hover:text-blue-800">
                                            Khoa khoa học thể thao hợp tác với Khoa quản lý thể thao Đại học Aletheia (Đài Loan)
                                        </Link>
                                    </div>
                                    <div className="pb-4">
                                        <Link className="text-blue-500 hover:text-blue-800">
                                            Đại học Tôn Đức Thắng được công nhận đạt chuẩn đại học theo hệ thống Châu Âu
                                        </Link>
                                    </div>
                                    <div className="pb-4">
                                        <Link className="text-blue-500 hover:text-blue-800">
                                            Kỷ niệm 124 năm Ngày thành lập Ủy ban Olympic quốc tế (23/06/1894-23/06/2018)
                                        </Link>
                                    </div>
                                    <div className="pb-4">
                                        <Link className="text-blue-500 hover:text-blue-800">
                                            Kỷ niệm 124 năm Ngày thành lập Ủy ban Olympic quốc tế (23/06/1894-23/06/2018)
                                        </Link>
                                    </div>
                                    <div className="pb-4">
                                        <Link className="text-blue-500 hover:text-blue-800">
                                            Khoa khoa học thể thao hợp tác với Khoa quản lý thể thao Đại học Aletheia (Đài Loan)
                                        </Link>
                                    </div>
                                </div>
                                <div className="pb-4">
                                    <Link className="text-blue-500 hover:text-blue-800 flex items-center">
                                        Xem thêm
                                        <svg xmlns="http://www.w3.org/2000/svg" className="flex items-center justify-center ml-2" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path></svg>
                                    </Link>
                                </div>
                            </div>
                        </StickyBox>
                    </div>
                </div>
            </div>
            <div>
                <Footer />
            </div>
        </div>
    );
}

export default Home;