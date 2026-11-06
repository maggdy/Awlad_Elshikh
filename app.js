(() => {
  const data = window.MENU_DATA;
  const grid = document.getElementById("menu-grid");
  const categoryList = document.getElementById("category-list");
  const searchInput = document.getElementById("search-input");
  const emptyState = document.getElementById("empty-state");
  const cartBar = document.getElementById("cart-bar");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");
  const checkoutButton = document.getElementById("checkout-button");

  let activeCategory = "الكل";
  const cart = new Map();

  document.title = data.restaurantName + " | المنيو";
  document.getElementById("restaurant-name").textContent = data.restaurantName;
  document.getElementById("restaurant-tagline").textContent = data.tagline;
  document.getElementById("footer-name").textContent = data.restaurantName;

  function money(value) {
    return Number(value).toLocaleString("ar-EG") + " " + data.currency;
  }

  function renderCategories() {
    categoryList.innerHTML = "";
    data.categories.forEach(category => {
      const button = document.createElement("button");
      button.className = "category-button" + (category === activeCategory ? " active" : "");
      button.textContent = category;
      button.type = "button";
      button.addEventListener("click", () => {
        activeCategory = category;
        renderCategories();
        renderItems();
      });
      categoryList.appendChild(button);
    });
  }

  function renderItems() {
    const term = searchInput.value.trim().toLocaleLowerCase("ar");
    const filtered = data.items.filter(item => {
      const categoryMatch = activeCategory === "الكل" ||
        item.category === activeCategory ||
        (activeCategory === "الأكثر طلبًا" && item.category === "الأكثر طلبًا");
      const textMatch = (item.name + " " + item.description).toLocaleLowerCase("ar").includes(term);
      return categoryMatch && textMatch;
    });

    grid.innerHTML = "";
    emptyState.hidden = filtered.length > 0;

    filtered.forEach(item => {
      const card = document.createElement("article");
      card.className = "menu-card";

      const imageWrap = document.createElement("div");
      imageWrap.className = "item-image-wrap";
      const image = document.createElement("img");
      image.className = "item-image";
      image.src = item.image;
      image.alt = item.name;
      image.loading = "lazy";
      image.onerror = () => { image.style.display = "none"; };
      imageWrap.appendChild(image);

      const content = document.createElement("div");
      content.className = "item-content";
      const name = document.createElement("h3");
      name.textContent = item.name;
      const description = document.createElement("p");
      description.className = "item-description";
      description.textContent = item.description || "";
      const bottom = document.createElement("div");
      bottom.className = "item-bottom";
      const price = document.createElement("span");
      price.className = "price";
      price.textContent = money(item.price);
      const add = document.createElement("button");
      add.className = "add-button";
      add.type = "button";
      add.textContent = cart.has(item.id) ? "أضف كمان +" : "+ أضف";
      add.addEventListener("click", () => {
        cart.set(item.id, (cart.get(item.id) || 0) + 1);
        updateCart();
        add.textContent = "اتضاف ✓";
        setTimeout(() => { add.textContent = "أضف كمان +"; }, 900);
      });
      bottom.append(price, add);
      content.append(name, description, bottom);
      card.append(imageWrap, content);
      grid.appendChild(card);
    });
  }

  function updateCart() {
    let count = 0, total = 0;
    cart.forEach((quantity, id) => {
      const item = data.items.find(entry => entry.id === id);
      if (item) { count += quantity; total += item.price * quantity; }
    });
    cartCount.textContent = count.toLocaleString("ar-EG");
    cartTotal.textContent = money(total);
    cartBar.hidden = count === 0;
  }

  checkoutButton.addEventListener("click", () => {
    const number = String(data.whatsappNumber || "").replace(/\D/g, "");
    if (!number || number.includes("X") || number.length < 10) {
      alert("أضف رقم واتساب المطعم أولاً في ملف menu-data.js");
      return;
    }
    const lines = ["السلام عليكم، عايز أطلب من " + data.restaurantName + ":", ""];
    let total = 0;
    cart.forEach((quantity, id) => {
      const item = data.items.find(entry => entry.id === id);
      if (item) {
        lines.push("• " + item.name + " × " + quantity + " = " + money(item.price * quantity));
        total += item.price * quantity;
      }
    });
    lines.push("", "الإجمالي: " + money(total), "", "الاسم:"  ,"رقم الهاتف:" , "العنوان:");
    const url = "https://wa.me/" + number + "?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener");
  });

  searchInput.addEventListener("input", renderItems);
  renderCategories();
  renderItems();
})();
