#!/usr/bin/env python3
"""PWA 图标生成器 — 五维色环（Design-Language v1.0 语义 token），零第三方依赖。

设计：浅中性底（#F4F4F6）+ 五段色环（time/health/wealth/rel/purpose，按 Design
Language 顺序，4 度小间隙），超采样 3x 抗锯齿。stdlib only（zlib/struct/math）。

输出（app/static/）：
  icons/icon-512.png          512  any（圆角方底）
  icons/icon-192.png          192  any（圆角方底）
  icons/icon-512-maskable.png 512  maskable（满幅方底，色环在 80% 安全区内）
  icons/icon-32.png           32   favicon（圆角方底）
  apple-touch-icon.png        180  iOS 主屏（满幅不透明方底，防黑角）

重新生成：python3 scripts/generate_pwa_icons.py
"""
import math
import struct
import zlib
from pathlib import Path

# Design-Language v1.0 五维识别色（顺序：time, health, wealth, rel, purpose）
DIM_COLORS = [
    (0x3E, 0x6D, 0xE0),  # --time
    (0x15, 0x8A, 0x4C),  # --health
    (0xC2, 0x74, 0x0B),  # --wealth
    (0xD4, 0x24, 0x4E),  # --rel
    (0x71, 0x35, 0xCE),  # --purpose
]
BG = (0xF4, 0xF4, 0xF6)  # Design Language 中性底

OUTER_FRAC = 0.38  # 色环外半径（maskable 80% 安全区 = 0.40 之内）
INNER_FRAC = 0.245  # 色环内半径
GAP = math.radians(5)  # 段间间隙
CORNER_FRAC = 0.22  # 圆角方底的角半径

ROOT = Path(__file__).resolve().parent.parent
STATIC = ROOT / "app" / "static"


def png_bytes(w, h, rows):
    """rows: list of bytearray（每行 RGBA 4*w 字节）→ PNG bytes。"""
    raw = b"".join(b"\x00" + bytes(r) for r in rows)

    def chunk(tag, data):
        return (struct.pack(">I", len(data)) + tag + data
                + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF))

    ihdr = struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0)
    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr)
            + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b""))


def render(size, rounded, ss=3):
    """返回 PNG bytes。rounded=True 圆角方底（透明角），False 满幅方底。"""
    w = size * ss
    cx = cy = w / 2.0
    outer, inner = OUTER_FRAC * w, INNER_FRAC * w
    corner = CORNER_FRAC * w
    seg = (2 * math.pi - 5 * GAP) / 5
    arcs = []
    a0 = -math.pi / 2  # 从正上方开始
    for i, col in enumerate(DIM_COLORS):
        s = a0 + i * (seg + GAP)
        arcs.append((s, s + seg, col))

    def subpixel(px, py):
        # 圆角方底裁切
        if rounded:
            dx = max(abs(px - cx) - (w / 2 - corner), 0.0)
            dy = max(abs(py - cy) - (w / 2 - corner), 0.0)
            if dx * dx + dy * dy > corner * corner:
                return (0, 0, 0, 0)
        d = math.hypot(px - cx, py - cy)
        if inner <= d <= outer:
            ang = math.atan2(py - cy, px - cx)
            while ang < a0:
                ang += 2 * math.pi
            for s, e, col in arcs:
                if s <= ang <= e:
                    return (col[0], col[1], col[2], 255)
        return (BG[0], BG[1], BG[2], 255)

    n = ss * ss
    rows = []
    for oy in range(size):
        row = bytearray(size * 4)
        for ox in range(size):
            acc = [0, 0, 0, 0]
            for sy in range(ss):
                for sx in range(ss):
                    c = subpixel(ox * ss + sx + 0.5, oy * ss + sy + 0.5)
                    for k in range(4):
                        acc[k] += c[k]
            for k in range(4):
                row[4 * ox + k] = acc[k] // n
        rows.append(row)
    return png_bytes(size, size, rows)


def main():
    (STATIC / "icons").mkdir(parents=True, exist_ok=True)
    jobs = [
        (STATIC / "icons" / "icon-512.png", 512, True),
        (STATIC / "icons" / "icon-192.png", 192, True),
        (STATIC / "icons" / "icon-512-maskable.png", 512, False),
        (STATIC / "icons" / "icon-32.png", 32, True),
        (STATIC / "apple-touch-icon.png", 180, False),
    ]
    for path, size, rounded in jobs:
        path.write_bytes(render(size, rounded))
        print(f"{path.relative_to(ROOT)}  {size}x{size}  {path.stat().st_size} bytes")


if __name__ == "__main__":
    main()
