const swiper = new Swiper('.swiper', {
  slidesPerView: 3,
  spaceBetween: 40, 
  loop: true,
  navigation: {
    nextEl: '.arrow-next',
    prevEl: '.arrow-prev',
  },
});