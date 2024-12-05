// Correct answers array (update this with all 35 answers)
const correctAnswers = [
  "A", // Q1
  "A", // Q2
  "C", // Q3
  "A", // Q4
  "B", // Q5
  "A", // Q6
  "B", // Q7
  // Add the remaining correct answers...
];

// Total questions count
const totalQuestions = correctAnswers.length;

// Handle quiz submission
document.getElementById("submitQuiz").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const photoInput = document.getElementById("photo");
  const photo = photoInput.files[0];
  const reader = new FileReader();

  if (!name || !photo) {
    alert("Please provide your name and upload a profile picture.");
    return;
  }

  let score = 0;
  correctAnswers.forEach((answer, index) => {
    const userAnswer = document.querySelector(`input[name="q${index}"]:checked`);
    if (userAnswer && userAnswer.value === answer) {
      score++;
    }
  });

  const percentage = ((score / totalQuestions) * 100).toFixed(2);
  const passed = percentage >= 50;

  reader.onload = () => {
    document.getElementById("quiz-form").style.display = "none";
    document.getElementById("certificate").style.display = "block";

    const certificateName = document.getElementById("certificate-name");
    certificateName.innerText = name;

    const studentPhoto = document.getElementById("student-photo");
    studentPhoto.src = reader.result;

    const dateField = document.getElementById("date");
    dateField.innerText = `Date: ${new Date().toLocaleDateString()}`;

    document.getElementById("download-certificate").addEventListener("click", () => {
      downloadCertificate();
    });

    sendToTelegram(name, percentage, passed);
  };

  reader.readAsDataURL(photo);
});

function downloadCertificate() {
  const certificate = document.getElementById("certificate-border");
  html2canvas(certificate).then((canvas) => {
    const link = document.createElement("a");
    link.download = "certificate.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
}

function sendToTelegram(name, percentage, passed) {
  const botToken = "8174835485:AAF4vGGDqIqKQvVyNrS2EfpbSuo5yhcY2Yo";
  const chatId = "7361816575";
  const message = `
📜 *Mandera Crypto Academy Quiz Results*
- 👤 Name: ${name}
- 📊 Score: ${percentage}%
- 🎉 Status: ${passed ? "Passed" : "Failed"}
  `;

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    }),
  }).catch((error) => {
    console.error("Error sending message to Telegram:", error);
  });
}
