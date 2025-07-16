/**
 * App script
 */
class CallistusPortfolio {
    #baseUrl    = app_vars.url;
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
            let header              = document.querySelector( 'header' );
            let navigationPanel     = header.querySelector( 'nav' );

            if ( isInternalLink ) {
                event.preventDefault();                
                const path = targetLink.getAttribute('href');
                this.navigate( path );
                let clickedOnMenu   = 'li' === event.target.parentElement.tagName.toLowerCase();
                let isMobile        = window.matchMedia( '(max-width: 850px)' ).matches
                if ( isMobile && this.#loaded && clickedOnMenu ) {
                    this.toggleMenu();
                    
                }
                
                return;              
            }

            if ( ! event.target.closest( 'header' )  && navigationPanel.classList.contains( 'vissible' ) ) {
                this.toggleMenu();
            }
        });
        const emailElements     = document.querySelectorAll( '.email-obfuscated' );
        const phoneElements     = document.querySelectorAll( '.phone-obfuscated' );
        const chatBtn           = document.querySelector( '#WhatsAppSendBtn' );
        const userWaMessage     = document.querySelector( '#WhatsAppMessageInput' );
        const contactForm       = document.querySelector( '#contactForm' );
        let menuToggle          = document.querySelector( '#hamburger-toggle' );

        const user              = 'callistus';
        const domain            = 'callismart.com.ng';
        const email             = `${user}@${domain}`;
        const whatsAppnumber    = atob( 'MjM0ODEwNDgxMzIyMQ==' );
        const whatsAppUrl       = 'https://wa.me';
        const blogContainer     = document.getElementById('blogPostsGrid');
        const blogAPI           = 'https://callismart.com.ng/wp-json/wp/v2/posts?per_page=6&_fields=title,date,excerpt,link';
        
        menuToggle.addEventListener( 'click', () => this.toggleMenu() );

        setTimeout(() => {
            emailElements.forEach( emailElement => {            
                emailElement.setAttribute( 'data-email', email );
                emailElement.setAttribute( 'title', email );
                if ( emailElement.classList.contains( 'txt' ) ) {
                    emailElement.innerHTML = email;
                } else if ( emailElement.classList.contains( 'link' ) ) {
                    emailElement.href = `mailto:${email}`;
                } else {
                    emailElement.innerHTML = `<a href="mailto:${email}" rel="nofollow">${email}</a>`;
                }
            });  

            phoneElements.forEach( phoneElement =>{
       
                if ( phoneElement.classList.contains( 'text' ) ) {
                    phoneElement.textContent = `+${whatsAppnumber}`;
                } else if ( phoneElement.classList.contains( 'link' ) ) {
                    phoneElement.href = `tel:+${whatsAppnumber}`;
                }
            });
        
        }, 6000);

        

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

        contactForm.querySelectorAll( 'input, textarea' ).forEach( input => {
            input.addEventListener( 'input', e => {
                if ( e.target.value.trim().length ) {
                    e.target.setCustomValidity( '' );
                }
            });
        });

        contactForm.addEventListener( 'submit', e => {
            e.preventDefault();

            const form = new FormData( contactForm );
            const payLoad = {};
            let isValid = true;

            for ( const [key, value] of form.entries() ) {
                const field = document.querySelector( `#${key}` );
                field.setCustomValidity('');

                if ( ! value.trim() ) {
                    const fieldName = field.getAttribute( 'data-field-name' ) || key;
                    field.setCustomValidity( `${fieldName} is required` );
                    field.reportValidity();
                    isValid = false;
                    break;
                }

                payLoad[key] = value.trim();
            }

            if ( ! isValid || ! contactForm.checkValidity() ) {
                return;
            }

            contactForm.querySelector('button[type="submit"]')?.setAttribute('disabled', 'true');

            let formatedBody = this.formatEmailBody( form.get( 'mail_body' ),
                {
                    clientName: form.get( 'client_name' ),
                    emailTitle: form.get( 'subject' ),
                    clientEmail: form.get( 'client_email' )
                }
            );

            payLoad.mail_body = formatedBody;

            fetch('https://cloud-mailer.callistus-nwachukwu.workers.dev/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payLoad),
            })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    contactForm.innerHTML = `<h3>Something went wrong 😞</h3><p>${data.message || 'Please try again later.'}</p>`;
                    return;
                }

                contactForm.innerHTML = `
                    <h2>Message Sent</h2>
                    <svg xmlns="http://www.w3.org/2000/svg" class="email-envelop" viewBox="0 0 640 512">
                        <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0l57.4-43c23.9-59.8 79.7-103.3 146.3-109.8l13.9-10.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176 0 384c0 35.3 28.7 64 64 64l296.2 0C335.1 417.6 320 378.5 320 336c0-5.6 .3-11.1 .8-16.6l-26.4 19.8zM640 336a144 144 0 1 0 -288 0 144 144 0 1 0 288 0zm-76.7-43.3c6.2 6.2 6.2 16.4 0 22.6l-72 72c-6.2 6.2-16.4 6.2-22.6 0l-40-40c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L480 353.4l60.7-60.7c6.2-6.2 16.4-6.2 22.6 0z"/>
                    </svg>
                `;
            })
            .catch(error => {
                console.error(error);
                contactForm.innerHTML = `<h3>Network error</h3><p>Unable to send your message right now. Please try again later.</p>`;
            });
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
            blogContainer.innerHTML = '';

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
        let currentUrl      = new URL( window.location.href );
        currentUrl.search = '';
        return currentUrl.href;
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
        console.log(path);
        
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

     /**
     * Escapes HTML special characters in a string to prevent XSS.
     * @param {string} str The string to escape.
     * @returns {string} The HTML-escaped string.
     */
    escapeHTML(str) {
        if (typeof str !== 'string') {
            return ''; // Ensure we're working with a string
        }
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /**
     * Formats plain text into a modern HTML email body template with paragraphs.
     * This template is designed for better compatibility across various email clients.
     *
     * @param {string} rawMessage - The user's message (plain text, potentially with newlines).
     * @param {Object} [options] - Optional parameters for the email content.
     * @param {string} [options.clientName='Guest'] - The name of the sender (e.g., from the contact form).
     * @param {string} [options.clientEmail=''] - The email of the sender.
     * @param {string} [options.emailSubject='New Message'] - The subject for the email (used in <title>).
     * @param {string} [options.emailTitle='New Message from Your Portfolio'] - The main title displayed within the email body.
     * @returns {string} The complete HTML formatted email body.
     */
    formatEmailBody(rawMessage, options = {}) {
        const {
            clientName = 'Guest',
            clientEmail = '',
            emailSubject = 'New Message',
            emailTitle = 'New Message from Your Portfolio'
        } = options;

        // Ensure rawMessage is a string
        const messageString = typeof rawMessage === 'string' ? rawMessage : String(rawMessage);

        // Format the message into HTML paragraphs, escaping each line
        const formattedParagraphs = messageString.trim()
            .split(/\r?\n/) // Split by newlines
            .filter(line => line.trim() !== '') // Remove empty lines
            .map(line => `<p style="margin: 0 0 10px 0;">${this.escapeHTML(line.trim())}</p>`) // Wrap each line in a paragraph with inline style
            .join(''); // Join paragraphs without extra newlines

        // Construct the full HTML email body using template literals
        const htmlTemplate = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en-GB">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${this.escapeHTML(emailSubject)}</title>
    <style type="text/css">
        /* Basic Reset */
        body, html { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        p { display: block; margin: 0; padding: 0; }
        a { text-decoration: none; }

        /* Font Stack */
        body { font-family: Arial, sans-serif; }

        /* Responsive Styles */
        @media only screen and (max-width: 600px) {
            .full-width-table { width: 100% !important; }
            .col-half { width: 100% !important; display: block !important; }
            .padding-mobile { padding: 20px !important; }
            .text-center-mobile { text-align: center !important; }
            .hide-on-mobile { display: none !important; width: 0 !important; height: 0 !important; overflow: hidden; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #FFFFFF;">
    <center style="width: 100%; background-color: #FFFFFF;">
        <div style="max-width: 600px; margin: 0 auto;">
            <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
            <tr>
            <td align="center" valign="top" width="600">
            <![endif]-->
            <table class="full-width-table" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%; max-width:600px; background-color:#ffffff; border-radius: 8px; overflow: hidden; margin: 20px auto;">
                <tr>
                    <td class="padding-mobile" style="padding: 40px 30px 40px 30px; text-align: left; font-size: 16px; line-height: 24px; color: #333333;">

                        <!-- Header/Title -->
                        <h1 style="margin: 0 0 20px 0; font-family: Arial, sans-serif; font-size: 28px; line-height: 32px; color: #1a202c; font-weight: bold;">
                            ${this.escapeHTML(emailTitle)}
                        </h1>

                        <!-- Sender Info -->
                        <p style="margin: 0 0 10px 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #555555;">
                            <strong>From:</strong> ${this.escapeHTML(clientName)} (${this.escapeHTML(clientEmail)})
                        </p>

                        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;" />

                        <!-- Message Body -->
                        <p style="margin: 0 0 15px 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
                            You have received a new message from your portfolio contact form:
                        </p>

                        <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; margin-bottom: 20px;">
                            <p style="margin: 0 0 10px 0; font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
                                <strong>Message:</strong>
                            </p>
                            <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333;">
                                ${formattedParagraphs}
                            </div>
                        </div>

                        <!-- Footer -->
                        <p style="margin: 0; font-family: Arial, sans-serif; font-size: 14px; line-height: 20px; color: #777777; text-align: center;">
                            ---<br>
                            This message was sent from your portfolio website.
                        </p>

                    </td>
                </tr>
            </table>
            <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
        </div>
    </center>
</body>
</html>
        `;

        return htmlTemplate;
    }

}
document.addEventListener('DOMContentLoaded', new CallistusPortfolio );