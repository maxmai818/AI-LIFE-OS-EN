"""Login/password layer (for AI Life OS cloud deployment).

Mounted by server.py only when the env var AI_LIFE_OS_AUTH=1:
- On first visit, /setup sets a password (only a PBKDF2 hash is stored; plaintext never touches disk)
- Afterwards, log in at /login; a signed cookie keeps the session
- Any page/API accessed without a session is refused

Not enabled for local development and testing; behavior is exactly the same as v0.2.
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
    """Public paths: static shell assets + PWA assets (icons/manifest hold no private data; home-screen install and SW registration need them allowed)."""
    return path in PUBLIC_PATHS or path.startswith("/icons/")

_PAGE = """<!doctype html><html lang="en"><head><meta charset="utf-8">
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


# ---------- Page routes ----------

def setup_page():
    return HTMLResponse(_PAGE.format(
        title="Set your password",
        hint="First-time setup: choose a password to protect your entries (only needed once).",
        action="/setup", placeholder="At least 6 characters", submit="Set and enter",
        extra='<p class="muted" style="margin-top:10px">Your password is stored only on the server (as a hash); it never passes through any chat log.</p>'))


def login_page():
    return HTMLResponse(_PAGE.format(
        title="Log in to AI Life OS", hint="Enter your password.",
        action="/login", placeholder="Password", submit="Enter",
        extra='<p class="muted" style="margin-top:10px">Forgot your password? Delete auth_state.json on the server and set it up again.</p>'))


def unauthorized():
    return JSONResponse({"detail": "Not logged in"}, status_code=401)


# ---------- Middleware ----------

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
