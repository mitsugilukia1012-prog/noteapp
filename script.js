document.addEventListener('DOMContentLoaded', () => {
    const noteInput = document.getElementById('note-input');
    const addBtn = document.getElementById('add-btn');
    const noteList = document.getElementById('note-list');

    // 初期メモをロード
    const initialNote = "新しいプロジェクトのアイデア";
    if (!localStorage.getItem('notes')) {
        const notes = [initialNote];
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    // メモを画面に表示する関数
    function renderNotes() {
        noteList.innerHTML = ''; // 一旦リストをクリア
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.forEach((noteText, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${noteText}</span>
                <button class="delete-btn" data-index="${index}">削除</button>
            `;
            noteList.appendChild(li);
        });
    }

    // メモを追加する関数
    function addNote() {
        const noteText = noteInput.value.trim();
        if (noteText !== "") {
            const notes = JSON.parse(localStorage.getItem('notes')) || [];
            notes.push(noteText);
            localStorage.setItem('notes', JSON.stringify(notes));
            noteInput.value = ''; // 入力欄をクリア
            renderNotes();
        }
    }

    // メモを削除する関数
    function deleteNote(e) {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.getAttribute('data-index');
            const notes = JSON.parse(localStorage.getItem('notes')) || [];
            notes.splice(index, 1);
            localStorage.setItem('notes', JSON.stringify(notes));
            renderNotes();
        }
    }

    // イベントリスナーの設定
    addBtn.addEventListener('click', addNote);
    noteList.addEventListener('click', deleteNote);

    // Enterキーでメモを追加
    noteInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNote();
        }
    });

    // 初期表示
    renderNotes();
});