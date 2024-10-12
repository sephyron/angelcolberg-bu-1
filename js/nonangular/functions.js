// Replace jQuery selectors with vanilla JS equivalents
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Replace $.fn.inlineStyle
Element.prototype.inlineStyle = function(prop) {
  return this.style[prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase())];
};

// Replace $.fn.doOnce
Element.prototype.doOnce = function(func) {
  if (this) func.apply(this);
  return this;
};

// Replace $.infinitescroll
if (typeof infinitescroll !== 'undefined') {
  Object.assign(infinitescroll.prototype, {
    _setup_portfolioinfiniteitemsloader: function() {
      const opts = this.options;
      const instance = this;
      
      $(opts.nextSelector).addEventListener('click', (e) => {
        if (e.which == 1 && !e.metaKey && !e.shiftKey) {
          e.preventDefault();
          instance.retrieve();
        }
      });

      instance.options.loading.start = function(opts) {
        opts.loading.msg
          .appendTo(opts.loading.selector)
          .show(opts.loading.speed, () => {
            instance.beginAjax(opts);
          });
      };
    },
    _showdonemsg_portfolioinfiniteitemsloader: function() {
      const opts = this.options;
      const instance = this;
      
      opts.loading.msg
        .querySelector('img')
        .style.display = 'none';
      
      opts.loading.msg
        .querySelector('div')
        .innerHTML = opts.loading.finishedMsg;
      
      // Animate opacity
      const animate = (el, prop, start, end, duration) => {
        let startTime = null;
        const step = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          el.style[prop] = start + progress * (end - start);
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
      };

      animate(opts.loading.msg.querySelector('div'), 'opacity', 0, 1, 2000);

      setTimeout(() => {
        opts.loading.msg.parentNode.style.display = 'none';
      }, 2000);

      $(opts.navSelector).style.display = 'none';

      opts.errorCallback.call($(opts.contentSelector), 'done');
    }
  });
} else {
  console.log('Infinite Scroll not defined.');
}

// Polyfill for requestAnimationFrame
(function() {
  let lastTime = 0;
  const vendors = ['ms', 'moz', 'webkit', 'o'];
  for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || 
                                  window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      const currTime = new Date().getTime();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = window.setTimeout(() => callback(currTime + timeToCall), timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
})();

// Debounce function
function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;
  return function() {
    context = this;
    args = arguments;
    timestamp = new Date();
    const later = function() {
      const last = (new Date()) - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
    if (callNow) result = func.apply(context, args);
    return result;
  };
}

let requesting = false;

const killRequesting = debounce(function() {
  requesting = false;
}, 100);

function onScrollSliderParallax() {
  if (!requesting) {
    requesting = true;
    requestAnimationFrame(function() {
      angelPortfolio.slider.sliderParallax();
      angelPortfolio.slider.sliderElementsFade();
    });
  }
  killRequesting();
}

const angelPortfolio = angelPortfolio || {};

(function() {
  "use strict";

  angelPortfolio.initialize = {
    init: function() {
      this.newSlider();
      this.responsiveClasses();
      this.imagePreload('.portfolio-item:not(:has(.fslider)) img');
      this.stickyElements();
      this.goToTop();
      this.lazyLoad();
      this.fullScreen();
      this.verticalMiddle();
      this.lightbox();
      this.resizeVideos();
      this.imageFade();
      this.pageTransition();
      this.dataResponsiveClasses();
      this.dataResponsiveHeights();

      $$('.fslider').forEach(el => el.classList.add('preloader2'));
    },

    newSlider: function() {
      const slider = $('#slider .flexslider');
      if (slider) {
        // Implement flexslider functionality here
        // This would require creating a custom slider or using a vanilla JS slider library
      }
    },

    responsiveClasses: function() {
      if (typeof jRespond === 'undefined') {
        console.log('responsiveClasses: jRespond not Defined.');
        return true;
      }

      const jRes = jRespond([
        { label: 'smallest', enter: 0, exit: 479 },
        { label: 'handheld', enter: 480, exit: 767 },
        { label: 'tablet', enter: 768, exit: 991 },
        { label: 'laptop', enter: 992, exit: 1199 },
        { label: 'desktop', enter: 1200, exit: 10000 }
      ]);

      jRes.addFunc([
        {
          breakpoint: 'desktop',
          enter: function() { document.body.classList.add('device-lg'); },
          exit: function() { document.body.classList.remove('device-lg'); }
        },
        {
          breakpoint: 'laptop',
          enter: function() { document.body.classList.add('device-md'); },
          exit: function() { document.body.classList.remove('device-md'); }
        },
        {
          breakpoint: 'tablet',
          enter: function() { document.body.classList.add('device-sm'); },
          exit: function() { document.body.classList.remove('device-sm'); }
        },
        {
          breakpoint: 'handheld',
          enter: function() { document.body.classList.add('device-xs'); },
          exit: function() { document.body.classList.remove('device-xs'); }
        },
        {
          breakpoint: 'smallest',
          enter: function() { document.body.classList.add('device-xxs'); },
          exit: function() { document.body.classList.remove('device-xxs'); }
        }
      ]);
    },

    imagePreload: function(selector, parameters) {
      const params = {
        delay: 250,
        transition: 400,
        easing: 'linear'
      };
      Object.assign(params, parameters);

      $$(selector).forEach(image => {
        image.style.visibility = 'hidden';
        image.style.opacity = 0;
        image.style.display = 'block';
        
        const wrapper = document.createElement('span');
        wrapper.className = 'preloader';
        image.parentNode.insertBefore(wrapper, image);
        wrapper.appendChild(image);

        image.onload = function() {
          setTimeout(() => {
            image.style.visibility = 'visible';
            const animate = (start, end, duration) => {
              let startTime = null;
              const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                image.style.opacity = start + progress * (end - start);
                if (progress < 1) {
                  window.requestAnimationFrame(step);
                } else {
                  wrapper.replaceWith(image);
                }
              };
              window.requestAnimationFrame(step);
            };
            animate(0, 1, params.transition);
          }, params.delay);
        };

        if (image.complete) image.onload();
      });
    },

    verticalMiddle: function() {
      $$('.vertical-middle').forEach(element => {
        const parentHeight = element.parentNode.offsetHeight;
        const elementHeight = element.offsetHeight;
        const headerHeight = $('header').offsetHeight;

        if (element.closest('#slider') && !element.classList.contains('ignore-header')) {
          if ($('header').classList.contains('transparent-header') && 
              (document.body.classList.contains('device-lg') || document.body.classList.contains('device-md'))) {
            element.style.top = (parentHeight - elementHeight) / 2 + 'px';
          } else {
            element.style.top = (parentHeight - elementHeight - headerHeight) / 2 + 'px';
          }
        } else {
          element.style.top = (parentHeight - elementHeight) / 2 + 'px';
        }
      });
    },

    stickyElements: function() {
      const siStickyEl = $('.si-sticky');
      if (siStickyEl) {
        siStickyEl.style.marginTop = -(siStickyEl.offsetHeight / 2) + 'px';
      }

      const dotsMenuEl = $('.dots-menu');
      if (dotsMenuEl) {
        dotsMenuEl.style.marginTop = -(dotsMenuEl.offsetHeight / 2) + 'px';
      }
    },

    goToTop: function() {
      const goToTopEl = $('#gotoTop');
      if (goToTopEl) {
        const elementScrollSpeed = goToTopEl.getAttribute('data-speed') || 700;
        const elementScrollEasing = goToTopEl.getAttribute('data-easing') || 'easeOutQuad';

        goToTopEl.addEventListener('click', (e) => {
          e.preventDefault();
          smoothScrollTo(0, elementScrollSpeed, elementScrollEasing);
        });
      }
    },

    lazyLoad: function() {
      const lazyLoadEl = $$('[data-lazyload]');
      if (lazyLoadEl.length > 0) {
        lazyLoadEl.forEach(element => {
          const elementImg = element.getAttribute('data-lazyload');
          element.setAttribute('src', 'images/blank.svg');
          element.style.background = 'url(images/preloader.gif) no-repeat center center #FFF';

          const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                element.style.background = 'none';
                element.removeAttribute('width');
                element.removeAttribute('height');
                element.setAttribute('src', elementImg);
                observer.unobserve(element);
              }
            });
          }, { rootMargin: '0px 0px 120px 0px' });

          observer.observe(element);
        });
      }
    },

    fullScreen: function() {
      $$('.full-screen').forEach(element => {
        const windowHeight = window.innerHeight;
        const headerHeight = $('header').offsetHeight;
        let fullScreenHeight = windowHeight;

        if (element.id === 'slider') {
          const sliderOffset = element.offsetTop;
          fullScreenHeight = windowHeight - sliderOffset;
          if (element.closest('.slider-parallax-inner')) {
            const transformVal = getComputedStyle(element.closest('.slider-parallax-inner')).transform;
            const transformY = transformVal ? parseFloat(transformVal.split(',')[5]) : 0;
            fullScreenHeight = windowHeight - sliderOffset + transformY;
          }
          if ($('#slider').nextElementSibling.id === 'header' && 
              (document.body.classList.contains('device-lg') || document.body.classList.contains('device-md'))) {
            fullScreenHeight -= headerHeight;
          }
        }

        if (document.body.classList.contains('device-xs') || document.body.classList.contains('device-xxs')) {
          if (!element.classList.contains('force-full-screen')) fullScreenHeight = 'auto';
        }

        element.style.height = fullScreenHeight + 'px';
      });
    },

    maxHeight: function() {
      $$('.common-height').forEach(element => {
        let maxHeight = 0;
        const children = element.children;
        for (let i = 0; i < children.length; i++) {
          const childHeight = children[i].offsetHeight;
          if (childHeight > maxHeight) maxHeight = childHeight;
        }
        for (let i = 0; i < children.length; i++) {
          children[i].style.height = maxHeight + 'px';
        }
      });
    },

    testimonialsGrid: function() {
      $$('.testimonials-grid').forEach(grid => {
        const items = grid.querySelectorAll('li > .testimonial');
        let maxHeight = 0;
        items.forEach(item => {
          if (item.offsetHeight > maxHeight) maxHeight = item.offsetHeight;
        });
        items.forEach(item => {
          item.style.height = maxHeight + 'px';
        });
      });
    },

    lightbox: function() {
      // Implement a vanilla JS lightbox here
      // This would require creating a custom lightbox or using a vanilla JS lightbox library
    },

    resizeVideos: function() {
      const selectors = [
        'iframe[src*="youtube.com"]',
        'iframe[src*="vimeo.com"]',
        'iframe[src*="dailymotion.com"]',
        'iframe[src*="maps.google.com"]',
        'iframe[src*="google.com/maps"]'
      ];
      
      const elements = document.querySelectorAll(selectors.join(','));
      
      elements.forEach(element => {
        const aspectRatio = element.height / element.width;
        element.style.width = '100%';
        element.style.height = element.offsetWidth * aspectRatio + 'px';
      });
    },

    imageFade: function() {
      $$('.image_fade').forEach(element => {
        element.addEventListener('mouseenter', function() {
          this.style.opacity = '0.8';
          this.style.transition = 'opacity 0.4s ease-in-out';
        });
        element.addEventListener('mouseleave', function() {
          this.style.opacity = '1';
          this.style.transition = 'opacity 0.4s ease-in-out';
        });
      });
    },

    pageTransition: function() {
      if (document.body.classList.contains('no-transition')) return true;

      if (typeof Animsition === 'undefined') {
        document.body.classList.add('no-transition');
        console.log('pageTransition: Animsition not Defined.');
        return true;
      }

      window.onpageshow = function(event) {
        if (event.persisted) {
          window.location.reload();
        }
      };

      const animationIn = document.body.getAttribute('data-animation-in') || 'fadeIn';
      const animationOut = document.body.getAttribute('data-animation-out') || 'fadeOut';
      const durationIn = parseInt(document.body.getAttribute('data-speed-in')) || 1500;
      const durationOut = parseInt(document.body.getAttribute('data-speed-out')) || 800;
      const loaderTimeOut = parseInt(document.body.getAttribute('data-loader-timeout')) || false;
      const loaderStyle = document.body.getAttribute('data-loader') || '2';
      const loaderColor = document.body.getAttribute('data-loader-color') || '#000000';

      let loaderHtml = '';
      switch(loaderStyle) {
        case '1':
          loaderHtml = '<div class="css3-spinner-bounce1"></div><div class="css3-spinner-bounce2"></div><div class="css3-spinner-bounce3"></div>';
          break;
        case '2':
          loaderHtml = '<div class="css3-spinner-flipper"></div>';
          break;
        case '3':
          loaderHtml = '<div class="loader"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="50"></circle></svg><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="50"></circle></svg><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="50"></circle></svg></div>';
          break;
        // Add more cases for different loader styles
      }

      new Animsition({
        inClass: animationIn,
        outClass: animationOut,
        inDuration: durationIn,
        outDuration: durationOut,
        linkElement: 'a:not([target="_blank"]):not([href^="#"]):not([data-lightbox]):not([href^="mailto:"]):not([href^="tel:"]):not([href^="sms:"]):not([href^="call:"])',
        loading: true,
        loadingParentElement: 'body',
        loadingClass: 'css3-spinner',
        loadingHtml: loaderHtml,
        unSupportCss: [
          'animation-duration',
          '-webkit-animation-duration',
          '-o-animation-duration'
        ],
        overlay: false,
        overlayClass: 'animsition-overlay-slide',
        overlayParentElement: 'body',
        timeOut: loaderTimeOut
      });
    },

    dataResponsiveClasses: function() {
      $$('[data-class-xxs], [data-class-xs], [data-class-sm], [data-class-md], [data-class-lg]').forEach(element => {
        const xxs = element.getAttribute('data-class-xxs');
        const xs = element.getAttribute('data-class-xs');
        const sm = element.getAttribute('data-class-sm');
        const md = element.getAttribute('data-class-md');
        const lg = element.getAttribute('data-class-lg');

        if (window.innerWidth <= 480 && xxs) {
          element.className = xxs;
        } else if (window.innerWidth <= 767 && xs) {
          element.className = xs;
        } else if (window.innerWidth <= 991 && sm) {
          element.className = sm;
        } else if (window.innerWidth <= 1199 && md) {
          element.className = md;
        } else if (window.innerWidth > 1199 && lg) {
          element.className = lg;
        }
      });
    },

    dataResponsiveHeights: function() {
      $$('[data-height-xxs], [data-height-xs], [data-height-sm], [data-height-md], [data-height-lg]').forEach(element => {
        const xxs = element.getAttribute('data-height-xxs');
        const xs = element.getAttribute('data-height-xs');
        const sm = element.getAttribute('data-height-sm');
        const md = element.getAttribute('data-height-md');
        const lg = element.getAttribute('data-height-lg');

        if (window.innerWidth <= 480 && xxs) {
          element.style.height = xxs;
        } else if (window.innerWidth <= 767 && xs) {
          element.style.height = xs;
        } else if (window.innerWidth <= 991 && sm) {
          element.style.height = sm;
        } else if (window.innerWidth <= 1199 && md) {
          element.style.height = md;
        } else if (window.innerWidth > 1199 && lg) {
          element.style.height = lg;
        }
      });
    }
  };

  angelPortfolio.header = {
    init: function() {
      this.superfish();
      this.menufunctions();
      this.fullWidthMenu();
      this.overlayMenu();
      this.stickyMenu();
      this.stickyPageMenu();
      this.onePageScroll();
      this.logo();
      this.topsearch();
      this.topcart();
    },

    superfish: function() {
      // Implement superfish menu functionality
      // This would require creating a custom dropdown menu system or using a vanilla JS alternative
    },

    menufunctions: function() {
      const subMenus = $$('#primary-menu ul li:has(ul)');
      subMenus.forEach(item => item.classList.add('sub-menu'));

      $$('.top-links ul li:has(ul) > a, #primary-menu.with-arrows > ul > li:has(ul) > a > div, #primary-menu.with-arrows > div > ul > li:has(ul) > a > div, #page-menu nav ul li:has(ul) > a > div').forEach(item => {
        const arrow = document.createElement('i');
        arrow.className = 'icon-angle-down';
        item.appendChild(arrow);
      });

      $$('.top-links > ul').forEach(item => item.classList.add('clearfix'));

      if (window.innerWidth > 991) {
        $$('#primary-menu.sub-title > ul > li').forEach(item => {
          item.addEventListener('mouseenter', function() {
            this.previousElementSibling.style.backgroundImage = 'none';
          });
          item.addEventListener('mouseleave', function() {
            this.previousElementSibling.style.backgroundImage = 'url("images/icons/menu-divider.png")';
          });
        });

        $('#primary-menu.sub-title').children('ul').children('.current').prev().css({ backgroundImage: 'none' });
      }

      // Mobile Menu Toggle
      $('#primary-menu-trigger,#overlay-menu-close').addEventListener('click', function() {
        $('body').classList.toggle('primary-menu-open');
        return false;
      });

      // Android Devices Menu Toggle
      if (navigator.userAgent.match(/Android/i)) {
        $$('#primary-menu ul li.sub-menu').forEach(item => {
          item.children[0].addEventListener('touchstart', function(e) {
            if (!item.classList.contains('sfHover')) {
              e.preventDefault();
            }
          });
        });
      }
    },

    fullWidthMenu: function() {
      if (document.body.classList.contains('stretched')) {
        if ($('#header').querySelector('.container-fullwidth')) {
          $('.mega-menu .mega-menu-content').style.width = $('#wrapper').offsetWidth - 120 + 'px';
        }
        if ($('#header').classList.contains('full-header')) {
          $('.mega-menu .mega-menu-content').style.width = $('#wrapper').offsetWidth - 60 + 'px';
        }
      } else {
        if ($('#header').querySelector('.container-fullwidth')) {
          $('.mega-menu .mega-menu-content').style.width = $('#wrapper').offsetWidth - 120 + 'px';
        }
        if ($('#header').classList.contains('full-header')) {
          $('.mega-menu .mega-menu-content').style.width = $('#wrapper').offsetWidth - 80 + 'px';
        }
      }
    },

    overlayMenu: function() {
      if (document.body.classList.contains('overlay-menu')) {
        const overlayMenuItem = $$('#primary-menu > ul > li');
        const overlayMenuItemHeight = overlayMenuItem[0].offsetHeight;
        const overlayMenuItemTHeight = overlayMenuItem.length * overlayMenuItemHeight;
        const firstItemOffset = (window.innerHeight - overlayMenuItemTHeight) / 2;

        $$('#primary-menu > ul > li:first-child').style.marginTop = firstItemOffset + 'px';
      }
    },

    stickyMenu: function(headerOffset) {
      const header = $('#header');
      const headerWrap = $('#header-wrap');

      if (window.pageYOffset > headerOffset) {
        if (window.innerWidth > 991) {
          document.body.classList.add('sticky-header');
          if (!headerWrap.classList.contains('force-not-dark')) {
            headerWrap.classList.remove('not-dark');
          }
          this.stickyMenuClass();
        } else if (window.innerWidth <= 991) {
          if (document.body.classList.contains('sticky-responsive-menu')) {
            document.body.classList.add('responsive-sticky-header');
            this.stickyMenuClass();
          }
        }
      } else {
        this.removeStickyness();
      }
    },

    stickyPageMenu: function(pageMenuOffset) {
      if (window.pageYOffset > pageMenuOffset) {
        if (window.innerWidth > 991) {
          $('#page-menu:not(.dots-menu,.no-sticky)').classList.add('sticky-page-menu');
        } else if (window.innerWidth <= 991) {
          if (document.body.classList.contains('sticky-responsive-pagemenu')) {
            $('#page-menu:not(.dots-menu,.no-sticky)').classList.add('sticky-page-menu');
          }
        }
      } else {
        $('#page-menu:not(.dots-menu,.no-sticky)').classList.remove('sticky-page-menu');
      }
    },

    removeStickyness: function() {
      if ($('#header').classList.contains('sticky-header')) {
        document.body.classList.remove('sticky-header');
        $('#header').className = oldHeaderClasses;
        $('#header-wrap').className = oldHeaderWrapClasses;
        if (!$('#header-wrap').classList.contains('force-not-dark')) {
          $('#header-wrap').classList.remove('not-dark');
        }
        angelPortfolio.slider.swiperSliderMenu();
        angelPortfolio.slider.revolutionSliderMenu();
      }
      if ($('#header').classList.contains('responsive-sticky-header')) {
        document.body.classList.remove('responsive-sticky-header');
      }
      if ((window.innerWidth <= 767) && (typeof responsiveMenuClasses === 'undefined')) {
        $('#header').className = oldHeaderClasses;
        $('#header-wrap').className = oldHeaderWrapClasses;
        if (!$('#header-wrap').classList.contains('force-not-dark')) {
          $('#header-wrap').classList.remove('not-dark');
        }
      }
    },

    sideHeader: function() {
      $('#header-trigger').addEventListener('click', function() {
        document.body.classList.toggle('side-header-open');
        return false;
      });
    },

    onePageScroll: function() {
      const onePageMenuLinks = $$('.one-page-menu a[data-href]');
      
      onePageMenuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          const href = this.getAttribute('data-href');
          const offset = this.getAttribute('data-offset') || angelPortfolio.initialize.topScrollOffset();
          
          document.querySelector(href).scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });

          // Close mobile menu if open
          if (window.innerWidth < 768 || document.body.classList.contains('overlay-menu')) {
            $('#primary-menu').classList.remove('show');
            document.body.classList.remove('primary-menu-open');
          }
        });
      });
    },

    logo: function() {
      const header = $('#header');
      const headerWrap = $('#header-wrap');
      const defaultLogo = $('#logo').querySelector('.standard-logo');
      const retinaLogo = $('#logo').querySelector('.retina-logo');
      
      if ((header.classList.contains('dark') || document.body.classList.contains('dark')) && !headerWrap.classList.contains('not-dark')) {
        if (defaultDarkLogo) defaultLogo.src = defaultDarkLogo;
        if (retinaDarkLogo) retinaLogo.src = retinaDarkLogo;
      } else {
        if (defaultLogoImg) defaultLogo.src = defaultLogoImg;
        if (retinaLogoImg) retinaLogo.src = retinaLogoImg;
      }
      
      if (header.classList.contains('sticky-header')) {
        if (defaultStickyLogo) defaultLogo.src = defaultStickyLogo;
        if (retinaStickyLogo) retinaLogo.src = retinaStickyLogo;
      }
      
      if (window.innerWidth <= 767) {
        if (defaultMobileLogo) defaultLogo.src = defaultMobileLogo;
        if (retinaMobileLogo) retinaLogo.src = retinaMobileLogo;
      }
    },

    stickyMenuClass: function() {
      if (stickyMenuClasses) {
        const newClassesArray = stickyMenuClasses.split(' ');
        const header = $('#header');

        newClassesArray.forEach(className => {
          if (className === 'not-dark') {
            header.classList.remove('dark');
            $('#header-wrap').classList.add('not-dark');
          } else if (className === 'dark') {
            $('#header-wrap').classList.remove('not-dark', 'force-not-dark');
            if (!header.classList.contains(className)) {
              header.classList.add(className);
            }
          } else if (!header.classList.contains(className)) {
            header.classList.add(className);
          }
        });
      }
    },

    responsiveMenuClass: function() {
      if (window.innerWidth <= 991) {
        if (responsiveMenuClasses) {
          const newClassesArray = responsiveMenuClasses.split(' ');
          const header = $('#header');

          newClassesArray.forEach(className => {
            if (className === 'not-dark') {
              header.classList.remove('dark');
              $('#header-wrap').classList.add('not-dark');
            } else if (className === 'dark') {
              $('#header-wrap').classList.remove('not-dark', 'force-not-dark');
              if (!header.classList.contains(className)) {
                header.classList.add(className);
              }
            } else if (!header.classList.contains(className)) {
              header.classList.add(className);
            }
          });
        }
        this.logo();
      }
    },

    topsearch: function() {
      $('#top-search-trigger').addEventListener('click', function(e) {
        document.body.classList.toggle('top-search-open');
        $('#top-cart').classList.remove('top-cart-open');
        $('#primary-menu > ul, #primary-menu > div > ul').classList.remove('show');
        $('#page-menu').classList.remove('pagemenu-active');
        if (document.body.classList.contains('top-search-open')) {
          $('#top-search').querySelector('input').focus();
        }
        e.stopPropagation();
        e.preventDefault();
      });

      document.addEventListener('click', function(event) {
        if (!event.target.closest('#top-search')) {
          document.body.classList.remove('top-search-open');
        } if (!event.target.closest('#top-cart')) {
            $('#top-cart').classList.remove('top-cart-open');
          }
          if (!event.target.closest('#page-menu')) {
            $('#page-menu').classList.remove('pagemenu-active');
          }
          if (!event.target.closest('#side-panel')) {
            document.body.classList.remove('side-panel-open');
          }
          if (!event.target.closest('#primary-menu.mobile-menu-off-canvas > ul')) {
            $('#primary-menu.mobile-menu-off-canvas > ul').classList.remove('show');
          }
          if (!event.target.closest('#primary-menu.mobile-menu-off-canvas > div > ul')) {
            $('#primary-menu.mobile-menu-off-canvas > div > ul').classList.remove('show');
          }
        });
      },
  
      topcart: function() {
        $('#top-cart-trigger').addEventListener('click', function(e) {
          $('#page-menu').classList.remove('pagemenu-active');
          $('#top-cart').classList.toggle('top-cart-open');
          e.stopPropagation();
          e.preventDefault();
        });
      }
    };
  
    angelPortfolio.slider = {
      init: function() {
        this.sliderParallaxDimensions();
        this.sliderRun();
        this.sliderParallax();
        this.sliderElementsFade();
        this.captionPosition();
      },
  
      sliderParallaxDimensions: function() {
        const sliderParallaxEl = $('.slider-parallax');
        if (!sliderParallaxEl) return;
  
        if (window.innerWidth > 991) {
          let parallaxElHeight = sliderParallaxEl.offsetHeight;
          const parallaxElWidth = sliderParallaxEl.offsetWidth;
  
          if (sliderParallaxEl.classList.contains('revslider-wrap') || sliderParallaxEl.querySelector('.carousel-widget')) {
            parallaxElHeight = sliderParallaxEl.querySelector('.slider-parallax-inner').children[0].offsetHeight;
            sliderParallaxEl.style.height = parallaxElHeight + 'px';
          }
  
          sliderParallaxEl.querySelector('.slider-parallax-inner').style.height = parallaxElHeight + 'px';
  
          if (document.body.classList.contains('side-header')) {
            sliderParallaxEl.querySelector('.slider-parallax-inner').style.width = parallaxElWidth + 'px';
          }
  
          if (!document.body.classList.contains('stretched')) {
            parallaxElWidth = $('#wrapper').offsetWidth;
            sliderParallaxEl.querySelector('.slider-parallax-inner').style.width = parallaxElWidth + 'px';
          }
        } else {
          sliderParallaxEl.querySelector('.slider-parallax-inner').style.width = '';
          sliderParallaxEl.querySelector('.slider-parallax-inner').style.height = '';
        }
  
        if (swiperSlider) {
          swiperSlider.update(true);
        }
      },
  
      sliderRun: function() {
        const sliderEl = $('#slider');
        if (!sliderEl) return;
  
        if (sliderEl.classList.contains('customjs')) return;
  
        if (sliderEl.classList.contains('swiper_wrapper')) {
          const element = sliderEl;
          const elementDirection = element.getAttribute('data-direction') || 'horizontal';
          const elementSpeed = parseInt(element.getAttribute('data-speed')) || 300;
          const elementAutoPlay = element.getAttribute('data-autoplay');
          const elementLoop = element.getAttribute('data-loop') !== 'false';
          const elementEffect = element.getAttribute('data-effect') || 'slide';
          const elementGrabCursor = element.getAttribute('data-grab') !== 'false';
          const slideNumberTotal = element.querySelector('#slide-number-total');
          const slideNumberCurrent = element.querySelector('#slide-number-current');
          const sliderVideoAutoPlay = element.getAttribute('data-video-autoplay') !== 'false';
  
          const elementPagination = element.querySelector('.swiper-pagination') ? '.swiper-pagination' : '';
          const elementPaginationClickable = elementPagination !== '';
          const elementNavNext = '#slider-arrow-right';
          const elementNavPrev = '#slider-arrow-left';
  
          swiperSlider = new Swiper(element.querySelector('.swiper-parent'), {
            direction: elementDirection,
            speed: elementSpeed,
            autoplay: elementAutoPlay ? { delay: parseInt(elementAutoPlay) } : false,
            loop: elementLoop,
            effect: elementEffect,
            slidesPerView: 1,
            grabCursor: elementGrabCursor,
            pagination: {
              el: elementPagination,
              clickable: elementPaginationClickable
            },
            navigation: {
              prevEl: elementNavPrev,
              nextEl: elementNavNext
            },
            on: {
              init: function() {
                angelPortfolio.slider.sliderParallaxDimensions();
                element.querySelectorAll('.yt-bg-player').forEach(player => player.classList.remove('customjs'));
                angelPortfolio.widget.youtubeBgVideo();
                angelPortfolio.widget.animations();
                angelPortfolio.initialize.lightbox();
                angelPortfolio.slider.sliderMenuClass();
              },
              slideChangeTransitionStart: function() {
                if (slideNumberCurrent) {
                  if (elementLoop) {
                    slideNumberCurrent.textContent = this.realIndex + 1;
                  } else {
                    slideNumberCurrent.textContent = this.activeIndex + 1;
                  }
                }
                angelPortfolio.slider.sliderMenuClass();
              },
              slideChangeTransitionEnd: function() {
                angelPortfolio.widget.animations();
                angelPortfolio.widget.loadFlexSlider();
                angelPortfolio.initialize.lightbox();
                angelPortfolio.widget.resizeVideos();
                angelPortfolio.widget.youtubeBgVideo();
              }
            }
          });
  
          if (slideNumberTotal) {
            slideNumberTotal.textContent = element.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)').length;
          }
        }
      },
  
      sliderParallaxOffset: function() {
        let sliderParallaxOffsetTop = 0;
        const headerHeight = $('#header').offsetHeight;
        if (document.body.classList.contains('side-header') || $('#header').classList.contains('transparent-header')) {
          headerHeight = 0;
        }
        if ($('#page-title').length > 0) {
          sliderParallaxOffsetTop = $('#page-title').offsetHeight + headerHeight;
        } else {
          sliderParallaxOffsetTop = headerHeight;
        }
  
        if ($('#slider').nextElementSibling.id === 'header') {
          sliderParallaxOffsetTop = 0;
        }
  
        return sliderParallaxOffsetTop;
      },
  
      sliderParallax: function() {
        const sliderParallaxEl = $('.slider-parallax');
        if (!sliderParallaxEl) return;
  
        const parallaxOffsetTop = this.sliderParallaxOffset();
        const parallaxElHeight = sliderParallaxEl.offsetHeight;
  
        if ((window.innerWidth > 991) && !angelPortfolio.isMobile.any()) {
          if ((parallaxElHeight + parallaxOffsetTop + 50) > window.pageYOffset) {
            sliderParallaxEl.classList.add('slider-parallax-visible');
            sliderParallaxEl.classList.remove('slider-parallax-invisible');
            if (window.pageYOffset > parallaxOffsetTop) {
              if (sliderParallaxEl.querySelector('.slider-parallax-inner')) {
                const transformAmount = ((window.pageYOffset - parallaxOffsetTop) * -0.4).toFixed(0);
                const transformAmount2 = ((window.pageYOffset - parallaxOffsetTop) * -0.15).toFixed(0);
                sliderParallaxEl.querySelector('.slider-parallax-inner').style.transform = `translateY(${transformAmount}px)`;
                $('.slider-parallax .slider-caption,.ei-title').style.transform = `translateY(${transformAmount2}px)`;
              } else {
                const transformAmount = ((window.pageYOffset - parallaxOffsetTop) / 1.5).toFixed(0);
                const transformAmount2 = ((window.pageYOffset - parallaxOffsetTop) / 7).toFixed(0);
                sliderParallaxEl.style.transform = `translateY(${transformAmount}px)`;
                $('.slider-parallax .slider-caption,.ei-title').style.transform = `translateY(${-transformAmount2}px)`;
              }
            } else {
              if (sliderParallaxEl.querySelector('.slider-parallax-inner')) {
                $('.slider-parallax-inner,.slider-parallax .slider-caption,.ei-title').style.transform = 'translateY(0px)';
              } else {
                $('.slider-parallax,.slider-parallax .slider-caption,.ei-title').style.transform = 'translateY(0px)';
              }
            }
          } else {
            sliderParallaxEl.classList.add('slider-parallax-invisible');
            sliderParallaxEl.classList.remove('slider-parallax-visible');
          }
          if (requesting) {
            requestAnimationFrame(() => {
              angelPortfolio.slider.sliderParallax();
              angelPortfolio.slider.sliderElementsFade();
            });
          }
        } else {
          if (sliderParallaxEl.querySelector('.slider-parallax-inner')) {
            $('.slider-parallax-inner,.slider-parallax .slider-caption,.ei-title').style.transform = 'translateY(0px)';
          } else {
            $('.slider-parallax,.slider-parallax .slider-caption,.ei-title').style.transform = 'translateY(0px)';
          }
        }
      },
  
      sliderElementsFade: function() {
        const sliderParallaxEl = $('.slider-parallax');
        if (!sliderParallaxEl) return;
  
        if ((window.innerWidth > 991) && !angelPortfolio.isMobile.any()) {
          const parallaxOffsetTop = this.sliderParallaxOffset();
          const parallaxElHeight = sliderParallaxEl.offsetHeight;
          if ($('#slider').length > 0) {
            if ($('#header').classList.contains('transparent-header') || document.body.classList.contains('side-header')) {
              var tHeaderOffset = 100;
            } else {
              var tHeaderOffset = 0;
            }
            const fadeStart = parallaxOffsetTop + tHeaderOffset;
            const fadeEnd = fadeStart + parallaxElHeight;
            const opacity = 1 - (((window.pageYOffset - fadeStart) * 1.85) / parallaxElHeight);
            sliderParallaxEl.querySelectorAll('#slider-arrow-left,#slider-arrow-right,.vertical-middle:not(.no-fade),.slider-caption,.ei-title,.camera_prev,.camera_next').forEach(el => {
              el.style.opacity = opacity;
            });
          }
        } else {
          sliderParallaxEl.querySelectorAll('#slider-arrow-left,#slider-arrow-right,.vertical-middle:not(.no-fade),.slider-caption,.ei-title,.camera_prev,.camera_next').forEach(el => {
            el.style.opacity = 1;
          });
        }
      },
  
      captionPosition: function() {
        const sliderEl = $('#slider');
        if (!sliderEl) return;
  
        sliderEl.querySelectorAll('.slider-caption:not(.custom-caption-pos)').forEach(caption => {
          const captionHeight = caption.offsetHeight;
          const sliderHeight = sliderEl.offsetHeight;
          const topMargin = (sliderHeight - captionHeight) / 2;
  
          if (sliderEl.previousElementSibling.id === 'header' && 
              sliderEl.previousElementSibling.classList.contains('transparent-header') && 
              (document.body.classList.contains('device-lg') || document.body.classList.contains('device-md'))) {
            if (sliderEl.previousElementSibling.classList.contains('floating-header')) {
              caption.style.top = (sliderHeight + 160 - captionHeight) / 2 + 'px';
            } else {
              caption.style.top = (sliderHeight + 100 - captionHeight) / 2 + 'px';
            }
          } else {
            caption.style.top = topMargin + 'px';
          }
        });
      },
  
      sliderMenuClass: function() {
        const sliderEl = $('#slider');
        if (!sliderEl) return;
  
        if (document.body.classList.contains('device-lg') || document.body.classList.contains('device-md')) {
          const activeSlide = sliderEl.querySelector('.swiper-slide.swiper-slide-active');
          const headerEl = $('#header');
  
          if (activeSlide.classList.contains('dark')) {
            headerEl.classList.add('dark');
            if (!headerEl.classList.contains('sticky-header')) {
              headerEl.querySelector('#header-wrap').classList.remove('not-dark');
            }
          } else {
            if (document.body.classList.contains('dark')) {
              activeSlide.classList.add('not-dark');
              headerEl.classList.remove('dark');
              headerEl.querySelector('#header-wrap').classList.add('not-dark');
            } else {
              headerEl.classList.remove('dark');
              headerEl.querySelector('#header-wrap').classList.remove('not-dark');
            }
          }
  
          if (headerEl.classList.contains('sticky-header')) {
            angelPortfolio.header.stickyMenuClass();
          }
  
          angelPortfolio.header.logo();
        }
      }
    };
  
    angelPortfolio.portfolio = {
      init: function() {
        this.ajaxload();
      },
  
      gridInit: function(container) {
        if (!container) return;
  
        if (container.classList.contains('customjs')) return;
  
        if (typeof Isotope === 'undefined') {
          console.log('gridInit: Isotope not Defined.');
          return true;
        }
  
        const defaultFilter = container.getAttribute('data-default-filter') || '*';
        const layoutMode = container.getAttribute('data-layout') || 'masonry';
        const stagger = parseInt(container.getAttribute('data-stagger')) || 0;
  
        const iso = new Isotope(container, {
          itemSelector: '.portfolio-item',
          layoutMode: layoutMode,
          stagger: stagger,
          masonry: {
            columnWidth: container.querySelector('.portfolio-item:not(.wide)').offsetWidth
          },
          filter: defaultFilter
        });
  
        window.addEventListener('load', () => {
          iso.layout();
          container.classList.add('isotope-initialized');
        });
      },
  
      filterInit: function() {
        const portfolioFilter = $('.portfolio-filter');
        if (!portfolioFilter) return;
  
        if (portfolioFilter.classList.contains('customjs')) return;
  
        const defaultFilter = portfolioFilter.getAttribute('data-default-filter') || '*';
        const activeClass = portfolioFilter.getAttribute('data-active-class') || 'activeFilter';
  
        portfolioFilter.querySelectorAll('a').forEach(filterLink => {
          filterLink.addEventListener('click', function(e) {
            e.preventDefault();
  
            portfolioFilter.querySelectorAll('li').forEach(li => li.classList.remove(activeClass));
            this.parentElement.classList.add(activeClass);
  
            const selector = this.getAttribute('data-filter');
            const targetContainer = document.querySelector(portfolioFilter.getAttribute('data-container'));
  
            if (targetContainer) {
              const iso = Isotope.data(targetContainer);
              if (iso) {
                iso.arrange({ filter: selector });
              }
            }
          });
        });
  
        if (defaultFilter !== '*') {
          const defaultFilterLink = portfolioFilter.querySelector(`[data-filter="${defaultFilter}"]`);
          if (defaultFilterLink) {
            defaultFilterLink.click();
          }
        }
      },
  
      shuffleInit: function() {
        const portfolioShuffle = $('.portfolio-shuffle');
        if (!portfolioShuffle) return;
  
        portfolioShuffle.addEventListener('click', function() {
          const container = document.querySelector(this.getAttribute('data-container'));
          if (container) {
            const iso = Isotope.data(container);
            if (iso) {
              iso.shuffle();
            }
          }
        });
      },
  
      portfolioDescMargin: function() {
        const portfolioOverlayEl = $$('.portfolio-overlay');
        portfolioOverlayEl.forEach(overlay => {
          const portfolioDesc = overlay.querySelector('.portfolio-desc');
          if (portfolioDesc) {
            const portfolioOverlayHeight = overlay.offsetHeight;
            const portfolioDescHeight = portfolioDesc.offsetHeight;
  
            if (overlay.querySelector('a.left-icon') || overlay.querySelector('a.right-icon') || overlay.querySelector('a.center-icon')) {
              var portfolioOverlayIconHeight = 40 + 20;
            } else {
              var portfolioOverlayIconHeight = 0;
            }
  
            const portfolioOverlayMiddleAlign = (portfolioOverlayHeight - portfolioDescHeight - portfolioOverlayIconHeight) / 2;
            portfolioDesc.style.marginTop = portfolioOverlayMiddleAlign + 'px';
          }
        });
      },
  
      arrange: function() {
        const portfolioContainers = $$('.portfolio-container');
        portfolioContainers.forEach(container => {
          const iso = Isotope.data(container);
          if (iso) {
            iso.arrange({ transitionDuration: '0.65s' });
          }
        });
      },
  
      ajaxload: function() {
        $$('.portfolio-ajax .portfolio-item a.center-icon').forEach(item => {
          item.addEventListener('click', function(e) {
            e.preventDefault();
            const portPostId = this.closest('.portfolio-item').id;
            if (!this.closest('.portfolio-item').classList.contains('portfolio-active')) {
              angelPortfolio.portfolio.loadItem(portPostId, prevPostPortId);
            }
          });
        });
      },
  
      newNextPrev: function(portPostId) {
        const portNext = this.getNextItem(portPostId);
        const portPrev = this.getPrevItem(portPostId);
        $('#next-portfolio').setAttribute('data-id', portNext);
        $('#prev-portfolio').setAttribute('data-id', portPrev);
      },
  
      loadItem: function(portPostId, prevPostPortId, getIt) {
        if (!getIt) getIt = false;
        const portNext = this.getNextItem(portPostId);
        const portPrev = this.getPrevItem(portPostId);
        if (getIt === false) {
          this.closeItem();
          const portfolioAjaxLoader = $('#portfolio-ajax-loader');
          portfolioAjaxLoader.style.display = 'block';
          const portfolioDataLoader = document.getElementById(portPostId).getAttribute('data-loader');
          const portfolioDetailsContainer = $('#portfolio-ajax-container');
  
          fetch(portfolioDataLoader, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `portid=${portPostId}&portnext=${portNext}&portprev=${portPrev}`
          })
          .then(response => response.text())
          .then(data => {
            portfolioDetailsContainer.innerHTML = data;
            this.initializeAjax(portPostId);
            this.openItem();
            $$('.portfolio-item').forEach(item => item.classList.remove('portfolio-active'));
            document.getElementById(portPostId).classList.add('portfolio-active');
          })
          .catch(error => {
            console.error('Error:', error);
          });
        }
      },
  
      closeItem: function() {
        const portfolioDetails = $('#portfolio-details');
        if (portfolioDetails && portfolioDetails.offsetHeight > 32) {
          $('#portfolio-ajax-loader').style.display = 'block';
          const portfolioAjaxSingle = portfolioDetails.querySelector('#portfolio-ajax-single');
          if (portfolioAjaxSingle) {
            portfolioAjaxSingle.style.animationName = 'fadeOutDown';
            setTimeout(() => {
              portfolioAjaxSingle.remove();
            }, 500);
          }
          portfolioDetails.classList.remove('portfolio-ajax-opened');
        }
      },
  
      openItem: function() {
        const portfolioDetails = $('#portfolio-details');
        const portfolioDetailsContainer = $('#portfolio-ajax-container');
        const portfolioAjaxLoader = $('#portfolio-ajax-loader');
        const images = portfolioDetails.querySelectorAll('img');
        let imagesLoaded = 0;
  
        if (images.length > 0) {
          images.forEach(img => {
            img.onload = () => {
              imagesLoaded++;
              if (imagesLoaded === images.length) {
                portfolioDetailsContainer.style.display = 'block';
                portfolioDetails.classList.add('portfolio-ajax-opened');
                portfolioAjaxLoader.style.display = 'none';
                setTimeout(() => {
                  angelPortfolio.widget.loadFlexSlider();
                  angelPortfolio.initialize.lightbox();
                  angelPortfolio.initialize.resizeVideos();
                  angelPortfolio.widget.masonryThumbs();
                  
                  const topScrollOffset = angelPortfolio.initialize.topScrollOffset();
                  window.scrollTo({
                    top: portfolioDetails.offsetTop - topScrollOffset,
                    behavior: 'smooth'
                  });
                }, 500);
              }
            };
          });
        } else {
          portfolioDetailsContainer.style.display = 'block';
          portfolioDetails.classList.add('portfolio-ajax-opened');
          portfolioAjaxLoader.style.display = 'none';
          setTimeout(() => {
            angelPortfolio.widget.loadFlexSlider();
            angelPortfolio.initialize.lightbox();
            angelPortfolio.initialize.resizeVideos();
            angelPortfolio.widget.masonryThumbs();
            
            const topScrollOffset = angelPortfolio.initialize.topScrollOffset();
            window.scrollTo({
              top: portfolioDetails.offsetTop - topScrollOffset,
              behavior: 'smooth'
            });
          }, 500);
        }
      },
  
      getNextItem: function(portPostId) {
        const currentItem = document.getElementById(portPostId);
        const nextItem = currentItem.nextElementSibling;
        return nextItem ? nextItem.id : '';
      },
  
      getPrevItem: function(portPostId) {
        const currentItem = document.getElementById(portPostId);
        const prevItem = currentItem.previousElementSibling;
        return prevItem ? prevItem.id : '';
      },
  
      initializeAjax: function(portPostId) {
        prevPostPortId = document.getElementById(portPostId);
  
        $('#next-portfolio, #prev-portfolio').forEach(nav => {
          nav.addEventListener('click', function(e) {
            e.preventDefault();
            const portPostId = this.getAttribute('data-id');
            $$('.portfolio-item').forEach(item => item.classList.remove('portfolio-active'));
            document.getElementById(portPostId).classList.add('portfolio-active');
            angelPortfolio.portfolio.loadItem(portPostId, prevPostPortId);
          });
        });
  
        $('#close-portfolio').addEventListener('click', function(e) {
          e.preventDefault();
          const portfolioDetailsContainer = $('#portfolio-ajax-container');
          portfolioDetailsContainer.style.animationName = 'fadeOutDown';
          setTimeout(() => {
            portfolioDetailsContainer.style.display = 'none';
            portfolioDetailsContainer.querySelector('#portfolio-ajax-single').remove();
          }, 500);
          const portfolioDetails = $('#portfolio-details');
          portfolioDetails.classList.remove('portfolio-ajax-opened');
          $$('.portfolio-item').forEach(item => item.classList.remove('portfolio-active'));
        });
      }
    };
  
    angelPortfolio.widget = {
      init: function() {
        this.animations();
        this.youtubeBgVideo();
        this.tabs();
        this.tabsJustify();
        this.tabsResponsive();
        this.toggles();
        this.accordions();
        this.counter();
        this.roundedSkill();
        this.progress();
        this.twitterFeed();
        this.flickrFeed();
        this.instagramPhotos();
        this.dribbbleShots();
        this.navTree();
        this.textRotater();
        this.carousel();
        this.linkScroll();
        this.contactForm();
        this.subscription();
        this.quickContact();
        this.cookieNotify();
        this.extras();
      },
  
      animations: function() {
        const animatedElements = $$('[data-animate]');
        
        if (animatedElements.length > 0) {
          if (window.innerWidth > 991) {
            animatedElements.forEach(element => {
              const animationDelay = element.getAttribute('data-delay');
              const animationDelayTime = animationDelay ? Number(animationDelay) + 500 : 500;
  
              if (!element.classList.contains('animated')) {
                element.classList.add('not-animated');
                const elementAnimation = element.getAttribute('data-animate');
  
                const observer = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      setTimeout(() => {
                        element.classList.remove('not-animated');
                        element.classList.add(elementAnimation, 'animated');
                      }, animationDelayTime);
                      observer.unobserve(element);
                    }
                  });
                }, { threshold: 0.5 });
  
                observer.observe(element);
              }
            });
          }
        }
      },
  
      youtubeBgVideo: function() {
        const youtubeBgPlayerEl = $$('.yt-bg-player');
        if (youtubeBgPlayerEl.length === 0) return;
  
        if (typeof YT === 'undefined') {
          console.log('youtubeBgVideo: YT API not Defined.');
          return true;
        }
  
        youtubeBgPlayerEl.forEach(element => {
          const elementVideo = element.getAttribute('data-video');
          const elementMute = element.getAttribute('data-mute') !== 'false';
          const elementRatio = element.getAttribute('data-ratio') || '16/9';
          const elementQuality = element.getAttribute('data-quality') || 'hd720';
          const elementOpacity = element.getAttribute('data-opacity') || 1;
          const elementContainer = element.getAttribute('data-container') || 'self';
          const elementOptimize = element.getAttribute('data-optimize') !== 'false';
          const elementLoop = element.getAttribute('data-loop') !== 'false';
          const elementVolume = element.getAttribute('data-volume') || 1;
          const elementStart = element.getAttribute('data-start') || 0;
          const elementStop = element.getAttribute('data-stop') || 0;
          const elementAutoPlay = element.getAttribute('data-autoplay') !== 'false';
          const elementFullScreen = element.getAttribute('data-fullscreen') === 'true';
  
          new YT.Player(element, {
            videoId: elementVideo,
            playerVars: {
              autoplay: elementAutoPlay ? 1 : 0,
              controls: 0,
              showinfo: 0,
              modestbranding: 1,
              loop: elementLoop ? 1 : 0,
              fs: elementFullScreen ? 1 : 0,
              cc_load_policy: 0,
              iv_load_policy: 3,
              autohide: 0,
              start: elementStart,
              end: elementStop
            },
            events: {
              onReady: function(event) {
                if (elementMute) event.target.mute();
                event.target.setVolume(elementVolume * 100);
                if (elementAutoPlay) {
                  event.target.playVideo();
                }
              },
              onStateChange: function(event) {
                if (event.data === YT.PlayerState.ENDED) {
                  if (elementLoop) {
                    event.target.playVideo();
                  }
                }
              }
            }
          });
        });
      },
  
      tabs: function() {
        const tabsEl = $$('.tabs:not(.customjs)');
        if (tabsEl.length === 0) return;
  
        tabsEl.forEach(element => {
          const elementSpeed = parseInt(element.getAttribute('data-speed')) || 400;
          const tabActive = parseInt(element.getAttribute('data-active')) - 1 || 0;
  
          const tabs = element.querySelectorAll('.tab-nav li');
          const tabContents = element.querySelectorAll('.tab-container .tab-content');
  
          tabs.forEach((tab, index) => {
            tab.addEventListener('click', (e) => {
              e.preventDefault();
              
              tabs.forEach(t => t.classList.remove('ui-tabs-active'));
              tab.classList.add('ui-tabs-active');
  
              tabContents.forEach(content => {
                content.style.display = 'none';
                content.classList.remove('fadeIn');
              });
  
              const activeContent = tabContents[index];
              activeContent.style.display = 'block';
              setTimeout(() => {
                activeContent.classList.add('fadeIn');
              }, 50);
            });
          });
  
          // Set initial active tab
          tabs[tabActive].click();
        });
      },
  
      tabsJustify: function() {
        if (window.innerWidth > 767) {
          const tabsJustify = $$('.tabs.tabs-justify');
          if (tabsJustify.length === 0) return;
  
          tabsJustify.forEach(element => {
            const elementTabs = element.querySelectorAll('.tab-nav > li');
            const elementTabsNo = elementTabs.length;
            let elementContainer, elementWidth;
  
            if (element.classList.contains('tabs-bordered') || element.classList.contains('tabs-bb')) {
              elementContainer = element.querySelector('.tab-nav').offsetWidth;
            } else {
              if (element.querySelector('.tab-nav').classList.contains('tab-nav2')) {
                elementContainer = element.querySelector('.tab-nav').offsetWidth - (elementTabsNo * 10);
              } else {
                elementContainer = element.querySelector('.tab-nav').offsetWidth - 30;
              }
            }
  
            elementWidth = Math.floor(elementContainer / elementTabsNo);
            elementTabs.forEach(tab => {
              tab.style.width = elementWidth + 'px';
            });
          });
        } else {
          $$('.tabs.tabs-justify').forEach(element => {
            element.querySelectorAll('.tab-nav > li').forEach(tab => {
              tab.style.width = '';
            });
          });
        }
      },
  
      tabsResponsive: function() {
        const tabsResponsive = $$('.tabs.tabs-responsive');
        if (tabsResponsive.length === 0) return;
  
        tabsResponsive.forEach(element => {
          const elementNav = element.querySelector('.tab-nav');
          const elementContent = element.querySelector('.tab-container');
  
          elementNav.querySelectorAll('li').forEach(li => {
            const anchor = li.querySelector('a');
            const target = anchor.getAttribute('href');
            const content = anchor.textContent;
  
            const accordionItem = document.createElement('div');
            accordionItem.className = accordionItem.className = 'acctitle hide';
            accordionItem.innerHTML = `
              <i class="acc-closed icon-ok-circle"></i>
              <i class="acc-open icon-remove-circle"></i>
              ${content}
            `;
  
            elementContent.querySelector(target).insertAdjacentElement('beforebegin', accordionItem);
          });
        });
      },
  
      tabsResponsiveResize: function() {
        const tabsResponsive = $$('.tabs.tabs-responsive');
        if (tabsResponsive.length === 0) return;
  
        tabsResponsive.forEach(element => {
          const elementAccStyle = element.getAttribute('data-accordion-style');
  
          if (window.innerWidth < 768) {
            element.querySelector('.tab-nav').classList.add('hide');
            element.querySelector('.tab-container').classList.add('accordion', elementAccStyle, 'clearfix');
            element.querySelectorAll('.tab-content').forEach(content => content.classList.add('acc_content'));
            element.querySelectorAll('.acctitle').forEach(title => title.classList.remove('hide'));
            angelPortfolio.widget.accordions();
          } else {
            element.querySelector('.tab-nav').classList.remove('hide');
            element.querySelector('.tab-container').classList.remove('accordion', elementAccStyle, 'clearfix');
            element.querySelectorAll('.tab-content').forEach(content => content.classList.remove('acc_content'));
            element.querySelectorAll('.acctitle').forEach(title => title.classList.add('hide'));
            // Refresh tabs
            angelPortfolio.widget.tabs();
          }
        });
      },
  
      toggles: function() {
        const toggles = $$('.toggle');
        if (toggles.length === 0) return;
  
        toggles.forEach(element => {
          const elementState = element.getAttribute('data-state');
  
          if (elementState !== 'open') {
            element.querySelector('.togglec').style.display = 'none';
          } else {
            element.querySelector('.togglet').classList.add('toggleta');
          }
  
          element.querySelector('.togglet').addEventListener('click', function() {
            this.classList.toggle('toggleta');
            this.nextElementSibling.slideToggle(300);
          });
        });
      },
  
      accordions: function() {
        const accordionEl = $$('.accordion');
        if (accordionEl.length === 0) return;
  
        accordionEl.forEach(element => {
          const elementState = element.getAttribute('data-state');
          const accordionActive = parseInt(element.getAttribute('data-active')) - 1 || 0;
  
          element.querySelectorAll('.acc_content').forEach(content => content.style.display = 'none');
  
          if (elementState !== 'closed') {
            element.querySelectorAll('.acctitle')[accordionActive].classList.add('acctitlec');
            element.querySelectorAll('.acc_content')[accordionActive].style.display = 'block';
          }
  
          element.querySelectorAll('.acctitle').forEach((title, index) => {
            title.addEventListener('click', function() {
              if (this.nextElementSibling.style.display === 'none') {
                element.querySelectorAll('.acctitle').forEach(t => t.classList.remove('acctitlec'));
                element.querySelectorAll('.acc_content').forEach(c => c.style.display = 'none');
                
                this.classList.add('acctitlec');
                this.nextElementSibling.style.display = 'block';
                
                const topScrollOffset = angelPortfolio.initialize.topScrollOffset();
                window.scrollTo({
                  top: this.offsetTop - topScrollOffset + 40,
                  behavior: 'smooth'
                });
              }
            });
          });
        });
      },
  
      counter: function() {
        const counterEl = $$('.counter:not(.counter-instant)');
        if (counterEl.length === 0) return;
  
        const intersectionObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const element = entry.target;
              const counterElement = element.querySelector('span');
              const counterComma = counterElement.getAttribute('data-comma') === 'true';
              
              let startValue = parseInt(counterElement.textContent);
              const endValue = parseInt(counterElement.getAttribute('data-to'));
              const duration = parseInt(element.getAttribute('data-speed')) || 2000;
              
              const countStep = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const currentValue = Math.floor(progress * (endValue - startValue) + startValue);
                
                counterElement.textContent = counterComma ? currentValue.toLocaleString() : currentValue;
                
                if (progress < 1) {
                  window.requestAnimationFrame(countStep);
                } else {
                  observer.unobserve(element);
                }
              };
              
              let startTimestamp = null;
              window.requestAnimationFrame(countStep);
            }
          });
        }, { threshold: 0.5 });
  
        counterEl.forEach(counter => intersectionObserver.observe(counter));
      },
  
      roundedSkill: function() {
        const roundedSkillEl = $$('.rounded-skill');
        if (roundedSkillEl.length === 0) return;
  
        roundedSkillEl.forEach(element => {
          const elementSize = parseInt(element.getAttribute('data-size')) || 140;
          const elementSpeed = parseInt(element.getAttribute('data-speed')) || 2000;
          const elementWidth = parseInt(element.getAttribute('data-width')) || 8;
          const elementColor = element.getAttribute('data-color') || '#0093BF';
          const elementTrackColor = element.getAttribute('data-trackcolor') || 'rgba(0,0,0,0.04)';
  
          const canvas = document.createElement('canvas');
          canvas.width = elementSize;
          canvas.height = elementSize;
          element.appendChild(canvas);
  
          const ctx = canvas.getContext('2d');
          const elementPercent = parseInt(element.getAttribute('data-percent'));
          let percent = 0;
          let centerX = canvas.width / 2;
          let centerY = canvas.height / 2;
          let radius = centerX - elementWidth / 2;
          let startAngle = 1.5 * Math.PI;
          let endAngle = (elementPercent / 100) * 2 * Math.PI + startAngle;
  
          const animate = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / elementSpeed, 1);
            percent = progress * elementPercent;
  
            ctx.clearRect(0, 0, canvas.width, canvas.height);
  
            // Draw track
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = elementTrackColor;
            ctx.lineWidth = elementWidth;
            ctx.stroke();
  
            // Draw progress
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, (percent / 100) * 2 * Math.PI + startAngle);
            ctx.strokeStyle = elementColor;
            ctx.lineWidth = elementWidth;
            ctx.stroke();
  
            // Update text
            element.querySelector('span').textContent = Math.round(percent) + '%';
  
            if (progress < 1) {
              window.requestAnimationFrame(animate);
            }
          };
  
          let startTimestamp = null;
          window.requestAnimationFrame(animate);
        });
      },
  
      progress: function() {
        const progressEl = $$('.progress');
        if (progressEl.length === 0) return;
  
        const intersectionObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const element = entry.target;
              const elementBar = element.querySelector('.progress-bar');
              const elementPercent = parseInt(elementBar.getAttribute('data-percent'));
              
              let percent = 0;
              const duration = 2000; // 2 seconds
  
              const animate = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                percent = progress * elementPercent;
  
                elementBar.style.width = percent + '%';
                element.querySelector('.counter-instant span').textContent = Math.round(percent);
  
                if (progress < 1) {
                  window.requestAnimationFrame(animate);
                } else {
                  observer.unobserve(element);
                }
              };
  
              let startTimestamp = null;
              window.requestAnimationFrame(animate);
            }
          });
        }, { threshold: 0.5 });
  
        progressEl.forEach(progress => intersectionObserver.observe(progress));
      },
  
      twitterFeed: function() {
        const twitterFeedEl = $$('.twitter-feed');
        if (twitterFeedEl.length === 0) return;
  
        if (typeof twitterFetcher === 'undefined') {
          console.log('twitterFeed: twitterFetcher not Defined.');
          return true;
        }
  
        twitterFeedEl.forEach(element => {
          const username = element.getAttribute('data-username') || 'twitter';
          const count = parseInt(element.getAttribute('data-count')) || 3;
          const loader = element.getAttribute('data-loader') || 'include/twitter/tweets.php';
  
          twitterFetcher.fetch({
            "profile": {"screenName": username},
            "domId": element.id,
            "maxTweets": count,
            "enableLinks": true,
            "showUser": true,
            "showTime": true,
            "dateFunction": '',
            "showRetweet": false,
            "customCallback": function(tweets) {
              let html = '<ul>';
              for (let i = 0; i < tweets.length; i++) {
                html += '<li>' + tweets[i] + '</li>';
              }
              html += '</ul>';
              element.innerHTML = html;
  
              if (element.classList.contains('fslider')) {
                setTimeout(() => {
                  angelPortfolio.widget.loadFlexSlider();
                }, 500);
              }
            },
            "lang": 'en'
          });
        });
      },
  
      flickrFeed: function() {
        const flickrFeedEl = $$('.flickr-feed');
        if (flickrFeedEl.length === 0) return;
  
        if (typeof jflickrfeed === 'undefined') {
          console.log('flickrFeed: jflickrfeed not Defined.');
          return true;
        }
  
        flickrFeedEl.forEach(element => {
          const flickrId = element.getAttribute('data-id');
          const flickrCount = parseInt(element.getAttribute('data-count')) || 9;
          const flickrType = element.getAttribute('data-type') || 'photos';
  
          element.jflickrfeed({
            limit: flickrCount,
            qstrings: {
              id: flickrId
            },
            itemTemplate: '<a href="{{image_b}}" title="{{title}}" data-lightbox="gallery-item">' +
                            '<img src="{{image_s}}" alt="{{title}}" />' +
                          '</a>'
          }, function(data) {
            angelPortfolio.initialize.lightbox();
          });
        });
      },
  
      instagramPhotos: function(clientID, accessToken) {
        const instagramPhotosEl = $$('.instagram-photos');
        if (instagramPhotosEl.length === 0) return;
  
        if (typeof Instafeed === 'undefined') {
          console.log('Instafeed not Defined.');
          return true;
        }
  
        instagramPhotosEl.forEach(element => {
          const instaGramTarget = element.getAttribute('id');
          const instaGramUserId = element.getAttribute('data-user');
          const instaGramTag = element.getAttribute('data-tag');
          const instaGramLocation = element.getAttribute('data-location');
          const instaGramCount = parseInt(element.getAttribute('data-count')) || 9;
          const instaGramType = element.getAttribute('data-type');
          const instaGramSortBy = element.getAttribute('data-sortBy') || 'none';
          const instaGramRes = element.getAttribute('data-resolution') || 'thumbnail';
  
          if (instaGramType === 'user') {
            const feed = new Instafeed({
              target: instaGramTarget,
              get: instaGramType,
              userId: instaGramUserId,
              limit: instaGramCount,
              sortBy: instaGramSortBy,
              resolution: instaGramRes,
              accessToken: accessToken,
              clientId: clientID
            });
            feed.run();
          } else if (instaGramType === 'tagged') {
            const feed = new Instafeed({
              target: instaGramTarget,
              get: instaGramType,
              tagName: instaGramTag,
              limit: instaGramCount,
              sortBy: instaGramSortBy,
              resolution: instaGramRes,
              clientId: clientID
            });
            feed.run();
          } else if (instaGramType === 'location') {
            const feed = new Instafeed({
              target: instaGramTarget,
              get: instaGramType,
              locationId: instaGramLocation,
              limit: instaGramCount,
              sortBy: instaGramSortBy,
              resolution: instaGramRes,
              clientId: clientID
            });
            feed.run();
          } else {
            const feed = new Instafeed({
              target: instaGramTarget,
              get: 'popular',
              limit: instaGramCount,
              sortBy: instaGramSortBy,
              resolution: instaGramRes,
              clientId: clientID
            });
            feed.run();
          }
        });
      },
  
      dribbbleShots: function(accessToken) {
        const dribbbleShotsEl = $$('.dribbble-shots');
        if (dribbbleShotsEl.length === 0) return;
  
        if (typeof Jribbble === 'undefined') {
          console.log('dribbbleShots: Jribbble not Defined.');
          return true;
        }
  
        Jribbble.setToken(accessToken);
  
        dribbbleShotsEl.forEach(element => {
          const dribbbleUsername = element.getAttribute('data-user');
          const dribbbleCount = parseInt(element.getAttribute('data-count')) || 9;
          const dribbbleList = element.getAttribute('data-list');
          const dribbbleType = element.getAttribute('data-type');
  
          element.classList.add('customjs');
  
          if (dribbbleType === 'user') {
            Jribbble.user(dribbbleUsername).shots({
              sort: 'recent',
              page: 1,
              per_page: dribbbleCount
            }).then(shots => {
              let html = '';
              shots.forEach(shot => {
                html += `<a href="${shot.html_url}" target="_blank">`;
                html += `<img src="${shot.images.teaser}" alt="${shot.title}">`;
                html += '</a>';
              });
              element.innerHTML = html;
  
              imagesLoaded(element, () => {
                element.classList.remove('customjs');
                angelPortfolio.widget.masonryThumbs();
              });
            });
          } else if (dribbbleType === 'list') {
            Jribbble.shots(dribbbleList, {
              sort: 'recent',
              page: 1,
              per_page: dribbbleCount
            }).then(shots => {
              let html = '';
              shots.forEach(shot => {
                html += `<a href="${shot.html_url}" target="_blank">`;
                html += `<img src="${shot.images.teaser}" alt="${shot.title}">`;
                html += '</a>';
              });
              element.innerHTML = html;
  
              imagesLoaded(element, () => {
                element.classList.remove('customjs');
                angelPortfolio.widget.masonryThumbs();
              });
            });
          }
        });
      },
  
      navTree: function() {
        const navTreeEl = $$('.nav-tree');
        if (navTreeEl.length === 0) return;
  
        navTreeEl.forEach(element => {
          const elementSpeed = parseInt(element.getAttribute('data-speed')) || 250;
          const elementEasing = element.getAttribute('data-easing') || 'swing';
  
          element.querySelectorAll('ul li:has(ul)').forEach(li => {
            li.classList.add('sub-menu');
            li.firstElementChild.insertAdjacentHTML('beforeend', ' <i class="icon-angle-down"></i>');
          });
  
          if (element.classList.contains('on-hover')) {
            element.querySelectorAll('ul li:has(ul):not(.active)').forEach(li => {
              li.addEventListener('mouseenter', function() {
                this.querySelector('ul').slideDown(elementSpeed, elementEasing);
              });
              li.addEventListener('mouseleave', function() {
                this.querySelector('ul').slideUp(elementSpeed, elementEasing);
              });
            });
          } else {
            element.querySelectorAll('ul li:has(ul) > a').forEach(a => {
              a.addEventListener('click', function(e) {
                const parent = this.parentNode;
                element.querySelectorAll('ul li').forEach(li => {
                  if (li !== parent && !li.contains(parent)) li.classList.remove('active');
                });
                parent.querySelector('ul').slideToggle(elementSpeed, elementEasing, () => {
                  parent.classList.toggle('active');
                });
                e.preventDefault();
              });
            });
          }
        });
      },
  
      carousel: function() {
        const carouselEl = $$('.carousel-widget:not(.customjs)');
        if (carouselEl.length < 1) return;
  
        carouselEl.forEach(element => {
          const elementItems = element.getAttribute('data-items');
          const elementItemsXl = element.getAttribute('data-items-xl');
          const elementItemsLg = element.getAttribute('data-items-lg');
          const elementItemsMd = element.getAttribute('data-items-md');
          const elementItemsSm = element.getAttribute('data-items-sm');
          const elementItemsXs = element.getAttribute('data-items-xs');
          const elementLoop = element.getAttribute('data-loop') !== 'false';
          const elementAutoPlay = element.getAttribute('data-autoplay');
          const elementSpeed = parseInt(element.getAttribute('data-speed')) || 250;
          const elementAnimateIn = element.getAttribute('data-animate-in');
          const elementAnimateOut = element.getAttribute('data-animate-out');
          const elementNav = element.getAttribute('data-nav') !== 'false';
          const elementPagi = element.getAttribute('data-pagi') !== 'false';
          const elementMargin = parseInt(element.getAttribute('data-margin')) || 20;
          const elementStage = parseInt(element.getAttribute('data-stage-padding')) || 0;
          const elementMerge = element.getAttribute('data-merge') === 'true';
          const elementStart = parseInt(element.getAttribute('data-start')) || 0;
          const elementRewind = element.getAttribute('data-rewind') === 'true';
          const elementSlideBy = element.getAttribute('data-slideby') || 1;
          const elementCenter = element.getAttribute('data-center') === 'true';
          const elementLazy = element.getAttribute('data-lazyload') === 'true';
          const elementVideo = element.getAttribute('data-video') === 'true';
          const elementRTL = element.getAttribute('data-rtl') === 'true';
  
          const options = {
            items: parseInt(elementItems) || 4,
            loop: elementLoop,
            autoplay: elementAutoPlay ? { delay: parseInt(elementAutoPlay) } : false,
            autoplayHoverPause: true,
            speed: elementSpeed,
            animateIn: elementAnimateIn,
            animateOut: elementAnimateOut,
            nav: elementNav,
            navText: ['<i class="icon-angle-left"></i>', '<i class="icon-angle-right"></i>'],
            dots: elementPagi,
            margin: elementMargin,
            stagePadding: elementStage,
            merge: elementMerge,
            startPosition: elementStart,
            rewind: elementRewind,
            slideBy: elementSlideBy,
            center: elementCenter,
            lazyLoad: elementLazy,
            video: elementVideo,
            rtl: elementRTL,
            responsive: {
              0: { items: parseInt(elementItemsXs) || 1 },
              576: { items: parseInt(elementItemsSm) || 2 },
              768: { items: parseInt(elementItemsMd) || 3 },
              992: { items: parseInt(elementItemsLg) || 4 },
              1200: { items: parseInt(elementItemsXl) || parseInt(elementItems) || 4 }
            },
            onInitialized: function() {
              angelPortfolio.slider.owlCaptionInit();
              angelPortfolio.slider.sliderParallaxDimensions();
              angelPortfolio.initialize.lightbox();
            }
          };
  
          const owl = new OwlCarousel(element, options);
        });
      },
  
      masonryThumbs: function() {
        const masonryThumbsEl = $$('.masonry-thumbs:not(.customjs)');
        if (masonryThumbsEl.length < 1) return;
  
        masonryThumbsEl.forEach(element => {
          const masonryItemContainer = element;
          const masonryItemWidth = masonryItemContainer.getAttribute('data-big');
          const bigItemNumbers = masonryItemWidth ? masonryItemWidth.split(',') : null;
  
          const iso = new Isotope(masonryItemContainer, {
            itemSelector: '.masonry-thumb',
            percentPosition: true,
            masonry: {
              columnWidth: '.masonry-thumb:not(.large-thumb)'
            }
          });
  
          if (bigItemNumbers) {
            bigItemNumbers.forEach(number => {
              const bigItem = masonryItemContainer.children[parseInt(number) - 1];
              if (bigItem) {
                bigItem.classList.add('large-thumb');
                bigItem.style.width = bigItem.offsetWidth * 2 + 'px';
              }
            });
  
            setTimeout(() => {
              iso.layout();
            }, 1000);
          }
        });
      },
  
      notifications: function(element) {
        if (typeof toastr === 'undefined') {
          console.log('notifications: Toastr not Defined.');
          return true;
        }
  
        toastr.remove();
        const notifyElement = element;
        const notifyPosition = notifyElement.getAttribute('data-notify-position') || 'toast-top-right';
        const notifyType = notifyElement.getAttribute('data-notify-type');
        const notifyMsg = notifyElement.getAttribute('data-notify-msg');
        const notifyTimeout = parseInt(notifyElement.getAttribute('data-notify-timeout')) || 5000;
        const notifyCloseButton = notifyElement.getAttribute('data-notify-close') === 'true';
  
        toastr.options.positionClass = 'toast-' + notifyPosition;
        toastr.options.timeOut = notifyTimeout;
        toastr.options.closeButton = notifyCloseButton;
        toastr.options.closeHtml = '<button><i class="icon-remove"></i></button>';
  
        switch(notifyType) {
          case 'warning':
            toastr.warning(notifyMsg);
            break;
          case 'error':
            toastr.error(notifyMsg);
            break;
          case 'success':
            toastr.success(notifyMsg);
            break;
          default:
            toastr.info(notifyMsg);
        }
  
        return false;
      },
  
      textRotater: function() {
        const textRotaterEl = $$('.text-rotater');
        if (textRotaterEl.length < 1) return;
  
        if (typeof Morphext === 'undefined') {
          console.log('textRotater: Morphext not Defined.');
          return true;
        }
  
        textRotaterEl.forEach(element => {
          const rotateText = element.getAttribute('data-rotate');
          const rotateSpeed = parseInt(element.getAttribute('data-speed')) || 1200;
          const rotateSeparator = element.getAttribute('data-separator') || ',';
  
          new Morphext(element.querySelector('.t-rotate'), {
            animation: rotateText || 'fadeIn',
            separator: rotateSeparator,
            speed: rotateSpeed
          });
        });
      },
  
      linkScroll: function() {
        $$('a[data-scrollto]').forEach(link => {
          link.addEventListener('click', function(e) {
            e.preventDefault();
            const element = this;
            const divScrollToAnchor = element.getAttribute('data-scrollto');
            const divScrollSpeed = parseInt(element.getAttribute('data-speed')) || 750;
            const divScrollOffset = parseInt(element.getAttribute('data-offset')) || angelPortfolio.initialize.topScrollOffset();
            const divScrollEasing = element.getAttribute('data-easing') || 'easeOutQuad';
            const divScrollHighlight = element.getAttribute('data-highlight');
  
            const targetElement = document.querySelector(divScrollToAnchor);
            if (targetElement) {
              const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - divScrollOffset;
  
              window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
              });
  
              if (divScrollHighlight) {
                if (targetElement.querySelector('.highlight-me')) {
                  setTimeout(() => {
                    targetElement.querySelector('.highlight-me').style.backgroundColor = divScrollHighlight;
                  }, divScrollSpeed);
                  setTimeout(() => {
                    targetElement.querySelector('.highlight-me').style.backgroundColor = 'transparent';
                  }, divScrollSpeed + 500);
                } else {
                  setTimeout(() => {
                    targetElement.style.backgroundColor = divScrollHighlight;
                  }, divScrollSpeed);
                  setTimeout(() => {
                    targetElement.style.backgroundColor = 'transparent';
                  }, divScrollSpeed + 500);
                }
              }
            }
          });
        });
      },
  
      contactForm: function() {
        const contactForm = $$('.contact-widget:not(.customjs)');
        if (contactForm.length < 1) return;
  
        contactForm.forEach(form => {
          form.addEventListener('submit', function(e) {
            e.preventDefault();
  
            const alertType = form.getAttribute('data-alert-type');
            const alertMsg = form.getAttribute('data-alert-msg');
            const alertPosition = form.getAttribute('data-alert-position');
  
            const formData = new FormData(form);
  
            fetch(form.action, {
              method: 'POST',
              body: formData
            })
            .then(response => response.json())
            .then(data => {
              if (data.alert === 'error') {
                if (alertType === 'inline') {
                  form.querySelector('.contact-form-result').innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
                } else {
                  angelPortfolio.widget.notifications({
                    'data-notify-type': 'error',
                    'data-notify-msg': data.message,
                    'data-notify-position': alertPosition
                  });
                }
              } else {
                if (alertType === 'inline') {
                  form.querySelector('.contact-form-result').innerHTML = `<div class="alert alert-success">${alertMsg || data.message}</div>`;
                } else {
                  angelPortfolio.widget.notifications({
                    'data-notify-type': 'success',
                    'data-notify-msg': alertMsg || data.message,
                    'data-notify-position': alertPosition
                  });
                }
                form.reset();
              }
            })
            .catch(error => {
              console.error('Error:', error);
            });
          });
        });
      },
  
      subscription: function() {
        const subscriptionForm = $$('.subscribe-widget:not(.customjs)');
        if (subscriptionForm.length < 1) return;
  
        subscriptionForm.forEach(form => {
          form.addEventListener('submit', function(e) {
            e.preventDefault();
  
            const alertType = form.getAttribute('data-alert-type');
            const alertMsg = form.getAttribute('data-alert-msg');
            const alertPosition = form.getAttribute('data-alert-position');
  
            const formData = new FormData(form);
  
            fetch(form.action, {
              method: 'POST',
              body: formData
            })
            .then(response => response.json())
            .then(data => {
              if (data.alert === 'error') {
                if (alertType === 'inline') {
                  form.querySelector('.widget-subscribe-form-result').innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
                } else {
                  angelPortfolio.widget.notifications({
                    'data-notify-type': 'error',
                    'data-notify-msg': data.message,
                    'data-notify-position': alertPosition
                  });
                }
              } else {
                if (alertType === 'inline') {
                  form.querySelector('.widget-subscribe-form-result').innerHTML = `<div class="alert alert-success">${alertMsg || data.message}</div>`;
                } else {
                  angelPortfolio.widget.notifications({
                    'data-notify-type': 'success',
                    'data-notify-msg': alertMsg || data.message,
                    'data-notify-position': alertPosition
                  });
                }
                form.reset();
              }
            })
            .catch(error => {
              console.error('Error:', error);
            });
          });
        });
      },
  
      quickContact: function() {
        const quickContactForm = $$('.quick-contact-widget:not(.customjs)');
        if (quickContactForm.length < 1) return;
  
        quickContactForm.forEach(form => {
          form.addEventListener('submit', function(e) {
            e.preventDefault();
  
            const alertType = form.getAttribute('data-alert-type');
            const alertMsg = form.getAttribute('data-alert-msg');
            const alertPosition = form.getAttribute('data-alert-position');
  
            const formData = new FormData(form);
  
            fetch(form.action, {
              method: 'POST',
              body: formData
            })
            .then(response => response.json())
            .then(data => {
              if (data.alert === 'error') {
                if (alertType === 'inline') {
                  form.querySelector('.quick-contact-form-result').innerHTML = `<div class="alert alert-danger">${data.message}</div>`;
                } else {
                  angelPortfolio.widget.notifications({
                    'data-notify-type': 'error',
                    'data-notify-msg': data.message,
                    'data-notify-position': alertPosition
                  });
                }
              } else {
                if (alertType === 'inline') {
                  form.querySelector('.quick-contact-form-result').innerHTML = `<div class="alert alert-success">${alertMsg || data.message}</div>`;
                } else {
                  angelPortfolio.widget.notifications({
                    'data-notify-type': 'success', 'data-notify-msg': alertMsg || data.message,
                    'data-notify-position': alertPosition
                  });
                }
                form.reset();
              }
            })
            .catch(error => {
              console.error('Error:', error);
            });
          });
        });
      },
  
      cookieNotify: function() {
        const cookieNotification = $('#cookie-notification');
        if (!cookieNotification) return;
  
        const cookieNotificationHeight = cookieNotification.offsetHeight;
  
        cookieNotification.style.bottom = -cookieNotificationHeight + 'px';
  
        if (getCookie('websiteUsesCookies') !== 'yesConfirmed') {
          cookieNotification.style.bottom = '0px';
        }
  
        $('.cookie-accept').addEventListener('click', function() {
          cookieNotification.style.bottom = -cookieNotificationHeight + 'px';
          setCookie('websiteUsesCookies', 'yesConfirmed', 30);
        });
      },
  
      extras: function() {
        // Tooltip
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new bootstrap.Tooltip(tooltipTriggerEl);
        });
  
        // Popover
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
          return new bootstrap.Popover(popoverTriggerEl);
        });
  
        // Close Message
        $$('.style-msg').forEach(msg => {
          msg.querySelector('.close').addEventListener('click', function(e) {
            e.preventDefault();
            msg.style.display = 'none';
          });
        });
  
        // Navbar Toggle
        $('#primary-menu-trigger,#overlay-menu-close').addEventListener('click', function() {
          if ($('#primary-menu').querySelector('ul.mobile-primary-menu')) {
            $('#primary-menu > ul.mobile-primary-menu, #primary-menu > div > ul.mobile-primary-menu').classList.toggle('show');
          } else {
            $('#primary-menu > ul, #primary-menu > div > ul').classList.toggle('show');
          }
          $('body').classList.toggle('primary-menu-open');
          return false;
        });
  
        // Page Menu Toggle
        $('#page-submenu-trigger').addEventListener('click', function() {
          $('body').classList.remove('top-search-open');
          $('#pagemenu').classList.toggle('pagemenu-active');
          return false;
        });
  
        // Page Menu Click for Mobile
        $('#pagemenu nav').addEventListener('click', function(e) {
          $('body').classList.remove('top-search-open');
          $('#top-cart').classList.remove('top-cart-open');
        });
  
        // Mobile Device Detection
        if (angelPortfolio.isMobile.any()) {
          $('body').classList.add('device-touch');
        }
      }
    };
  
    angelPortfolio.isMobile = {
      Android: function() {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
      },
      any: function() {
        return (angelPortfolio.isMobile.Android() || angelPortfolio.isMobile.BlackBerry() || angelPortfolio.isMobile.iOS() || angelPortfolio.isMobile.Opera() || angelPortfolio.isMobile.Windows());
      }
    };
  
    angelPortfolio.documentOnResize = {
      init: function() {
        let t = setTimeout(() => {
          angelPortfolio.header.topsocial();
          angelPortfolio.header.fullWidthMenu();
          angelPortfolio.header.overlayMenu();
          angelPortfolio.initialize.fullScreen();
          angelPortfolio.initialize.verticalMiddle();
          angelPortfolio.initialize.maxHeight();
          angelPortfolio.initialize.testimonialsGrid();
          angelPortfolio.initialize.stickyFooter();
          angelPortfolio.slider.sliderParallaxDimensions();
          angelPortfolio.slider.captionPosition();
          angelPortfolio.portfolio.arrange();
          angelPortfolio.portfolio.portfolioDescMargin();
          angelPortfolio.widget.tabsResponsiveResize();
          angelPortfolio.widget.tabsJustify();
          angelPortfolio.widget.html5Video();
          angelPortfolio.widget.masonryThumbs();
          angelPortfolio.initialize.dataResponsiveClasses();
          angelPortfolio.initialize.dataResponsiveHeights();
          
          if ($('.grid-container').length > 0) {
            if (!$('.grid-container').hasClass('.customjs')) {
              if (typeof Isotope !== 'undefined') {
                $('.grid-container').isotope('layout');
              } else {
                console.log('documentOnResize > init: Isotope not defined.');
              }
            }
          }
  
          if ($('body').hasClass('device-xl') || $('body').hasClass('device-lg')) {
            $('#primary-menu').find('ul.mobile-primary-menu').removeClass('show');
          }
        }, 500);
  
        window.addEventListener('resize', function() {
          angelPortfolio.documentOnResize.init();
        });
      }
    };
  
    angelPortfolio.documentOnReady = {
      init: function() {
        angelPortfolio.initialize.init();
        angelPortfolio.header.init();
        if ($('#slider').length > 0) { 
          angelPortfolio.slider.init();
        }
        if ($('.portfolio').length > 0) {
          angelPortfolio.portfolio.init();
        }
        angelPortfolio.widget.init();
        angelPortfolio.documentOnReady.windowscroll();
      },
  
      windowscroll: function() {
        let headerOffset = 0,
            headerWrapOffset = 0,
            pageMenuOffset = 0;
  
        if ($('#header').length > 0) { 
          headerOffset = $('#header').offset().top;
        }
        if ($('#header').length > 0) {
          headerWrapOffset = $('#header-wrap').offset().top;
        }
        if ($('#page-menu').length > 0) {
          if ($('#header').length > 0 && !$('#header').hasClass('no-sticky')) {
            if ($('#header').hasClass('sticky-style-2') || $('#header').hasClass('sticky-style-3')) {
              pageMenuOffset = $('#page-menu').offset().top - $('#header-wrap').outerHeight();
            } else {
              pageMenuOffset = $('#page-menu').offset().top - $('#header').outerHeight();
            }
          } else {
            pageMenuOffset = $('#page-menu').offset().top;
          }
        }
  
        let headerDefinedOffset = $('#header').attr('data-sticky-offset');
        if (typeof headerDefinedOffset !== 'undefined') {
          if (headerDefinedOffset == 'full') {
            headerWrapOffset = window.innerHeight;
            let headerOffsetNegative = $('#header').attr('data-sticky-offset-negative');
            if (typeof headerOffsetNegative !== 'undefined') {
              headerWrapOffset = headerWrapOffset - parseFloat(headerOffsetNegative) - 1;
            }
          } else {
            headerWrapOffset = parseFloat(headerDefinedOffset);
          }
        }
  
        angelPortfolio.header.stickyMenu(headerWrapOffset);
        angelPortfolio.header.stickyPageMenu(pageMenuOffset);
  
        window.addEventListener('scroll', function() {
          angelPortfolio.initialize.goToTopScroll();
          $('body.open-header.close-header-on-scroll').removeClass("side-header-open");
          angelPortfolio.header.stickyMenu(headerWrapOffset);
          angelPortfolio.header.stickyPageMenu(pageMenuOffset);
          angelPortfolio.header.logo();
        });
  
        window.addEventListener('scroll', angelPortfolio.slider.sliderParallax);
        window.addEventListener('scroll', angelPortfolio.slider.sliderElementsFade);
  
        if ($('.one-page-menu').length > 0) {
          window.addEventListener('scroll', angelPortfolio.header.onepageScroller);
        }
      }
    };
  
    angelPortfolio.documentOnLoad = {
      init: function() {
        angelPortfolio.slider.captionPosition();
        angelPortfolio.slider.swiperSliderMenu(true);
        angelPortfolio.slider.revolutionSliderMenu(true);
        angelPortfolio.initialize.maxHeight();
        angelPortfolio.initialize.testimonialsGrid();
        angelPortfolio.initialize.verticalMiddle();
        angelPortfolio.initialize.stickFooterOnSmall();
        angelPortfolio.initialize.stickyFooter();
        angelPortfolio.portfolio.gridInit($('.grid-container'));
        angelPortfolio.portfolio.filterInit();
        angelPortfolio.portfolio.shuffleInit();
        angelPortfolio.portfolio.arrange();
        angelPortfolio.portfolio.portfolioDescMargin();
        angelPortfolio.widget.parallax();
        angelPortfolio.widget.loadFlexSlider();
        angelPortfolio.widget.html5Video();
        angelPortfolio.widget.masonryThumbs();
        angelPortfolio.header.topsocial();
        angelPortfolio.header.responsiveMenuClass();
        angelPortfolio.initialize.modal();
      }
    };
  
    // Initialize Functions on Document Ready
    document.addEventListener('DOMContentLoaded', function() {
      angelPortfolio.documentOnReady.init();
    });
  
    // Initialize Functions on Window Load
    window.addEventListener('load', function() {
      angelPortfolio.documentOnLoad.init();
    });
  
    // Initialize Functions on Window Resize
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        angelPortfolio.documentOnResize.init();
      }, 250);
    });
  
  })();
  
  // Helper Functions
  function $(selector) {
    return document.querySelector(selector);
  }
  
  function $$(selector) {
    return document.querySelectorAll(selector);
  }
  
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  }
  
  function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  
  // Smooth Scroll
  function smoothScrollTo(to, duration, easing) {
    const start = window.pageYOffset;
    const change = to - start;
    const increment = 20;
    let currentTime = 0;
  
    const animateScroll = function() {
      currentTime += increment;
      const val = Math.easeInOutQuad(currentTime, start, change, duration);
      window.scrollTo(0, val);
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  }
  
  Math.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
  };
  
  // Export the angelPortfolio object if needed
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = angelPortfolio;
  }