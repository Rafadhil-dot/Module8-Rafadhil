let proyek = [];

const daftarProyek = document.querySelector("#daftar-proyek");
const jumlahProyek = document.querySelector("#jumlah-proyek");
const daftarKeahlian = document.querySelector("#daftar-keahlian");
const statusKeahlian = document.querySelector("#status-keahlian");

// ==================== PROYEK (data/proyek.json) ====================
function buatKartu(item) {
    return `
    <article class="project-item">
        <img src="${item.gambar}" alt="${item.alt}" class="project-img">
        <span class="label">${item.kategori}</span>
        <h2 class="section-heading" style="margin-top: 8px;">${item.judul}</h2>
        <p class="bio-text" style="margin-bottom: 12px;">${item.deskripsi}</p>
    </article>`;
}

function tampilkanProyek(daftar) {
    if (!daftarProyek) return;
    const semuaKartu = daftar.map((item) => buatKartu(item));
    daftarProyek.innerHTML = semuaKartu.join("");
    if (jumlahProyek) {
        jumlahProyek.textContent = `Menampilkan ${daftar.length} dari ${proyek.length} proyek`;
    }
}

function pasangFilter(idTombol, kategori) {
    const tombol = document.querySelector(idTombol);
    if (!tombol) return;

    tombol.addEventListener("click", () => {
        document.querySelectorAll(".tombol-filter").forEach((b) => b.classList.remove("aktif"));
        tombol.classList.add("aktif");

        if (kategori === "Semua") {
            tampilkanProyek(proyek);
        } else {
            tampilkanProyek(proyek.filter((item) => item.kategori === kategori));
        }
    });
}

async function muatProyek() {
    if (!daftarProyek) return;

    if (jumlahProyek) {
        jumlahProyek.textContent = "Memuat data proyek...";
    }

    try {
        const response = await fetch("data/proyek.json");
        if (!response.ok) {
            throw new Error(`Gagal memuat data proyek (Status: ${response.status})`);
        }

        const data = await response.json();
        proyek = Array.isArray(data) ? data : [];
        tampilkanProyek(proyek);
    } catch (error) {
        daftarProyek.innerHTML = `<p class="bio-text">Terjadi kesalahan saat memuat proyek: ${error.message}</p>`;
        if (jumlahProyek) {
            jumlahProyek.textContent = "Gagal memuat proyek.";
        }
    }
}

if (daftarProyek) {
    pasangFilter("#filter-semua", "Semua");
    pasangFilter("#filter-html", "HTML");
    pasangFilter("#filter-css", "CSS");
    pasangFilter("#filter-javascript", "JavaScript");
    muatProyek();
}

// ==================== KEAHLIAN (data/keahlian.json) ====================
async function muatKeahlian() {
    if (!daftarKeahlian) return;

    if (statusKeahlian) {
        statusKeahlian.textContent = "Memuat data keahlian...";
    }

    try {
        const response = await fetch("data/keahlian.json");
        if (!response.ok) {
            throw new Error(`Gagal memuat data keahlian (Status: ${response.status})`);
        }

        const keahlianList = await response.json();
        if (!Array.isArray(keahlianList) || keahlianList.length === 0) {
            daftarKeahlian.innerHTML = `<p class="bio-text">Belum ada data keahlian.</p>`;
            if (statusKeahlian) statusKeahlian.textContent = "";
            return;
        }

        daftarKeahlian.innerHTML = keahlianList
            .map((skill) => {
                const judul = skill.nama;
                const level = skill.level || "";
                const deskripsi = skill.deskripsi || "";
                const info = deskripsi
                    ? `${deskripsi}${level ? ` (Level: ${level})` : ""}`
                    : level;

                return `
                <button type="button" class="skill-card" data-title="${judul}" data-info="${info}">
                    <div class="skill-card-top">
                        <strong class="skill-title">${judul}</strong>
                        ${level ? `<span class="skill-meta">${level}</span>` : ""}
                    </div>
                    ${deskripsi ? `<p class="skill-desc">${deskripsi}</p>` : ""}
                </button>`;
            })
            .join("");

        if (statusKeahlian) {
            statusKeahlian.textContent = "";
        }
    } catch (error) {
        daftarKeahlian.innerHTML = `<p class="bio-text">Gagal memuat keahlian: ${error.message}</p>`;
        if (statusKeahlian) {
            statusKeahlian.textContent = "";
        }
    }
}

muatKeahlian();

// ==================== MODAL KEAHLIAN ====================
const modalSkill = document.querySelector("#modalSkill");
const modalSkillTitle = document.querySelector("#modalSkillTitle");
const modalSkillInfo = document.querySelector("#modalSkillInfo");
const btnTutupModalSkill = document.querySelector("#btnTutupModalSkill");

if (daftarKeahlian && modalSkill && modalSkillTitle && modalSkillInfo) {
    daftarKeahlian.addEventListener("click", (event) => {
        const kartu = event.target.closest(".skill-card");
        if (!kartu) return;

        modalSkillTitle.textContent = kartu.dataset.title || "Detail Keahlian";
        modalSkillInfo.textContent = kartu.dataset.info || "";
        modalSkill.classList.add("show");
    });
}

if (btnTutupModalSkill && modalSkill) {
    btnTutupModalSkill.addEventListener("click", () => {
        modalSkill.classList.remove("show");
    });
}

if (modalSkill) {
    modalSkill.addEventListener("click", (event) => {
        if (event.target === modalSkill) {
            modalSkill.classList.remove("show");
        }
    });
}

// ==================== REPOSITORI GITHUB ====================
const usernameGitHub = "Rafadhil-dot";
const statusRepo = document.querySelector("#status-repo");
const daftarRepo = document.querySelector("#daftar-repo");

async function muatRepositoriGitHub() {
    if (!statusRepo || !daftarRepo) return;

    statusRepo.textContent = "Memuat repositori GitHub...";
    daftarRepo.innerHTML = "";

    try {
        const response = await fetch(`https://api.github.com/users/${usernameGitHub}/repos?per_page=100`);
        if (!response.ok) {
            throw new Error(`Gagal memuat data (Status: ${response.status})`);
        }

        const repos = await response.json();

        if (!Array.isArray(repos) || repos.length === 0) {
            statusRepo.textContent = "Belum ada repositori publik yang ditemukan.";
            return;
        }

        repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        const repoTeratas = repos.slice(0, 6);

        daftarRepo.innerHTML = repoTeratas
            .map((repo) => {
                const bahasa = repo.language
                    ? `<span class="repo-lang">${repo.language}</span>`
                    : `<span class="repo-lang">Tanpa Bahasa</span>`;
                const bintang = `<span class="repo-stars">⭐ ${repo.stargazers_count}</span>`;
                const deskripsi = repo.description
                    ? `<p class="repo-desc">${repo.description}</p>`
                    : `<p class="repo-desc repo-desc-empty">Tidak ada deskripsi repositori.</p>`;

                return `
                <li class="repo-card">
                    <div class="repo-card-header">
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name">${repo.name}</a>
                        ${bintang}
                    </div>
                    ${deskripsi}
                    <div class="repo-card-footer">
                        ${bahasa}
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-open">Lihat Repo →</a>
                    </div>
                </li>`;
            })
            .join("");

        statusRepo.textContent = `Menampilkan ${repoTeratas.length} repositori terbaru dari @${usernameGitHub}.`;
    } catch (error) {
        statusRepo.textContent = `Terjadi kesalahan saat memuat repositori: ${error.message}`;
    }
}

muatRepositoriGitHub();

// ==================== TEMA TERANG / GELAP ====================
const tombolTema = document.querySelector("#btnToggleTema");

if (localStorage.getItem("tema") === "light") {
    document.body.classList.add("light-mode");
    if (tombolTema) tombolTema.textContent = "🌙 Mode Gelap";
} else {
    if (tombolTema) tombolTema.textContent = "🔆 Mode Terang";
}

if (tombolTema) {
    tombolTema.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");

        if (document.body.classList.contains("light-mode")) {
            localStorage.setItem("tema", "light");
            tombolTema.textContent = "🌙 Mode Gelap";
        } else {
            localStorage.setItem("tema", "dark");
            tombolTema.textContent = "🔆 Mode Terang";
        }
    });
}

// ==================== HITUNG KARAKTER PESAN ====================
const kotakPesan = document.querySelector("#pesan");
const hitungKarakter = document.querySelector("#hitung-karakter");

if (kotakPesan && hitungKarakter) {
    kotakPesan.addEventListener("input", () => {
        hitungKarakter.textContent = `${kotakPesan.value.length}/300 karakter`;
    });
}