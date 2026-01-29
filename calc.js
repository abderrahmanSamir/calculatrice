function addition(number1, number2) {
  return number1 + number2;
}

function soustraction(number1, number2) {
  return number1 - number2;
}

function multiplication(number1, number2) {
  return number1 * number2;
}

function division(number1, number2) {
  if (number2 === 0) {
    return "Erreur : Division par zéro";
  }
  return number1 / number2;
}

let number1 = null;
let number2 = null;
let operateur = null;
let isResultDisplayed = false;

function operation(number1, operateur, number2) {
  let resultat;
  switch (operateur) {
    case "+":
      resultat = addition(number1, number2);
      break;
    case "-":
      resultat = soustraction(number1, number2);
      break;
    case "*":
      resultat = multiplication(number1, number2);
      break;
    case "/":
      resultat = division(number1, number2);
      break;
    default:
      break;
  }

  // Arrondir à 10 décimales pour éviter les erreurs de précision flottante
  if (typeof resultat === "number" && !Number.isInteger(resultat)) {
    resultat = Math.round(resultat * 10000000000) / 10000000000;
  }

  return resultat;
}

console.log(operation(2, "*", 4));

let display = document.getElementById("display");
let buttons = document.querySelectorAll(".btn");
let clearBtn = document.getElementById("clear");
let deleteBtn = document.getElementById("delete");

display.value = "0";

// Gérer l'entrée utilisateur empêchant les caractères non numériques
display.addEventListener("input", function (e) {
  let valeur = e.target.value;
  // Valider l'entrée pour n'accepter que les chiffres et les opérateurs
  let validValeur = valeur.replace(/[^0-9+\-*/.]/g, "");

  // Si le contenu change corriger la valeur
  if (valeur !== validValeur) {
    e.target.value = validValeur;
  }
});

buttons.forEach((button) => {
  button.addEventListener("click", function () {
    let valeurBtn = button.getAttribute("data-value");

    if (valeurBtn === null || valeurBtn === "del") {
      return; // Ignorer les boutons sans data-value ou del
    }

    if (
      valeurBtn === "+" ||
      valeurBtn === "-" ||
      valeurBtn === "*" ||
      valeurBtn === "/"
    ) {
      if (display.value === "-" && operateur === null) {
        // Bloquer les opérateurs tant que en saisie de nombre négatif
      } else if (display.value === "0" && valeurBtn === "-") {
        display.value = "-";
      } else if (
        display.value === "0" &&
        (valeurBtn === "+" || valeurBtn === "*" || valeurBtn === "/")
      ) {
        // Rien ne se passe
      } else {
        if (operateur !== null) {
          // Calculer automatiquement la paire précédente
          let number2 = parseFloat(display.value);
          if (isNaN(number2)) number2 = 0;
          let resultat = operation(number1, operateur, number2);
          display.value = resultat;
          number1 = resultat;
          isResultDisplayed = true;
          // Stocker le nouvel opérateur sans l'afficher (le résultat reste visible)
          operateur = valeurBtn;
        } else if (operateur === null) {
          // Premier opérateur après saisie de number1
          if (isResultDisplayed) {
            number1 = parseFloat(display.value);
            isResultDisplayed = false;
          } else {
            number1 = parseFloat(display.value);
            if (isNaN(number1)) {
              number1 = 0;
            }
          }
          operateur = valeurBtn;
          display.value = operateur;
        }
        // Si même opérateur, rien
      }
    } else if (valeurBtn === "=") {
      if (display.value === "-" && operateur === null) {
        // Bloquer "=" tant que en saisie de nombre négatif
      } else {
        if (operateur === null) {
          // Rien ne se passe si pas d'opérateur
        } else {
          number2 = parseFloat(display.value);
          if (isNaN(number2)) {
            number2 = 0;
          }
          let resultat = operation(number1, operateur, number2);
          display.value = resultat;
          number1 = null;
          number2 = null;
          operateur = null;
          isResultDisplayed = true;
        }
      }
    } else {
      // C'est un nombre
      if (valeurBtn === "." && display.value.includes(".")) {
        // Ne pas ajouter un deuxième point
      } else {
        if (isResultDisplayed) {
          display.value = valeurBtn;
          isResultDisplayed = false;
        } else if (display.value === "-" && operateur === null) {
          display.value += valeurBtn;
        } else if (
          display.value === "+" ||
          display.value === "-" ||
          display.value === "*" ||
          display.value === "/"
        ) {
          if (valeurBtn === ".") {
            display.value = "0.";
          } else {
            display.value = valeurBtn;
          }
        } else if (display.value === "0" && valeurBtn === ".") {
          display.value = "0.";
        } else if (display.value === "0") {
          display.value = valeurBtn;
        } else {
          display.value += valeurBtn;
        }
      }
    }
  });
});

clearBtn.addEventListener("click", function () {
  display.value = "0";
  number1 = null;
  number2 = null;
  operateur = null;
  isResultDisplayed = false;
});

deleteBtn.addEventListener("click", function () {
  // Si c'est un message d'erreur, réinitialiser complètement
  if (display.value.includes("Erreur")) {
    display.value = "0";
    number1 = null;
    number2 = null;
    operateur = null;
    isResultDisplayed = false;
  }
  // Si c'est un opérateur, revenir au nombre précédent
  else if (
    display.value === "+" ||
    display.value === "-" ||
    display.value === "*" ||
    display.value === "/"
  ) {
    operateur = null;
    display.value = number1 !== null ? number1 : "0";
  }
  // Sinon, supprimer un caractère
  else if (display.value.length > 1) {
    display.value = display.value.slice(0, -1);
  } else if (display.value !== "0") {
    display.value = "0";
  }
});

// Prise en charge du clavier
document.addEventListener("keydown", function (event) {
  let key = event.key;
  if (key >= "0" && key <= "9") {
    // Simuler clic sur le bouton nombre
    let btn = document.querySelector(`.btn[data-value="${key}"]`);
    if (btn) btn.click();
  } else if (key === ".") {
    let btn = document.querySelector(`.btn[data-value="."]`);
    if (btn) btn.click();
  } else if (key === "+" || key === "-" || key === "*" || key === "/") {
    let btn = document.querySelector(`.btn[data-value="${key}"]`);
    if (btn) btn.click();
  } else if (key === "Enter" || key === "=") {
    let btn = document.querySelector(`.btn[data-value="="]`);
    if (btn) btn.click();
  } else if (key === "Backspace") {
    deleteBtn.click();
  } else if (key === "Escape" || key === "c" || key === "C") {
    clearBtn.click();
  }
});
