/*==================== SHOW MENU ====================*/
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu')
    })
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))


/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
    const header = document.getElementById('header')
    const brand = document.getElementById('nav-brand')

    // When the scroll is greater than 100 viewport height, add the scroll-header class to the header tag
    if (window.scrollY >= 100) {
        header.classList.add('scroll-header')
        brand.classList.add('show')
    } else {
        header.classList.remove('scroll-header')
        brand.classList.remove('show')
    }
}
window.addEventListener('scroll', scrollHeader)


/*==================== SHOW SCROLL UP ====================*/
function scrollUp() {
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 200 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if (this.scrollY >= 200) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute('id');

        const navLink = document.querySelector('.nav__menu a[href*=' + sectionId + ']');
        if (!navLink) return; // Skip if no matching nav link found

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink.classList.add('active-link');
        } else {
            navLink.classList.remove('active-link');
        }
    });
}

window.addEventListener('scroll', scrollActive)

/*==================== SCROLL REVEAL ANIMATION ====================*/
const sr = ScrollReveal({
    distance: '60px',
    duration: 2800,
    // reset: true,
})


sr.reveal(`.home__data, .home__social-link, .home__info,
           .discover__container,
           .experience__data, .experience__overlay,
           .place__card,
           .sponsor__content,
           .footer__data, .footer__rights`, {
    origin: 'top',
    interval: 100,
})

sr.reveal(`.about__data, 
           .video__description,
           .subscribe__description`, {
    origin: 'left',
})

sr.reveal(`.about__img-overlay, 
           .video__content,
           .subscribe__form`, {
    origin: 'right',
    interval: 100,
})

/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-line'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line'

// We validate if the user previously chose a topic
if (selectedTheme) {
    // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
    themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})
/*==================== PAINTING GALLERY ====================*/
let painting_list = [];

// Run after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    fetch('./assets/json/paintings.json')
        .then(response => response.json())
        .then(data => {
            painting_list = data;

            // 🎨 Split by type
            const landscape_paintings = painting_list.filter(p => p.type === "horizontal");
            const portrait_paintings = painting_list.filter(p => p.type === "vertical");

            /* ========== LANDSCAPE SECTION (Gallery Cards) ========== */
            const placeContainer = document.getElementById('place-container');
            if (placeContainer) {
                landscape_paintings.forEach(place => {
                    const card = document.createElement('div');
                    card.className = 'place__card';
                    card.onclick = () => openCanvas(place.id);

                    card.innerHTML = `
                        <img src="${place.filename}" alt="${place.title}" class="place__img">
                        <div class="place__content">
                            <span class="place__rating">
                                <i class="ri-star-line place__rating-icon"></i>
                            </span>
                            <div class="place__data">
                                <h3 class="place__title">${place.title}</h3>
                                <span class="place__subtitle">${place.material}</span>
                            </div>
                        </div>
                        <button class="button button--flex place__button">
                            <i class="ri-arrow-right-line"></i>
                        </button>
                    `;
                    placeContainer.appendChild(card);
                });
            }

            /* ========== PORTRAIT SECTION (Swiper) ========== */
            const discoverContainer = document.getElementById('discover-container');
            if (discoverContainer) {
                discoverContainer.classList.add('swiper', 'discover__container');

                const wrapper = document.createElement('div');
                wrapper.className = 'swiper-wrapper';

                portrait_paintings.forEach(painting => {
                    const slide = document.createElement('div');
                    slide.className = 'discover__card swiper-slide';
                    slide.onclick = () => openCanvas(painting.id);

                    slide.innerHTML = `
                    <div class="image-container">
                        <img src="${painting.filename}" alt="${painting.title}" class="discover__img">
                    </div>
                    <div class="discover__data">
                        <h2 class="discover__title">${painting.title}</h2>
                        <span class="discover__description">${painting.material}</span>
                    </div>
                `;
                    wrapper.appendChild(slide);
                });

                discoverContainer.appendChild(wrapper);

                // Initialize Swiper
                new Swiper(".discover__container", {
                    effect: "coverflow",
                    grabCursor: true,
                    centeredSlides: true,
                    slidesPerView: "auto",
                    loop: true,
                    spaceBetween: 32,
                    coverflowEffect: {
                        rotate: 0,
                    },
                });
            }
            /* ========== FULL GALLERY SECTION (Grid) ========== */
            const galleryContainer = document.getElementById('gallery-container');
            if (galleryContainer) {
                painting_list.forEach(painting => {
                    const card = document.createElement('div');
                    card.className = 'gallery__card';
                    card.onclick = () => openCanvas(painting.id);

                    card.innerHTML = `
                    <img src="${painting.filename}" alt="${painting.title}" class="gallery__img">
                    <div class="gallery__data">
                        <h3 class="gallery__title">${painting.title}</h3>
                        <span class="gallery__subtitle">${painting.material}</span>
                    </div>
                `;
                    galleryContainer.appendChild(card);
                });
            }

        })
        .catch(error => {
            console.error("Error loading paintings.json:", error);
        });
});


/*==================== CANVAS POPUP ====================*/
document.addEventListener("DOMContentLoaded", () => {
    // Only generate once
    if (!document.getElementById("canvasPopup")) {
        const popupHTML = `
        <!--==================== CANVAS POPUP ====================-->
        <div id="canvasPopup" class="canvas-popup">
            <span class="canvas-close" onclick="closeCanvas()">&times;</span>

            <!-- Image -->
            <div class="canvas-image-container">
                <img id="canvasImage" src="" alt="">
            </div>

            <!-- Info -->
            <div class="canvas-info-container">
                <h1 id="canvasTitle"></h1>
                <hr>

                <div class="art-meta">
                    <p><strong>Tác giả:</strong> Lê Tấn Đạt</p>
                    <p><strong>Kích thước:</strong> <span id="canvasSize"></span> cm</p>
                    <p><strong>Năm sáng tác:</strong> <span id="canvasYear"></span></p>
                    <p><strong>Chất liệu:</strong> <span id="canvasMaterial"></span></p>
                    <p><strong>Giá bán:</strong> <span class="price-highlight">Vui lòng liên hệ</span></p>
                </div>
                <hr>
                <a href="#contact" class="button" onclick="closeCanvas()">Liên hệ ngay</a>
            </div>
        </div>`;
        document.body.insertAdjacentHTML("beforeend", popupHTML);
    }
});

/*==================== OPEN POPUP ====================*/
function openCanvas(id) {
    try {
        const painting = painting_list.find(p => p.id === id);
        if (!painting) throw new Error(`Painting with id=${id} not found`);

        const imgEl = document.getElementById("canvasImage");
        const titleEl = document.getElementById("canvasTitle");
        const sizeEl = document.getElementById("canvasSize");
        const yearEl = document.getElementById("canvasYear");
        const materialEl = document.getElementById("canvasMaterial");
        const popupEl = document.getElementById("canvasPopup");

        if (!imgEl || !titleEl || !sizeEl || !yearEl || !materialEl || !popupEl) {
            throw new Error("Canvas elements are missing in DOM");
        }

        imgEl.src = painting.filename;
        titleEl.textContent = painting.title;
        sizeEl.textContent = painting.size || "";
        yearEl.textContent = painting.year || "";
        materialEl.textContent = painting.material || "";

        popupEl.classList.add("active");
        document.body.style.overflow = "hidden";

        // Push state for browser back button
        history.pushState({ canvasOpen: true }, "", window.location.href);

    } catch (error) {
        console.error("openCanvas failed:", error);
    }
}


function closeCanvas() {
    document.getElementById('canvasPopup').classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling

}

document.addEventListener('keydown', function (e) {
    if (e.key === "Escape") {
        closeCanvas();
    }
});

// Listen for popstate events to handle back button
window.addEventListener("popstate", function (event) {
    const canvasPopup = document.getElementById('canvasPopup');
    if (canvasPopup.classList.contains("active")) {
        closeCanvas();

        // Push the state back to prevent going back further
        history.pushState(null, "", window.location.href);
    }
});


