// ==UserScript==
// @name           Makerworld Enhancements
// @description    Enhancements for Makerworld website
// @version        1.0.1
// @icon           https://raw.githubusercontent.com/JMcrafter26/Makerworld-Enhancements/master/assets/icon.png
//
// @author         Cufiy (aka JMcrafter26) <https://cufiy.net>
// @namespace      https://github.com/JMcrafter26
//
// @downloadURL    https://raw.githubusercontent.com/JMcrafter26/Makerworld-Enhancements/master/userscript/makerworld-enhancements.user.js
// @updateURL      https://raw.githubusercontent.com/JMcrafter26/Makerworld-Enhancements/master/userscript/makerworld-enhancements.user.js
//
// @license        AGPL-3.0
// @copyright      Copyright (C) 2025, Cufiy
//
// @match          https://makerworld.com/*
// @match          https://makerworld.com.cn/*
//
// @run-at         document-end
//
// @resource       exampleImage https://www.example.com/example.png
//
// ==/UserScript==

/**
 * Makerworld Enhancements Userscript
 *
 * @see http://wiki.greasespot.net/API_reference
 * @see http://wiki.greasespot.net/Metadata_Block
 */
(function () {

    const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles-icon lucide-sparkles"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>`;

function getDesignCards() {
    return document.querySelectorAll('.js-design-card');
}

    function addButtonToDesignCard(card) {
        // Prevent duplicate buttons
        if (card.querySelector('.enhancement-btn')) {
            return;
        }
        
        // Mark card as processed
        card.setAttribute('data-enhanced', 'true');
        const button = document.createElement('button');
        button.className = 'enhancement-btn';
        button.innerHTML = logoSvg;
        button.style.background = 'transparent';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.position = 'absolute';
        button.style.top = '0px';

        // check if cards first child is a div with a span inside
        const firstChild = card.firstElementChild;
        if (firstChild && firstChild.tagName.toLowerCase() === 'div' && firstChild.querySelector('span')) {
            button.style.left = '32px';
        } else {
            button.style.left = '0px';
        }
        button.style.zIndex = '1000';
        button.title = 'Makerworld Enhancement';
        button.style.width = '32px';
        button.style.height = '32px';
        button.style.padding = '4px';
        button.style.borderRadius = '0 0 3px 0';
        button.style.color = '#b0fd41';
        button.style.backgroundColor = 'rgba(0, 0, 0)';
        card.style.position = 'relative';
        card.appendChild(button);
        addPopover(button, card);
    }

    function addPopover(enhanceBtn, card) {
        console.log('Adding popover to button');
        // new popover for enhancement
        const popover = document.createElement('div');
        popover.classList.add('enhancement-popover', 'MuiPaper-root', 'MuiPaper-elevation', 'MuiPaper-rounded', 'MuiPaper-elevation8', 'MuiPopover-paper', 'MuiMenu-paper', 'MuiMenu-paper', 'mw-css-kqqlx6');
        popover.style.maxHeight = '150px';
        popover.style.width = '200px';
        popover.style.borderRadius = '4px';
        popover.style.boxShadow = 'rgba(0, 0, 0, 0.06) 0px 8px 24px 0px';
        popover.style.padding = '8px';
        popover.style.position = 'absolute';
        popover.style.top = '36px';
        popover.style.left = '0px';
        popover.style.zIndex = '1001';
        popover.style.height = '100%';
        popover.style.maxHeight = '300px';
        
        const optionsList = document.createElement('ul');
        optionsList.style.listStyle = 'none';
        optionsList.style.padding = '0';
        optionsList.style.margin = '0';

        const options = [
            {
                text: 'Search on Printables',
                icon: 'https://unpkg.com/lucide-static@latest/icons/search.svg',
                for: 'card',
                action: () => {
                    const cardName = getCardName(card);
                    if (!cardName) {
                        alert('Could not find design name.');
                        return;
                    }
                    const query = encodeURIComponent(cardName);
                    window.open(`https://www.printables.com/search?q=${query}`, '_blank');
                }
            },
            {
                text: 'Search on Thingiverse',
                icon: 'https://unpkg.com/lucide-static@latest/icons/search.svg',
                for: 'card',
                action: () => {
                    const cardName = getCardName(card);
                    if (!cardName) {
                        alert('Could not find design name.');
                        return;
                    }
                    const query = encodeURIComponent(cardName);
                    window.open(`https://www.thingiverse.com/search?q=${query}`, '_blank');
                }
            },
            {
                text: 'Open in Bambu Studio',
                icon: 'https://unpkg.com/lucide-static@latest/icons/box.svg',
                for: 'card',
                action: () => {
                    const cardUrl = getCardUrl(card);
                    if (!cardUrl) {
                        alert('Could not find design URL.');
                        return;
                    }
                    getModelDetails(cardUrl).then(data => {
                        if (!data) {
                            alert('Could not fetch model details.');
                            return;
                        }
                        const modelId = data.pageProps?.design?.id;
                        if (!modelId) {
                            alert('Could not find model ID.');
                            return;
                        }
                        const bambuUrl = `bambu-studio://import/model/${modelId}`;

                    });
                }
            }
        ];

        options.forEach(option => {
            const listItem = document.createElement('li');
            listItem.style.padding = '8px 0';
            listItem.style.cursor = 'pointer';
            
            listItem.innerHTML = `${option.icon ? `<i style="background-image: url(${option.icon}); display: inline-block; width: 16px; height: 16px; background-size: contain; background-repeat: no-repeat; vertical-align: middle; margin-right: 8px; color: white;"></i>` : ''}${option.text}`;
            listItem.addEventListener('click', () => {
                option.action();
                document.body.removeChild(popover);
            });
            optionsList.appendChild(listItem);
        });
        popover.appendChild(optionsList);
        enhanceBtn.addEventListener('click', (e) => {
            console.log('Enhancement button clicked');
            e.stopPropagation();
            // remove existing popovers
            const existingPopovers = document.querySelectorAll('.enhancement-popover');
            if (existingPopovers.length > 0) {
                existingPopovers.forEach(p => {
                    if (p.parentNode) {
                        p.parentNode.removeChild(p);
                    }
                });
            }
            card.appendChild(popover);
        });
    }

    function getCardName(card) {
        const titleElement = card.querySelector('.design-bottom-row .translated-text a');
        if (titleElement) {
            return titleElement.innerText.trim();
        }
        return false;
    }

    function getCardUrl(card) {
        const linkElement = card.querySelector('.design-bottom-row .translated-text a');
        if (linkElement) {
            return linkElement.href;
        }
        return false;
    }

    function getModelSlug(url) {
        const match = url.match(/\/models\/([\w-]+)/);
        return match ? match[1] : null;
    }

    function getNextJSBuildId() {
        // search on the entire html page for "buildId":"{buildId}" and return the buildId
        const html = document.documentElement.innerHTML;
        const match = html.match(/"buildId":"([\w\d]+)"/);
        return match ? match[1] : null;
    }

    async function getModelDetails(url, modelId = null) {
        // if modelid is not set, get it from url: e.g. https://makerworld.com/de/models/1866618-wheel-loader-kit-card#profileId-1997183 --> 1866618
        if (!modelId) {
            const match = url.match(/\/models\/(\d+)/);
            if (match) {
                modelId = match[1];
            }
        }
        if (!modelId) {
            return null;
        }

        const moduleSlug = getModelSlug(url);
        if (!moduleSlug) {
            return null;
        }

        console.log('Fetching model details for model ID:', modelId);
        console.log('Using module slug:', moduleSlug);

        let fetchUrl = `https://makerworld.com/_next/data/${getNextJSBuildId()}/de/models/${moduleSlug}.json?designId=${moduleSlug}`;
        try {
        const response = await fetch(fetchUrl, {
            "credentials": "include",
            "headers": {
                "User-Agent": window.navigator.userAgent,
                "Accept": "*/*",
                "Accept-Language": "en-US;q=0.7,en;q=0.3",
                "x-nextjs-data": "1",
                "Sec-GPC": "1",
                "Alt-Used": "makerworld.com",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                "Priority": "u=0"
            },
            "referrer": "https://makerworld.com/de",
            "method": "GET",
            "mode": "cors"
        });
        const data = await response.json();
        console.log('Fetched model details:', data);


        return data;
        } catch (error) {
            console.error('Error fetching model details:', error);
            return null;
        }
    }

    function injectCSS() {
        const style = document.createElement('style');
        style.innerHTML = `
        .enhancement-popover {
            position: absolute;
            top: 36px;
            left: 0;
            z-index: 1001;
            width: 200px;
            max-height: 150px;
            padding: 8px;
            background-color: rgb(45, 45, 49);
            border: 0.9px solid rgb(82, 82, 82);
            border-radius: 4px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
            color: rgb(239, 239, 240);
            overflow-y: auto;
            transition: opacity 0.211s cubic-bezier(0.4, 0, 0.2, 1), transform 0.141s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .enhancement-popover ul {
            margin: 0;
            padding: 8px 0;
            list-style: none;
        }
        .enhancement-popover li {
            padding: 8px 0;
            cursor: pointer;
            display: flex;
            align-items: center;
            user-select: none;
        }
        .enhancement-popover li:hover {
            opacity: 0.8;
        }
        `;
        document.head.appendChild(style);
        console.log('Injected custom CSS for enhancement popover.');
    }

    function addMutationObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    // Check the node itself
                    if (node.nodeType === 1) {
                        if (node.classList && node.classList.contains('js-design-card') && !node.hasAttribute('data-enhanced')) {
                            addButtonToDesignCard(node);
                        }
                        // Also check child nodes (for nested structures)
                        const childCards = node.querySelectorAll && node.querySelectorAll('.js-design-card');
                        if (childCards && childCards.length > 0) {
                            childCards.forEach(card => {
                                if (!card.hasAttribute('data-enhanced')) {
                                    addButtonToDesignCard(card);
                                }
                            });
                        }
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function enhanceMakerworld() {
        injectCSS();
        const designCards = getDesignCards();
        designCards.forEach(card => {
            addButtonToDesignCard(card);
        });
        addMutationObserver();
        
        // Single event listener for closing popovers (event delegation)
        document.addEventListener('click', (e) => {
            // Don't close if clicking on enhancement button
            if (e.target.closest('.enhancement-btn')) {
                return;
            }
            const existingPopovers = document.querySelectorAll('.enhancement-popover');
            existingPopovers.forEach(p => {
                if (p.parentNode) {
                    p.parentNode.removeChild(p);
                }
            });
        });
    }

    console.log('Makerworld Enhancements by Cufiy loaded.');
    enhanceMakerworld();
})();