"""登录/密码层（AI Life OS 云端部署用）。

仅当环境变量 AI_LIFE_OS_AUTH=1 时由 server.py 挂载：
- 首次访问 /setup 自设密码（密码只存 PBKDF2 哈希，明文不落盘）
- 之后 /login 登录，签名 Cookie 保持会话
- 未登录访问任何页面/接口一律拒之门外

本地开发与测试不启用，行为与 v0.2 完全一致。
"""
import hashlib
import hmac
import json
import os
import secrets
import time
from pathlib import Path

from fastapi import Request
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse

_STATE_PATH = Path(__file__).resolve().parent / "auth_state.json"
COOKIE = "lifeos_session"
SESSION_DAYS = 30
_PBKDF2_ITERS = 200_000

PUBLIC_PATHS = {"/setup", "/login", "/style.css", "/app.js",
                "/manifest.json", "/sw.js", "/apple-touch-icon.png"}


def _is_public(path: str) -> bool:
    """公开路径：静态壳资源 + PWA 资源（图标/manifest 无隐私数据，主屏添加与 SW 注册需要放行）。"""
    return path in PUBLIC_PATHS or path.startswith("/icons/")

_PAGE = """<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title><link rel="stylesheet" href="/style.css"></head>
<body><main class="feed">
<div class="card" style="margin-top:48px">
<h2 style="margin:0 0 6px">{title}</h2>
<p class="muted">{hint}</p>
<form method="post" action="{action}" class="edit-row" style="margin-top:14px">
<input type="password" name="password" placeholder="{placeholder}" required minlength="6" autocomplete="current-password">
<button class="btn" type="submit">{submit}</button>
</form>
{extra}
</div></main></body></html>"""


def _load():
    if _STATE_PATH.exists():
        return json.loads(_STATE_PATH.read_text())
    return {}


def _save(state):
    _STATE_PATH.write_text(json.dumps(state))
    os.chmod(_STATE_PATH, 0o600)


def is_setup() -> bool:
    return bool(_load().get("password_hash"))


def _hash(password: str, salt: str) -> str:
    return hashlib.pbkdf2_hmac(
        "sha256", password.encode(), bytes.fromhex(salt), _PBKDF2_ITERS
    ).hex()


def _verify(password: str, state) -> bool:
    salt, want = state["password_hash"].split("$", 1)
    return hmac.compare_digest(_hash(password, salt), want)


def _sign(value: str, secret: str) -> str:
    return hmac.new(secret.encode(), value.encode(), hashlib.sha256).hexdigest()


def issue_cookie(response, state):
    exp = str(int(time.time()) + SESSION_DAYS * 86400)
    sig = _sign(f"1.{exp}", state["secret"])
    response.set_cookie(
        COOKIE, f"1.{exp}.{sig}", max_age=SESSION_DAYS * 86400,
        httponly=True, samesite="lax")
    return response


def _session_ok(request: Request, state) -> bool:
    raw = request.cookies.get(COOKIE, "")
    parts = raw.split(".")
    if len(parts) != 3:
        return False
    uid, exp, sig = parts
    if not exp.isdigit() or int(exp) < time.time():
        return False
    return hmac.compare_digest(sig, _sign(f"{uid}.{exp}", state["secret"]))


# ---------- 页面路由 ----------

def setup_page():
    return HTMLResponse(_PAGE.format(
        title="设置你的密码", hint="首次使用：设一个密码保护你的记录（只需这一次）。",
        action="/setup", placeholder="至少 6 位", submit="设好，进入",
        extra='<p class="muted" style="margin-top:10px">密码只存在服务器上（哈希），不经过任何聊天记录。</p>'))


def login_page():
    return HTMLResponse(_PAGE.format(
        title="登录 AI Life OS", hint="输入你的密码。",
        action="/login", placeholder="密码", submit="进入",
        extra='<p class="muted" style="margin-top:10px">忘记密码？到服务器删除 auth_state.json 重设。</p>'))


def unauthorized():
    return JSONResponse({"detail": "未登录"}, status_code=401)


# ---------- 中间件 ----------

async def gate(request: Request, call_next):
    state = _load()
    path = request.url.path

    if not state.get("password_hash"):
        if path in ("/setup", "/style.css") or _is_public(path):
            return await call_next(request)
        if path.startswith("/api/"):
            return unauthorized()
        return RedirectResponse("/setup", 302)

    if _is_public(path):
        return await call_next(request)

    if not _session_ok(request, state):
        if path.startswith("/api/"):
            return unauthorized()
        return RedirectResponse("/login", 302)

    return await call_next(request)
