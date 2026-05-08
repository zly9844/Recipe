const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { DatabaseSync } = require("node:sqlite");

const root = __dirname;
const dataDir = path.resolve(process.env.DATA_DIR || path.join(root, "data"));
const dbFile = path.resolve(process.env.DATABASE_PATH || path.join(dataDir, "app.db"));
const legacyRecipesFile = path.join(dataDir, "recipes.json");
const legacyUsersFile = path.join(dataDir, "users.json");
const uploadDir = path.resolve(process.env.UPLOAD_DIR || path.join(dataDir, "uploads"));
const port = Number(process.env.PORT || 5173);
const host = process.env.HOST || "0.0.0.0";
const maxBodySize = 15 * 1024 * 1024;
const tokenTtlMs = 1000 * 60 * 60 * 24 * 14;

const sessions = new Map();
const demoUserId = "demo-user";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif"
};

const seedRecipes = [
  {
    id: "salmon",
    userId: demoUserId,
    title: "蜂蜜照烧三文鱼",
    category: "海鲜",
    time: 25,
    difficulty: "MED",
    servings: 2,
    kcal: 420,
    favorite: true,
    photo: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1000&q=80",
    description: "甜咸适中的蜂蜜酱汁裹住三文鱼，带一点姜蒜和柠檬香。",
    ingredients: [
      { qty: "2 块", name: "新鲜三文鱼排", tag: "新鲜", done: false },
      { qty: "3 汤匙", name: "蜂蜜", tag: "常备", done: false },
      { qty: "1 汤匙", name: "低盐酱油", tag: "调味", done: false },
      { qty: "1 茶匙", name: "鲜姜末", tag: "新鲜", done: false },
      { qty: "2 瓣", name: "蒜末", tag: "新鲜", done: false },
      { qty: "1 汤匙", name: "柠檬汁", tag: "新鲜", done: false }
    ],
    steps: [
      { title: "调制酱汁", text: "将蜂蜜、酱油、柠檬汁、蒜末和姜末放入小碗中搅拌均匀。", photo: "" },
      { title: "处理鱼排", text: "用厨房纸擦干三文鱼，两面撒少量盐和黑胡椒。", photo: "" },
      { title: "煎制上色", text: "平底锅中火加热，倒少量油，将三文鱼放入煎至表面金黄。", photo: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=900&q=80" },
      { title: "收汁完成", text: "翻面后倒入酱汁，小火煮 3-4 分钟，并不断把酱汁淋在鱼排表面。", photo: "" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "salad",
    userId: demoUserId,
    title: "藜麦牛油果能量碗",
    category: "轻食",
    time: 15,
    difficulty: "EASY",
    servings: 1,
    kcal: 360,
    favorite: false,
    photo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    description: "清爽的蔬菜、藜麦和牛油果组合，适合作为工作日快手餐。",
    ingredients: [
      { qty: "1 碗", name: "熟藜麦", tag: "常备", done: false },
      { qty: "1 个", name: "牛油果", tag: "新鲜", done: false },
      { qty: "1 把", name: "菠菜", tag: "新鲜", done: false },
      { qty: "6 个", name: "圣女果", tag: "新鲜", done: false }
    ],
    steps: [
      { title: "铺底", text: "将藜麦、菠菜、圣女果和黄瓜片放入碗中。", photo: "" },
      { title: "调味", text: "加入牛油果、橄榄油、柠檬汁和少许盐拌匀。", photo: "" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "pasta",
    userId: demoUserId,
    title: "柠檬蒜香意面",
    category: "面食",
    time: 20,
    difficulty: "MED",
    servings: 2,
    kcal: 510,
    favorite: false,
    photo: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
    description: "蒜香、柠檬皮和帕玛森带来清爽但浓郁的味道。",
    ingredients: [
      { qty: "180 克", name: "扁意面", tag: "常备", done: false },
      { qty: "2 瓣", name: "大蒜", tag: "新鲜", done: false },
      { qty: "1 个", name: "柠檬", tag: "新鲜", done: false },
      { qty: "30 克", name: "帕玛森芝士", tag: "乳制品", done: false }
    ],
    steps: [
      { title: "煮面", text: "盐水煮意面至弹牙，保留半杯煮面水。", photo: "" },
      { title: "拌酱", text: "橄榄油小火煸香蒜片，加入意面、柠檬皮、柠檬汁和芝士，用煮面水调整浓稠度。", photo: "" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });

const db = new DatabaseSync(dbFile);
initializeDatabase();

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith("/api/auth")) {
      await handleAuthApi(req, res);
      return;
    }

    if (req.url.startsWith("/api/uploads")) {
      await handleUploadApi(req, res);
      return;
    }

    if (req.url.startsWith("/api/recipes")) {
      await handleRecipeApi(req, res);
      return;
    }

    if (req.url.startsWith("/uploads/")) {
      serveUpload(req, res);
      return;
    }

    serveStatic(req, res);
  } catch (error) {
    sendJson(res, error.statusCode || 500, { error: error.message || "Server error" });
  }
});

server.listen(port, host, () => {
  console.log(`私房菜谱 running at http://${host}:${port}/`);
});

async function handleAuthApi(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/api/auth/me") {
    const user = requireUser(req);
    sendJson(res, 200, { user: publicUser(user) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/register") {
    const body = await readJsonBody(req);
    const name = String(body.name || "").trim();
    const email = normalizeEmail(body.email);
    const password = String(body.password || "");

    if (!name || !email || password.length < 6) {
      throw httpError(400, "请填写昵称、邮箱，并设置至少 6 位密码");
    }

    if (getUserByEmail(email)) {
      throw httpError(409, "这个邮箱已经注册过");
    }

    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    };
    insertUser(user);

    const token = createSession(user.id);
    sendJson(res, 201, { token, user: publicUser(user) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/login") {
    const body = await readJsonBody(req);
    const email = normalizeEmail(body.email);
    const password = String(body.password || "");
    const user = getUserByEmail(email);

    if (!user || !verifyPassword(password, user.passwordHash)) {
      throw httpError(401, "邮箱或密码不正确");
    }

    const token = createSession(user.id);
    sendJson(res, 200, { token, user: publicUser(user) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/logout") {
    const token = getBearerToken(req);
    if (token) sessions.delete(token);
    sendJson(res, 204, null);
    return;
  }

  sendJson(res, 404, { error: "Not found" });
}

async function handleRecipeApi(req, res) {
  const currentUser = requireUser(req);
  const url = new URL(req.url, `http://${req.headers.host}`);
  const id = decodeURIComponent(url.pathname.replace("/api/recipes", "").replace(/^\/+/, ""));

  if (req.method === "GET" && !id) {
    sendJson(res, 200, listRecipesForUser(currentUser.id));
    return;
  }

  if (req.method === "POST" && !id) {
    const recipe = normalizeRecipe(await readJsonBody(req));
    recipe.id = crypto.randomUUID();
    recipe.userId = currentUser.id;
    recipe.createdAt = new Date().toISOString();
    recipe.updatedAt = recipe.createdAt;
    saveRecipe(recipe);
    sendJson(res, 201, stripOwner(recipe));
    return;
  }

  if (req.method === "PUT" && id) {
    const previous = getRecipeForUser(id, currentUser.id);
    if (!previous) throw httpError(404, "菜谱不存在或无权访问");

    const recipe = {
      ...normalizeRecipe(await readJsonBody(req)),
      id,
      userId: currentUser.id,
      createdAt: previous.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveRecipe(recipe);
    sendJson(res, 200, stripOwner(recipe));
    return;
  }

  if (req.method === "DELETE" && id) {
    const recipe = getRecipeForUser(id, currentUser.id);
    if (!recipe) throw httpError(404, "菜谱不存在或无权访问");
    deleteRecipe(id, currentUser.id);
    sendJson(res, 204, null);
    return;
  }

  sendJson(res, 404, { error: "Not found" });
}

async function handleUploadApi(req, res) {
  const currentUser = requireUser(req);

  if (req.method !== "POST") {
    sendJson(res, 404, { error: "Not found" });
    return;
  }

  const body = await readJsonBody(req);
  const { buffer, extension, mimeType } = decodeImageDataUrl(body.dataUrl);
  const userUploadDir = path.join(uploadDir, currentUser.id);
  fs.mkdirSync(userUploadDir, { recursive: true });

  const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`;
  const filePath = path.join(userUploadDir, filename);
  fs.writeFileSync(filePath, buffer);

  sendJson(res, 201, {
    url: `/uploads/${encodeURIComponent(currentUser.id)}/${encodeURIComponent(filename)}`,
    filename,
    mimeType,
    size: buffer.length
  });
}

function serveStatic(req, res) {
  const requested = req.url === "/" ? "index.html" : decodeURIComponent(req.url.split("?")[0].slice(1));
  const filePath = path.resolve(root, requested);

  if (!filePath.startsWith(root) || filePath.includes(`${path.sep}data${path.sep}`)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(data);
  });
}

function serveUpload(req, res) {
  const relativePath = decodeURIComponent(req.url.split("?")[0].replace(/^\/uploads\/?/, ""));
  const filePath = path.resolve(uploadDir, relativePath);

  if (!filePath.startsWith(uploadDir)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable"
    });
    res.end(data);
  });
}

function initializeDatabase() {
  db.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS recipes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      time INTEGER NOT NULL DEFAULT 30,
      difficulty TEXT NOT NULL DEFAULT 'EASY',
      servings INTEGER NOT NULL DEFAULT 2,
      kcal INTEGER NOT NULL DEFAULT 0,
      favorite INTEGER NOT NULL DEFAULT 0,
      photo TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      qty TEXT NOT NULL DEFAULT '',
      name TEXT NOT NULL DEFAULT '',
      tag TEXT NOT NULL DEFAULT '',
      done INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      title TEXT NOT NULL DEFAULT '',
      text TEXT NOT NULL DEFAULT '',
      photo TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_recipes_user_updated ON recipes(user_id, updated_at DESC);
    CREATE INDEX IF NOT EXISTS idx_ingredients_recipe ON ingredients(recipe_id, sort_order);
    CREATE INDEX IF NOT EXISTS idx_steps_recipe ON steps(recipe_id, sort_order);
  `);

  if (!getUserByEmail("demo@example.com")) {
    insertUser({
      id: demoUserId,
      name: "示例用户",
      email: "demo@example.com",
      passwordHash: hashPassword("123456"),
      createdAt: new Date().toISOString()
    });
  }

  if (countRecipes() === 0) {
    importLegacyData();
  }

  if (countRecipes() === 0) {
    seedRecipes.forEach(saveRecipe);
  }
}

function importLegacyData() {
  if (fs.existsSync(legacyUsersFile)) {
    try {
      JSON.parse(fs.readFileSync(legacyUsersFile, "utf8")).forEach((user) => {
        if (!getUserByEmail(user.email)) {
          insertUser({
            id: user.id || crypto.randomUUID(),
            name: user.name || "用户",
            email: normalizeEmail(user.email),
            passwordHash: user.passwordHash || hashPassword("123456"),
            createdAt: user.createdAt || new Date().toISOString()
          });
        }
      });
    } catch (error) {
      console.warn("旧 users.json 导入失败：", error.message);
    }
  }

  if (fs.existsSync(legacyRecipesFile)) {
    try {
      JSON.parse(fs.readFileSync(legacyRecipesFile, "utf8")).forEach((recipe) => {
        saveRecipe({
          ...normalizeRecipe(recipe),
          id: recipe.id || crypto.randomUUID(),
          userId: recipe.userId || demoUserId,
          createdAt: recipe.createdAt || new Date().toISOString(),
          updatedAt: recipe.updatedAt || new Date().toISOString()
        });
      });
    } catch (error) {
      console.warn("旧 recipes.json 导入失败：", error.message);
    }
  }
}

function listRecipesForUser(userId) {
  return db.prepare("SELECT * FROM recipes WHERE user_id = ? ORDER BY updated_at DESC").all(userId).map(hydrateRecipe);
}

function getRecipeForUser(id, userId) {
  const row = db.prepare("SELECT * FROM recipes WHERE id = ? AND user_id = ?").get(id, userId);
  return row ? hydrateRecipe(row) : null;
}

function hydrateRecipe(row) {
  return stripOwner({
    id: row.id,
    userId: row.user_id,
    title: row.title,
    category: row.category,
    time: row.time,
    difficulty: row.difficulty,
    servings: row.servings,
    kcal: row.kcal,
    favorite: Boolean(row.favorite),
    photo: row.photo,
    description: row.description,
    ingredients: db.prepare("SELECT qty, name, tag, done FROM ingredients WHERE recipe_id = ? ORDER BY sort_order").all(row.id).map((item) => ({
      qty: item.qty,
      name: item.name,
      tag: item.tag,
      done: Boolean(item.done)
    })),
    steps: db.prepare("SELECT title, text, photo FROM steps WHERE recipe_id = ? ORDER BY sort_order").all(row.id),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  });
}

function saveRecipe(recipe) {
  db.exec("BEGIN");
  try {
    db.prepare(`
      INSERT INTO recipes (id, user_id, title, category, time, difficulty, servings, kcal, favorite, photo, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        category = excluded.category,
        time = excluded.time,
        difficulty = excluded.difficulty,
        servings = excluded.servings,
        kcal = excluded.kcal,
        favorite = excluded.favorite,
        photo = excluded.photo,
        description = excluded.description,
        updated_at = excluded.updated_at
    `).run(
      recipe.id,
      recipe.userId,
      recipe.title,
      recipe.category,
      recipe.time,
      recipe.difficulty,
      recipe.servings,
      recipe.kcal,
      recipe.favorite ? 1 : 0,
      recipe.photo,
      recipe.description,
      recipe.createdAt,
      recipe.updatedAt
    );

    db.prepare("DELETE FROM ingredients WHERE recipe_id = ?").run(recipe.id);
    db.prepare("DELETE FROM steps WHERE recipe_id = ?").run(recipe.id);

    const insertIngredient = db.prepare("INSERT INTO ingredients (recipe_id, sort_order, qty, name, tag, done) VALUES (?, ?, ?, ?, ?, ?)");
    recipe.ingredients.forEach((item, index) => {
      insertIngredient.run(recipe.id, index, item.qty, item.name, item.tag, item.done ? 1 : 0);
    });

    const insertStep = db.prepare("INSERT INTO steps (recipe_id, sort_order, title, text, photo) VALUES (?, ?, ?, ?, ?)");
    recipe.steps.forEach((step, index) => {
      insertStep.run(recipe.id, index, step.title, step.text, step.photo);
    });

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function deleteRecipe(id, userId) {
  db.prepare("DELETE FROM recipes WHERE id = ? AND user_id = ?").run(id, userId);
}

function countRecipes() {
  return db.prepare("SELECT COUNT(*) AS count FROM recipes").get().count;
}

function getUserByEmail(email) {
  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(normalizeEmail(email));
  return row ? userFromRow(row) : null;
}

function getUserById(id) {
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  return row ? userFromRow(row) : null;
}

function insertUser(user) {
  db.prepare("INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)").run(
    user.id,
    user.name,
    normalizeEmail(user.email),
    user.passwordHash,
    user.createdAt
  );
}

function userFromRow(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at
  };
}

function requireUser(req) {
  const token = getBearerToken(req);
  const session = token ? sessions.get(token) : null;

  if (!session || session.expiresAt < Date.now()) {
    if (token) sessions.delete(token);
    throw httpError(401, "请先登录");
  }

  const user = getUserById(session.userId);
  if (!user) throw httpError(401, "账号不存在，请重新登录");
  return user;
}

function createSession(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, { userId, expiresAt: Date.now() + tokenTtlMs });
  return token;
}

function getBearerToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${key}`;
}

function verifyPassword(password, passwordHash) {
  const [, salt, key] = String(passwordHash || "").split(":");
  if (!salt || !key) return false;
  const actual = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(key, "hex");
  return expected.length === actual.length && crypto.timingSafeEqual(actual, expected);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > maxBodySize) {
        reject(httpError(413, "上传内容过大，请压缩图片后再试"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(httpError(400, "JSON 格式错误"));
      }
    });
    req.on("error", reject);
  });
}

function decodeImageDataUrl(dataUrl) {
  const match = String(dataUrl || "").match(/^data:(image\/(?:png|jpeg|webp|gif));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw httpError(400, "请上传 png、jpg、webp 或 gif 图片");

  const mimeType = match[1];
  const buffer = Buffer.from(match[2], "base64");
  if (!buffer.length) throw httpError(400, "图片内容为空");
  if (buffer.length > maxBodySize) throw httpError(413, "图片过大，请压缩后再上传");

  const extension = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "image/gif": ".gif"
  }[mimeType];

  return { buffer, extension, mimeType };
}

function normalizeRecipe(input) {
  return {
    title: String(input.title || "").trim(),
    category: String(input.category || "家常菜").trim(),
    time: Number(input.time || 30),
    difficulty: ["EASY", "MED", "HARD"].includes(input.difficulty) ? input.difficulty : "EASY",
    servings: Number(input.servings || 2),
    kcal: Number(input.kcal || 0),
    favorite: Boolean(input.favorite),
    photo: String(input.photo || "").trim(),
    description: String(input.description || "").trim(),
    ingredients: Array.isArray(input.ingredients) ? input.ingredients.map(normalizeIngredient).filter((item) => item.name || item.qty) : [],
    steps: Array.isArray(input.steps) ? input.steps.map(normalizeStep).filter((item) => item.text || item.photo) : []
  };
}

function normalizeIngredient(item) {
  return {
    qty: String(item.qty || "").trim(),
    name: String(item.name || "").trim(),
    tag: String(item.tag || "").trim(),
    done: Boolean(item.done)
  };
}

function normalizeStep(item) {
  return {
    title: String(item.title || "").trim(),
    text: String(item.text || "").trim(),
    photo: String(item.photo || "").trim()
  };
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

function stripOwner(recipe) {
  const { userId, ...publicRecipe } = recipe;
  return publicRecipe;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  if (statusCode === 204) res.end();
  else res.end(JSON.stringify(payload));
}

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
