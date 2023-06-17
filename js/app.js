// Define Global Variables
const sections = document.querySelectorAll('section');
const menu = document.getElementById("navbar__list");
const topButton = document.getElementById('top-button');
let hide;

// Build the navigation menu
function buildNav() {
    const fragment = document.createDocumentFragment();
    for (const section of sections) {
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = `#${section.id}`;
      anchor.className = "menu__link";
      anchor.setAttribute('data-id', section.id);
      anchor.textContent = section.getAttribute('data-nav');
      li.appendChild(anchor);
      fragment.appendChild(li);
    }
    menu.appendChild(fragment);
  }
// Helper function to get the visible height of a section in the viewport
function getVisibleHeight(element) {
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const box = element.getBoundingClientRect();
    const top = Math.min(Math.max(box.top, 0), windowHeight);
    const bottom = Math.min(Math.max(box.bottom, 0), windowHeight);
    return bottom - top;
  }
  
  // Add class 'active' to section when near top of viewport
  function scrollHandler() {
    // Make the navbar visible
    menu.classList.remove('hidden');
  
    let maxVisibleHeight = 0;
    let activeSection = sections[0];
  
    for (const section of sections) {
      const height = getVisibleHeight(section);
      if (height > maxVisibleHeight) {
        maxVisibleHeight = height;
        activeSection = section;
      } else if (height < maxVisibleHeight) {
        break; // All subsequent sections will have less height, so break the loop
      }
    }
  
    for (const section of sections) {
      const sectionVisibleHeight = getVisibleHeight(section);
      const link = document.querySelector(`a[data-id="${section.id}"]`);
      const isActive = sectionVisibleHeight === maxVisibleHeight;
      section.classList.toggle('your-active-class', isActive);
      link.classList.toggle('selected', isActive);
    }
  
    // Hide navigation bar when not scrolling
    clearTimeout(hide);
    hide = setTimeout(() => {
      menu.classList.add("hidden");
    }, 3000);
  
    // Show top button when the window is not at the top
    topButton.classList.toggle('show', (document.documentElement.scrollTop > 300));
  }
  
  // Scroll to section on link click
  function scrollToSection(evt) {
    const link = evt.target;
    if (link.nodeName !== 'A') return;
  
    evt.preventDefault();
    const element = document.getElementById(link.getAttribute('data-id'));
    const offsetTop = element.offsetTop;
    const duration = 1000; // Adjust the duration as desired
    const startingY = window.pageYOffset;
    const diff = offsetTop - startingY;
    let start;
  
    function step(timestamp) {
      if (!start) start = timestamp;
      const time = timestamp - start;
      const percentage = Math.min(time / duration, 1);
      window.scrollTo(0, startingY + diff * percentage);
  
      if (time < duration) {
        window.requestAnimationFrame(step);
      }
    }
  
    window.requestAnimationFrame(step);
  }
  
// Build the navigation menu
buildNav();

// Add event listeners
menu.addEventListener('click', scrollToSection);
window.addEventListener("scroll", scrollHandler);
