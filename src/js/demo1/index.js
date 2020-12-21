import {preloadFonts, preloadImages} from '../utils';
import Cursor from '../cursor';
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
    getPhotos(`https://api.imgur.com/3/album/lnyLIDE`)
        .then(data => {
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
                    <a class="gallery__item-link detail-img" id="${image.link}">explore</a>
                </figcaption>
            </figure>`;
                gallery.insertAdjacentHTML('beforeend', element);
            }) : null
        })
        .then(function () {
            // Preload images and fonts
            Promise.all([preloadImages('.gallery__item-imginner'), preloadFonts('vxy2fer')]).then(() => {
                // Remove loader (loading class)
                document.body.classList.remove('loading');

                // Initialize custom cursor
                const cursor = new Cursor(document.querySelector('.cursor'));

                // Mouse effects on all links and others
                [...document.querySelectorAll('a')].forEach(link => {
                    link.addEventListener('mouseenter', () => cursor.enter());
                    link.addEventListener('mouseleave', () => cursor.leave());
                });
            });
        })
        .then(function () {
            // Initial Locomotive Scroll => refresh scrollbar after insert content in HTML
            const lscroll = new LocomotiveScroll({
                el: document.querySelector('[data-scroll-container]'),
                smooth: true,
                direction: 'horizontal'
            });
        })
}

window.onload = function () {
    showPhotos();
}

window.addEventListener('click', event => {
    if (event.target.classList[1] === 'detail-img') {
        const linkImage = event.target.id;

        let modal = document.getElementById("fullscreenModal");
        let span = document.getElementsByClassName("close")[0];
        let replaceImage = document.getElementById("linkImgID");

        modal.style.display = "block";
        replaceImage.setAttribute("src", linkImage);

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

})

