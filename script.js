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

  // Validate name and photo
  if (!name || !photo) {
    alert("Please provide your name and upload a profile picture.");
    return;
  }

  // Calculate the score
  let score = 0;
  correctAnswers.forEach((answer, index) => {
    const userAnswer = document.querySelector(`input[name="q${index}"]:checked`);
    if (userAnswer && userAnswer.value === answer) {
      score++;
    }
  });

  // Calculate percentage and determine pass/fail
  const percentage = ((score / totalQuestions) * 100).toFixed(2);
  const passed = percentage >= 50;

  // Generate the certificate
  reader.onload = () => {
    // Hide the quiz form and display the certificate
    document.getElementById("quiz-form").style.display = "none";
    document.getElementById("certificate").style.display = "block";

    // Populate certificate fields
    document.getElementById("student-photo").src = reader.result;
    document.getElementById("congratulations").innerText = `Congratulations, ${name}!`;
    document.getElementById("certificate-details").innerText = `You scored ${percentage}%. You have ${passed ? "passed" : "failed"} the quiz.`;
    document.getElementById("date").innerText = `Date: ${new Date().toLocaleDateString()}`;

    // Send results to the Telegram bot
    sendToTelegram(name, percentage, passed);
  };

  // Read photo file as Data URL for display
  reader.readAsDataURL(photo);
});

// Function to send quiz results to Telegram bot
function sendToTelegram(name, percentage, passed) {
  const botToken = "8174835485:AAF4vGGDqIqKQvVyNrS2EfpbSuo5yhcY2Yo";
  const chatId = "7361816575"; // Your bot's chat ID
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
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to send the message.");
      }
    })
    .catch((error) => {
      console.error("Error sending message to Telegram:", error);
    });
}
