import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

document.addEventListener("DOMContentLoaded", function () {
    const ratingInputs = document.querySelectorAll(".star-rating input");
    const ratingLabels = document.querySelectorAll(".star-rating:not(.readonly) label");
    const warningText = document.getElementById("warning");

    ratingInputs.forEach(input => {
        input.addEventListener("change", function () {
            console.log("Selected Rating: ", this.value);
        });
    });

    ratingLabels.forEach(star => {
        star.addEventListener("click", function () {
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Firebase Setup
    const firebaseConfig = {
        apiKey: "AIzaSyBcBwidTGliI1odZpXbETRib2BHmF44xIA",
        authDomain: "piqah-f2f8d.firebaseapp.com",
        databaseURL: "https://piqah-f2f8d-default-rtdb.firebaseio.com",
        projectId: "piqah-f2f8d",
        storageBucket: "piqah-f2f8d.firebasestorage.app",
        messagingSenderId: "208869672776",
        appId: "1:208869672776:web:bb3a251d38cfc2f4c8d57d",
        measurementId: "G-YCJHN899X2"
    };

    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const database = getDatabase(app);

    async function checkBadWords(userInput, name) {
        try {
            let sanitizedInputName = name.replace(/\s+/g, "");
            let sanitizedInput = userInput.replace(/\s+/g, ""); // Remove spaces within words
            const response = await fetch(`https://www.purgomalum.com/service/json?text=${encodeURIComponent(sanitizedInput)}`);
            const responseName = await fetch(`https://www.purgomalum.com/service/json?text=${encodeURIComponent(sanitizedInputName)}`);
            const data = await response.json();
            const data2 = await responseName.json();

            if ((userInput !== "" && data.result !== sanitizedInput) && (name !== "" && data2.result !== sanitizedInputName)) {
                // warningText.textContent = "Warning: Your input contains inappropriate words!";
                // warningText.style.display = "block";
                Swal.fire({
                    title: "ALERT!!",
                    text: "Your input contains inappropriate words!",
                    icon: "error"
                });
                return false;
            } else if ((userInput !== "" && data.result !== sanitizedInput) || (name !== "" && data2.result !== sanitizedInputName)) {
                // warningText.textContent = "Warning: Your input contains inappropriate words!";
                // warningText.style.display = "block";
                Swal.fire({
                    title: "ALERT!!",
                    text: "Your input contains inappropriate words!",
                    icon: "error"
                });
                return false;
            } else {
                // warningText.textContent = "";
                // warningText.style.display = "none";
                return true;
            }
        } catch (error) {
            console.error("Error checking bad words:", error);
            warningText.textContent = "Error checking text. Please try again.";
            warningText.style.display = "block";
            return false;
        }
    }

    function addData(userId, name, message, rating) {
        const usersRef = ref(database, 'feedbacks/' + userId);
        const now = new Date();

        // Format date as "01 Jan, 2022"
        const dateOptions = { day: '2-digit', month: 'short', year: 'numeric' };
        const dateString = now.toLocaleDateString('en-GB', dateOptions).replace(' ', ' ').replace(',', ', ');

        // Get Time in readable format
        const timeString = now.toLocaleTimeString();

        // Display in HTML
        // document.getElementById("date").innerText = dateString;
        // document.getElementById("time").innerText = timeString;

        set(usersRef, {
            username: name,
            message: message,
            rating: rating,
            date: dateString,
            time: timeString
        }).then(() => {
            console.log("Data added successfully");
            Swal.fire({
                title: "SUCCESSFULLY!!",
                text: "Feedback Submitted Successfully!",
                icon: "success"
            });
            resetForm(); // Reset form after submission
            fetchData(); // Refresh data after submission
        }).catch((error) => {
            console.error("Error adding data: ", error);
        });
    }

    function fetchData() {
        const dbRef = ref(database);
        get(child(dbRef, 'feedbacks')).then((snapshot) => {
            if (snapshot.exists()) {
                let feedbackList = document.getElementById("feedbackList");
                let counting = document.getElementById('count');
                let c = 0;
                feedbackList.innerHTML = "";
                snapshot.forEach(childSnapshot => {
                    let feedback = childSnapshot.val();
                    // feedbackList.innerHTML += `<div class="swiper-slide">
                    //                                 <div class="testimonial-item">
                    //                                     <img src="assets/img/users.jpg" class="testimonial-img" alt="">
                    //                                     <h3>${feedback.username}</h3>
                    //                                     <!-- <h4>- USER ROLE -</h4> -->
                    //                                     `;
                    if(feedback.rating === "1"){
                        feedbackList.innerHTML += `<div class="container" data-aos="fade-up" data-aos-delay="300">
                                                        <br>
                                                        <div class="author-container d-flex align-items-center">
                                                            <img src="assets/img/user.jpg" class="rounded-circle flex-shrink-0" alt="">
                                                            <div>
                                                            <div class="d-flex"><h4>${feedback.username}</h4><p style="font-size: 12px; position: absolute; right: 10%;">${feedback.date}</p></div>
                                                            
                                                            <div class="social-links">
                                                                <i class="bi bi-star-fill"></i><i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i>
                                                            </div>
                                                            <p>
                                                            ${feedback.message}
                                                            </p>
                                                            </div>
                                                        </div>
                                                    </div>`;
                    }else if(feedback.rating === "2"){
                        feedbackList.innerHTML += ` <div class="container" data-aos="fade-up" data-aos-delay="300">
                                                        <br>
                                                        <div class="author-container d-flex align-items-center">
                                                            <img src="assets/img/user.jpg" class="rounded-circle flex-shrink-0" alt="">
                                                            <div>
                                                            <div class="d-flex"><h4>${feedback.username}</h4><p style="font-size: 12px; position: absolute; right: 10%;">${feedback.date}</p></div>
                                                            <div class="social-links">
                                                                <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i>
                                                            </div>
                                                            <p>
                                                            ${feedback.message}
                                                            </p>
                                                            </div>
                                                        </div>
                                                    </div>`;
                    }else if(feedback.rating === "3"){
                        feedbackList.innerHTML += ` <div class="container" data-aos="fade-up" data-aos-delay="300">
                                                        <br>
                                                        <div class="author-container d-flex align-items-center">
                                                            <img src="assets/img/user.jpg" class="rounded-circle flex-shrink-0" alt="">
                                                            <div>
                                                            <div class="d-flex"><h4>${feedback.username}</h4><p style="font-size: 12px; position: absolute; right: 10%;">${feedback.date}</p></div>
                                                            <div class="social-links">
                                                                <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star"></i><i class="bi bi-star"></i>
                                                            </div>
                                                            <p>
                                                            ${feedback.message}
                                                            </p>
                                                            </div>
                                                        </div>
                                                    </div>`;
                    }else if(feedback.rating === "4"){
                        feedbackList.innerHTML += `<div class="container" data-aos="fade-up" data-aos-delay="300">
                                                        <br>
                                                        <div class="author-container d-flex align-items-center">
                                                            <img src="assets/img/user.jpg" class="rounded-circle flex-shrink-0" alt="">
                                                            <div>
                                                            <div class="d-flex"><h4>${feedback.username}</h4><p style="font-size: 12px; position: absolute; right: 10%;">${feedback.date}</p></div>
                                                            <div class="social-links">
                                                                <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star"></i>
                                                            </div>
                                                            <p>
                                                            ${feedback.message}
                                                            </p>
                                                            </div>
                                                        </div>
                                                    </div>`;
                    }else if(feedback.rating === "5"){
                        feedbackList.innerHTML += `<div class="container" data-aos="fade-up" data-aos-delay="300">
                                                        <br>
                                                        <div class="author-container d-flex align-items-center">
                                                            <img src="assets/img/user.jpg" class="rounded-circle flex-shrink-0" alt="">
                                                            <div>
                                                            <div class="d-flex"><h4>${feedback.username}</h4><p style="font-size: 12px; position: absolute; right: 10%;">${feedback.date}</p></div>
                                                            <div class="social-links">
                                                                <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                                                            </div>
                                                            <p>
                                                            ${feedback.message}
                                                            </p>
                                                            </div>
                                                        </div>
                                                    </div>`;
                    }else if(feedback.rating === "No rating"){
                        feedbackList.innerHTML += `<div class="container" data-aos="fade-up" data-aos-delay="300">
                                                        <br>
                                                        <div class="author-container d-flex align-items-center">
                                                            <img src="assets/img/user.jpg" class="rounded-circle flex-shrink-0" alt="">
                                                            <div>
                                                            <div class="d-flex"><h4>${feedback.username}</h4><p style="font-size: 12px; position: absolute; right: 10%;">${feedback.date}</p></div>
                                                            <div class="social-links">
                                                                <i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i><i class="bi bi-star"></i>
                                                            </div>
                                                            <p>
                                                            ${feedback.message}
                                                            </p>
                                                            </div>
                                                        </div>
                                                    </div>`;
                    }                                     
                                                
                    // feedbackList.innerHTML += `         <p>
                    //                                     <i class="bi bi-quote quote-icon-left"></i>
                    //                                     <span>${feedback.message}</span>
                    //                                     <i class="bi bi-quote quote-icon-right"></i>
                    //                                     </p>
                    //                                 </div>
                    //                             </div>`;
                    c++;
                    counting.innerText = c + " feedbacks";
                });
            } else {
                console.log("No feedback available");
            }
        }).catch((error) => {
            console.error("Error fetching data: ", error);
        });
    }

    function resetForm() {
        document.getElementById("username").value = "";
        document.getElementById("message").value = "";
        ratingInputs.forEach(input => input.checked = false);
    }

    document.getElementById("addDataBtn").addEventListener("click", async function () {
        const userId = "user_" + Date.now();
        let message = document.getElementById("message").value.trim();
        let name = document.getElementById("username").value.trim();
        let rating = document.querySelector(".star-rating input:checked")?.value || "No rating";

        if (name === "" || message === "") {
            Swal.fire({
                title: "ALERT!!",
                text: "Please fill in both Name and Message fields before submitting.",
                icon: "error"
            });
            return;
        }

        if (await checkBadWords(message, name)) {
            addData(userId, name, message, rating);
        }
    });

    fetchData(); // Load data on page load
});
