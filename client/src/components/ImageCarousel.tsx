import Carousel from 'react-bootstrap/Carousel';
import '../styling/ImageCarousel.scss';

const ImageCarousel = ({carouselItems}: {carouselItems: string[]}) => {
  return (
    <Carousel className='Carousel'>
      {carouselItems.map(function(item) {
        return <Carousel.Item key={item}>
          <img
            className="d-block w-100"
            src={item}
            alt="item for sale"
          />
        </Carousel.Item>
      })}
    </Carousel>
  )
}

export default ImageCarousel