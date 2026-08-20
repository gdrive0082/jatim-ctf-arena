"""Generate CTF challenge artifacts for JATIM CYBERSEC — CTF ARENA."""
import base64, hashlib, json, math, struct, zlib, wave, os
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public"
OUT.mkdir(exist_ok=True)

FLAGS = {
    "robot-trace":   "JTCS{r0b0ts_d0nt_l13_but_th3y_h1nt}",
    "batik-cipher":  "JTCS{l4y3r5_up0n_l4y3r5_0f_b4t1k}",
    "bromo-whisper": "JTCS{3x1f_wh1sp3r5_fr0m_br0m0}",
    "majapahit-echo":"JTCS{gema_majapahit}",
    "third-eye":     "JTCS{vi3w_s0urc3_1s_th3_th1rd_3y3}",
    "kera-sakti":    "JTCS{g1t_n3v3r_f0rg3ts_th3_p4st}",
}

hashes = {k: hashlib.sha256(v.encode()).hexdigest() for k, v in FLAGS.items()}
print("FLAG HASHES:")
print(json.dumps(hashes, indent=2))

# ---------- CH1: robots.txt -> /vault/notes.txt (double base64) ----------
f1 = FLAGS["robot-trace"]
b64_once = base64.b64encode(f1.encode()).decode()
b64_twice = base64.b64encode(b64_once.encode()).decode()

(OUT / "robots.txt").write_text(
    "User-agent: *\n"
    "Disallow: /vault/\n"
    "Disallow: /admin-backup/\n"
    "\n"
    "# catatan admin: aku sudah memindahkan catatan sensitif ke /vault/notes.txt\n"
    "# jangan sampai peserta CTF menemukannya... dua kali dilipat harusnya aman\n"
)
(OUT / "vault").mkdir(exist_ok=True)
(OUT / "vault" / "notes.txt").write_text(
    "CATATAN OPERASIONAL - RAHASIA\n"
    "=============================\n\n"
    "Kalau kamu membaca ini, kamu sudah setengah jalan.\n"
    "Di bawah ini ada sesuatu yang dilipat dua kali. Buka lipatannya.\n\n"
    f"{b64_twice}\n"
)

# ---------- CH2: Batik Cipher ciphertext (rot13(b64(hex(flag)))) ----------
f2 = FLAGS["batik-cipher"]
hexed = f2.encode().hex()
b64d = base64.b64encode(hexed.encode()).decode()
import codecs
final = codecs.encode(b64d, "rot13")
(OUT / "vault" / "batik.txt").write_text(
    "KAIN BATIK TERENKRIPSI\n"
    "======================\n\n"
    "Tiga lapis kain melindungi pesan ini.\n"
    "13 putaran. 64 motif. 16 warna.\n"
    "Kupas dari lapisan terluar.\n\n"
    f"{final}\n"
)
print("\nBATIK CIPHERTEXT:", final)

# ---------- CH3: bromo.png with tEXt metadata chunk ----------
def png_chunk(ctype: bytes, data: bytes) -> bytes:
    c = struct.pack(">I", len(data)) + ctype + data
    c += struct.pack(">I", zlib.crc32(ctype + data) & 0xFFFFFFFF)
    return c

w, h = 640, 360
raw = b""
for y in range(h):
    raw += b"\x00"
    for x in range(w):
        # dark gradient with "volcanic" red glow
        r = int(20 + 120 * (y / h) * (x / w))
        g = int(10 + 30 * (y / h))
        b = int(30 + 40 * (1 - y / h))
        raw += bytes((r, g, b))

png = b"\x89PNG\r\n\x1a\n"
png += png_chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
png += png_chunk(b"tEXt", b"Author\x00Bromo Forensic Unit")
png += png_chunk(b"tEXt", b"Description\x00Gunung tidak berbohong.")
png += png_chunk(b"tEXt", ("Comment\x00" + FLAGS["bromo-whisper"]).encode())
png += png_chunk(b"IDAT", zlib.compress(raw, 9))
png += png_chunk(b"IEND", b"")
(OUT / "files").mkdir(exist_ok=True)
(OUT / "files" / "bromo.png").write_bytes(png)

# ---------- CH4: majapahit.wav morse of "GEMA MAJAPAHIT" ----------
MORSE = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.',
}
MSG = "GEMA MAJAPAHIT"
SR = 22050
UNIT = 0.09  # seconds per dit
FREQ = 750.0

def tone(dur):
    n = int(SR * dur)
    return b"".join(
        struct.pack("<h", int(12000 * math.sin(2 * math.pi * FREQ * i / SR)))
        for i in range(n)
    )
def silence(dur):
    return b"\x00\x00" * int(SR * dur)

audio = b""
for ch in MSG:
    if ch == ' ':
        audio += silence(UNIT * 7)
        continue
    for sym in MORSE[ch]:
        audio += tone(UNIT if sym == '.' else UNIT * 3)
        audio += silence(UNIT)
    audio += silence(UNIT * 2)

with wave.open(str(OUT / "files" / "majapahit.wav"), "wb") as wf:
    wf.setnchannels(1)
    wf.setsampwidth(2)
    wf.setframerate(SR)
    wf.writeframes(audio)

# ---------- CH5: XOR cipher bytes for third-eye ----------
f5 = FLAGS["third-eye"]
key = "JATIMCYBER"
cipher = [b ^ ord(key[i % len(key)]) for i, b in enumerate(f5.encode())]
print("\nTHIRD-EYE XOR CIPHER BYTES:")
print(cipher)
(OUT / "vault" / "third-eye.bin").write_bytes(bytes(cipher))

# ---------- CH6 secret (committed then deleted via git) ----------
print("\nDone. Files written to", OUT)
