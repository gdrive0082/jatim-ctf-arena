// ============================================================
// CATATAN INTERNAL — BUKAN UNTUK PRODUKSI
// ============================================================
// TODO(sekuriti): file ini TIDAK BOLEH ikut build publik.
// Sementara ini, kredensial darurat disimpan di sini:
//
//   BENDERALAPDARURAT = JTCS{s0urc3_m4p_l34k}
//
// Segera pindahkan ke vault. Siapa pun yang membaca source
// lengkap kita bisa melihat ini. Untung source map tidak
// pernah ikut ter-deploy... kan?
// ============================================================

export const INTERNAL_BUILD = "webexp-2026.08";

export function internalNotes(): number {
  // panjang catatan internal, untuk telemetri kasar
  return INTERNAL_BUILD.length;
}
