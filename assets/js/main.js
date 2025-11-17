"use strict";

import { FIREBASE_CONFIG } from './firebase-config.js';

// Page loading
var pageLoading = document.querySelector(".page-loading");

if (pageLoading) {
  window.addEventListener("load", () => {
    pageLoading.classList.add("hide");

    setTimeout(() => {
      pageLoading.style.display = "none";
    }, 1000);
  });
}

// Navbar
const navbar = document.querySelector(".ic-navbar"),
  navbarToggler = navbar.querySelector("[data-web-toggle=navbar-collapse]");

navbarToggler.addEventListener("click", function () {
  const dataTarget = this.dataset.webTarget,
    targetElement = document.getElementById(dataTarget),
    isExpanded = this.ariaExpanded === "true";

  if (!targetElement) {
    return;
  }

  navbar.classList.toggle("menu-show");
  this.ariaExpanded = !isExpanded;
  navbarToggler.innerHTML = navbar.classList.contains("menu-show")
    ? '<i class="lni lni-close"></i>'
    : '<i class="lni lni-menu"></i>';
});

// Sticky navbar
window.addEventListener("scroll", function () {
  if (this.scrollY >= 72) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
});

// Web theme
const webTheme = document.querySelector("[data-web-trigger=web-theme]"),
  html = document.querySelector("html");

window.addEventListener("load", function () {
  var theme = localStorage.getItem("Inazuma_WebTheme");

  if (theme == "light") {
    webTheme.innerHTML = '<i class="lni lni-sun"></i>';
  } else if (theme == "dark") {
    webTheme.innerHTML = '<i class="lni lni-night"></i>';
  } else {
    theme = "light";
    localStorage.setItem("Inazuma_WebTheme", theme);
    webTheme.innerHTML = '<i class="lni lni-night"></i>';
  }

  html.dataset.webTheme = theme;
});

webTheme.addEventListener("click", function () {
  var theme = localStorage.getItem("Inazuma_WebTheme");

  webTheme.innerHTML =
    theme == "dark"
      ? '<i class="lni lni-sun"></i>'
      : '<i class="lni lni-night"></i>';
  theme = theme == "dark" ? "light" : "dark";
  localStorage.setItem("Inazuma_WebTheme", theme);
  html.dataset.webTheme = theme;
});

// Scrollspy
function scrollspy(event) {
  var links = document.querySelectorAll(".ic-page-scroll"),
    scrollpos =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;

  for (let i = 0; i < links.length; i++) {
    var currentLink = links[i],
      dataTarget = currentLink.getAttribute("href"),
      targetElement = document.querySelector(dataTarget),
      topminus = scrollpos + 74;

    if (targetElement) {
      if (
        targetElement.offsetTop <= topminus &&
        targetElement.offsetTop + targetElement.offsetHeight > topminus
      ) {
        document.querySelector(".ic-page-scroll").classList.remove("active");
        currentLink.classList.add("active");
      } else {
        currentLink.classList.remove("active");
      }
    }
  }
}

window.document.addEventListener("scroll", scrollspy);

// Menu scroll
const pageLink = document.querySelectorAll(".ic-page-scroll");

pageLink.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetElement = document.querySelector(link.getAttribute("href"));

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        offsetTop: 1 - 74,
      });
    }

    navbar.classList.remove("menu-show");
    navbarToggler.innerHTML = navbar.classList.contains("menu-show")
      ? '<i class="lni lni-close"></i>'
      : '<i class="lni lni-menu"></i>';
  });
});

// Tabs
const tabs = document.querySelectorAll(".tabs");

tabs.forEach((tab) => {
  const links = tab.querySelectorAll(".tabs-nav .tabs-link"),
    contents = tab.querySelectorAll(".tabs-content");

  if (!contents) {
    return;
  }

  window.addEventListener("load", function () {
    for (let i = 0; i < contents.length; i++) {
      contents[i].classList.add("hide");
    }

    for (let i = 0; i < links.length; i++) {
      links[i].classList.remove("active");
      links[i].ariaSelected = false;
    }

    links[0].classList.add("active");
    links[0].ariaSelected = true;

    const dataTarget = links[0].dataset.webTarget,
      targetElement = this.document.getElementById(dataTarget);

    targetElement.classList.remove("hide");
  });

  links.forEach((link) => {
    const dataTarget = link.dataset.webTarget,
      targetElement = document.getElementById(dataTarget);

    if (targetElement) {
      link.addEventListener("click", function () {
        for (let i = 0; i < contents.length; i++) {
          contents[i].classList.add("hide");
        }

        for (let i = 0; i < links.length; i++) {
          links[i].classList.remove("active");
          links[i].ariaSelected = false;
        }

        link.classList.add("active");
        link.ariaSelected = true;
        targetElement.classList.remove("hide");
      });
    } else {
      link.disabled = true;
    }
  });
});

// Portfolio filter
const portfolioFilters = document.querySelectorAll(".portfolio-menu button");

portfolioFilters.forEach((filter) => {
  filter.addEventListener("click", function () {
    let btn = portfolioFilters[0];

    while (btn) {
      if (btn.tagName === "BUTTON") {
        btn.classList.remove("active");
      }

      btn = btn.nextSibling;
    }

    this.classList.add("active");

    let selected = filter.getAttribute("data-filter"),
      itemsToHide = document.querySelectorAll(
        '.portfolio-grid .portfolio :not([data-filter="' + selected + '"])'
      ),
      itemsToShow = document.querySelectorAll(
        '.portfolio-grid .portfolio [data-filter="' + selected + '"]'
      );

    if (selected == "all") {
      itemsToHide = [];
      itemsToShow = document.querySelectorAll(
        ".portfolio-grid .portfolio [data-filter]"
      );
    }

    itemsToHide.forEach((el) => {
      el.parentElement.classList.add("hide");
      el.parentElement.classList.remove("show");
    });

    itemsToShow.forEach((el) => {
      el.parentElement.classList.remove("hide");
      el.parentElement.classList.add("show");
    });
  });
});

// Scroll to top
var st = document.querySelector("[data-web-trigger=scroll-top]");

if (st) {
  window.onscroll = function () {
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      st.classList.remove("is-hided");
    } else {
      st.classList.add("is-hided");
    }
  };

  st.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}


// Testimonios.

function fetchTestimonials(url) {
  return fetch(url)
          .then((response) => 
            { 
              if(!response.ok){
                throw new Error("HTML Error");
              }
              return response.json();
            }
          )
          .then((data) => 
            { 
              return { success: true, body: data };
            }
          )
          .catch((error) => 
            { 
              return { success: false, body: error.message }; 
            }
          );
}

function renderTestimonials(){
  fetchTestimonials("https://raw.githubusercontent.com/Darwin4050E/Testimonios-Proesvi-Landing-Page/main/testimonios.json")
    .then((value) => 
      {
        if(value.success){
          let testimonialsContainer = document.querySelector(".testimonial-carousel");
          if(!testimonialsContainer){
            console.error('Contenedor .testimonial-carousel no encontrado en el DOM.');
            return;
          }

          // Nos aseguramos de que exista el wrapper (si Swiper ya lo modificó, lo creamos)
          let swiperWrapper = testimonialsContainer.querySelector(".swiper-wrapper");
          if(!swiperWrapper){
            // Se intenta crear un wrapper si falta
            swiperWrapper = document.createElement('div');
            swiperWrapper.className = 'swiper-wrapper';
            testimonialsContainer.appendChild(swiperWrapper);
          }

          // Se vacían solo las tarjetas del carrusel
          swiperWrapper.innerHTML = "";
          
          value.body.forEach((testimonial) => 
            {
              let slideTemplate = `<div class="swiper-slide">
                                    <div class="rounded-xl bg-body-light-1 dark:bg-body-dark-12/10 px-5 py-8 shadow-card-2 sm:px-8">
                                      <p class="mb-6 text-base text-body-light-11 dark:text-body-dark-11">
                                        "${testimonial.mensaje}"
                                      </p>
                                      <figure class="flex items-center gap-4">
                                        <div class="h-[50px] w-[50px] overflow-hidden">
                                          <img src="${testimonial.foto}" alt="Testimonial picture" class="h-full w-full rounded-full object-cover"/>
                                        </div>
                                        <figcaption class="flex-grow">
                                          <h3 class="text-sm font-semibold text-body-light-11 dark:text-body-dark-11">${testimonial.nombre}</h3>
                                          <p class="text-xs text-body-light-10 dark:text-body-dark-10">${testimonial.cargo}</p>
                                        </figcaption>
                                      </figure>
                                    </div>
                                  </div>`;
              swiperWrapper.innerHTML += slideTemplate;
            }
          );

          // Nos aseguramos de que existan los botones de navegación (prev / next)
          let prevBtn = testimonialsContainer.querySelector('.swiper-button-prev');
          let nextBtn = testimonialsContainer.querySelector('.swiper-button-next');
          if (!prevBtn || !nextBtn) {
            // Si no existen, se crea un contenedor de botones con las mismas características del que antes se encontraba en el HTML
            const navWrap = document.createElement('div');
            navWrap.className = 'flex items-center justify-center gap-1';
            // Añadimos margen en línea porque las clases dinámicas en JS
            // pueden no ser incluidas por Tailwind durante la compilación
            navWrap.style.marginTop = '60px';

            const prev = document.createElement('div');
            prev.className = 'swiper-button-prev';
            prev.innerHTML = '<i class="lni lni-arrow-left"></i>';

            const next = document.createElement('div');
            next.className = 'swiper-button-next';
            next.innerHTML = '<i class="lni lni-arrow-right"></i>';

            navWrap.appendChild(prev);
            navWrap.appendChild(next);

            testimonialsContainer.appendChild(navWrap);

            prevBtn = prev;
            nextBtn = next;
          }

          // Se crea nueva instancia con las mismas opciones que antes se encontraban en el HTML
          window.testimonialSwiper = new Swiper(testimonialsContainer, {
            observer: true,
            observeParents: true,
            slidesPerView: 1,
            spaceBetween: 30,
            navigation: {
              nextEl: nextBtn,
              prevEl: prevBtn,
            },
            breakpoints: {
              640: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1280: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            },
          });
        }else{
          window.alert(value.body)
        }
      }
    ) 
}

// Se cargan los testimonios cuando el DOM está listo
window.addEventListener("load", function() {
  renderTestimonials();
});
  

document.addEventListener('DOMContentLoaded', function(){
  const contactForm = document.getElementById('contactForm');
  if(!contactForm) return;

  function showContactMessage(text, type){
    const msgEl = document.getElementById('contactFormMsg');
    if(!msgEl) return;
    msgEl.textContent = text;
    msgEl.className = type === 'success' ? 'mt-4 text-center text-green-600' : 'mt-4 text-center text-red-600';
  }

  contactForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if(submitBtn) { submitBtn.disabled = true; submitBtn.classList.add('opacity-50'); }

    const formData = {
      name: contactForm.querySelector('input[name="name"]').value,
      email: contactForm.querySelector('input[name="email"]').value,
      phone: contactForm.querySelector('input[name="phone"]').value,
      subject: contactForm.querySelector('input[name="subject"]').value,
      message: contactForm.querySelector('textarea[name="message"]').value,
      timestamp: new Date().toISOString()
    };

    if(!formData.name || !formData.email || !formData.message){
      showContactMessage('Por favor, rellena los campos requeridos (nombre, email, mensaje).', 'error');
      if(submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('opacity-50'); }
      return;
    }

    try{
      
      const timestamp = Date.now();
      const firebaseEndpoint = `${FIREBASE_CONFIG.databaseURL}/contactos/${timestamp}.json`;

      const resp = await fetch(firebaseEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if(resp.ok){
        showContactMessage('Mensaje enviado. ¡Gracias! Te contactaremos pronto.', 'success');
        contactForm.reset();
      } else {
        const data = await resp.json();
        const message = data && data.error ? data.error : 'Error al enviar el formulario. Intenta de nuevo.';
        showContactMessage(message, 'error');
      }
    }catch(err){
      showContactMessage('Error de red: ' + err.message, 'error');
    }finally{
      if(submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('opacity-50'); }
    }
  });
});