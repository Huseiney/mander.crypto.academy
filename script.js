// script.js

const botToken = "8174835485:AAF4vGGDqIqKQvVyNrS2EfpbSuo5yhcY2Yo";
const chatId = "7361816575";

const questions = [
  { q: "What is the first cryptocurrency?", a: "Bitcoin", choices: ["Bitcoin", "Ethereum", "Litecoin", "Ripple"] },
  { q: "What does NFT stand for?", a: "Non-Fungible Token", choices: ["Non-Fungible Token", "New Future Token", "Network Fast Transfer", "None"] },
  // Add 33 more questions here...
];

let userName = "";
let userProfile;

// Start Quiz
document.getElementById("startQuiz").addEventListener("click", () => {
  const nameInput = document.getElementById("name").value;
  const profileInput = document.getElementById("profile").files[0];

  if (!nameInput || !profileInput) {
    alert("Please provide your name and profile picture.");
    return;
  }

  userName = nameInput;
  userProfile = profileInput;

  document.getElementById("user-info").style.display = "none";
  document.getElementById("quiz").style.display = "block";

  generateQuestions();
});

// Generate Questions
function generateQuestions() {
  const questionContainer = document.getElementById("questions");
  questions.forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");
    questionDiv.innerHTML = `
      <p>${index + 1}. ${q.q}</p>
      ${q.choices.map((choice, i) => `
        <label>
          <input type="radio" name="q${index}" value="${choice}" required> ${choice}
        </label>
      `).join("")}
    `;
    questionContainer.appendChild(questionDiv);
  });
}

// Submit Quiz
document.getElementById("submitQuiz").addEventListener("click", async () => {
  const answers = [...document.querySelectorAll("input:checked")].map(input => input.value);
  const correctAnswers = questions.filter((q, i) => q.a === answers[i]).length;
  const score = (correctAnswers / questions.length) * 100;
  const pass = score >= 50 ? "Pass" : "Fail";

  const resultMessage = `Name: ${userName}\nScore: ${score}%\nResult: ${pass}`;
  
  // Send to Telegram
  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append("text", resultMessage);

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    body: formData,
  });

  // Show Results
  document.getElementById("quiz").style.display = "none";
  document.getElementById("result").style.display = "block";
  document.getElementById("score").innerText = `You scored ${score}%. You ${pass}!`;

  generateCertificate(userName, score, pass);
});

// Generate Certificate
function generateCertificate(name, score, pass) {
  const canvas = document.getElementById("certificateCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 600;

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.font = "30px Arial";
  ctx.fillText("Mandera Crypto Academy", canvas.width / 2, 100);
  ctx.font = "20px Arial";
  ctx.fillText(`This certifies that ${name}`, canvas.width / 2, 200);
  ctx.fillText(`has ${pass}ed with a score of ${score}%.`, canvas.width / 2, 250);

  ctx.font = "16px Arial";
  ctx.fillText(`Signed by: Hussein Hassan`, canvas.width / 2, 400);
  ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, canvas.width / 2, 450);

  document.getElementById("downloadCertificate").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "Certificate.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}
