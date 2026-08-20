"""Generate TIER 4 — WEB EXPLOIT artifacts."""
import hashlib, json, random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public"
rng = random.Random(77)

FLAGS = {
    "dom-xss":        "JTCS{d0m_xss_0wn3d_th3_p4g3}",
    "sqli-login":     "JTCS{0r_1_3qu4ls_1_d4sh_d4sh}",
    "ssti-eval":      "JTCS{sst1_3v4l_1nj3ct3d}",
    "proto-pollute":  "JTCS{pr0t0_p0llut10n_1s_4dm1n}",
    "idor-users":     "JTCS{1d0r_us3r_z3r0_4dm1n}",
    "path-traversal": "JTCS{d0t_d0t_sl4sh_byp4ss}",
    "sourcemap-leak": "JTCS{s0urc3_m4p_l34k}",
    "bac-admin":      "JTCS{l0c4lst0r4g3_n0t_4uth}",
    "otp-brute":      "JTCS{0tp_n0_r4t3_l1m1t}",
    "dir-buster":     "JTCS{d1r3ct0ry_bust3d}",
}
hashes = {k: hashlib.sha256(v.encode()).hexdigest() for k, v in FLAGS.items()}
print("WEB-EXPLOIT FLAG HASHES:")
print(json.dumps(hashes, indent=2))

# ---------- IDOR: /api/users/0..7.json, admin di id=0 ----------
(OUT / "api" / "users").mkdir(parents=True, exist_ok=True)
names = ["admin", "arek_sby", "cak_mlg", "ning_kdr", "mas_jbr", "mbak_bwi", "pak_mdn", "bk_pas"]
for i in range(8):
    user = {
        "id": i,
        "username": names[i],
        "role": "admin" if i == 0 else "user",
        "email": f"{names[i]}@jatim-cybersec.id",
    }
    if i == 0:
        user["catatan_admin"] = "Akses penuh. Bendera gudang: " + FLAGS["idor-users"]
    (OUT / "api" / "users" / f"{i}.json").write_text(json.dumps(user, indent=2) + "\n")

# ---------- Path traversal: vault/read/ + vault/secret/ ----------
(OUT / "vault" / "read").mkdir(exist_ok=True)
(OUT / "vault" / "read" / "welcome.txt").write_text(
    "Selamat datang di layanan pembaca dokumen internal.\n"
    "Layanan ini hanya boleh membaca berkas di direktori ini.\n"
)
(OUT / "vault" / "read" / "panduan.txt").write_text(
    "PANDUAN: gunakan parameter ?file=<nama> untuk membaca dokumen publik.\n"
)
(OUT / "vault" / "secret").mkdir(exist_ok=True)
(OUT / "vault" / "secret" / "flag-internal.txt").write_text(
    "DOKUMEN SANGAT RAHASIA — INTERNAL ONLY\n"
    "======================================\n\n"
    "Bendera traversal: " + FLAGS["path-traversal"] + "\n"
)

# ---------- Dir buster: /panel-3ng1n33r/index.html ----------
(OUT / "panel-3ng1n33r").mkdir(exist_ok=True)
(OUT / "panel-3ng1n33r" / "index.html").write_text(
    "<!doctype html><html><head><meta charset='utf-8'><title>panel teknisi</title></head>"
    "<body style='background:#120a03;color:#f59e0b;font-family:monospace;padding:3rem'>"
    "<h1>PANEL TEKNISI — 3NG1N33R ONLY</h1>"
    "<p>Bagaimana kamu menemukan tempat ini?</p>"
    "<p>Bendera teknisi: <b style='color:#fde047'>" + FLAGS["dir-buster"] + "</b></p>"
    "</body></html>\n"
)

# ---------- OTP brute: otp -> xor(flag, sha256(otp)) ----------
otp = f"{rng.randrange(0, 1000000):06d}"
key = hashlib.sha256(otp.encode()).digest()
enc = bytes(b ^ key[i % 32] for i, b in enumerate(FLAGS["otp-brute"].encode()))
print("\nOTP (rahasia):", otp)
print("OTP_HASH =", hashlib.sha256(otp.encode()).hexdigest())
print("OTP_ENC_HEX =", enc.hex())
dec = bytes(b ^ key[i % 32] for i, b in enumerate(enc)).decode()
assert dec == FLAGS["otp-brute"]

# ---------- Source map: konstanta internal (ditanam di src) ----------
print("\nINTERNAL-NOTES FLAG:", FLAGS["sourcemap-leak"])
print("\nAll web-exploit artifacts generated & self-verified.")
