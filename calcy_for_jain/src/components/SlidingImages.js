import React from 'react'
// import pic from './image2.jpg'
import pic1 from './Images/slidepic8.jpeg'
import pic2 from './Images/slidepic9.jpeg'
import pic3 from './Images/slidepic10.jpeg'
import pic4 from './Images/slidepic11.jpeg'
import pic5 from './Images/slidepic15.jpg'
// import pic from './image2.jpg'
export default function SlidingImages() {
    return (
        <div className='row p-2 mb-5 mt-4 '>
            <div className='col-sm-8'>
        <div>
        <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" aria-label="Slide 4"></button>
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="4" aria-label="Slide 5"></button>
        </div>
        <div className="carousel-inner fs-2">
          <div className="carousel-item active">
            <img src={pic5} className="d-block w-100" alt="..."/>
            <div className="carousel-caption d-none d-md-block ">
              {/* <h5>First slide label</h5> */}
              <p className='position-absolute top-50 start-0 translate-middle'>Architect: <br/> <b>Jain & Associates</b></p>
            </div>
          </div>
          <div className="carousel-item">
            <img src={pic1} className="d-block w-100" alt="..."/>
            <div className="carousel-caption d-none d-md-block ">
              {/* <h5>First slide label</h5> */}
              <p className='position-absolute top-50 start-0 translate-middle '>Architect: <br/> <b>Jain & Associates</b></p>
            </div>
          </div>
          <div className="carousel-item">
            <img src={pic2} className="d-block w-100" alt="..."/>
            <div className="carousel-caption d-none d-md-block">
            <p className='position-absolute top-50 start-0 translate-middle '>Architect: <br/> <b>Jain & Associates</b></p>

            </div>
          </div>
          <div className="carousel-item">
            <img src={pic3} className="d-block w-100" alt="..."/>
            <div className="carousel-caption d-none d-md-block">
            <p className='position-absolute top-50 start-0 translate-middle '>Architect: <br/> <b>Jain & Associates</b></p>

            </div>
          </div>
          <div className="carousel-item">
            <img src={pic4} className="d-block w-100" alt="..."/>
            <div className="carousel-caption d-none d-md-block">
            <p className='position-absolute top-50 start-0 translate-middle '>Architect: <br/> <b>Jain & Associates</b></p>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <div/>
            
         </div>
             </div> 
              <div className='col-sm-4'>
              <figure className="figure" >
        {/* <img src={pic} className="bg-opacity-25 figure-img img-fluid rounded" alt="..." /> */}
        <figcaption className="figure-caption" >
        <div className='container fs-4 mt-2 p-4  text-primary-emphasis bg-table-info bg-success-subtle borde border-primary rounded-3' >
                <div className='text-start'>
                <span className='fs-1'>W</span>elcome to <b>Jain And Associates</b>, where 
                excellence meets construction expertise. With 17+ years of industry experience, we pride ourselves on delivering top-quality services tailored to meet our clients' needs. From residential renovations to large-scale commercial projects, we bring precision, professionalism, and passion to every job. Our team of skilled professionals is committed to safety, innovation, and exceeding expectations. Explore our portfolio to see our completed projects and read testimonials from satisfied clients. Ready to start your next project? Contact us today for a consultation. Let's build something extraordinary together.
                </div>
               
                <div className='text-end mt-2'>
                  -Er. Pritam L. Kandi<br></br>
                  (DCE, B.E. Civil)<br></br>
                  9595793202

                </div>
             </div> 
              </figcaption>
              </figure>
             </div> 
         </div>
    )
}
