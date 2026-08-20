"""Generate ZERO-DAY tier + 2 new tier-1 challenge artifacts."""
import base64, codecs, gzip, hashlib, json, os, random, struct, subprocess, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public"
rng = random.Random(4242)

FLAGS = {
    "header-whisper":  "JTCS{h34d3rs_wh1sp3r_s3cr3ts}",
    "cookie-monster":  "JTCS{c00k13_m0nst3r_4t3_th3_s3ss10n}",
    "fermat-rsa":      "JTCS{rs4_f3rm4t_f4ct0r3d}",
    "pin-vault":       "JTCS{p1n_brut3_f0rc3d_0p3n}",
    "usb-ghost":       "JTCS{usb_k3yl0gg3r_c4ptur3d}",
    "polyglot":        "JTCS{p0lygl0t_f1l3_unz1pp3d}",
    "broken-image":    "JTCS{h3x_3d1t0r_r3p41r3d_m3}",
    "encoding-tower":  "JTCS{s3v3n_l4y3rs_0f_p41n}",
    "brainfuck":       "JTCS{br41nfck_1nt3rpr3t3r}",
    "heap-bleed":      "JTCS{h34rtbl33d_h34p_c4rv1ng}",
}
hashes = {k: hashlib.sha256(v.encode()).hexdigest() for k, v in FLAGS.items()}
print("NEW FLAG HASHES:")
print(json.dumps(hashes, indent=2))

# ---------- CH fermat-rsa: RSA dengan p,q berdekatan (Fermat factorization) ----------
def is_prime(n, k=20):
    if n < 2: return False
    for p in [2,3,5,7,11,13,17,19,23,29,31,37]:
        if n % p == 0: return n == p
    d, r = n - 1, 0
    while d % 2 == 0: d //= 2; r += 1
    for _ in range(k):
        a = rng.randrange(2, n - 2)
        x = pow(a, d, n)
        if x in (1, n - 1): continue
        for _ in range(r - 1):
            x = pow(x, 2, n)
            if x == n - 1: break
        else: return False
    return True

def gen_prime_near(center):
    c = center | 1
    while not is_prime(c): c += 2
    return c

base = rng.getrandbits(256) | (1 << 255) | 1
p = gen_prime_near(base)
q = gen_prime_near(p + rng.randrange(100, 5000))
n, e = p * q, 65537
m = int.from_bytes(FLAGS["fermat-rsa"].encode(), "big")
assert m < n
c = pow(m, e, n)
(OUT / "vault" / "rsa-weak.txt").write_text(
    "INTERSEPSI RSA — kunci publik target bocor\n"
    "==========================================\n\n"
    f"n = {n}\ne = {e}\nc = {c}\n\n"
    "catatan analis: implementasi RSA target memakai dua prima yang\n"
    "dibangkitkan berdekatan satu sama lain. modulus 512-bit.\n"
)
# verify Fermat solve
a0 = __import__("math").isqrt(n) + 1
while True:
    b2 = a0 * a0 - n
    b = __import__("math").isqrt(b2)
    if b * b == b2:
        pf, qf = a0 - b, a0 + b
        if pf * qf == n: break
    a0 += 1
phi = (pf - 1) * (qf - 1)
d = pow(e, -1, phi)
mback = pow(c, d, n)
assert mback == m
assert mback.to_bytes((mback.bit_length() + 7) // 8, "big") == FLAGS["fermat-rsa"].encode()
print("RSA Fermat verified. bits:", n.bit_length())

# ---------- CH pin-vault: AES-256-CBC, key=sha256(pin), iv=0 ----------
pin = "1945"
key_hex = hashlib.sha256(pin.encode()).hexdigest()
subprocess.run(
    ["openssl", "enc", "-aes-256-cbc", "-K", key_hex,
     "-iv", "0" * 32, "-in", "/dev/stdin", "-out", str(OUT / "files" / "vault-pin.bin")],
    input=FLAGS["pin-vault"].encode(), check=True)
# verify decrypt
dec = subprocess.run(
    ["openssl", "enc", "-d", "-aes-256-cbc", "-K", key_hex,
     "-iv", "0" * 32, "-in", str(OUT / "files" / "vault-pin.bin")],
    capture_output=True, check=True).stdout.decode()
assert dec == FLAGS["pin-vault"]
print("pin-vault verified. pin =", pin)

# ---------- CH usb-ghost: keyboard-hantu.pcap (usbmon linktype 189) ----------
HID = {}
for i, ch in enumerate("abcdefghijklmnopqrstuvwxyz"): HID[ch] = (0, 0x04 + i)
for i, ch in enumerate("1234567890"): HID[ch] = (0, 0x1E + i)
HID.update({" ": (0, 0x2C), "-": (0, 0x2D), "=": (0, 0x2E),
            "{": (2, 0x2F), "}": (2, 0x30), "_": (2, 0x2D)})
def hid_char(ch):
    if ch.isupper(): return (2, HID[ch.lower()][1])
    return HID[ch]

def usbmon_pkt(payload: bytes, ts: int) -> bytes:
    hdr = struct.pack("<QBBBBHBBq i i I I 8s".replace(" ", ""),
                      rng.getrandbits(63), ord('C'), 1, 0x81, 3, 2, 0, 0,
                      ts, rng.randrange(999999), 0, len(payload), len(payload),
                      b"\x00" * 8)
    return hdr + payload

pcap = struct.pack("<IHHIIII", 0xA1B2C3D4, 2, 4, 0, 0, 65535, 189)
ts = 1755220000
for ch in FLAGS["usb-ghost"]:
    mod, code = hid_char(ch)
    for rep in (bytes([mod, 0, code, 0, 0, 0, 0, 0]), b"\x00" * 8):
        pkt = usbmon_pkt(rep, ts)
        pcap += struct.pack("<IIII", ts, 0, len(pkt), len(pkt)) + pkt
        ts += rng.randint(1, 3)
(OUT / "files" / "keyboard-hantu.pcap").write_bytes(pcap)
# self-verify decode
raw = pcap
off, decoded = 24, ""
codemap = {HID[c][1]: c for c in "abcdefghijklmnopqrstuvwxyz1234567890"}
codemap[0x2D] = "-"; codemap[0x2F] = "["; codemap[0x30] = "]"
SHIFT = {"[": "{", "]": "}", "-": "_"}
while off < len(raw):
    t, u, ln, _ = struct.unpack("<IIII", raw[off:off+16]); off += 16
    body = raw[off+48:off+ln]; off += ln
    if len(body) == 8 and body[2]:
        base = codemap.get(body[2])
        if base:
            decoded += SHIFT.get(base, base.upper()) if body[0] == 2 else base
print("usb-hid self-decode:", decoded)
assert decoded == FLAGS["usb-ghost"]

# ---------- CH polyglot: matahari.png + zip ----------
import zlib as _zlib
def png_chunk(t, d):
    c = struct.pack(">I", len(d)) + t + d
    return c + struct.pack(">I", _zlib.crc32(t + d) & 0xFFFFFFFF)
w, h = 500, 280
raw_img = b""
for y in range(h):
    raw_img += b"\x00"
    for x in range(w):
        raw_img += bytes((int(255 * (x / w)), int(140 * (y / h)), 20))
png = (b"\x89PNG\r\n\x1a\n"
       + png_chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
       + png_chunk(b"IDAT", _zlib.compress(raw_img, 9)) + png_chunk(b"IEND", b""))
zip_path = OUT / "files" / "_inner.zip"
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    z.writestr("rahasia/flag.txt",
               "Kamu membongkar arsip tersembunyi.\n\n" + FLAGS["polyglot"] + "\n")
(OUT / "files" / "matahari.png").write_bytes(png + zip_path.read_bytes())
zip_path.unlink()
print("polyglot size:", len(png), "png + zip appended")

# ---------- CH broken-image: rusak.png (IHDR height dikorupsi ke 1) ----------
from PIL import Image, ImageDraw, ImageFont
img = Image.new("RGB", (800, 400), (5, 10, 8))
dr = ImageDraw.Draw(img)
try:
    font = ImageFont.truetype("/System/Library/Fonts/Monaco.ttf", 34)
except Exception:
    font = ImageFont.load_default()
dr.text((40, 150), FLAGS["broken-image"], fill=(16, 185, 129), font=font)
dr.text((40, 230), "selamat, kau memperbaikiku", fill=(80, 90, 85), font=font)
img.save(OUT / "files" / "_fixed.png")
fixed = (OUT / "files" / "_fixed.png").read_bytes()
# corrupt IHDR height -> 1, fix its CRC so it looks "valid"
import zlib as _z
ihdr_data = fixed[16:29]
w_ok, _h_ok = struct.unpack(">II", ihdr_data[:8])
bad_ihdr = struct.pack(">I", w_ok) + struct.pack(">I", 1) + ihdr_data[8:]
bad_png = (fixed[:8]
           + struct.pack(">I", 13) + b"IHDR" + bad_ihdr
           + struct.pack(">I", _z.crc32(b"IHDR" + bad_ihdr) & 0xFFFFFFFF)
           + fixed[33:])
(OUT / "files" / "rusak.png").write_bytes(bad_png)
# self-verify repair
d = bad_png
good_ihdr = struct.pack(">I", w_ok) + struct.pack(">I", 400) + d[24:29]
fixed2 = (d[:8] + struct.pack(">I", 13) + b"IHDR" + good_ihdr
          + struct.pack(">I", _z.crc32(b"IHDR" + good_ihdr) & 0xFFFFFFFF) + d[33:])
(OUT / "files" / "_check.png").write_bytes(fixed2)
chk = Image.open(OUT / "files" / "_check.png"); chk.load()
assert chk.size == (800, 400)
(OUT / "files" / "_fixed.png").unlink(); (OUT / "files" / "_check.png").unlink()
print("broken-image verified, repairable to 800x400")

# ---------- CH encoding-tower: 7 lapis ----------
t = FLAGS["encoding-tower"]
t = base64.b64encode(t.encode()).decode()          # 1 base64
t = t.encode().hex()                                # 2 hex
t = base64.b32encode(t.encode()).decode()           # 3 base32
t = base64.b64encode(gzip.compress(t.encode())).decode()  # 4 gzip+b64
t = base64.b85encode(t.encode()).decode()           # 5 base85
t = codecs.encode(t, "rot13")                       # 6 rot13
t = t[::-1]                                         # 7 reverse
(OUT / "vault" / "menara.txt").write_text(
    "MENARA ENCODING — tujuh lapis\n"
    "=============================\n\n"
    f"{t}\n"
)
# verify unwind
u = t[::-1]
u = codecs.decode(u, "rot13")
u = base64.b85decode(u.encode()).decode()
u = gzip.decompress(base64.b64decode(u)).decode()
u = base64.b32decode(u.encode()).decode()
u = bytes.fromhex(u).decode()
u = base64.b64decode(u).decode()
assert u == FLAGS["encoding-tower"]
print("encoding-tower verified")

# ---------- CH brainfuck ----------
bf, cur = "", 0
for ch in FLAGS["brainfuck"]:
    d = ord(ch) - cur
    bf += ("+" * d) if d > 0 else ("-" * (-d))
    bf += "."
    cur = ord(ch)
(OUT / "vault" / "terlarang.bf").write_text(bf + "\n")
# verify interpret
cells, ptr, out, pc = [0]*30000, 0, "", 0
while pc < len(bf):
    op = bf[pc]
    if op == "+": cells[ptr] = (cells[ptr] + 1) % 256
    elif op == "-": cells[ptr] = (cells[ptr] - 1) % 256
    elif op == ".": out += chr(cells[ptr])
    pc += 1
assert out == FLAGS["brainfuck"]
print("brainfuck verified, program length:", len(bf))

# ---------- CH heap-bleed: heap-dump.bin ----------
marker = b"\xde\xad\xbe\xef"
enc = bytes(b ^ 0xAA for b in FLAGS["heap-bleed"].encode())
dump = bytearray(os.urandom(2 * 1024 * 1024))
off = rng.randrange(100000, len(dump) - 100000)
dump[off:off + 4 + len(enc) + 4] = marker + enc + marker
(OUT / "files" / "heap-dump.bin").write_bytes(bytes(dump))
# verify carve
d = (OUT / "files" / "heap-dump.bin").read_bytes()
i = d.find(marker)
j = d.find(marker, i + 4)
assert bytes(b ^ 0xAA for b in d[i+4:j]).decode() == FLAGS["heap-bleed"]
print("heap-bleed verified at offset", i)

# ---------- header whisper: vercel.json + api/status.json ----------
f1, f2, f3 = FLAGS["header-whisper"][:13], FLAGS["header-whisper"][13:23], FLAGS["header-whisper"][23:]
print("header parts:", repr(f1), repr(f2), repr(f3))
(OUT / "api").mkdir(exist_ok=True)
(OUT / "api" / "status.json").write_text(
    '{"status":"ok","service":"jatim-ctf-edge","hint":"body ini hanya pemanis — baca response headers-nya"}\n')
(ROOT / "vercel.json").write_text(json.dumps({
    "headers": [{
        "source": "/api/status.json",
        "headers": [
            {"key": "X-JTCS-Fragment-1", "value": f1},
            {"key": "X-JTCS-Fragment-2", "value": f2},
            {"key": "X-JTCS-Fragment-3", "value": f3},
        ],
    }],
}, indent=2) + "\n")
assert f1 + f2 + f3 == FLAGS["header-whisper"]

print("\nAll zero-day artifacts generated & self-verified.")
