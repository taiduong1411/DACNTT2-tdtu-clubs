import { Carousel } from 'antd';

const CarouselHome = () => (
    <>
        <Carousel arrows infinite={true}>
            <div>
                <img src="http://sport.tdtu.edu.vn/images/slide/slide2.jpg" className='w-full' alt="" />
            </div>
            <div>
                <img src="http://sport.tdtu.edu.vn/images/slide/slide1.jpg" className='w-full' alt="" />
            </div>
            <div>
                <img src="http://sport.tdtu.edu.vn/images/slide/slide3.png" className='w-full' alt="" />
            </div>
        </Carousel>
    </>
);
export default CarouselHome;