# JATIM CYBERSEC — CTF ARENA

Arena Capture The Flag (CTF) untuk komunitas Jawa Timur Cybersecurity.
38 challenge jeopardy-style dalam 4 tier — semuanya bisa diselesaikan langsung dari website, repo ini, dan file artefak yang disediakan.

## Tier 1 — Pemanasan (HARD)

| Codename | Kategori | Poin | Teknik |
|---|---|---|---|
| SECURITY-TXT | Recon / Web | 250 | RFC 9116 /.well-known/security.txt |
| CSS-PHANTOM | Recon / Web | 250 | Custom property tersembunyi di stylesheet + Base64 |
| CONSOLE-WHISPER | Recon / Web | 250 | Fragmen flag di console DevTools |
| SITEMAP-GHOST | Recon / Web | 300 | Halaman hantu di sitemap.xml |
| ATBASH-BATIK | Cryptography | 350 | Sandi Atbash klasik |
| ROBOT-TRACE | Recon / Web | 300 | robots.txt + encoding berlapis |
| BATIK-CIPHER | Cryptography | 400 | ROT13 → Base64 → Hex |
| BROMO-WHISPER | Forensics | 400 | PNG metadata (tEXt chunk) |
| MAJAPAHIT-ECHO | Steganography | 500 | Sandi Morse pada audio WAV |
| RAIN-SPECTROGRAM | Steganography | 500 | Teks terlukis di spektrogram audio |
| THIRD-EYE | Reversing | 600 | XOR cipher, kunci terbelah di HTML + JS |
| KERA-SAKTI | OSINT / Git | 600 | Forensik riwayat git |
| HEADER-WHISPER | Recon / Web | 350 | Response header rahasia (curl -I) |
| COOKIE-MONSTER | Recon / Web | 350 | Inspeksi cookie via DevTools + Base64 |

## Tier 2 — CVE Level (INSANE)

| Codename | Kategori | Poin | Teknik |
|---|---|---|---|
| LOG4SHELL-AFTERMATH | DFIR | 700 | Analisis access.log, rekonstruksi eksfiltrasi JNDI (CVE-2021-44228) |
| SILENT-EXFIL | DFIR | 800 | Analisis PCAP, DNS tunneling ber-label Base32 |
| PETRA-BINARY | Binary Reversing | 800 | Bongkar binary Mach-O (Ghidra/r2/objdump), XOR rolling key |
| ROGUE-TOKEN | Cracking | 700 | Crack secret HMAC JWT (HS256 lemah, hashcat mode 16500) |
| SHADOW-LEAK | Cracking | 700 | Crack sha256($pass.$salt) (hashcat mode 1410) |
| EVIL-PICKLE | Exploit | 800 | Bedah Python pickle (insecure deserialization, XOR blob) |

## Tier 3 — ZERO-DAY

| Codename | Kategori | Poin | Teknik |
|---|---|---|---|
| FERMAT-RSA | Cryptography | 1000 | RSA 512-bit, prima berdekatan → Fermat factorization (ala ROCA CVE-2017-15361) |
| PIN-VAULT | Cracking | 900 | Brute-force PIN 4 digit, AES-256-CBC key = SHA256(pin) |
| USB-GHOST | Forensics | 950 | Decode USB HID keylogger capture (usbmon PCAP) |
| POLYGLOT | Steganography | 900 | Berkas PNG+ZIP polyglot, binwalk / unzip |
| BROKEN-IMAGE | Forensics | 900 | Perbaikan header PNG (IHDR + CRC) via hex editor |
| ENCODING-TOWER | Cryptography | 850 | Menara 7 lapis: reverse→ROT13→Base85→gzip→Base32→hex→Base64 |
| BRAINFUCK | Reversing | 850 | Interpretasi program Brainfuck |
| HEAP-BLEED | Forensics | 900 | Memory carving ala Heartbleed (CVE-2014-0160), marker 0xDEADBEEF + XOR |

## Tier 4 — Web Exploit (lab interaktif di /lab/*)

| Codename | Kategori | Poin | Teknik |
|---|---|---|---|
| DOM-XSS | Exploit | 700 | Reflected DOM XSS + event handler injection |
| SQLI-LOGIN | Exploit | 700 | SQL injection klasik ' OR '1'='1' -- |
| SSTI-EVAL | Exploit | 800 | Template injection, jelajah globalThis |
| PROTO-POLLUTE | Exploit | 800 | Prototype pollution via merge JSON rentan |
| IDOR-USERS | Exploit | 600 | Enumerasi /api/users/*.json tanpa otorisasi |
| PATH-TRAVERSAL | Exploit | 700 | Bypass filter ../ dengan ....// |
| SOURCEMAP-LEAK | Recon | 650 | sourcesContent di .js.map membocorkan catatan internal |
| BAC-ADMIN | Exploit | 600 | Broken access control via localStorage |
| OTP-BRUTE | Cracking | 750 | Brute-force OTP 6 digit tanpa rate limit |
| DIR-BUSTER | Recon | 550 | ffuf/gobuster menemukan panel tersembunyi |

Format flag: `JTCS{...}`

## Menjalankan Lokal

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # output ke dist/ (static site, siap deploy)
```

---

> ⚠️ Untuk peserta: repo ini **bagian dari arena**. Ada hantu di masa lalunya.
