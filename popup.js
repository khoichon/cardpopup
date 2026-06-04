(() => {
    const CDN_ROOT =
        "https://cdn.jsdelivr.net/gh/khoichon/cardpopup";

    const DEFAULTS = {
        angle: -8,
        openSound: `${CDN_ROOT}/sounds/open.ogg`,
        closeSound: `${CDN_ROOT}/sounds/close.ogg`,
        closeOnOverlay: true,
    };

    function ensureStyles() {
        if (document.getElementById("card-popup-styles"))
            return;

        const style = document.createElement("style");

        style.id = "card-popup-styles";

        style.textContent = `
            .card-popup-overlay {
                position: fixed;
                inset: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                background: rgba(0,0,0,.45);
                z-index: 999999;
            }

            .card-popup-modal {
                transform-origin: center center;
            }

            .card-popup-enter {
                animation: cardPopupEnter 1.5s cubic-bezier(.2,1,.3,1) forwards;
            }

            .card-popup-exit {
                animation: cardPopupExit 1.3s ease-in forwards;
            }

            @keyframes cardPopupEnter {
                0% {
                    transform:
                        translateY(-150vh)
                        rotate(-50deg)
                        scale(.8);
                    opacity: 0;
                }

                75% {
                    transform:
                        translateY(10px)
                        rotate(-4deg)
                        scale(1.03);
                }

                100% {
                    transform:
                        translateY(0)
                        rotate(var(--card-angle, -8deg))
                        scale(1);
                    opacity: 1;
                }
            }

            @keyframes cardPopupExit {
                0% {
                    transform:
                        translateY(0)
                        rotate(var(--card-angle, -8deg))
                        scale(1);
                    opacity: 1;
                }

                100% {
                    transform:
                        translateY(150vh)
                        rotate(45deg)
                        scale(.8);
                    opacity: 0;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function playSound(src) {
        const audio = new Audio(src);

        audio.volume = 0.7;

        audio.play().catch(() => {});
    }

    window.openCard = function(content, options = {}) {
        ensureStyles();

        const config = {
            ...DEFAULTS,
            ...options
        };

        const overlay = document.createElement("div");
        overlay.className = "card-popup-overlay";

        const modal = document.createElement("div");
        modal.className =
            "card-popup-modal card-popup-enter";

        modal.style.setProperty(
            "--card-angle",
            `${config.angle}deg`
        );

        if (content instanceof HTMLElement) {
            modal.appendChild(content);
        } else {
            modal.innerHTML = content;
        }

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        playSound(config.openSound);

        function close() {
            if (modal.classList.contains("card-popup-exit"))
                return;

            playSound(config.closeSound);

            modal.classList.remove("card-popup-enter");
            modal.classList.add("card-popup-exit");

            modal.addEventListener("animationend", () => {
                overlay.remove();
            }, { once: true });
        }

        if (config.closeOnOverlay) {
            overlay.addEventListener("click", e => {
                if (e.target === overlay)
                    close();
            });
        }

        return {
            element: modal,
            overlay,
            close
        };
    };
})();