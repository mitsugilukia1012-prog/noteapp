import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, push, remove, set } from "firebase/database";

// Firebaseの設定を貼り付け
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const signupBtn = document.getElementById('signup-btn');
    const signinBtn = document.getElementById('signin-btn');
    const signoutBtn = document.getElementById('signout-btn');
    const noteInput = document.getElementById('note-input');
    const addBtn = document.getElementById('add-btn');
    const noteList = document.getElementById('note-list');
    const authArea = document.querySelector('.auth-area');
    const inputArea = document.querySelector('.input-area');

    let userId = null;
    let notesRef = null;

    // ログイン状態の変化を監視
    onAuthStateChanged(auth, (user) => {
        if (user) {
            userId = user.uid;
            notesRef = ref(database, `notes/${userId}`);
            loadNotes(notesRef);
            authArea.style.display = 'none';
            signoutBtn.style.display = 'block';
            inputArea.style.display = 'flex';
        } else {
            userId = null;
            notesRef = null;
            noteList.innerHTML = '';
            authArea.style.display = 'block';
            signoutBtn.style.display = 'none';
            inputArea.style.display = 'none';
        }
    });

    // 新規登録
    signupBtn.addEventListener('click', () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        if (email && password) {
            createUserWithEmailAndPassword(auth, email, password)
                .then(() => {
                    alert('新規登録が完了しました！');
                })
                .catch((error) => {
                    console.error("新規登録失敗", error);
                    alert('新規登録に失敗しました。' + error.message);
                });
        }
    });

    // ログイン
    signinBtn.addEventListener('click', () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        if (email && password) {
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    alert('ログインしました！');
                })
                .catch((error) => {
                    console.error("ログイン失敗", error);
                    alert('ログインに失敗しました。' + error.message);
                });
        }
    });

    // ログアウト
    signoutBtn.addEventListener('click', () => {
        signOut(auth)
            .then(() => {
                alert('ログアウトしました。');
            })
            .catch((error) => {
                console.error("ログアウト失敗", error);
            });
    });

    // メモをサーバーから読み込む関数
    function loadNotes(notesRef) {
        onValue(notesRef, (snapshot) => {
            noteList.innerHTML = '';
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
            alert('ログインしてください。');
            return;
        }
        const noteText = noteInput.value.trim();
        if (noteText !== "") {
            push(notesRef, noteText)
                .then(() => {
                    noteInput.value = '';
                })
                .catch((error) => {
                    console.error("メモの追加に失敗", error);
                });
        }
    }

    // メモをサーバーから削除する関数
    function deleteNote(e) {
        if (!userId) {
            alert('ログインしてください。');
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

    noteInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNote();
        }
    });
});
