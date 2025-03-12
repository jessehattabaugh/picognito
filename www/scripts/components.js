class SiteHeader extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		if (this.shadowRoot) {
			this.render();
		}
	}

	render() {
		if (this.shadowRoot) {
			this.shadowRoot.innerHTML = `
				<style>
					@import url('/styles/all.css');
				</style>
				<header>
					<nav>
						<a href="/index.html" class="active">Home</a>
						<a href="/about.html">About</a>
						<a href="/contact.html">Contact</a>
					</nav>
				</header>
			`;
		}
	}
}

customElements.define('site-header', SiteHeader);

class SiteFooter extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		if (this.shadowRoot) {
			this.render();
		}
	}

	render() {
		if (this.shadowRoot) {
			this.shadowRoot.innerHTML = `
				<style>
					@import url('/styles/all.css');
				</style>
				<footer>
					<nav>
						<a href="/index.html">Home</a>
						<a href="/about.html">About</a>
						<a href="/contact.html">Contact</a>
					</nav>
				</footer>
			`;
		}
	}
}

customElements.define('site-footer', SiteFooter);
