// Firebase SDKのインポート
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, push, remove } from "firebase/database";

// Firebaseの設定を貼り付け
const firebaseConfig = {
  apiKey: "AIzaSyBqn_TrZTBY1SYubyBUKm4wQ-uMJ_zeNpQ",
  authDomain: "noteappa-99fed.firebaseapp.com",
  projectId: "noteappa-99fed",
  storageBucket: "noteappa-99fed.firebasestorage.app",
  messagingSenderId: "1079670475114",
  appId: "1:1079670475114:web:1cb3efc4fcc3d6af007d13",
  measurementId: "G-1H1YV0E4YM"
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const noteInput = document.getElementById('note-input');
    const addBtn = document.getElementById('add-btn');
    const noteList = document.getElementById('note-list');

    let userId = null;
    let notesRef = null;

    // 匿名ログイン
    signInAnonymously(auth)
        .then(() => {
            console.log("匿名ログイン成功");
        })
        .catch((error) => {
            console.error("匿名ログイン失敗", error);
        });

    // ログイン状態の変化を監視
    onAuthStateChanged(auth, (user) => {
        if (user) {
            userId = user.uid;
            notesRef = ref(database, `notes/${userId}`);
            // ユーザーIDに基づいてメモを読み込む
            loadNotes(notesRef);
        } else {
            // ログアウト状態
            userId = null;
            notesRef = null;
            noteList.innerHTML = '';
        }
    });

    // メモをサーバーから読み込む関数
    function loadNotes(notesRef) {
        onValue(notesRef, (snapshot) => {
            noteList.innerHTML = ''; // 一旦リストをクリア
            const notes = snapshot.val() || {};
            const noteKeys = Object.keys(notes);
            noteKeys.forEach((key) => {
                const noteText = notes[key];
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${noteText}</span>
                    <button class="delete-btn" data-key="${key}">削除</button>
                `;
                noteList.appendChild(li);
            });
        });
    }

    // メモをサーバーに追加する関数
    function addNote() {
        if (!userId) {
            alert('ログインしていません。');
            return;
        }

        const noteText = noteInput.value.trim();
        if (noteText !== "") {
            push(notesRef, noteText)
                .then(() => {
                    noteInput.value = ''; // 入力欄をクリア
                })
                .catch((error) => {
                    console.error("メモの追加に失敗", error);
                });
        }
    }

    // メモをサーバーから削除する関数
    function deleteNote(e) {
        if (!userId) {
            alert('ログインしていません。');
            return;
        }

        if (e.target.classList.contains('delete-btn')) {
            const key = e.target.getAttribute('data-key');
            const noteToDeleteRef = ref(database, `notes/${userId}/${key}`);
            remove(noteToDeleteRef)
                .then(() => {
                    console.log("削除成功");
                })
                .catch((error) => {
                    console.error("削除失敗", error);
                });
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
});
