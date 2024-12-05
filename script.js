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

  // Read the uploaded photo
  reader.onload = () => {
    // Hide the quiz form and show the certificate section
    document.getElementById("quiz-form").style.display = "none";
    document.getElementById("certificate").style.display = "block";

    // Calculate the user's score
    let score = 0;
    correctAnswers.forEach((answer, index) => {
      const userAnswer = document.querySelector(`input[name="q${index}"]:checked`);
      if (userAnswer && userAnswer.value === answer) {
        score++;
      }
    });

    const percentage = ((score / totalQuestions) * 100).toFixed(2);
    const passed = percentage >= 50;

    // Populate the certificate fields
    document.getElementById("certificate-name").innerText = name;
    document.getElementById("student-photo").src = reader.result;
    document.getElementById("score").innerText = `${percentage}%`;
    document.getElementById("congratulations").innerText = passed
      ? "🎉 Congratulations on passing!"
      : "❌ Better luck next time!";
    document.getElementById("date").innerText = `Date: ${new Date().toLocaleDateString()}`;

    // Add download button event listener
    document.getElementById("download-certificate").addEventListener("click", downloadCertificate);

    // Send results to Telegram
    sendToTelegram(name, percentage, passed);
  };

  reader.readAsDataURL(photo);
});

// Function to download the certificate
function downloadCertificate() {
  const certificate = document.getElementById("certificate-border");

  // Ensure the user photo is displayed as a high-quality canvas image
  const studentPhoto = document.getElementById("student-photo");
  const imgCanvas = document.createElement("canvas");
  const imgContext = imgCanvas.getContext("2d");

  // Create a temporary canvas for the photo
  const img = new Image();
  img.src = studentPhoto.src;
  img.onload = () => {
    // Set canvas dimensions to match the image
    imgCanvas.width = img.naturalWidth;
    imgCanvas.height = img.naturalHeight;

    // Draw the image onto the canvas
    imgContext.drawImage(img, 0, 0, imgCanvas.width, imgCanvas.height);

    // Replace the photo in the DOM temporarily with the high-res canvas image
    studentPhoto.style.display = "none";
    const canvasPhoto = document.createElement("img");
    canvasPhoto.src = imgCanvas.toDataURL("image/png");
    studentPhoto.parentNode.insertBefore(canvasPhoto, studentPhoto);

    // Use html2canvas to capture the certificate and generate a downloadable image
    html2canvas(certificate, {
      scale: 2, // High resolution
      backgroundColor: null, // Transparent background
    }).then((canvas) => {
      const link = document.createElement("a");
      link.download = "Certificate_of_Completion.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      // Restore the original photo after download
      canvasPhoto.remove();
      studentPhoto.style.display = "block";
    });
  };
}

// Function to send results to Telegram
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
