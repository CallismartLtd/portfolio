/**
 * App script
 */
class CallistusPortfolio {
    #baseUrl    = app_vars.url;
    #currentUrl = window.location.href;
    #loaded     = false;

    /**
     * Defines the routes for the Single Page Application.
     * Each route maps a URL path to the ID of the corresponding HTML section
     * and the document title.
     */
    routes = {
        '': {
            sectionId: 'home',
            title: 'Callistus Nwachukwu – Full Stack Developer'
        },
        'resume': {
            sectionId: 'resume',
            title: 'Resume – Callistus Nwachukwu'
        },
        'contact': {
            sectionId: 'contact',
            title: 'Contact - Callistus Nwachukwu'
        },
        'about': {
            sectionId: 'about',
            title: 'About - Callistus Nwachukwu'
        },
        'projects': {
            sectionId: 'projects',
            title: 'Projects - Callistus Nwachukwu'
        },
        'blogs': {
            sectionId: 'blogs',
            title: 'Blogs - Callistus Nwachukwu'
        },
        '404': {
            sectionId: 'not-found',
            title: '404 Not Found - Callistus Nwachukwu'
        }
    };

    constructor() {
        document.body.addEventListener( 'click', ( event ) => {
            const targetLink        = event.target.closest('[data-link]');
            const isInternalLink    = targetLink && targetLink.hostname === window.location.hostname;

            if ( isInternalLink ) {
                event.preventDefault();                
                const path = targetLink.getAttribute('href');
                this.navigate( path );
                let clickedOnMenu   = 'li' === event.target.parentElement.tagName.toLowerCase();
                let isMobile        = window.matchMedia( '(max-width: 850px)' ).matches
                if ( isMobile && this.#loaded && clickedOnMenu ) {
                    this.toggleMenu();
                }                
            }
        });
        const emailElements     = document.querySelectorAll( '.email-obfuscated' );
        const chatBtn           = document.querySelector( '#WhatsAppSendBtn' );
        const userWaMessage     = document.querySelector( '#WhatsAppMessageInput' );
        const contactForm       = document.querySelector( '#contactForm' );
        let menuToggle          = document.querySelector( '#hamburger-toggle' );

        const user              = 'callistus';
        const domain            = 'callismart.com.ng';
        const email             = `${user}@${domain}`;
        const whatsAppnumber    = '2348104813221';
        const whatsAppUrl       = 'https://wa.me';
        const blogContainer     = document.getElementById('blogPostsGrid');
        const blogAPI           = 'https://callismart.com.ng/wp-json/wp/v2/posts?per_page=6&_fields=title,date,excerpt,link';
        
        menuToggle.addEventListener( 'click', () => this.toggleMenu() );

        emailElements.forEach( emailElement => {
            emailElement.setAttribute('data-email', email);
            emailElement.setAttribute('title', email);

            setTimeout(() => {
                if ( emailElement.classList.contains( 'txt' ) ) {
                    emailElement.innerHTML = email;
                } else {
                    emailElement.innerHTML = `<a href="mailto:${email}" rel="nofollow">${email}</a>`;
                }
                
            }, 6000);
        });

        chatBtn.addEventListener( 'click', () =>{
            let link    = new URL( `${ whatsAppUrl}/${whatsAppnumber}` );
            if ( userWaMessage.value.trim().length ) {
                link.searchParams.set( 'text', userWaMessage.value.trim() );
            }
            
            let aTag = document.createElement( 'a' );
            aTag.href = link.toString();
            aTag.target = '_blank';
            document.body.appendChild( aTag );
            aTag.click();
            aTag.remove();
        });

        contactForm.addEventListener( 'submit', e =>{
            e.preventDefault();

        });

        const progressValues = {
            'php': 90,
            'javascript': 85,
            'mysql': 80,
            'htmlcss': 90,
            'wordpress': 95,
            'woocommerce': 90
        };

        Object.entries(progressValues).forEach(([key, value]) => {
            const el = document.querySelector(`.progress.${key}`);
            if (el) {
                el.style.width = value + '%';
                el.setAttribute('data-progress', value + '%'); // This enables the ::after
            }
        });
            
        fetch(blogAPI)
        .then(response => response.json())
        .then(posts => {
            blogContainer.innerHTML = ''; // Clear skeletons

            posts.forEach(post => {
                const div = document.createElement('div');
                div.className = 'blog-post-item';

                const date = new Date(post.date).toDateString();
                const title = post.title.rendered;
                const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').trim();

                div.innerHTML = `
                    <h3>${title}</h3>
                    <em>Date: ${date}</em>
                    <p>${excerpt}</p>
                    <a href="${post.link}" class="button nav-button" data-link target="_blank">Read More</a>
                `;

                blogContainer.appendChild(div);
            });
        })
        .catch(err => {
            let div = document.createElement( 'div' );
            div.className = 'blog-post-item';
            div.innerHTML = `
                <h3>[Server Error]</h3>
                <em>Unable to fetch blog posts</em>
                <p>${err}</p>
            `;
            blogContainer.innerHTML = '';

            blogContainer.appendChild(div);
            console.error('Blog fetch error:', err);
        });

        this.handleLocation();
        window.addEventListener( 'popstate', () => this.handleLocation() );
        this.#loaded = true;
    }

    /**
     * Open and close the mobile menu.
     * @param {Event} e Event object
     */
    toggleMenu () {
        let menuToggle  = document.querySelector( '#hamburger-toggle' );
        const icon      = menuToggle.querySelector( 'i.fas' );
        const menuNav   = document.querySelector( 'nav' );
        
        if ( icon.classList.contains( 'fa-bars' ) ) {
            icon.classList.replace( 'fa-bars', 'fa-x');
        } else if ( icon.classList.contains( 'fa-x' ) ) {
            icon.classList.replace( 'fa-x', 'fa-bars')
        }
 
        menuNav.classList.toggle( 'vissible' );            
    }

    getBaseURl() {
        return this.#baseUrl;
    }

    getCurrentUrl() {
        let currentUrl      = window.location.href;
        if ( this.#currentUrl !== currentUrl ) {
            this.#currentUrl    = currentUrl;
        }

        return this.#currentUrl;
    }
    
    getQueriedPath() {        
        if ( ! this.getCurrentUrl().startsWith( this.getBaseURl() ) ) {
            return '';
        }

        let startIndex = this.getBaseURl().length;
        return this.getCurrentUrl().substring( startIndex );
    }

    /**
     * Navigates to a new URL without a full page reload.
     * This function uses the History API's pushState method.
     * @param {string} path The new URL path to navigate to.
     */
    navigate ( path ) {
        history.pushState({}, '', app_vars.url + path.replace( '/', '' ) );
        this.handleLocation();
    };

    /**
     * Handles the routing logic:
     * 1. Gets the current path from the URL.
     * 2. Determines the target section ID.
     * 3. Hides all page content sections.
     * 4. Shows the matched section.
     * 5. Updates the document title.
     */
    handleLocation () {
        let path        = this.getQueriedPath().replace( '/', '' );
        let routeConfig = this.routes[path] ?? '';
        if ( ! routeConfig ) {
            routeConfig = this.routes['404'];
        }
        const pageSections = document.querySelectorAll( '.page-content' );

        pageSections.forEach(section => {
            section.classList.add( 'hidden' );
            
        });

        const targetSection = document.getElementById( routeConfig.sectionId );

        if ( targetSection ) {
            targetSection.classList.remove( 'hidden' );
        
        }

        document.title = routeConfig.title;
        const navButtons = document.querySelectorAll( '.app-nav-list li' );

        navButtons.forEach( button => {
            let link = button.querySelector( 'a' );
            if ( link.getAttribute('href') === path ) {
                button.classList.add( 'active' );
            } else {
                button.classList.remove( 'active' );
            }
        });
    };

}
document.addEventListener('DOMContentLoaded', new CallistusPortfolio );
