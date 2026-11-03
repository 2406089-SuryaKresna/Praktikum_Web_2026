"use strict";

// ==========================================
// STATE & STORAGE
// ==========================================
const STORAGE_KEY = "todo_app_tasks";

// Ambil data dari LocalStorage (jika ada)
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ==========================================
// ELEMEN DOM
// ==========================================
const todoForm         = document.getElementById("todoForm");
const taskInput        = document.getElementById("taskInput");
const todoList         = document.getElementById("todoList");
const inputError       = document.getElementById("inputError");
const taskCounter      = document.getElementById("taskCounter");       // ✅ Fitur 1
const clearCompletedBtn = document.getElementById("clearCompletedBtn"); // ✅ Fitur 2

// ==========================================
// HELPER: Simpan ke LocalStorage
// ==========================================
const saveTasks = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

// ==========================================
// ✅ FITUR 1: Update Ringkasan Jumlah Tugas
// ==========================================
const updateCounter = () => {
    const total     = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending   = total - completed;

    taskCounter.textContent =
        `Total: ${total} Tugas | Selesai: ${completed} | Belum Selesai: ${pending}`;

    // Tombol bersihkan otomatis disabled jika tidak ada tugas selesai
    clearCompletedBtn.disabled = completed === 0;
};

// ==========================================
// RENDER DAFTAR TUGAS
// ==========================================
const renderTasks = () => {
    if (tasks.length === 0) {
        todoList.innerHTML = `<li class="empty-state">Belum ada tugas. Tambahkan tugas baru!</li>`;
    } else {
        todoList.innerHTML = tasks.map(task => `
            <li class="todo-item ${task.completed ? "completed" : ""}" data-id="${task.id}">
                <span class="task-text">${escapeHTML(task.text)}</span>
                <div class="task-actions">
                    <button type="button" class="toggle-btn" data-action="toggle" data-id="${task.id}">
                        ${task.completed ? "↩️ Batal" : "✅ Selesai"}
                    </button>
                    <button type="button" class="delete-btn" data-action="delete" data-id="${task.id}">
                        🗑️ Hapus
                    </button>
                </div>
            </li>
        `).join("");
    }

    updateCounter(); // ✅ Fitur 1 selalu sinkron
    saveTasks();     // 💾 Simpan ke LocalStorage
};

// ==========================================
// HELPER: Escape HTML (anti-XSS)
// ==========================================
const escapeHTML = (str) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return String(str).replace(/[&<>"']/g, c => map[c]);
};

// ==========================================
// TAMBAH TUGAS BARU
// ==========================================
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const text = taskInput.value.trim();

    // Validasi minimal 3 karakter
    if (text.length < 3) {
        inputError.style.display = "block";
        taskInput.focus();
        return;
    }

    inputError.style.display = "none";

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    taskInput.value = "";
    renderTasks();
});

// Sembunyikan error saat user mulai mengetik
taskInput.addEventListener("input", () => {
    if (taskInput.value.trim().length >= 3) {
        inputError.style.display = "none";
    }
});

// ==========================================
// EVENT DELEGATION: TOGGLE & DELETE
// ==========================================
todoList.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return;

    // Toggle status selesai / belum
    if (action === "toggle") {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
        return;
    }

    // ✅ FITUR 3: Konfirmasi sebelum menghapus
    if (action === "delete") {
        const confirmation = confirm("Apakah Anda yakin ingin menghapus tugas ini?");
        if (!confirmation) return; // user klik Cancel → batal hapus

        tasks.splice(index, 1);
        renderTasks();
    }
});

// ==========================================
// ✅ FITUR 2: Bersihkan Hanya Tugas Selesai
// ==========================================
clearCompletedBtn.addEventListener("click", () => {
    const completedCount = tasks.filter(t => t.completed).length;

    if (completedCount === 0) {
        alert("Tidak ada tugas selesai untuk dibersihkan.");
        return;
    }

    const confirmation = confirm(
        `Hapus ${completedCount} tugas yang sudah selesai?`
    );
    if (!confirmation) return;

    // Simpan hanya tugas yang BELUM selesai
    tasks = tasks.filter(t => !t.completed);
    renderTasks();
});

// ==========================================
// INIT: Render saat halaman pertama dibuka
// ==========================================
renderTasks();