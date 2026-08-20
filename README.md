# JATIM CYBERSEC — CTF ARENA

Arena Capture The Flag (CTF) tingkat **HARD** untuk komunitas Jawa Timur Cybersecurity.
Enam challenge jeopardy-style yang bisa diselesaikan langsung dari website, repo ini, dan file artefak yang disediakan.

## Kategori Challenge

| Codename | Kategori | Poin | Teknik |
|---|---|---|---|
| ROBOT-TRACE | Recon / Web | 300 | robots.txt + encoding berlapis |
| BATIK-CIPHER | Cryptography | 400 | ROT13 → Base64 → Hex |
| BROMO-WHISPER | Forensics | 400 | PNG metadata (tEXt chunk) |
| MAJAPAHIT-ECHO | Steganography | 500 | Sandi Morse pada audio WAV |
| THIRD-EYE | Reversing | 600 | XOR cipher, kunci terbelah di HTML + JS |
| KERA-SAKTI | OSINT / Git | 600 | Forensik riwayat git |

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
