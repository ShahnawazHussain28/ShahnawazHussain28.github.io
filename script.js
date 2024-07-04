let contentDiv = document.getElementById("content");
let contentHTML = "";
let data = [];

function getDOM(link, thumbLink, name, description) {
  let dom = `<div class='services' onclick="window.location.href ='${link}'">
		<div class='box'>
			<div class='iconbox'>
				<img src='${thumbLink}'>
			</div>
			<div class='content'>
				<h2>${name}</h2>
				<p>${description}</p>
			</div>
		</div>
	</div>`;
  return dom;
}

function setAbout() {
  let d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth();
  let myYear = year - 2021;
  if (month > 5) myYear++;
  let yearText = "First";
  if (myYear == 2) yearText = "Second Year";
  else if (myYear == 3) yearText = "Third Year";
  else if (myYear == 4) yearText = "Fourth Year";
  else yearText = "Graduated";
  document.getElementById("about-desc").innerHTML =
    `Hey there, I'm Shahnawaz Hussain, the creator of this website. This website is entirely developed by me and all the content is created by only myself. I'm a ${yearText} student of BTech in Computer Science in the college GCETTS. For any queries you can contact me, details are given in the contact section of this page. Enjoy surfing this website. And remember It's FUN Zone.`;
}

async function setWebpage() {
  let res = await fetch("webdata.json");
  data = await res.json();
  contentHTML = "";
  for (let i = 0; i < data.length; i++) {
    contentHTML += getDOM(
      data[i].link,
      data[i].thumbLink,
      data[i].name,
      data[i].description,
    );
  }
  contentDiv.innerHTML = contentHTML;
}

function showSearchedProjects(text) {
  if (text === "") {
    contentDiv.innerHTML = contentHTML;
    return;
  }
  let searchedData = data.filter(
    (project) =>
      project.name.toLowerCase().includes(text) ||
      project.description.toLowerCase().includes(text),
  );
  let elements = "";
  for (let i = 0; i < searchedData.length; i++) {
    elements += getDOM(
      searchedData[i].link,
      searchedData[i].thumbLink,
      searchedData[i].name,
      searchedData[i].description,
    );
  }
  contentDiv.innerHTML = elements;
}

function toggle() {
  var header = document.querySelector("header");
  header.classList.toggle("active");
}

setWebpage();
setAbout();

window.addEventListener("scroll", function () {
  var header = document.querySelector("header");
  header.classList.toggle("stickey", window.scrollY > 0);
});

document.getElementById("search-bar").addEventListener("input", (e) => {
  showSearchedProjects(e.target.value);
});

function clearSearch() {
  document.getElementById("search-bar").value = "";
  showSearchedProjects("");
}
