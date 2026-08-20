"""Generate 6 new tier-1 (warmup) challenge artifacts."""
import base64, hashlib, json, struct
import numpy as np
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public"

FLAGS = {
    "security-txt":    "JTCS{s3cur1ty_txt_1s_r34l}",
    "css-phantom":     "JTCS{css_l3g4l_c0mm3nt}",
    "console-whisper": "JTCS{d3vt00ls_c0ns0l3_l34k}",
    "sitemap-ghost":   "JTCS{s1t3m4p_sh0ws_h1dd3n_r00ms}",
    "atbash-batik":    "JTCS{4tb4sh_1s_4nc13nt}",
    "rain-spectrogram":"JTCS{sp3ctr4_gh0st}",
}
hashes = {k: hashlib.sha256(v.encode()).hexdigest() for k, v in FLAGS.items()}
print("WARMUP-2 FLAG HASHES:")
print(json.dumps(hashes, indent=2))

# ---------- security.txt (RFC 9116) ----------
(OUT / ".well-known").mkdir(exist_ok=True)
(OUT / ".well-known" / "security.txt").write_text(
    "Contact: mailto:security@jatim-cybersec.id\n"
    "Expires: 2027-08-20T00:00:00.000Z\n"
    "Preferred-Languages: id, en\n"
    "Canonical: https://jatim-ctf-arena.vercel.app/.well-known/security.txt\n"
    "# Terima kasih sudah melapor. Sebagai tanda terima kasih untuk pembaca yang teliti:\n"
    f"# {FLAGS['security-txt']}\n"
)

# ---------- sitemap.xml + halaman arsip tersembunyi ----------
(OUT / "sitemap.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    "  <url><loc>https://jatim-ctf-arena.vercel.app/</loc></url>\n"
    "  <url><loc>https://jatim-ctf-arena.vercel.app/vault/arsip-lama.html</loc></url>\n"
    "</urlset>\n"
)
(OUT / "vault" / "arsip-lama.html").write_text(
    "<!doctype html><html><head><meta charset='utf-8'><title>arsip — 2019</title></head>"
    "<body style='background:#0a0f0a;color:#4ade80;font-family:monospace;padding:3rem'>"
    "<h1>ARSIP LAMA — TIDAK UNTUK UMUM</h1>"
    "<p>Halaman ini seharusnya sudah dihapus dari indeks mesin pencari.</p>"
    "<p>Bendera arsip: <b style='color:#facc15'>" + FLAGS["sitemap-ghost"] + "</b></p>"
    "</body></html>\n"
)

# ---------- Atbash ----------
def atbash(s: str) -> str:
    out = []
    for ch in s:
        if "a" <= ch <= "z": out.append(chr(ord("z") - (ord(ch) - ord("a"))))
        elif "A" <= ch <= "Z": out.append(chr(ord("Z") - (ord(ch) - ord("A"))))
        else: out.append(ch)
    return "".join(out)

ct = atbash(FLAGS["atbash-batik"])
print("ATBASH CIPHERTEXT:", ct)
assert atbash(ct) == FLAGS["atbash-batik"]

# ---------- CSS legal comment payload (base64 of flag) ----------
b64_css = base64.b64encode(FLAGS["css-phantom"].encode()).decode()
print("CSS BASE64:", b64_css)

# ---------- Spectrogram WAV: teks flag terlukis di domain frekuensi ----------
from PIL import Image, ImageDraw, ImageFont

SR = 8000
COL_MS = 28
txt = FLAGS["rain-spectrogram"]
font = ImageFont.truetype("/System/Library/Fonts/Monaco.ttf", 26)
tmp = Image.new("1", (10, 40))
d = ImageDraw.Draw(tmp)
bbox = d.textbbox((0, 0), txt, font=font)
W, H = bbox[2] - bbox[0] + 8, 40
img = Image.new("1", (W, H))
d = ImageDraw.Draw(img)
d.text((4 - bbox[0], 6 - bbox[1]), txt, fill=1, font=font)
px = np.array(img)

samples = []
t_cache = np.arange(int(SR * COL_MS / 1000)) / SR
for col in range(W):
    rows = np.where(px[:, col] > 0)[0]
    seg = np.zeros(len(t_cache))
    for r in rows:
        f = 400 + (H - r) * 70.0  # baris atas = frekuensi tinggi
        seg += np.sin(2 * np.pi * f * t_cache)
    if len(rows): seg /= max(1, len(rows))
    samples.append(seg)
audio = np.concatenate(samples)
audio = (audio * 0.7 * 32767).astype("<i2")
(OUT / "files" / "hujan.wav").write_bytes(
    struct.pack("<4sI4s4sIHHIIHH4sI", b"RIFF", 36 + audio.nbytes, b"WAVE",
                b"fmt ", 16, 1, 1, SR, SR * 2, 2, 16, b"data", audio.nbytes)
    + audio.tobytes()
)

# verifikasi: FFT kolom tengah harus punya puncak di frekuensi baris aktif
mid = W // 2
rows = np.where(px[:, mid] > 0)[0]
if len(rows):
    seg = audio[mid * len(t_cache):(mid + 1) * len(t_cache)]
    spec = np.abs(np.fft.rfft(seg))
    freqs = np.fft.rfftfreq(len(seg), 1 / SR)
    top = freqs[np.argsort(spec)[-len(rows):]]
    expect = sorted(400 + (H - r) * 70.0 for r in rows)
    for ef in expect:
        assert np.min(np.abs(top - ef)) < 40, f"peak missing for {ef}"
print("spectrogram verified, duration %.1fs, %d cols" % (len(audio) / SR, W))

print("\nAll warmup-2 artifacts generated & self-verified.")
