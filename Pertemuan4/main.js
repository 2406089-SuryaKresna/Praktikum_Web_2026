
"use strict";

// Data awal proyek menggunakan Array of Objects
const projects = [
    {
        id: 1,
        title: "Sistem Inventaris Keuangan",
        category: "Web App",
        budget: 2500000,
        completed: true
    },
    {
        id: 2,
        title: "Sistem Kasir Digital",
        category: "Desktop App",
        budget: 5000000,
        completed: true
    },
    {
        id: 3,
        title: "Website Portofolio",
        category: "Web App",
        budget: 1500000,
        completed: false
    },
    {
        id: 4,
        title: "Aplikasi Presensi Mobile",
        category: "Mobile App",
        budget: 4500000,
        completed: false
    }
];

// Mengambil elemen HTML
const projectForm = document.getElementById("projectForm");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const budgetInput = document.getElementById("budget");
const completedInput = document.getElementById("completed");
const searchInput = document.getElementById("search");
const filterCategory = document.getElementById("filterCategory");
const projectList = document.getElementById("projectList");

// Format angka menjadi Rupiah
const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(amount);
};

// Memperbarui statistik
const updateStatistics = () => {
    const totalProjects = projects.length;

    // reduce() menghitung total anggaran
    const totalBudget = projects.reduce(
        (total, project) => total + project.budget,
        0
    );

    // filter() menghitung proyek yang selesai
    const completedProjects = projects.filter(
        project => project.completed
    ).length;

    document.getElementById("totalProjects").textContent =
        totalProjects;

    document.getElementById("totalBudget").textContent =
        formatRupiah(totalBudget);

    document.getElementById("completedProjects").textContent =
        completedProjects;
};

// Mencegah input teks dianggap sebagai HTML
const escapeHTML = (value) => {
    const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    };

    return String(value).replace(/[&<>"']/g, char => entities[char]);
};

// Menampilkan proyek berdasarkan pencarian dan filter
const renderProjects = () => {
    const keyword = searchInput.value.trim().toLowerCase();
    const selectedCategory = filterCategory.value;

    // filter() mencari proyek sesuai nama dan kategori
    const filteredProjects = projects.filter(project => {
        const matchesName = project.title
            .toLowerCase()
            .includes(keyword);

        const matchesCategory =
            selectedCategory === "Semua" ||
            project.category === selectedCategory;

        return matchesName && matchesCategory;
    });

    if (filteredProjects.length === 0) {
        projectList.innerHTML = `
            <div class="empty">
                Tidak ada proyek yang ditemukan.
            </div>
        `;
        return;
    }

    // map() mengubah setiap objek menjadi kartu HTML
    projectList.innerHTML = filteredProjects.map(project => {
        const status = project.completed
            ? "Selesai"
            : "Dalam Pengerjaan";

        const statusClass = project.completed
            ? "done"
            : "pending";

        const toggleText = project.completed
            ? "Ubah ke Proses"
            : "Tandai Selesai";

        return `
            <div class="project-card">
                <div class="project-info">
                    <span class="category">
                        ${escapeHTML(project.category)}
                    </span>

                    <h3>${escapeHTML(project.title)}</h3>

                    <p>Anggaran: ${formatRupiah(project.budget)}</p>

                    <p class="status ${statusClass}">
                        Status: ${status}
                    </p>
                </div>

                <div class="actions">
                    <button
                        type="button"
                        data-action="toggle"
                        data-id="${project.id}">
                        ${toggleText}
                    </button>

                    <button
                        type="button"
                        class="delete-button"
                        data-action="delete"
                        data-id="${project.id}">
                        Hapus
                    </button>
                </div>
            </div>
        `;
    }).join("");
};

// Memperbarui daftar dan statistik
const refreshDashboard = () => {
    renderProjects();
    updateStatistics();
};

// Menambahkan proyek baru
projectForm.addEventListener("submit", event => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const budget = Number(budgetInput.value);
    const completed = completedInput.checked;

    if (title === "") {
        alert("Judul proyek tidak boleh kosong!");
        return;
    }

    if (!Number.isFinite(budget) || budget <= 0) {
        alert("Anggaran harus lebih besar dari 0!");
        return;
    }

    const newProject = {
        id: Date.now(),
        title,
        category,
        budget,
        completed
    };

    projects.push(newProject);

    projectForm.reset();

    // Kembalikan filter ke keadaan awal
    searchInput.value = "";
    filterCategory.value = "Semua";

    refreshDashboard();

    alert("Proyek berhasil ditambahkan!");
});

// Pencarian real-time
searchInput.addEventListener("input", renderProjects);

// Filter berdasarkan kategori
filterCategory.addEventListener("change", renderProjects);

// Mengubah status dan menghapus proyek
projectList.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    const projectIndex = projects.findIndex(
        project => project.id === id
    );

    if (projectIndex === -1) return;

    if (action === "toggle") {
        projects[projectIndex].completed =
            !projects[projectIndex].completed;
    }

    if (action === "delete") {
        const projectName = projects[projectIndex].title;

        const confirmation = confirm(
            `Apakah Anda yakin ingin menghapus "${projectName}"?`
        );

        if (!confirmation) return;

        projects.splice(projectIndex, 1);
    }

    refreshDashboard();
});

// Menampilkan data ketika halaman pertama kali dibuka
refreshDashboard();
