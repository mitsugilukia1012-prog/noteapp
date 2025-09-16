// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqn_TrZTBY1SYubyBUKm4wQ-uMJ_zeNpQ",
  authDomain: "noteappa-99fed.firebaseapp.com",
  projectId: "noteappa-99fed",
  storageBucket: "noteappa-99fed.firebasestorage.app",
  messagingSenderId: "1079670475114",
  appId: "1:1079670475114:web:1cb3efc4fcc3d6af007d13",
  measurementId: "G-1H1YV0E4YM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// この下に、以前提示したscript.jsの本体コードを貼り付けます
// 例: document.addEventListener('DOMContentLoaded', () => { ... });
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
