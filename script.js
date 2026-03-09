const login = () => {
  const userName = document.getElementById("user-name").value;
  const password = document.getElementById("password").value;
  if (userName === "admin" && password === "admin123") {
    window.location.href = "./home.html";
  } else {
    alert("Invalid username or password");
  }
};

let currentTab = "all";

const switchTab = (tab) => {
  const tabs = ["all", "open", "closed"];
  for (const t of tabs) {
    const tabName = document.getElementById("tab-" + t);
    if (t === tab) {
      tabName.classList.add("btn-primary");
      tabName.classList.remove("text-[#64748B]");
    } else {
      tabName.classList.remove("btn-primary");
      tabName.classList.add("text-[#64748B]");
    }
  }
  currentTab = tab;
  loadIssues();
};

const loadIssues = async () => {
  const issuesContainer = document.getElementById("issues-container");
  issuesContainer.innerHTML = `<div class="col-span-full text-center py-10">
      <span class="loading loading-spinner text-primary"></span>
    </div>`;

  const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

  const res = await fetch(url);
  const data = await res.json();

  if (data.status === "success") {
    if (currentTab === "all") {
      displayIssues(data.data);
    } else {
      const filterData = data.data.filter(
        (issue) => issue.status === currentTab,
      );
      displayIssues(filterData);
    }
  }
};

const cardUpdate = (issue) => {
  if (issue.status === "open") {
    return {
      borderColor: "border-t-4 border-green-600",
      statusImg: "./assets/Open-Status.png",
      statusText: "Opened",
      statusColor: "bg-green-600",
    };
  } else if (issue.status === "closed") {
    return {
      borderColor: "border-t-4 border-purple-600",
      statusImg: "./assets/Closed- Status .png",
      statusText: "Closed",
      statusColor: "bg-purple-600",
    };
  }
};

const priorityColor = (priority) => {
  if (priority === "high") {
    return "text-red-600 bg-red-100";
  } else if (priority === "medium") {
    return "text-yellow-600 bg-yellow-100";
  } else if (priority === "low") {
    return "text-gray-600 bg-gray-100";
  }
};

const labelColor = (label) => {
  if (label.toLowerCase() === "bug") {
    return {
      color: "text-red-600 bg-red-100",
      icon: '<i class="fa-solid fa-bug"></i>',
    };
  } else if (label.toLowerCase() === "help wanted") {
    return {
      color: "text-yellow-600 bg-yellow-100",
      icon: '<i class="fa-solid fa-bullseye"></i>',
    };
  } else if (label.toLowerCase() === "enhancement") {
    return {
      color: "text-green-600 bg-green-100",
      icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>',
    };
  } else if (label.toLowerCase() === "documentation") {
    return {
      color: "text-gray-600 bg-gray-100",
      icon: '<i class="fa-solid fa-file-alt"></i>',
    };
  } else if (label.toLowerCase() === "good first issue") {
    return {
      color: "text-blue-600 bg-blue-100",
      icon: '<i class="fa-solid fa-hand-holding-heart"></i>',
    };
  }
};

const renderLabels = (labels = []) => {
  return labels
    .map((label) => {
      const res = labelColor(label);
      return res
        ? `<p class="border px-2 font-medium rounded-full ${res.color}">${res.icon} ${label.toUpperCase()}</p>`
        : "";
    })
    .join("");
};

const issueModal = async (id) => {
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayIssuesDetails(details.data);
};

const displayIssuesDetails = (issue) => {
  const modalContent = document.getElementById("modal-content");
  const { statusColor, statusText } = cardUpdate(issue);
  modalContent.innerHTML = `
  <div class="space-y-6">
            <h1 class="text-2xl font-bold">${issue.title}</h1>
            <div class="md:flex items-center gap-2">
              <span class="${statusColor} text-white px-3 py-1 rounded-full"
                >${statusText}</span
              >
              <p class="text-[#64748B] mt-2 md:mt-0">• ${statusText} by ${issue.author}</p>
              <p class="text-[#64748B]">• ${new Date(issue.updatedAt).toLocaleDateString()}</p>
            </div>

            <div class="flex flex-wrap items-center gap-1">
              ${renderLabels(issue.labels)}
            </div>

            <p class="text-[#64748B]">
              ${issue.description}
            </p>

            <div class="grid grid-cols-2 bg-[#F8FAFC] p-4 rounded-lg">
              <div>
                <p class="text-[#64748B]">Assignee:</p>
                <p class="font-semibold">${issue.assignee}</p>
              </div>
              <div>
                <p class="text-[#64748B]">Priority:</p>
                <span class="px-3 font-medium rounded-full ${priorityColor(issue.priority)}">${issue.priority.toUpperCase()}</span>
              </div>
            </div>
          </div>
  `;
  document.getElementById("modal_box").showModal();
};

const displayIssues = (issues) => {
  const issueCount = document.getElementById("issue-count");
  issueCount.innerText = issues.length + " Issues";

  const issuesContainer = document.getElementById("issues-container");
  issuesContainer.innerHTML = "";

  issues.forEach((issue) => {
    const { borderColor, statusImg } = cardUpdate(issue);

    const issueDiv = document.createElement("div");

    issueDiv.innerHTML = `
    <div onclick="issueModal(${issue.id})" class="bg-white p-4 ${borderColor} rounded-md shadow-md space-y-4 h-full cursor-pointer hover:bg-[#F8FAFC]">
          <div class="flex justify-between items-center">
            <img src="${statusImg}" alt="" />
            <p class="px-3 font-medium rounded-full ${priorityColor(issue.priority)}">${issue.priority.toUpperCase()}</p>
          </div>

          <h3 class="font-semibold text-lg">${issue.title}</h3>
          <p class="text-[#64748B]">${issue.description}</p>

          <div class="flex flex-wrap items-center gap-1">
            ${renderLabels(issue.labels)}
          </div>

          <hr class="w-full opacity-25" />

          <div>
            <p class="text-[#64748B]">#${issue.id} by ${issue.author}</p>
            <p class="text-[#64748B]">${new Date(issue.createdAt).toLocaleDateString()}</p>
          </div>
          
        </div>

    `;
    issuesContainer.appendChild(issueDiv);
  });
};
loadIssues();

const searchIssues = async () => {
  switchTab();

  const searchInput = document
    .getElementById("search-input")
    .value.trim()
    .toLowerCase();

  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchInput}`;

  const res = await fetch(url);

  const data = await res.json();
  const allSearchIssues = data.data;
  displayIssues(allSearchIssues);
};

document.getElementById("btn-search").addEventListener("click", searchIssues);
