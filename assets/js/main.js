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
    // When the scroll is greater than 100 viewport height, add the scroll-header class to the header tag
    if (this.scrollY >= 100) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
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
// Initialize an empty array to hold the landscape paintings
let landscape_painting_list = [];

// Function to fetch and display landscape paintings
document.addEventListener('DOMContentLoaded', () => {
    fetch('./assets/json/tranhngang.json')
        .then(response => response.json())
        .then(data => {
            landscape_painting_list = data;

            // Get the container where the painting cards will be displayed
            const container = document.getElementById('place-container');
            landscape_painting_list.forEach(place => {
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
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error loading paintings.json:", error);
        });
});

/*==================== DISCOVER PAINTINGS ====================*/
// Initialize an empty array to hold the portrait paintings
let portrait_painting_list = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('./assets/json/tranhdoc.json')
        .then(response => response.json())
        .then(data => {
            portrait_painting_list = data;
            
            const container = document.getElementById('discover-container');

            // 🛠️ Ensure container is .swiper with ID
            container.classList.add('swiper');

            // ✅ Create the required swiper-wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'swiper-wrapper';

            // ✅ Add swiper-slide for each painting
            data.forEach(painting => {
                const slide = document.createElement('div');
                slide.className = 'discover__card swiper-slide';
                slide.onclick = () => openCanvas(painting.id);
                slide.setAttribute('onclick', `openCanvas(${painting.id})`);

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

            // ✅ Inject into container
            container.appendChild(wrapper);

            // ✅ Initialize Swiper after DOM is ready
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
        })
        .catch(error => console.error('Failed to fetch discover paintings:', error));
});

/*==================== CANVAS POPUP ====================*/
function openCanvas(id) {
    console.log("Opening canvas for ID:", id);
    const combinedList = landscape_painting_list.concat(portrait_painting_list);
    console.log("Combined painting list:", combinedList);
    console.log(" landscape_painting_list list:", landscape_painting_list);
    console.log(" portrait_painting_list list:", portrait_painting_list);
    const painting = combinedList.find(p => p.id === id);
    document.getElementById("canvasImage").src = painting.filename;
    document.getElementById("canvasTitle").textContent = painting.title;
    document.getElementById("canvasSize").textContent = painting.size;
    document.getElementById("canvasYear").textContent = painting.year;
    document.getElementById("canvasMaterial").textContent = painting.material;
    document.getElementById('canvasPopup').classList.add('active');

    document.body.style.overflow = 'hidden'; // Prevent scrolling

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


