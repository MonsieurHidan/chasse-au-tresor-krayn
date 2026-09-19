// Remplace ces valeurs par celles de TON projet Firebase.
// Console Firebase > Parametres du projet > Tes applications > appli Web > Config SDK.
// Ces cles sont publiques par design (la securite vient des regles Firestore, pas de ces cles) :
// c'est pour ca qu'on peut les laisser directement dans le code d'un site statique.
export const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME.appspot.com",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME",
};
