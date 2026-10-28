
document.addEventListener("DOMContentLoaded", () => {

    // ========================================
    // 1. AMBIL ELEMEN DOM
    // ========================================

    const todoForm = document.querySelector("#todoForm");
    const taskInput = document.querySelector("#taskInput");
    const inputError = document.querySelector("#inputError");
    const todoList = document.querySelector("#todoList");

    // Periksa apakah elemen HTML ditemukan
    if (!todoForm || !taskInput || !inputError || !todoList) {
        console.error("Error: Elemen HTML Todo List tidak ditemukan.");
        return;
    }

    // ========================================
    // 2. LOCAL STORAGE
    // ========================================

    const getTasks = () => {
        try {
            return JSON.parse(localStorage.getItem("todo_tasks")) || [];
        } catch (error) {
            console.error("Gagal membaca data tugas:", error);
            return [];
        }
    };

    const saveTasks = (tasks) => {
        try {
            localStorage.setItem(
                "todo_tasks",
                JSON.stringify(tasks)
            );
        } catch (error) {
            console.error("Gagal menyimpan data tugas:", error);
            alert("Data tugas gagal disimpan.");
        }
    };

    // ========================================
    // 3. RENDER DAFTAR TUGAS
    // ========================================

    const renderTasks = () => {

        const tasks = getTasks();

        // Kosongkan daftar
        todoList.innerHTML = "";

        // Jika belum ada tugas
        if (tasks.length === 0) {

            const emptyMessage = document.createElement("p");

            emptyMessage.textContent = "Belum ada tugas tersimpan.";

            emptyMessage.style.textAlign = "center";
            emptyMessage.style.color = "#64748b";
            emptyMessage.style.fontSize = "13px";
            emptyMessage.style.padding = "10px";

            todoList.appendChild(emptyMessage);

            return;
        }

        // Tampilkan setiap tugas
        tasks.forEach((task, index) => {

            const li = document.createElement("li");

            li.className = `todo-item ${
                task.completed ? "completed" : ""
            }`;

            // Teks tugas
            const taskText = document.createElement("span");

            taskText.className = "todo-text";

            taskText.textContent = task.text;

            // Container tombol
            const actions = document.createElement("div");

            actions.className = "todo-actions";

            // Tombol selesai
            const completeButton = document.createElement("button");

            completeButton.className = "action-btn complete-btn";

            completeButton.dataset.index = index;

            completeButton.textContent = task.completed
                ? "Batal"
                : "Selesai";

            // Tombol hapus
            const deleteButton = document.createElement("button");

            deleteButton.className = "action-btn delete-btn";

            deleteButton.dataset.index = index;

            deleteButton.textContent = "Hapus";

            // Masukkan tombol ke container
            actions.appendChild(completeButton);

            actions.appendChild(deleteButton);

            // Masukkan elemen ke daftar
            li.appendChild(taskText);

            li.appendChild(actions);

            todoList.appendChild(li);

        });

    };

    // ========================================
    // 4. TAMBAH TUGAS
    // ========================================

    todoForm.addEventListener("submit", (e) => {

        // Mencegah halaman reload
        e.preventDefault();

        // Ambil teks input
        const taskText = taskInput.value.trim();

        // Validasi input
        if (taskText.length < 3) {

            taskInput.classList.add("error");

            inputError.style.display = "block";

            taskInput.focus();

            return;
        }

        // Hilangkan error
        taskInput.classList.remove("error");

        inputError.style.display = "none";

        // Ambil data tugas
        const tasks = getTasks();

        // Tambahkan tugas baru
        tasks.push({
            text: taskText,
            completed: false
        });

         if (tasks.length >= 5) {

        taskInput.classList.add("error");
        inputError.style.display = "block";
        taskInput.focus();
        return;
         }
        // Simpan tugas
        saveTasks(tasks);

        // Kosongkan input
        taskInput.value = "";

        // Render ulang
        renderTasks();

    });

    // ========================================
    // 5. EVENT LISTENER TOMBOL
    // ========================================

    todoList.addEventListener("click", (e) => {

        // Cari tombol yang diklik
        const button = e.target.closest("button");

        // Jika bukan tombol
        if (!button) return;

        // Ambil index tugas
        const index = Number(button.dataset.index);

        // Validasi index
        if (!Number.isInteger(index)) return;

        // Ambil data tugas
        const tasks = getTasks();

        // Pastikan tugas tersedia
        if (index < 0 || index >= tasks.length) return;

        // ========================================
        // TOMBOL SELESAI
        // ========================================

        if (button.classList.contains("complete-btn")) {

            // Ubah status tugas
            tasks[index].completed = !tasks[index].completed;

            // Simpan perubahan
            saveTasks(tasks);

            // Render ulang
            renderTasks();

        }

        // ========================================
        // TOMBOL HAPUS
        // ========================================

        else if (button.classList.contains("delete-btn")) {

            // Hapus tugas berdasarkan index
            tasks.splice(index, 1);

            // Simpan perubahan
            saveTasks(tasks);

            // Render ulang
            renderTasks();

        }

    });

    // ========================================
    // 6. HILANGKAN ERROR SAAT INPUT
    // ========================================

    taskInput.addEventListener("input", () => {

        if (taskInput.value.trim().length >= 3) {

            taskInput.classList.remove("error");

            inputError.style.display = "none";

        }

    });

    // ========================================
    // 7. RENDER PERTAMA KALI
    // ========================================

    renderTasks();

});
