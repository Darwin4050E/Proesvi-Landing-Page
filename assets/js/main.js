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


// Testimonios: leer/escribir desde la base de datos de Firebase

async function fetchTestimonialsFromDB() {
  try {
    const resp = await fetch(`${FIREBASE_CONFIG.databaseURL}/testimonios.json`);
    if (!resp.ok) throw new Error('Error al obtener testimonios de la base de datos');
    const data = await resp.json();
    if (data === null) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'object') return Object.values(data);
    return [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function ensureDefaultTestimonials(defaults) {
  try {
    const resp = await fetch(`${FIREBASE_CONFIG.databaseURL}/testimonios.json`);
    let data = null;
    if (resp.ok) data = await resp.json();

    const emptyArray = data === null || (Array.isArray(data) && data.length === 0);
    const emptyObject = typeof data === 'object' && !Array.isArray(data) && Object.keys(data).length === 0;

    if (emptyArray || emptyObject || data === null) {
      await fetch(`${FIREBASE_CONFIG.databaseURL}/testimonios.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(defaults),
      });
    }
    return true;
  } catch (err) {
    console.error('Error al inicializar testimonios por defecto', err);
    return false;
  }
}

async function renderTestimonials(){
  // Si no hay datos, inicializamos con algunos testimonios por defecto
  const defaults = [
    { nombre: 'María Pérez', cargo: 'Directora', foto: 'https://picsum.photos/200', mensaje: 'Excelente servicio y atención personalizada.' },
    { nombre: 'Juan Gómez', cargo: 'Cliente', foto: 'https://picsum.photos/200', mensaje: 'Resultados rápidos y profesionales.' },
    { nombre: 'Luisa Martínez', cargo: 'Consultora', foto: 'https://picsum.photos/200', mensaje: 'Recomendados al 100% por su compromiso.' }
  ];

  let list = await fetchTestimonialsFromDB();
  if (!list || list.length === 0) {
    const initOk = await ensureDefaultTestimonials(defaults);
    if (initOk) {
      list = await fetchTestimonialsFromDB();
    } else {
      // No fue posible escribir en la DB (posible permiso denegado).
      // Hacemos fallback a los valores por defecto localmente para que siempre haya contenido.
      console.warn('No fue posible inicializar testimonios en la DB; usando defaults locales');
      list = defaults;
    }
  }

  let testimonialsContainer = document.querySelector(".testimonial-carousel");
  if(!testimonialsContainer){
    console.error('Contenedor .testimonial-carousel no encontrado en el DOM.');
    return;
  }

  let swiperWrapper = testimonialsContainer.querySelector(".swiper-wrapper");
  if(!swiperWrapper){
    swiperWrapper = document.createElement('div');
    swiperWrapper.className = 'swiper-wrapper';
    testimonialsContainer.appendChild(swiperWrapper);
  }

  swiperWrapper.innerHTML = "";

  list.forEach((testimonial) => {
    let slideTemplate = `<div class="swiper-slide">
                              <div class="rounded-xl bg-body-light-1 dark:bg-body-dark-12/10 px-5 py-8 shadow-card-2 sm:px-8">
                                <p class="mb-6 text-base text-body-light-11 dark:text-body-dark-11">
                                  "${testimonial.mensaje}"
                                </p>
                                <figure class="flex items-center gap-4">
                                  <div class="h-[50px] w-[50px] overflow-hidden">
                                    <img src="https://picsum.photos/200" alt="Testimonial picture" class="h-full w-full rounded-full object-cover"/>
                                  </div>
                                  <figcaption class="flex-grow">
                                    <h3 class="text-sm font-semibold text-body-light-11 dark:text-body-dark-11">${testimonial.nombre}</h3>
                                    <p class="text-xs text-body-light-10 dark:text-body-dark-10">${testimonial.cargo || ''}</p>
                                  </figcaption>
                                </figure>
                              </div>
                            </div>`;
    swiperWrapper.innerHTML += slideTemplate;
  });

  let prevBtn = testimonialsContainer.querySelector('.swiper-button-prev');
  let nextBtn = testimonialsContainer.querySelector('.swiper-button-next');
  if (!prevBtn || !nextBtn) {
    const navWrap = document.createElement('div');
    navWrap.className = 'flex items-center justify-center gap-1';
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

  if (window.testimonialSwiper && typeof window.testimonialSwiper.destroy === 'function') {
    try { window.testimonialSwiper.destroy(true, true); } catch(e){}
  }

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
      640: { slidesPerView: 2, spaceBetween: 30 },
      1024: { slidesPerView: 3, spaceBetween: 30 },
      1280: { slidesPerView: 3, spaceBetween: 30 },
    },
  });
}

// Cargar testimonios al cargar la página
window.addEventListener("load", function() {
  renderTestimonials();
});
  

document.addEventListener('DOMContentLoaded', function(){
  const contactForm = document.getElementById('contactForm');
  // contactForm puede no existir en algunas páginas; continuamos para manejar otros formularios (testimonios)

  if (contactForm) {
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
          if (resp.status === 401 || resp.status === 403) {
            showContactMessage('Permiso denegado: revisa las reglas de Realtime Database o configura autenticación.', 'error');
          } else {
            let data = null;
            try { data = await resp.json(); } catch(e){}
            const message = data && data.error ? data.error : 'Error al enviar el formulario. Intenta de nuevo.';
            showContactMessage(message, 'error');
          }
        }
      }catch(err){
        showContactMessage('Error de red: ' + err.message, 'error');
      }finally{
        if(submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('opacity-50'); }
      }
    });
  }

  // Manejador del formulario de testimonios
  const testimonialForm = document.getElementById('testimonialForm');

  function showTestimonialMessage(text, type){
    const msgEl = document.getElementById('testimonialFormMsg');
    if(!msgEl) return;
    msgEl.textContent = text;
    msgEl.className = type === 'success' ? 'text-green-600' : 'text-red-600';
  }

  if(testimonialForm){
    testimonialForm.addEventListener('submit', async function(e){
      e.preventDefault();
      const submitBtn = testimonialForm.querySelector('button[type="submit"]');
      if(submitBtn) { submitBtn.disabled = true; submitBtn.classList.add('opacity-50'); }

      const formData = {
        nombre: testimonialForm.querySelector('input[name="nombre"]').value,
        cargo: testimonialForm.querySelector('input[name="cargo"]').value,
        foto: (testimonialForm.querySelector('input[name="foto"]') ? testimonialForm.querySelector('input[name="foto"]').value : '') || '/assets/img/avatar/1.jpg',
        mensaje: testimonialForm.querySelector('textarea[name="mensaje"]').value,
        timestamp: new Date().toISOString()
      };

      if(!formData.nombre || !formData.mensaje){
        showTestimonialMessage('Por favor, rellena los campos requeridos (nombre, mensaje).', 'error');
        if(submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('opacity-50'); }
        return;
      }

      try{
        const resp = await fetch(`${FIREBASE_CONFIG.databaseURL}/testimonios.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if(resp.ok){
          showTestimonialMessage('Testimonio agregado. Gracias.', 'success');
          testimonialForm.reset();
          await renderTestimonials();
        } else {
          if (resp.status === 401 || resp.status === 403) {
            showTestimonialMessage('Permiso denegado: no se puede escribir en la base de datos. Revisa reglas o autenticación.', 'error');
          } else {
            let data = null;
            try { data = await resp.json(); } catch(e){}
            const message = data && data.error ? data.error : 'Error al guardar el testimonio.';
            showTestimonialMessage(message, 'error');
          }
        }
      }catch(err){
        showTestimonialMessage('Error de red: ' + err.message, 'error');
      }finally{
        if(submitBtn) { submitBtn.disabled = false; submitBtn.classList.remove('opacity-50'); }
      }
    });
  }
});