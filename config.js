// =====================================================================
//  إعدادات «معلّم قريب» — يُملأ هذا الملف مرة واحدة فقط، ولا تستبدله في التحديثات
//  1) Firebase Console > ⚙ Project settings > Your apps > (تطبيق الويب) > SDK setup and configuration > Config
//     انسخ كتلة  const firebaseConfig = { ... };  كما هي، وضعها مكان الكتلة أسفله.
//     (أو انسخها من ملف index.html القديم على GitHub: نفس الأسطر)
// =====================================================================
const firebaseConfig = {
  apiKey: "PASTE_API_KEY",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};

// 2) الإشعارات على الهاتف (اختياري): نفس القيمتين اللتين كانتا في PUSH داخل index.html القديم
const pushConfig = {
  workerUrl: "",   // مثال: https://maalem-push.YOUR-NAME.workers.dev
  vapidKey: ""     // Firebase Console > Project settings > Cloud Messaging > Web Push certificates
};
