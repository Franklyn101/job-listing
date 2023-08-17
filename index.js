"use strict";

const container = document.querySelector(".con");
const inputBox = document.querySelector(".input-box");
const inputField = document.querySelector(".input-field");
const clearAll = document.querySelector(".clear");

let filter = [];
let selectedKeywords = [];

const filteredSearch = function (name, data) {
  if (selectedKeywords.includes(name.toLowerCase())) {
    return;
  }

  const html = `
    <div class="input-name">
      <span class="input-text">${name}</span>
      <img
        src="images/icon-remove.svg"
        alt="remove icon"
        class="remove-icon"
      />
    </div>
  `;
  inputField.insertAdjacentHTML("beforeend", html);

  selectedKeywords.push(name.toLowerCase());

  const deleteIcon = inputBox.querySelectorAll(".remove-icon");
  deleteIcon.forEach((del) =>
    del.addEventListener("click", function () {
      handleDeleteIconClick(data);
    })
  );
};

const handleDeleteIconClick = function (data) {
  const deleteIcon = event.target;
  const keyword = deleteIcon.previousElementSibling.textContent;
  const filteredKeyword = keyword.toLowerCase();

  selectedKeywords = selectedKeywords.filter(
    (selected) => selected !== filteredKeyword
  );
  container.innerHTML = "";

  filter = data.filter((job) => matchesKeywords(job));
  filter.forEach((job) => renderJobs(job));

  deleteIcon.parentElement.remove();

  if (selectedKeywords.length === 0) inputBox.classList.add("hidden");
};

const clearFilters = function (data) {
  selectedKeywords = [];
  filter = [];
  container.innerHTML = "";
  const removeIcons = document.querySelectorAll(".remove-icon");
  removeIcons.forEach(function (icon) {
    const parentElement = icon.parentElement;
    parentElement.remove();
  });
  data.forEach((info) => renderJobs(info));
  inputBox.classList.add("hidden");
};

const matchesKeywords = function (job) {
  return selectedKeywords.every((keyword) => {
    return (
      job.level.toLowerCase().includes(keyword) ||
      job.role.toLowerCase().includes(keyword) ||
      job.languages.some((lang) => lang.toLowerCase().includes(keyword)) ||
      job.tools.some((tool) => tool.toLowerCase().includes(keyword))
    );
  });
};

const renderJobs = function (data) {
  const html = `
    <div class="job-container ${data.featured ? "featured-border" : ""} ">
      <img src="${data.logo}" alt="${data.company}" class="job-img" />
      <div class="job-description">
        <div class="job-heading-box">
          <h3 class="job-company">${data.company}</h3>
          <p class=" ${data.new ? "job-new" : "hidden"}">New!</p>
          <p class="${data.featured ? "job-featured" : "hidden"}">Featured</p>
        </div>
        <h2 class="job-title">Senior Frontend Developer</h2>
        <div class="more-info">
          <span class="job-date">${data.postedAt}</span>
          <span class="job-type">${data.contract}</span>
          <span class="job-location">${data.location}</span>
        </div>
      </div>
      <div class="job-skills">
        <span class="job-role skill">${data.role}</span>
        <span class="job-level skill">${data.level}</span> 
         ${data.languages
           .map((lang) => `<span class="job-languages skill">${lang}</span>`)
           .join(" ")}
           
           ${data.tools
             .map((tool) => `<span class="job-tools skill">${tool}</span>`)
             .join(" ")}
      </div>
    </div>
    `;
  container.insertAdjacentHTML("beforeend", html);
};

const filterJobs = function (data) {
  const handleFilterClick = function (e) {
    const skill = e.target;
    const keyword = skill.textContent;

    if (skill.classList.contains("skill")) {
      inputBox.classList.remove("hidden");

      if (filter.length === 0) {
        // No previous filters, filter from the original data
        filter = data.filter((job) => {
          return (
            job.level.toLowerCase().includes(keyword.toLowerCase()) ||
            job.role.toLowerCase().includes(keyword.toLowerCase()) ||
            job.languages.some((lang) =>
              lang.toLowerCase().includes(keyword.toLowerCase())
            ) ||
            job.tools.some((tool) =>
              tool.toLowerCase().includes(keyword.toLowerCase())
            )
          );
        });
      } else {
        // Filter from the existing filter array
        filter = filter.filter((job) => {
          return (
            job.level.toLowerCase().includes(keyword.toLowerCase()) ||
            job.role.toLowerCase().includes(keyword.toLowerCase()) ||
            job.languages.some((lang) =>
              lang.toLowerCase().includes(keyword.toLowerCase())
            ) ||
            job.tools.some((tool) =>
              tool.toLowerCase().includes(keyword.toLowerCase())
            )
          );
        });
      }

      container.innerHTML = "";

      filteredSearch(keyword, data);
      filter.forEach((job) => renderJobs(job));
    }
  };
  container.addEventListener("click", handleFilterClick);
};

const findJob = async function () {
  const res = await fetch("data.json");
  const data = await res.json();
  container.innerHTML = "";

  data.forEach((info) => renderJobs(info));
  filterJobs(data);
  clearAll.addEventListener("click", function () {
    clearFilters(data);
  });
};
findJob();
