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
  document.getElementById("footer-name").textContent = "بيتزا وكريب " + data.restaurantName;
  document.getElementById("footer-address").textContent = data.address;
  const calls = document.getElementById("call-buttons");
  data.phones.forEach(ph => {
    const a = document.createElement("a");
    a.href = "tel:" + ph; a.textContent = "📞 " + ph; calls.appendChild(a);
  });

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

  const selected = new Map(); // item id -> chosen size index

  function renderItems() {
    const term = searchInput.value.trim().toLocaleLowerCase("ar");
    grid.innerHTML = "";
    let shown = 0;
    data.categories.filter(c => c !== "الكل").forEach(category => {
      if (activeCategory !== "الكل" && activeCategory !== category) return;
      const list = data.items.filter(item => item.category === category &&
        (item.name + " " + item.description).toLocaleLowerCase("ar").includes(term));
      if (!list.length) return;
      shown += list.length;
      const section = document.createElement("section");
      section.className = "menu-section";
      const title = document.createElement("h3");
      title.className = "section-title";
      title.textContent = category;
      const wrap = document.createElement("div");
      wrap.className = "menu-grid";
      list.forEach(item => wrap.appendChild(buildCard(item)));
      section.append(title, wrap);
      grid.appendChild(section);
    });
    emptyState.hidden = shown > 0;
  }

  function buildCard(item) {
    const card = document.createElement("article");
    card.className = "menu-card";
    const name = document.createElement("h4");
    name.textContent = item.name;
    card.appendChild(name);
    if (item.description) {
      const d = document.createElement("p");
      d.className = "item-description";
      d.textContent = item.description;
      card.appendChild(d);
    }
    const price = document.createElement("span");
    price.className = "price";
    const sizeIdx = () => selected.get(item.id) || 0;
    const refresh = () => { price.textContent = money(item.options[sizeIdx()].price); };

    if (item.options.length > 1) {
      const sizes = document.createElement("div");
      sizes.className = "sizes";
      item.options.forEach((opt, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "size-chip" + (i === sizeIdx() ? " active" : "");
        b.innerHTML = opt.label + "<small>" + opt.price.toLocaleString("ar-EG") + "</small>";
        b.addEventListener("click", () => {
          selected.set(item.id, i);
          sizes.querySelectorAll(".size-chip").forEach((c, j) => c.classList.toggle("active", j === i));
          refresh();
        });
        sizes.appendChild(b);
      });
      card.appendChild(sizes);
    }

    const bottom = document.createElement("div");
    bottom.className = "item-bottom";
    const add = document.createElement("button");
    add.className = "add-button";
    add.type = "button";
    add.textContent = "+ أضف";
    add.addEventListener("click", () => {
      const key = item.id + "|" + sizeIdx();
      cart.set(key, (cart.get(key) || 0) + 1);
      updateCart();
      add.textContent = "اتضاف ✓";
      setTimeout(() => { add.textContent = "+ أضف"; }, 900);
    });
    refresh();
    bottom.append(price, add);
    card.appendChild(bottom);
    return card;
  }

  function lineInfo(key) {
    const [id, idx] = key.split("|");
    const item = data.items.find(e => e.id === Number(id));
    const opt = item && item.options[Number(idx)];
    return item ? { item, opt, label: item.name + (opt.label ? " (" + opt.label + ")" : "") } : null;
  }

  function updateCart() {
    let count = 0, total = 0;
    cart.forEach((quantity, key) => {
      const l = lineInfo(key);
      if (l) { count += quantity; total += l.opt.price * quantity; }
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
    cart.forEach((quantity, key) => {
      const l = lineInfo(key);
      if (l) {
        lines.push("• " + l.label + " × " + quantity + " = " + money(l.opt.price * quantity));
        total += l.opt.price * quantity;
      }
    });
    lines.push("", "الإجمالي: " + money(total), "", "الاسم: ", "\nرقم الهاتف: ", "\nالعنوان: ");
    const url = "https://wa.me/" + number + "?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener");
  });

  searchInput.addEventListener("input", renderItems);
  renderCategories();
  renderItems();
})();
