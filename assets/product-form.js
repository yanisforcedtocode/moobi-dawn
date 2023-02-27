// this.cart has prototype/ inheritance methods: (1) getSectionsToRender and (2) renderContents
// Utilize those to update the cartpopup outside of the vanilla theme
// Possibility to add an interface to onSubmitHandler for conversion tracking

class ProductForm extends HTMLElement {
  constructor() {
    super();

    this.form = this.querySelector("form");
    this.form.querySelector("[name=id]").disabled = false;
    this.form.addEventListener("submit", this.onSubmitHandler.bind(this));
    this.cart =
      document.querySelector("cart-notification") ||
      document.querySelector("cart-drawer");
    this.submitButton = this.querySelector('[type="submit"]');
    if (document.querySelector("cart-drawer"))
      this.submitButton.setAttribute("aria-haspopup", "dialog");
  }

  onSubmitHandler(evt) {
    if(evt && evt !== undefined){
      evt.preventDefault()
    }
    if (this.submitButton.getAttribute("aria-disabled") === "true") return;

    this.handleErrorMessage();

    this.submitButton.setAttribute("aria-disabled", true);
    this.submitButton.classList.add("loading");
    this.querySelector(".loading-overlay__spinner").classList.remove(
      "hidden"
    );

    const config = fetchConfig("javascript");
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    delete config.headers["Content-Type"];

    const formData = new FormData(this.form);
    if (this.cart) {
      formData.append(
        "sections",
        this.cart.getSectionsToRender().map((section) => section.id)
      );
      formData.append("sections_url", window.location.pathname);
      this.cart.setActiveElement(document.activeElement);
    }
    config.body = formData;

    fetch(`${routes.cart_add_url}`, config)
      .then((response) => response.json())
      .then((response)=>{this.responseHandler.apply(this, [response])})
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        this.onSubmitFinallyHandler.apply(this);
      });
  }

  responseHandler = (response) => {
    if (response.status) {
      this.handleErrorMessage(response.description);

      const soldOutMessage =
        this.submitButton.querySelector(".sold-out-message");
      if (!soldOutMessage) return;
      this.submitButton.setAttribute("aria-disabled", true);
      this.submitButton.querySelector("span").classList.add("hidden");
      soldOutMessage.classList.remove("hidden");
      this.error = true;
      return;
    } else if (!this.cart) {
      window.location = window.routes.cart_url;
      return;
    }

    this.error = false;
    const quickAddModal = this.closest("quick-add-modal");
    if (quickAddModal) {
      document.body.addEventListener(
        "modalClosed",
        () => {
          setTimeout(() => {
            this.cart.renderContents(response);
          });
        },
        { once: true }
      );
      quickAddModal.hide(true);
    } else {
      this.cart.renderContents(response);
    }
  }

  onSubmitFinallyHandler() {
    this.submitButton.classList.remove("loading");
    if (this.cart && this.cart.classList.contains("is-empty"))
      this.cart.classList.remove("is-empty");
    if (!this.error) this.submitButton.removeAttribute("aria-disabled");
    this.querySelector(".loading-overlay__spinner").classList.add("hidden");
  }

  handleErrorMessage(errorMessage = false) {
    this.errorMessageWrapper =
      this.errorMessageWrapper ||
      this.querySelector(".product-form__error-message-wrapper");
    if (!this.errorMessageWrapper) return;
    this.errorMessage =
      this.errorMessage ||
      this.errorMessageWrapper.querySelector(
        ".product-form__error-message"
      );

    this.errorMessageWrapper.toggleAttribute("hidden", !errorMessage);

    if (errorMessage) {
      this.errorMessage.textContent = errorMessage;
    }
  }
}

const cartPageAddButtonFinallyExtHandler = (_this) => {
  const button = _this.submitButton;
  if (button) {
      _this.submitButton.disabled = true;
      _this.submitButton.innerText = "added to cart";
      if(window.location.pathname.includes('/cart')){
        window.location.reload()
      }
  }
};
externalTriggerInterface.addToCartFinally = cartPageAddButtonFinallyExtHandler

class productFormExternal extends ProductForm {
  constructor() {
    super();
    if(externalTriggerInterface){
      this.wrapOnResponseHandler(externalTriggerInterface.addToCartResponse);
      this.wrapOnSubmitFinallyHandler(externalTriggerInterface.addToCartFinally)
    }
  }

  wrapOnSubmitFinallyHandler(fn) {
    const handlerCopy = this.onSubmitFinallyHandler
    const wrapperFn = () => {
      handlerCopy.apply(this);
      fn(this);
    };
    this.onSubmitFinallyHandler = wrapperFn
  }

  wrapOnResponseHandler(fn) {
    const handlerCopy = this.responseHandler
    const wrapperFn = (response) => {
      handlerCopy.apply(this, [response]);
      fn(response)
    };
    this.responseHandler = wrapperFn;
  }
}

if (!customElements.get('product-form')) {
  customElements.define(
    "product-form",ProductForm
  );
}

if (!customElements.get("product-form-external")) {
  customElements.define(
    "product-form-external",productFormExternal
  );
}