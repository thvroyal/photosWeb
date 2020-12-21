import 'regenerator-runtime/runtime'
import LocomotiveScroll from 'locomotive-scroll';

const gallery = document.getElementById("showGallery");


function convertNumber(index) {
    let no = index + 1;
    if (no < 10) return '0' + no; else return no;
}

async function getPhotos(url) {
    let response = await fetch(url, {
        method: "GET",
        headers: {
            'Authorization': 'Client-ID f53d1fa9b2553c0'
        }
    });
    return await response.json();
}

function showPhotos() {
    console.log("hello show");
    getPhotos(`https://api.imgur.com/3/album/lnyLIDE`)
        .then(data => {
            document.getElementById('refreshScroll').setAttribute("style", "overflow: hidden");

            console.log('data', data);
            const images = data.data.images;
            // print node image on HTML
            images ? images.map((image, index) => {
                let element = `<figure class="gallery__item">
                <div class="gallery__item-img">
                    <div class="gallery__item-imginner" style="background-image: url(${image.link})"></div>
                </div>  
                <figcaption class="gallery__item-caption">
                    <h2 class="gallery__item-title" data-scroll data-scroll-speed="1">Funambulist</h2>
                    <span class="gallery__item-number">${convertNumber(index)}</span> 
                    <p class="gallery__item-tags">
                        <span>#house</span>
                        <span>#green</span>
                        <span>#chair</span>
                    </p>
                    <a class="gallery__item-link">explore</a>
                </figcaption>
            </figure>`;
                gallery.insertAdjacentHTML('beforeend', element);
            }) : null
        })
        .then(function(){
            // Initial Locomotive Scroll => refresh scrollbar after insert content in HTML
            const lscroll = new LocomotiveScroll({
                el: document.querySelector('[data-scroll-container]'),
                smooth: true,
                direction: 'horizontal'
            });
        })
}

window.onload = function(){
    showPhotos();
}
