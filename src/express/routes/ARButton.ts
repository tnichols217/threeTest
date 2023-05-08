class ARButton {
    public inAR = false;
    public XRsession;
    public sessionInit;
    public button;
    public domEl;
    public currentSession;

    public ARButton(renderer, domEl) {
        this.button = document.createElement('button');
        this.domEl = domEl;
        domEl.appendChild(this.button)

        this.button.style.display = '';

        this.button.style.cursor = 'pointer';
        this.button.style.left = 'calc(50% - 50px)';
        this.button.style.width = '100px';

        this.button.textContent = 'START AR';

        if (navigator.xr != null) {
            this.XRsession = navigator.xr;

            this.button.id = 'ARButton';
            this.button.style.display = 'none';

            this.stylizeElement(this.button);

            navigator.xr.isSessionSupported('immersive-ar').then((supported) => {

                supported ? this.showStartAR() : this.showARNotSupported();

            }).catch(this.showARNotAllowed);

        } else {

            const message = document.createElement('a');

            if (window.isSecureContext === false) {

                message.href = document.location.href.replace(/^http:/, 'https:');
                message.innerHTML = 'WEBXR NEEDS HTTPS'; // TODO Improve message

            } else {

                message.href = 'https://immersiveweb.dev/';
                message.innerHTML = 'WEBXR NOT AVAILABLE';

            }

            message.style.left = 'calc(50% - 90px)';
            message.style.width = '180px';
            message.style.textDecoration = 'none';

            this.stylizeElement(message);
        }

        this.button.onmouseenter = function () {

            this.button.style.opacity = '1.0';

        };

        this.button.onmouseleave = function () {

            this.button.style.opacity = '0.5';

        };

        this.button.onclick = function () {

            if (this.currentSession === null) {

                this.XRsession.requestSession('immersive-ar', this.sessionInit).then(this.onSessionStarted);
                this.inAR = true;

            } else {

                this.currentSession.end();
                this.inAR = false;
            }

        };
    }

    showStartAR( /*device*/) {

        if (this.sessionInit.domOverlay === undefined) {

            const overlay = document.createElement('div');
            overlay.style.display = 'none';
            document.body.appendChild(overlay);

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', "38");
            svg.setAttribute('height', "38");
            svg.style.position = 'absolute';
            svg.style.right = '20px';
            svg.style.top = '20px';
            svg.addEventListener('click', () => {

                this.currentSession.end();
                this.inAR = false;

            });
            overlay.appendChild(svg);

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M 12,12 L 28,28 M 28,12 12,28');
            path.setAttribute('stroke', '#fff');
            path.setAttribute('stroke-width', "2");
            svg.appendChild(path);

            if (this.sessionInit.optionalFeatures === undefined) {

                this.sessionInit.optionalFeatures = [];

            }

            this.sessionInit.optionalFeatures.push('dom-overlay');
            this.sessionInit.domOverlay = { root: overlay };

        }

        async function onSessionStarted(session) {

            session.addEventListener('end', onSessionEnded);

            this.renderer.xr.setReferenceSpaceType('local');

            await this.renderer.xr.setSession(session);

            this.button.textContent = 'STOP AR';
            this.sessionInit.domOverlay.root.style.display = '';

            this.currentSession = session;
            this.inAR = true;

        }

        function onSessionEnded( /*event*/) {

            this.currentSession.removeEventListener('end', onSessionEnded);

            this.button.textContent = 'START AR';
            this.sessionInit.domOverlay.root.style.display = 'none';

            this.currentSession = null;
            this.inAR = false;

        }
    }

    disableButton() {

        this.button.style.display = '';

        this.button.style.cursor = 'auto';
        this.button.style.left = 'calc(50% - 75px)';
        this.button.style.width = '150px';

        this.button.onmouseenter = null;
        this.button.onmouseleave = null;

        this.button.onclick = null;

    }

    showARNotSupported() {

        this.disableButton();

        this.button.textContent = 'AR NOT SUPPORTED';

    }

    showARNotAllowed(exception) {

        this.disableButton();

        console.warn('Exception when trying to call xr.isSessionSupported', exception);

        this.button.textContent = 'AR NOT ALLOWED';

    }

    stylizeElement(element) {

        element.style.position = 'absolute';
        element.style.bottom = '20px';
        element.style.padding = '12px 6px';
        element.style.border = '1px solid #fff';
        element.style.borderRadius = '4px';
        element.style.background = 'rgba(0,0,0,0.1)';
        element.style.color = '#fff';
        element.style.font = 'normal 13px sans-serif';
        element.style.textAlign = 'center';
        element.style.opacity = '0.5';
        element.style.outline = 'none';
        element.style.zIndex = '999';

    }

}

export { ARButton };
