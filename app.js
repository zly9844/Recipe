const icon = {
  menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  search: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/></svg>',
  clock: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  leaf: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 4 13c0-6 8-9 16-9 0 8-3 16-9 16Z"/><path d="M4 13c4 0 8-1 12-5"/></svg>',
  fire: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A3.5 3.5 0 0 0 12 20a5 5 0 0 0 5-5c0-3-2-5-4-7 .2 2-1 3.2-2.2 4.3C9.6 13.3 8.8 13.8 8.5 14.5Z"/><path d="M12 3C8 7 6 10 6 14a6 6 0 0 0 12 0c0-3-1.5-5.5-4-8"/></svg>',
  users: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg>',
  heart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
  heartFill: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
  grid: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  list: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/></svg>',
  plus: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
  compass: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="m15 9-2 6-4 2 2-6 4-2Z"/></svg>',
  utensils: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 3v8M8 3v8M6 3v18"/><path d="M18 3c-2 2-3 4-3 7v2h4v9"/></svg>',
  bookmark: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12v18l-6-4-6 4V3Z"/></svg>',
  back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
  camera: '<svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M14 4h-4L8 7H4v13h16V7h-4l-2-3Z"/><circle cx="12" cy="13" r="4"/></svg>',
  trash: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15"/></svg>',
  shield: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>'
};

const fallbackImages = {
  upload: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=70",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
};

const app = document.querySelector("#app");
const authStorageKey = "culinary-journal-token";
const draftPrefix = "culinary-journal-draft";
const selectedStorageKey = "culinary-journal-selected";
let authToken = localStorage.getItem(authStorageKey) || "";

const api = {
  authHeaders() {
    return authToken ? { Authorization: `Bearer ${authToken}` } : {};
  },
  async me() {
    const response = await fetch("/api/auth/me", { headers: this.authHeaders() });
    if (!response.ok) throw new Error("请先登录");
    return response.json();
  },
  async login(email, password) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "登录失败");
    return payload;
  },
  async register(name, email, password) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "注册失败");
    return payload;
  },
  async logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: this.authHeaders()
    });
  },
  async list() {
    const response = await fetch("/api/recipes", { headers: this.authHeaders() });
    if (response.status === 401) throw new Error("请先登录");
    if (!response.ok) throw new Error("读取菜谱失败");
    return response.json();
  },
  async save(recipe) {
    const response = await fetch(recipe.id ? `/api/recipes/${recipe.id}` : "/api/recipes", {
      method: recipe.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", ...this.authHeaders() },
      body: JSON.stringify(recipe)
    });
    if (response.status === 401) throw new Error("请先登录");
    if (!response.ok) throw new Error("保存菜谱失败");
    return response.json();
  },
  async remove(id) {
    const response = await fetch(`/api/recipes/${id}`, { method: "DELETE", headers: this.authHeaders() });
    if (response.status === 401) throw new Error("请先登录");
    if (!response.ok) throw new Error("删除菜谱失败");
  },
  async uploadImage(dataUrl) {
    const response = await fetch("/api/uploads", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...this.authHeaders() },
      body: JSON.stringify({ dataUrl })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "图片上传失败");
    return payload;
  },
  async publicRecipes() {
    const response = await fetch("/api/recipes/public", { headers: this.authHeaders() });
    if (!response.ok) throw new Error("读取公共菜谱失败");
    return response.json();
  },
  async importRecipe(id) {
    const response = await fetch(`/api/recipes/import/${id}`, {
      method: "POST",
      headers: this.authHeaders()
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "添加菜谱失败");
    return payload;
  }
};

let state = {
  authMode: "login",
  currentUser: null,
  route: "home",
  activeId: "",
  editingId: null,
  lightboxImage: null,
  selectedCategory: "凉菜",
  selectedRecipeIds: [],
  publicRecipes: [],
  query: "",
  toast: "",
  loading: true,
  error: ""
};

let recipes = [];
let delegatedClicksBound = false;

init();

async function init() {
  bindEvents();
  if (!authToken) {
    state.loading = false;
    state.route = "auth";
    render();
    return;
  }
  try {
    const payload = await api.me();
    state.currentUser = payload.user;
    state.selectedRecipeIds = loadSelectedRecipeIds();
  } catch {
    authToken = "";
    localStorage.removeItem(authStorageKey);
    state.loading = false;
    state.route = "auth";
    render();
    return;
  }
  await refreshRecipes();
}

async function refreshRecipes() {
  state.loading = true;
  render();
  try {
    recipes = await api.list();
    state.publicRecipes = await api.publicRecipes().catch(() => []);
    state.selectedRecipeIds = state.selectedRecipeIds.filter((id) => recipes.some((recipe) => recipe.id === id));
    saveSelectedRecipeIds();
    state.activeId ||= recipes[0]?.id || "";
    state.error = "";
  } catch (error) {
    if (String(error.message).includes("登录")) {
      state.route = "auth";
      state.error = "";
    } else {
      state.error = "后端服务暂时不可用，请确认 Node 服务已启动。";
    }
  } finally {
    state.loading = false;
    render();
  }
}

function render() {
  const views = {
    auth: renderAuth,
    home: renderHome,
    detail: renderDetail,
    edit: renderEdit,
    saved: renderSaved,
    explore: renderExplore,
    admin: renderAdmin,
    account: renderAccount
  };

  if (state.route === "auth") {
    app.innerHTML = renderAuth() + lightboxHtml();
    return;
  }

  if (state.loading) {
    app.innerHTML = `${topbar()}<section class="content"><div class="empty-state">正在加载菜谱...</div></section>${tabs("recipes")}${lightboxHtml()}`;
    return;
  }

  if (state.error) {
    app.innerHTML = `${topbar()}<section class="content"><div class="empty-state">${state.error}<br><br><button class="primary-button" data-action="reload">重新加载</button></div></section>${lightboxHtml()}`;
    return;
  }

  app.innerHTML = views[state.route]() + lightboxHtml();
}

function topbar({ back = false, title = "私房菜谱", avatar = true } = {}) {
  return `
    <header class="topbar">
      <button class="icon-button" data-action="${back ? "home" : "admin"}" aria-label="${back ? "返回" : "后台管理"}">${back ? icon.back : icon.menu}</button>
      <h1 class="brand">${title}</h1>
      ${avatar ? `<button class="avatar user-chip-button" data-action="account" aria-label="账号">${escapeHtml(userInitial())}</button>` : `<button class="icon-button" data-action="edit-new" aria-label="新建菜谱">${icon.plus}</button>`}
    </header>
  `;
}

function renderAuth() {
  const isRegister = state.authMode === "register";
  return `
    <section class="auth-page">
      <div class="auth-card">
        <div class="auth-brand">
          ${icon.utensils}
          <h1>私房菜谱</h1>
          <p>${isRegister ? "创建账号后，每个人都会拥有独立的菜谱空间。" : "登录后查看和管理只属于你的菜谱。"}</p>
        </div>
        <form class="auth-form" data-form="${isRegister ? "register" : "login"}">
          ${isRegister ? `<label>昵称<input class="field" name="name" autocomplete="name" placeholder="例如：小林"></label>` : ""}
          <label>邮箱<input class="field" name="email" type="email" autocomplete="email" required placeholder="you@example.com"></label>
          <label>密码<input class="field" name="password" type="password" autocomplete="${isRegister ? "new-password" : "current-password"}" required placeholder="至少 6 位"></label>
          <button class="primary-button" type="submit">${isRegister ? "注册并进入" : "登录"}</button>
        </form>
        <button class="secondary-button auth-switch" data-action="${isRegister ? "show-login" : "show-register"}">
          ${isRegister ? "已有账号，去登录" : "没有账号，去注册"}
        </button>
        <button class="link-button demo-login" data-action="demo-login">使用示例账号登录</button>
      </div>
      ${toastHtml()}
    </section>
  `;
}

function tabs(active = "recipes") {
  const items = [
    ["recipes", "点菜", icon.utensils, "home"],
    ["explore", "发现", icon.compass, "explore"],
    ["cook", "记录", icon.plus, "edit-new"],
    ["saved", "清单", icon.bookmark, "saved"]
  ];
  return `
    <nav class="tabbar">
      ${items.map(([key, label, svg, action]) => `<button class="tab ${active === key ? "active" : ""}" data-action="${action}">${svg}<span>${label}</span></button>`).join("")}
    </nav>
  `;
}

function renderHome() {
  const visibleRecipes = recipesForCategory(state.selectedCategory);
  const selected = selectedRecipes();
  return `
    ${topbar()}
    <section class="ordering-layout">
      <aside class="category-rail">
        ${menuCategories().map((category) => `
          <button class="category-tab ${state.selectedCategory === category ? "active" : ""}" data-action="select-category" data-value="${category}">
            <span>${categoryIcon(category)}</span>
            <small>${category}</small>
          </button>
        `).join("")}
      </aside>
      <section class="menu-panel">
        <div class="menu-heading">
          <h2>${escapeHtml(state.selectedCategory)}</h2>
          <p>${categorySubtitle(state.selectedCategory)}</p>
        </div>
        <div class="menu-list">
          ${visibleRecipes.length ? visibleRecipes.map(renderMenuDishCard).join("") : `<div class="empty-state">这个分类还没有菜。可以去“记录”添加，或去“发现”一键加入。</div>`}
        </div>
      </section>
    </section>
    ${renderSelectionDock(selected)}
    ${tabs("recipes")}
    ${toastHtml()}
  `;
}

function renderMenuDishCard(recipe) {
  const selected = state.selectedRecipeIds.includes(recipe.id);
  return `
    <article class="menu-dish-card ${selected ? "selected" : ""}">
      <button class="menu-dish-photo" data-action="detail" data-id="${recipe.id}" aria-label="查看 ${escapeAttr(recipe.title)}">
        <img data-preview-image src="${recipe.photo || fallbackImages.upload}" alt="${escapeAttr(recipe.title)}">
      </button>
      <div class="menu-dish-body">
        <button class="menu-dish-title" data-action="detail" data-id="${recipe.id}">
          <h3>${escapeHtml(recipe.title)}</h3>
          <div class="meta"><span>${icon.clock} ${recipe.time} 分钟</span><span>${difficultyLabel(recipe.difficulty)}</span></div>
        </button>
        <button class="add-dish-button ${selected ? "selected" : ""}" data-action="toggle-select-recipe" data-id="${recipe.id}" aria-label="${selected ? "移除" : "添加"}">${selected ? "✓" : "+"}</button>
      </div>
    </article>
  `;
}

function renderSelectionDock(selected) {
  if (!selected.length) {
    return `
      <div class="selection-dock">
        <div><strong>Selected Recipes</strong><p>先像点餐一样添加想做的菜</p></div>
        <button class="primary-button" data-action="saved">生成买菜清单</button>
      </div>
    `;
  }
  return `
    <div class="selection-dock">
      <div class="selection-summary">
        <span class="basket-count">${selected.length}</span>
        <div><strong>Selected Recipes</strong><p>${selected.length} items in your list</p></div>
      </div>
      <div class="selection-avatars">
        ${selected.slice(0, 3).map((recipe) => `<img src="${recipe.photo || fallbackImages.upload}" alt="">`).join("")}
      </div>
      <button class="primary-button" data-action="saved">生成买菜清单</button>
    </div>
  `;
}

function renderRecipeCard(recipe) {
  return renderMenuDishCard(recipe);
}

function renderDetail() {
  const recipe = recipes.find((item) => item.id === state.activeId) || recipes[0];
  if (!recipe) return `${topbar({ back: true })}<section class="content"><div class="empty-state">暂无菜谱，先记录第一道菜吧。</div></section>${tabs("recipes")}`;
  const completed = recipe.ingredients.filter((item) => item.done).length;
  const progress = Math.round((completed / Math.max(recipe.ingredients.length, 1)) * 100);
  return `
    ${topbar({ back: true, avatar: false })}
    <section class="content">
      <div class="hero-photo">
        <img data-preview-image src="${recipe.photo || fallbackImages.upload}" alt="${escapeAttr(recipe.title)}">
        <button class="floating-back" data-action="home" aria-label="返回">${icon.back}</button>
        <button class="floating-heart" data-action="favorite" data-id="${recipe.id}" aria-label="收藏">${recipe.favorite ? icon.heartFill : icon.heart}</button>
      </div>
      <div class="detail-content">
        <h2 class="recipe-name">${escapeHtml(recipe.title)}</h2>
        <div class="stats">
          <div class="stat">${icon.clock}<div><strong>${recipe.time}</strong><span>分钟</span></div></div>
          <div class="stat">${icon.users}<div><strong>${recipe.servings}</strong><span>人份</span></div></div>
          <div class="stat">${icon.fire}<div><strong>${recipe.kcal}</strong><span>千卡</span></div></div>
        </div>
        <div class="progress-head"><span>制作进度</span><span>${progress}% 完成</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>

        <div class="section-title"><h2>食材</h2><button class="link-button" data-action="edit" data-id="${recipe.id}">编辑</button></div>
        <div class="ingredient-panel">
          ${recipe.ingredients.map((item, index) => `
            <button class="check-row ${item.done ? "done" : ""}" data-action="toggle-ingredient" data-id="${recipe.id}" data-index="${index}">
              <span class="check-box">${item.done ? "✓" : ""}</span>
              <span class="ingredient-text">${escapeHtml([item.qty, item.name].filter(Boolean).join(" "))}${item.tag ? `<br><span class="tiny-tag">${escapeHtml(item.tag)}</span>` : ""}</span>
            </button>
          `).join("")}
        </div>

        <div class="section-title"><h2>制作步骤</h2></div>
        <div class="steps">
          ${recipe.steps.map((step, index) => `
            <article class="step">
              <span class="step-num">${index + 1}</span>
              <div>
                <h3>${escapeHtml(step.title || `第 ${index + 1} 步`)}</h3>
                <p>${escapeHtml(step.text)}</p>
                ${step.photo ? `<img data-preview-image src="${step.photo}" alt="步骤 ${index + 1} 图片">` : ""}
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
    ${tabs("recipes")}
    ${toastHtml()}
  `;
}

function renderEdit() {
  const recipe = state.editingId ? recipes.find((item) => item.id === state.editingId) : null;
  const draft = loadRecipeDraft(state.editingId) || recipe || emptyRecipe();
  return `
    ${topbar({ title: recipe ? "编辑菜谱" : "记录菜谱" })}
    <form class="content form-page" data-form="recipe">
      <label class="upload-box">
        <img data-preview-image src="${draft.photo || fallbackImages.upload}" alt="">
        <input type="file" accept="image/*" data-input="photo">
        <span class="upload-label">${icon.camera}<strong>上传成品照片</strong><span>建议比例 1200x600</span></span>
      </label>

      <div class="form-group">
        <label>菜谱名称</label>
        <input class="field" name="title" required placeholder="例如：外婆的红烧肉" value="${escapeAttr(draft.title)}">
      </div>
      <div class="form-group">
        <label>分类</label>
        <select class="select" name="category">
          ${["请选择分类", "早餐", "家常菜", "海鲜", "面食", "烘焙", "晚餐", "甜点", "轻食"].map((option) => `<option ${draft.category === option ? "selected" : ""}>${option}</option>`).join("")}
        </select>
      </div>
      <div class="form-group three-fields">
        <div><label>制作时间</label><input class="field" name="time" inputmode="numeric" placeholder="例如：45" value="${escapeAttr(draft.time)}"></div>
        <div><label>人份</label><input class="field" name="servings" inputmode="numeric" placeholder="2" value="${escapeAttr(draft.servings)}"></div>
        <div><label>热量</label><input class="field" name="kcal" inputmode="numeric" placeholder="千卡" value="${escapeAttr(draft.kcal)}"></div>
      </div>
      <div class="form-group">
        <label>菜谱简介</label>
        <textarea class="textarea compact" name="description" placeholder="写下这道菜的风味、来源或小提示">${escapeHtml(draft.description)}</textarea>
      </div>

      <div class="inline-title"><h2>食材</h2><button type="button" class="add-button" data-action="add-ingredient">${icon.plus} 添加</button></div>
      <div data-list="ingredients">
        ${draft.ingredients.map((item) => ingredientEditRow(item)).join("")}
      </div>

      <div class="inline-title"><h2>制作步骤</h2><button type="button" class="add-button" data-action="add-step">${icon.plus} 添加步骤</button></div>
      <div data-list="steps">
        ${draft.steps.map((step, index) => stepEditRow(step, index)).join("")}
      </div>

      <div class="actions">
        <button class="primary-button" type="submit">保存菜谱</button>
        <button class="secondary-button" type="button" data-action="${state.route === "admin" ? "admin" : "home"}">取消</button>
      </div>
    </form>
    ${tabs("cook")}
    ${toastHtml()}
  `;
}

function ingredientEditRow(item = {}) {
  return `
    <div class="ingredient-edit-row" data-ingredient-row>
      <input class="field" name="qty" placeholder="用量" value="${escapeAttr(item.qty || "")}">
      <input class="field" name="ingredient" placeholder="食材名称" value="${escapeAttr(item.name || "")}">
      <input class="field tag-field" name="tag" placeholder="标签" value="${escapeAttr(item.tag || "")}">
      <button type="button" class="delete-button" data-action="remove-row">${icon.trash}</button>
    </div>
  `;
}

function stepEditRow(step = {}, index = 0) {
  return `
    <div class="step-edit-row" data-step-row>
      <span class="step-num">${index + 1}</span>
      <div class="step-edit-fields">
        <input class="field" name="stepTitle" placeholder="步骤标题，如：调制酱汁" value="${escapeAttr(step.title || "")}">
        <textarea class="textarea" name="stepText" placeholder="${index === 0 ? "描述第一步..." : "描述下一步..."}">${escapeHtml(step.text || "")}</textarea>
        <label class="mini-upload">
          <input type="file" accept="image/*" data-input="step-photo">
          <span>${icon.camera} ${step.photo ? "更换步骤照片" : "添加步骤照片"}</span>
          ${step.photo ? `<img data-preview-image src="${step.photo}" alt="">` : ""}
        </label>
      </div>
    </div>
  `;
}

function renderSaved() {
  const selected = selectedRecipes();
  const groups = shoppingGroups(selected);
  const totalItems = groups.reduce((sum, group) => sum + group.items.length, 0);
  return `
    ${topbar({ back: true, title: "买菜清单" })}
    <section class="content shopping-page">
      <p class="eyebrow">WEEKLY PREP</p>
      <h2 class="shopping-title">Shopping List</h2>
      <p class="shopping-subtitle">Consolidated ingredients from ${selected.length} recipes.</p>
      <div class="shopping-actions">
        <button class="secondary-pill" data-action="copy-shopping">${icon.bookmark} Copy</button>
        <button class="share-pill" data-action="share-shopping">${icon.compass} Share</button>
      </div>
      <section class="selected-panel">
        <h3>Selected Recipes</h3>
        <div class="selected-tags">${selected.map((recipe) => `<button data-action="detail" data-id="${recipe.id}">${escapeHtml(recipe.title)}</button>`).join("") || "<span>还没有选择菜品</span>"}</div>
      </section>
      <section class="total-panel"><strong>${totalItems}</strong><span>TOTAL ITEMS</span></section>
      <div class="shopping-groups">
        ${groups.map((group) => `
          <section class="shopping-group">
            <h3><span>${group.icon}</span>${group.title}</h3>
            ${group.items.map((item) => `
              <div class="shopping-item">
                <span class="shopping-check"></span>
                <div><strong>${escapeHtml(item.name)}</strong><p>Used in: ${escapeHtml([...item.recipes].join(", "))}</p></div>
                <b>${escapeHtml(item.amount)}</b>
              </div>
            `).join("")}
          </section>
        `).join("") || `<div class="empty-state">先在点菜页选择几道菜，就会自动生成买菜清单。</div>`}
      </div>
    </section>
    ${tabs("saved")}
  `;
}

function renderExplore() {
  const pool = state.publicRecipes.length ? state.publicRecipes : recipes;
  return `
    ${topbar({ back: true, title: "发现灵感" })}
    <section class="content inspiration-page">
      <p class="eyebrow">COMMUNITY POOL</p>
      <h2 class="shopping-title">发现灵感</h2>
      <p class="shopping-subtitle">从大家上传过的菜谱池里，一键加入自己的菜单。</p>
      <div class="recipe-list">
        ${pool.map((recipe) => `
          <article class="inspiration-card">
            <img data-preview-image src="${recipe.photo || fallbackImages.upload}" alt="${escapeAttr(recipe.title)}">
            <div>
              <h3>${escapeHtml(recipe.title)}</h3>
              <p>${escapeHtml(recipe.category || "家常菜")} · ${recipe.time} 分钟 · ${recipe.ingredients?.length || 0} 个食材</p>
              <button class="primary-button" data-action="${recipe.inMyMenu ? "toggle-select-recipe" : "import-public-recipe"}" data-id="${recipe.id}">
                ${recipe.inMyMenu ? "加入本周菜单" : "一键添加到我的菜单"}
              </button>
            </div>
          </article>
        `).join("") || `<div class="empty-state">公共池暂时没有菜谱。</div>`}
      </div>
    </section>
    ${tabs("explore")}
  `;
}

function renderAdmin() {
  const totalIngredients = recipes.reduce((sum, item) => sum + item.ingredients.length, 0);
  const totalSteps = recipes.reduce((sum, item) => sum + item.steps.length, 0);
  return `
    ${topbar({ back: true, title: "后台管理", avatar: false })}
    <section class="content admin-page">
      <div class="admin-hero">
        <div>${icon.shield}<h2>菜谱内容管理</h2><p>统一管理用户记录的菜谱、照片、食材和制作步骤。</p></div>
        <button class="primary-button" data-action="edit-new">新增菜谱</button>
      </div>
      <div class="admin-stats">
        <div><strong>${recipes.length}</strong><span>菜谱</span></div>
        <div><strong>${totalIngredients}</strong><span>食材</span></div>
        <div><strong>${totalSteps}</strong><span>步骤</span></div>
      </div>
      <label class="search">${icon.search}<input data-input="search" placeholder="搜索后台菜谱" value="${escapeAttr(state.query)}"></label>
      <div class="admin-list">
        ${filterRecipes().map((recipe) => `
          <article class="admin-item">
            <img data-preview-image src="${recipe.photo || fallbackImages.upload}" alt="">
            <div>
              <h3>${escapeHtml(recipe.title)}</h3>
              <p>${escapeHtml(recipe.category || "未分类")} · ${recipe.time} 分钟 · ${recipe.ingredients.length} 个食材</p>
              <div class="admin-actions">
                <button data-action="detail" data-id="${recipe.id}">查看</button>
                <button data-action="edit" data-id="${recipe.id}">编辑</button>
                <button class="danger" data-action="delete" data-id="${recipe.id}">删除</button>
              </div>
            </div>
          </article>
        `).join("") || `<div class="empty-state">没有匹配的菜谱。</div>`}
      </div>
    </section>
    ${tabs("recipes")}
    ${toastHtml()}
  `;
}

function renderAccount() {
  const user = state.currentUser;
  return `
    ${topbar({ back: true, title: "账号中心", avatar: false })}
    <section class="content admin-page">
      <div class="admin-hero">
        <div>${icon.shield}<h2>${escapeHtml(user?.name || "我的账号")}</h2><p>${escapeHtml(user?.email || "")}</p></div>
        <button class="secondary-button" data-action="logout">退出登录</button>
      </div>
      <div class="admin-stats">
        <div><strong>${recipes.length}</strong><span>我的菜谱</span></div>
        <div><strong>${recipes.filter((item) => item.favorite).length}</strong><span>收藏</span></div>
        <div><strong>${recipes.reduce((sum, item) => sum + item.steps.length, 0)}</strong><span>步骤</span></div>
      </div>
      <div class="empty-state">当前账号的数据会独立保存，其他用户无法看到你的菜谱。</div>
    </section>
    ${tabs("recipes")}
    ${toastHtml()}
  `;
}

function bindEvents() {
  if (!delegatedClicksBound) {
    app.addEventListener("click", async (event) => {
      const previewImage = event.target.closest("[data-preview-image]");
      if (previewImage && app.contains(previewImage)) {
        event.preventDefault();
        event.stopPropagation();
        state.lightboxImage = {
          src: previewImage.currentSrc || previewImage.src,
          alt: previewImage.alt || "图片预览"
        };
        render();
        return;
      }

      const el = event.target.closest("[data-action]");
      if (!el || !app.contains(el)) return;
      if (el.dataset.action !== "toggle-ingredient") event.preventDefault();
      await handleAction(el.dataset.action, el);
    });

    app.addEventListener("input", (event) => {
      if (event.target.matches("[data-input='search']")) {
        state.query = event.target.value;
        repaintCurrentList();
      }
      if (event.target.closest("[data-form='recipe']")) {
        saveCurrentDraft();
      }
    });

    app.addEventListener("change", async (event) => {
      if (event.target.matches("[data-input='photo']")) {
        const dataUrl = await readFileAsDataUrl(event.target.files[0]);
        if (!dataUrl) return;
        event.target.closest(".upload-box").querySelector("img").src = dataUrl;
        try {
          const uploaded = await api.uploadImage(dataUrl);
          event.target.dataset.photoUrl = uploaded.url;
          saveCurrentDraft();
          passiveToast("成品图已上传");
        } catch (error) {
          passiveToast(error.message || "图片上传失败");
        }
      }
      if (event.target.matches("[data-input='step-photo']")) {
        const dataUrl = await readFileAsDataUrl(event.target.files[0]);
        if (!dataUrl) return;
        const label = event.target.closest(".mini-upload");
        label.querySelector("img")?.remove();
        label.insertAdjacentHTML("beforeend", `<img data-preview-image src="${dataUrl}" alt="">`);
        label.querySelector("span").innerHTML = `${icon.camera} 更换步骤照片`;
        try {
          const uploaded = await api.uploadImage(dataUrl);
          event.target.dataset.photoUrl = uploaded.url;
          saveCurrentDraft();
          passiveToast("步骤照片已上传");
        } catch (error) {
          passiveToast(error.message || "图片上传失败");
        }
      }
    });

    app.addEventListener("submit", async (event) => {
      const authForm = event.target.closest("[data-form='login'], [data-form='register']");
      if (authForm) {
        event.preventDefault();
        await submitAuthForm(authForm);
        return;
      }

      const form = event.target.closest("[data-form='recipe']");
      if (!form) return;
      event.preventDefault();
      await saveRecipeFromForm(form);
    });

    delegatedClicksBound = true;
  }
}

async function handleAction(action, el) {
  if (action === "close-lightbox") {
    state.lightboxImage = null;
    render();
    return;
  }
  if (action === "show-register") {
    state.authMode = "register";
    render();
  }
  if (action === "show-login") {
    state.authMode = "login";
    render();
  }
  if (action === "demo-login") {
    await completeLogin(await api.login("demo@example.com", "123456"));
  }
  if (action === "account") {
    state.route = "account";
    render();
    return;
  }
  if (action === "logout") {
    await api.logout();
    authToken = "";
    localStorage.removeItem(authStorageKey);
    recipes = [];
    state.currentUser = null;
    state.route = "auth";
    state.authMode = "login";
    toast("已退出登录");
    return;
  }
  if (action === "reload") return refreshRecipes();
  if (action === "home") {
    state.route = "home";
    state.editingId = null;
    render();
  }
  if (action === "detail") {
    state.activeId = el.dataset.id;
    state.route = "detail";
    render();
  }
  if (action === "select-category") {
    state.selectedCategory = el.dataset.value;
    render();
  }
  if (action === "toggle-select-recipe") {
    const id = el.dataset.id;
    state.selectedRecipeIds = state.selectedRecipeIds.includes(id)
      ? state.selectedRecipeIds.filter((item) => item !== id)
      : [...state.selectedRecipeIds, id];
    saveSelectedRecipeIds();
    render();
  }
  if (action === "copy-shopping") {
    await copyShoppingList();
  }
  if (action === "share-shopping") {
    await shareShoppingList();
  }
  if (action === "import-public-recipe") {
    const imported = await api.importRecipe(el.dataset.id);
    recipes = [imported, ...recipes];
    state.publicRecipes = await api.publicRecipes().catch(() => state.publicRecipes);
    state.selectedRecipeIds = [...new Set([...state.selectedRecipeIds, imported.id])];
    saveSelectedRecipeIds();
    toast("已添加到我的菜单");
  }
  if (action === "favorite") {
    const recipe = recipes.find((item) => item.id === el.dataset.id);
    if (!recipe) return;
    recipe.favorite = !recipe.favorite;
    await persist(recipe, recipe.favorite ? "已加入收藏" : "已取消收藏");
  }
  if (action === "toggle-ingredient") {
    const recipe = recipes.find((item) => item.id === el.dataset.id);
    const item = recipe?.ingredients[Number(el.dataset.index)];
    if (!item) return;
    item.done = !item.done;
    await persist(recipe);
  }
  if (action === "edit") {
    state.editingId = el.dataset.id;
    state.route = "edit";
    render();
  }
  if (action === "edit-new") {
    state.editingId = null;
    state.route = "edit";
    render();
  }
  if (action === "saved") {
    state.route = "saved";
    render();
  }
  if (action === "explore") {
    state.route = "explore";
    render();
  }
  if (action === "admin") {
    state.route = "admin";
    render();
  }
  if (action === "filter") {
    state.query = el.dataset.value;
    state.route = "home";
    render();
  }
  if (action === "add-ingredient") {
    const list = app.querySelector("[data-list='ingredients']");
    list.insertAdjacentHTML("beforeend", ingredientEditRow());
    saveCurrentDraft();
  }
  if (action === "add-step") {
    const list = app.querySelector("[data-list='steps']");
    list.insertAdjacentHTML("beforeend", stepEditRow({}, list.children.length));
    renumberStepRows();
    saveCurrentDraft();
  }
  if (action === "remove-row") {
    el.closest("[data-ingredient-row], [data-step-row]")?.remove();
    renumberStepRows();
    saveCurrentDraft();
  }
  if (action === "delete") {
    const recipe = recipes.find((item) => item.id === el.dataset.id);
    if (!recipe || !confirm(`确定删除《${recipe.title}》吗？`)) return;
    await api.remove(recipe.id);
    recipes = recipes.filter((item) => item.id !== recipe.id);
    toast("菜谱已删除");
    render();
  }
}

async function submitAuthForm(form) {
  const data = new FormData(form);
  const email = String(data.get("email") || "").trim();
  const password = String(data.get("password") || "");
  const name = String(data.get("name") || "").trim();

  try {
    const payload = form.dataset.form === "register"
      ? await api.register(name, email, password)
      : await api.login(email, password);
    await completeLogin(payload);
  } catch (error) {
    toast(error.message || "操作失败，请稍后重试");
  }
}

async function completeLogin(payload) {
  authToken = payload.token;
  localStorage.setItem(authStorageKey, authToken);
  state.currentUser = payload.user;
  state.selectedRecipeIds = loadSelectedRecipeIds();
  state.route = "home";
  state.activeId = "";
  toast(`欢迎，${payload.user.name}`);
  await refreshRecipes();
}

async function saveRecipeFromForm(form) {
  const oldRecipe = state.editingId ? recipes.find((item) => item.id === state.editingId) : null;
  const draft = recipeFromForm(form);
  const ingredients = draft.ingredients.filter((item) => item.qty || item.name);
  const steps = draft.steps.map((step, index) => ({
    ...step,
    title: step.title || `第 ${index + 1} 步`
  })).filter((step) => step.text || step.photo);

  const recipe = {
    id: oldRecipe?.id || "",
    title: draft.title,
    category: draft.category || "家常菜",
    time: Number(String(draft.time || "").match(/\d+/)?.[0] || 30),
    difficulty: oldRecipe?.difficulty || "EASY",
    servings: Number(String(draft.servings || "").match(/\d+/)?.[0] || 2),
    kcal: Number(String(draft.kcal || "").match(/\d+/)?.[0] || 0),
    favorite: oldRecipe?.favorite || false,
    photo: draft.photo || fallbackImages.upload,
    description: draft.description || "这是一道记录在私房菜谱里的家常味道。",
    ingredients: ingredients.length ? ingredients : [{ qty: "适量", name: "主要食材", tag: "新鲜", done: false }],
    steps: steps.length ? steps : [{ title: "第 1 步", text: "写下第一步做法。", photo: "" }]
  };

  if (!recipe.title) {
    toast("请先填写菜谱名称");
    return;
  }

  const saved = await api.save(recipe);
  const exists = recipes.some((item) => item.id === saved.id);
  recipes = exists ? recipes.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...recipes];
  state.activeId = saved.id;
  state.editingId = null;
  state.route = "detail";
  clearRecipeDraft(recipe.id);
  clearRecipeDraft(null);
  toast("菜谱已保存");
}

async function persist(recipe, message = "") {
  try {
    const saved = await api.save(recipe);
    recipes = recipes.map((item) => (item.id === saved.id ? saved : item));
    if (message) toast(message);
    else render();
  } catch {
    toast("保存失败，请稍后重试");
  }
}

function repaintCurrentList() {
  if (state.route === "home") {
    render();
  }
  if (state.route === "admin") render();
}

function filterRecipes() {
  const q = state.query.trim().toLowerCase();
  return recipes.filter((recipe) => {
    const haystack = [recipe.title, recipe.category, recipe.description, recipe.ingredients.map((i) => i.name).join(" ")].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}

function emptyRecipe() {
  return {
    title: "",
    category: "",
    time: "",
    servings: 2,
    kcal: "",
    photo: "",
    description: "",
    ingredients: [
      { qty: "", name: "", tag: "新鲜" },
      { qty: "", name: "", tag: "常备" }
    ],
    steps: [
      { title: "", text: "", photo: "" },
      { title: "", text: "", photo: "" }
    ]
  };
}

function renumberStepRows() {
  app.querySelectorAll("[data-step-row] .step-num").forEach((node, index) => {
    node.textContent = index + 1;
  });
}

function menuCategories() {
  return ["凉菜", "荤菜", "蔬菜", "汤品", "主食"];
}

function categoryIcon(category) {
  return { 凉菜: "✳", 荤菜: "♨", 蔬菜: "◒", 汤品: "♨", 主食: "◓" }[category] || "•";
}

function categorySubtitle(category) {
  return {
    凉菜: "Fresh starters to awaken your palate",
    荤菜: "Protein dishes for the center of the table",
    蔬菜: "Greens and vegetables for balance",
    汤品: "Warm soups for the whole meal",
    主食: "Rice, noodles and staple dishes"
  }[category] || "Choose dishes like ordering at a restaurant";
}

function recipeMenuCategory(recipe) {
  const text = `${recipe.category || ""} ${recipe.title || ""}`.toLowerCase();
  if (/(凉|冷|拍黄瓜|木耳|沙拉|salad|tofu|豆腐)/i.test(text)) return "凉菜";
  if (/(汤|羹|soup|stock)/i.test(text)) return "汤品";
  if (/(饭|面|粥|米|risotto|pasta|linguine|rice|noodle|主食)/i.test(text)) return "主食";
  if (/(鸡|肉|鱼|虾|牛|猪|羊|salmon|chicken|beef|pork|seafood|荤|海鲜)/i.test(text)) return "荤菜";
  if (/(蔬|菜|菠菜|番茄|牛油果|黄瓜|蘑菇|avocado|spinach|vegetable|轻食)/i.test(text)) return "蔬菜";
  return recipe.category || "蔬菜";
}

function recipesForCategory(category) {
  const q = state.query.trim().toLowerCase();
  return recipes.filter((recipe) => {
    const matchesCategory = recipeMenuCategory(recipe) === category;
    const haystack = [recipe.title, recipe.category, recipe.description, recipe.ingredients.map((i) => i.name).join(" ")].join(" ").toLowerCase();
    return matchesCategory && (!q || haystack.includes(q));
  });
}

function selectedRecipes() {
  return state.selectedRecipeIds.map((id) => recipes.find((recipe) => recipe.id === id)).filter(Boolean);
}

function selectedKey() {
  return `${selectedStorageKey}:${state.currentUser?.id || "guest"}`;
}

function loadSelectedRecipeIds() {
  try {
    const raw = localStorage.getItem(selectedKey());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSelectedRecipeIds() {
  localStorage.setItem(selectedKey(), JSON.stringify(state.selectedRecipeIds));
}

function shoppingGroups(selected) {
  const map = new Map();
  selected.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      const name = (ingredient.name || "").trim();
      if (!name) return;
      const key = name.toLowerCase();
      const current = map.get(key) || { name, qtys: [], recipes: new Set(), group: ingredientGroup(name) };
      if (ingredient.qty) current.qtys.push(ingredient.qty);
      current.recipes.add(recipe.title);
      map.set(key, current);
    });
  });

  const groups = [
    { title: "Produce", icon: "◒", match: "produce", items: [] },
    { title: "Meat & Dairy", icon: "♨", match: "meat", items: [] },
    { title: "Pantry & Seasoning", icon: "▤", match: "pantry", items: [] }
  ];

  [...map.values()].forEach((item) => {
    const target = groups.find((group) => group.match === item.group) || groups[2];
    target.items.push({ ...item, amount: mergeAmounts(item.qtys) });
  });

  return groups.filter((group) => group.items.length);
}

function ingredientGroup(name) {
  if (/(鸡|肉|鱼|虾|牛|猪|羊|蛋|芝士|奶|cheese|butter|chicken|salmon|beef|pork|egg)/i.test(name)) return "meat";
  if (/(米|面|油|盐|酱|糖|醋|stock|rice|pasta|sauce|honey|soy|flour)/i.test(name)) return "pantry";
  return "produce";
}

function mergeAmounts(qtys) {
  if (!qtys.length) return "适量";
  const parsed = qtys.map(parseAmount);
  const unit = parsed[0].unit;
  if (unit && parsed.every((item) => item.unit === unit && Number.isFinite(item.value))) {
    const total = parsed.reduce((sum, item) => sum + item.value, 0);
    return `${Number(total.toFixed(1))}${unit}`;
  }
  return [...new Set(qtys)].join(" + ");
}

function parseAmount(text) {
  const match = String(text).trim().match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
  return match ? { value: Number(match[1]), unit: match[2].trim() } : { value: NaN, unit: "" };
}

function shoppingListText() {
  const selected = selectedRecipes();
  const lines = [`买菜清单（${selected.length} 道菜）`, ...selected.map((recipe) => `- ${recipe.title}`), ""];
  shoppingGroups(selected).forEach((group) => {
    lines.push(group.title);
    group.items.forEach((item) => lines.push(`- ${item.name}: ${item.amount}`));
  });
  return lines.join("\n");
}

async function copyShoppingList() {
  await navigator.clipboard?.writeText(shoppingListText());
  passiveToast("买菜清单已复制");
}

async function shareShoppingList() {
  const text = shoppingListText();
  if (navigator.share) await navigator.share({ title: "买菜清单", text });
  else await copyShoppingList();
}

function draftKey(recipeId = state.editingId) {
  return `${draftPrefix}:${state.currentUser?.id || "guest"}:${recipeId || "new"}`;
}

function loadRecipeDraft(recipeId = state.editingId) {
  try {
    const raw = localStorage.getItem(draftKey(recipeId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearRecipeDraft(recipeId = state.editingId) {
  localStorage.removeItem(draftKey(recipeId));
}

function saveCurrentDraft() {
  const form = app.querySelector("[data-form='recipe']");
  if (!form) return;
  localStorage.setItem(draftKey(), JSON.stringify(recipeFromForm(form)));
  passiveStatus("已自动暂存");
}

function recipeFromForm(form) {
  const data = new FormData(form);
  const currentRecipe = state.editingId ? recipes.find((item) => item.id === state.editingId) : null;
  const previousDraft = loadRecipeDraft(state.editingId);
  const photo = form.querySelector("[data-input='photo']").dataset.photoUrl || previousDraft?.photo || currentRecipe?.photo || "";
  const ingredients = [...form.querySelectorAll("[data-ingredient-row]")].map((row) => {
    const [qty, name, tag] = row.querySelectorAll("input");
    return { qty: qty.value.trim(), name: name.value.trim(), tag: tag.value.trim(), done: false };
  });
  const previousSteps = previousDraft?.steps || currentRecipe?.steps || [];
  const steps = [...form.querySelectorAll("[data-step-row]")].map((row, index) => {
    const fileInput = row.querySelector("[data-input='step-photo']");
    return {
      title: row.querySelector("[name='stepTitle']").value.trim(),
      text: row.querySelector("[name='stepText']").value.trim(),
      photo: fileInput.dataset.photoUrl || previousSteps[index]?.photo || ""
    };
  });

  return {
    title: String(data.get("title") || "").trim(),
    category: String(data.get("category") || "").replace("请选择分类", "") || "",
    time: String(data.get("time") || "").trim(),
    servings: String(data.get("servings") || "").trim(),
    kcal: String(data.get("kcal") || "").trim(),
    photo,
    description: String(data.get("description") || "").trim(),
    ingredients,
    steps
  };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

function toast(message) {
  state.toast = message;
  render();
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => {
    state.toast = "";
    render();
  }, 1300);
}

function passiveToast(message) {
  app.querySelector(".toast")?.remove();
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  app.appendChild(node);
  window.clearTimeout(passiveToast.timer);
  passiveToast.timer = window.setTimeout(() => {
    node.remove();
  }, 1300);
}

function passiveStatus(message) {
  window.clearTimeout(passiveStatus.timer);
  passiveStatus.timer = window.setTimeout(() => {
    const existing = app.querySelector(".draft-status");
    if (existing) {
      existing.textContent = message;
      return;
    }
    const node = document.createElement("div");
    node.className = "draft-status";
    node.textContent = message;
    app.appendChild(node);
    window.setTimeout(() => node.remove(), 900);
  }, 500);
}

function toastHtml() {
  return state.toast ? `<div class="toast">${state.toast}</div>` : "";
}

function lightboxHtml() {
  if (!state.lightboxImage) return "";
  return `
    <div class="image-lightbox" data-action="close-lightbox" role="dialog" aria-modal="true" aria-label="图片预览">
      <button class="lightbox-close" data-action="close-lightbox" aria-label="关闭">×</button>
      <img src="${escapeAttr(state.lightboxImage.src)}" alt="${escapeAttr(state.lightboxImage.alt)}">
    </div>
  `;
}

function difficultyLabel(value = "EASY") {
  return { EASY: "简单", MED: "中等", HARD: "较难" }[value] || value;
}

function userInitial() {
  const name = state.currentUser?.name || "我";
  return String(name).trim().slice(0, 1).toUpperCase();
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value = "") {
  return escapeHtml(value);
}
