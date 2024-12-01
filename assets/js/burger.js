
function toggleMenu() {
    const logo = document.getElementById('logo');
    const navItems = document.querySelectorAll('.nav_top .search-container, .nav_top .group, .nav_top .nav-link-pages,.basket-count');
    const burgerMenu = document.querySelector('.burger-menu');
    burgerMenu.addEventListener("click", () => {
        navItems.forEach(item => {
            item.classList.toggle('none');
            item.style.display = 'flex';
        });
        logo.classList.toggle('none');
    })
    if (window.innerWidth <= 992) {

        navItems.forEach(item => {
            item.classList.add('none');
        });
        burgerMenu.classList.remove('none');
    } else {

        navItems.forEach(item => {
            item.classList.remove('none');
        });
        burgerMenu.classList.add('none');
    }
}

toggleMenu() ;