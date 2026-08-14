#!/bin/bash

# Nama branch tujuan (ubah sesuai kebutuhan)
BRANCH="main"

# Pesan commit otomatis (bisa diubah)
COMMIT_MESSAGE="Deploy: $(date '+%Y-%m-%d %H:%M:%S')"

# Pastikan skrip berhenti jika ada error
set -e

# Periksa status Git
if git diff --quiet && git diff --staged --quiet; then
    echo "⚠️  Tidak ada perubahan untuk di-push."
    exit 0
fi

# Tambahkan semua perubahan
git add .

# Commit dengan pesan otomatis
git commit -m "$COMMIT_MESSAGE"

# Push ke branch tujuan
git push origin "$BRANCH"

# Pesan sukses
echo "✅ Deploy ke GitHub selesai di branch $BRANCH"
