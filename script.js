const API_URL = "https://fedskillstest.coalitiontechnologies.workers.dev";

let patientsData = [];

// 🔹 FETCH WITH AUTH
fetch(API_URL, {
  headers: {
    "Authorization": "Basic " + btoa("coalition:skills-test")
  }
})
.then(res => res.json())
.then(data => {
  console.log(data); // check in console

  patientsData = data;

  loadPatients(data);
  loadProfile(data[0]); // first patient default
  loadChart(data[0]);
});


// 🔹 LEFT SIDE – PATIENT LIST
function loadPatients(data) {
  const list = document.getElementById("patientList");
  list.innerHTML = "";

  data.forEach((patient, index) => {
    const div = document.createElement("div");
    div.className = "patient";
    div.innerText = patient.name;

    div.onclick = () => {
      loadProfile(patient);
      loadChart(patient);
    };

    list.appendChild(div);
  });
}


// 🔹 RIGHT SIDE – PROFILE
function loadProfile(patient) {

  document.getElementById("name").innerText = patient.name;
  document.getElementById("gender").innerText = "Gender: " + patient.gender;
  document.getElementById("dob").innerText = "Age: " + patient.age;
  document.getElementById("phone").innerText = "Phone: " + patient.phone_number;

  document.getElementById("profileImg").src = patient.profile_picture;

  // latest diagnosis
  const latest = patient.diagnosis_history.slice(-1)[0];

  document.getElementById("resp").innerText =
    latest.respiratory_rate.value + " bpm";

  document.getElementById("temp").innerText =
    latest.temperature.value + " °F";

  document.getElementById("heart").innerText =
    latest.heart_rate.value + " bpm";
}


// 🔹 CENTER – CHART
function loadChart(patient) {

  const labels = [];
  const systolic = [];
  const diastolic = [];

  patient.diagnosis_history.forEach(item => {
    labels.push(item.month);

    systolic.push(item.blood_pressure.systolic.value);
    diastolic.push(item.blood_pressure.diastolic.value);
  });

  // destroy old chart if exists
  if (window.bpChart && typeof window.bpChart.destroy === "function") {
  window.bpChart.destroy();
}

  window.bpChart = new Chart(document.getElementById("bpChart"), {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Systolic",
          data: systolic
        },
        {
          label: "Diastolic",
          data: diastolic
        }
      ]
    }
  });
}