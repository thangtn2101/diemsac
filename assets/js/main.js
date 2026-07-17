let painting_list = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('./assets/json/paintings.json')
        .then(response => response.json())
        .then(data => {
            painting_list = data;

            // Increased Featured Works to 9 items
            const highlightContainer = document.getElementById('highlight-gallery');
            if (highlightContainer) {
                renderGallery(painting_list.slice(0, 12), highlightContainer);
                initScrollReveal(); 
            }

            const fullGalleryContainer = document.getElementById('full-gallery');
            if (fullGalleryContainer) {
                renderGallery(painting_list, fullGalleryContainer);
                initScrollReveal();
            }
        })
        .catch(error => console.error("Error loading paintings:", error));

    initScrollReveal();
});

function renderGallery(paintings, container) {
    container.innerHTML = '';
    paintings.forEach((painting, index) => {
        const item = document.createElement('div');
        const delayClass = `delay-${(index % 3) * 100 + 100}`; 
        item.className = `gallery-item reveal-zoom ${delayClass}`;
        item.onclick = () => openCanvas(painting.id);
        
        item.innerHTML = `
            <img src="${painting.filename}" alt="${painting.title}" loading="lazy">
            <div class="gallery-item__overlay">
                <h3 class="gallery-item__title">${painting.title}</h3>
                <span class="gallery-item__subtitle">${painting.material} | ${painting.size || ''}</span>
            </div>
        `;
        container.appendChild(item);
    });
}

function openCanvas(id) {
    const painting = painting_list.find(p => p.id === id);
    if (!painting) return;

    document.getElementById("canvasImage").src = painting.filename;
    document.getElementById("canvasTitle").textContent = painting.title;
    document.getElementById("canvasSize").textContent = painting.size || "N/A";
    document.getElementById("canvasYear").textContent = painting.year || "N/A";
    document.getElementById("canvasMaterial").textContent = painting.material || "N/A";

    const popupEl = document.getElementById("canvasPopup");
    popupEl.classList.add("active");
    
    document.body.classList.add("no-scroll");
    document.documentElement.classList.add("no-scroll");
}

function closeCanvas() {
    const popupEl = document.getElementById("canvasPopup");
    popupEl.classList.remove("active");

    document.body.classList.remove("no-scroll");
    document.documentElement.classList.remove("no-scroll");
}

document.addEventListener('keydown', function(e) {
    if (e.key === "Escape") closeCanvas();
});

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-zoom');
    
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                obs.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => observer.observe(el));
}

// Mail sending function for Contact Page
// Hàm kiểm tra định dạng Email hoặc Số điện thoại
function validateEmailOrPhone(value) {
    const trimmedValue = value.trim();
    // Kiểm tra xem chuỗi có toàn số hay không
    const isNumeric = /^\d+$/.test(trimmedValue);

    if (isNumeric) {
        // Nếu toàn số -> Kiểm tra định dạng SĐT Việt Nam (Bắt đầu bằng 0, gồm 10 số)
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(trimmedValue)) {
            return { isValid: false, message: "Số điện thoại không đúng định dạng" };
        }
    } else {
        // Nếu chứa ký tự chữ -> Kiểm tra định dạng Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedValue)) {
            return { isValid: false, message: "Email không đúng định dạng" };
        }
    }
    
    return { isValid: true };
}

// Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
document.addEventListener("DOMContentLoaded", () => {
    const emailInput = document.getElementById("email");
    if (emailInput) {
        emailInput.addEventListener("input", function() {
            this.classList.remove("input-error");
            document.getElementById("emailError").style.display = "none";
        });
    }
});

// Hàm gửi email
function sendEmail(event) {
    event.preventDefault();

    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");
    const emailValue = emailInput.value;

    // Chạy hàm Validate
    const validation = validateEmailOrPhone(emailValue);

    // Nếu không hợp lệ -> Báo lỗi và dừng việc gửi
    if (!validation.isValid) {
        emailInput.classList.add("input-error");
        emailError.textContent = validation.message;
        emailError.style.display = "block";
        return; 
    }

    // Nếu hợp lệ -> Tiến hành gửi mail
    const submitBtn = document.getElementById("submitBtn");
    const originalBtnText = submitBtn.innerText;
    
    submitBtn.innerText = "Đang gửi...";
    submitBtn.style.opacity = "0.7";
    submitBtn.disabled = true;

    // Dùng EmailJS để gửi
    emailjs.send("service_u43d1tp", "template_ag3jlko", {
        cus_name: document.getElementById("name").value,
        cus_email: emailValue.trim(),
        message: document.getElementById("message").value,
    })
    .then(function(response) {
        submitBtn.innerText = originalBtnText;
        submitBtn.style.opacity = "1";
        submitBtn.disabled = false;

        document.getElementById("contactForm").style.display = "none";
        document.getElementById("successMessage").style.display = "flex";
        
        document.getElementById("contactForm").reset(); 
    }, function(error) {
        submitBtn.innerText = originalBtnText;
        submitBtn.style.opacity = "1";
        submitBtn.disabled = false;

        document.getElementById("contactForm").style.display = "none";
        document.getElementById("errorMessage").style.display = "flex";
        
        console.log("FAILED...", error);
    });
}
// Hàm để nút "Thử lại" hoạt động
function resetFormView() {
    // Ẩn thông báo lỗi, hiện lại form
    document.getElementById("errorMessage").style.display = "none";
    document.getElementById("contactForm").style.display = "flex";
}


/*=============== MOBILE MENU TOGGLE ===============*/
const navToggle = document.createElement('div');
navToggle.className = 'nav__toggle';
navToggle.innerHTML = '<i class="ri-menu-line"></i>';
document.querySelector('.nav').appendChild(navToggle);

const navList = document.querySelector('.nav__list');
navToggle.addEventListener('click', () => {
    navList.classList.toggle('show-menu');
    navToggle.querySelector('i').classList.toggle('ri-menu-line');
    navToggle.querySelector('i').classList.toggle('ri-close-line');
});
