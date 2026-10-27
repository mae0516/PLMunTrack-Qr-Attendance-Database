
const API_URL = "https://script.google.com/macros/s/AKfycbz2WDr8p9UzsvpGgrL_A3XRfmIt5P8yjmQiqiciuHqNZ1Gd72syFf21ytR3RVen6EEP/exec";

const studentBtn = document.getElementById("studentBtn");
const visitorBtn = document.getElementById("visitorBtn");
const adminBtn = document.getElementById("adminBtn");
const studentForm = document.getElementById("studentForm");
const registrationForm = document.getElementById("registrationForm");
const message = document.getElementById("message");

studentBtn.addEventListener("click", function () {
    studentForm.hidden = false;
    message.textContent = "Enter the student information below.";
});

visitorBtn.addEventListener("click", function () {
    studentForm.hidden = true;
    message.textContent =
        "Visitor Module — Visitor registration will be added later.";
});

adminBtn.addEventListener("click", function () {
    studentForm.hidden = true;
    message.textContent =
        "Admin Dashboard — Attendance records will be added later.";
});

registrationForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(registrationForm);

    const studentData = {
        action: "registerStudent",
        studentNumber: formData.get("studentNumber").trim(),
        fullName: formData.get("fullName").trim(),
        email: formData.get("email").trim(),
        course: formData.get("course").trim(),
        yearSection: formData.get("yearSection").trim()
    };

    message.textContent = "Registering student...";

    try {
        await fetch(API_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(studentData)
        });

        message.textContent =
            "Registration request sent. Please check the People sheet to confirm.";

        registrationForm.reset();

    } catch (error) {
        message.textContent =
            "Unable to send registration request. Please check your connection.";
        console.error(error);
    }
});

async function testConnection() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.success) {
            message.textContent =
                "Connected successfully! " + data.message;
        }
    } catch (error) {
        message.textContent =
            "Connection failed. Please check the server URL.";
        console.error(error);
    }
}

testConnection();

