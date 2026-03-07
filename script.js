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

// {
//     "id": 1,
//     "title": "Fix navigation menu on mobile devices",
//     "description": "The navigation menu doesn't collapse properly on mobile devices. Need to fix the responsive behavior.",
//     "status": "open",
//     "labels": [
//         "bug",
//         "help wanted"
//     ],
//     "priority": "high",
//     "author": "john_doe",
//     "assignee": "jane_smith",
//     "createdAt": "2024-01-15T10:30:00Z",
//     "updatedAt": "2024-01-15T10:30:00Z"
// }

const cardUpdate = (issue) => {
  if (issue.status === "open") {
    return {
      borderColor: "border-t-4 border-green-600",
      statusImg: "./assets/Open-Status.png",
    };
  } else if (issue.status === "closed") {
    return {
      borderColor: "border-t-4 border-purple-600",
      statusImg: "./assets/Closed- Status .png",
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
      icon: '<i class="fa-solid fa-diamond"></i>',
    };
  } else if (label.toLowerCase() === "documentation") {
    return {
      color: "text-gray-600 bg-gray-100",
      icon: '<i class="fa-solid fa-file-alt"></i>',
    };
  }
};

const loadIssues = () => {
  const issuesContainer = document.getElementById("issues-container");
  issuesContainer.innerHTML = `<div class="col-span-full text-center py-10">
      <span class="loading loading-spinner text-primary"></span>
    </div>`;

  fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then((res) => res.json())
    .then((json) => {
      if (json.status === "success") {
        let filterData = json.data;
        if (currentTab !== "all") {
          filterData = json.data.filter((issue) => issue.status === currentTab);
        }
        displayIssues(filterData);
      }
    });
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
    <div class="bg-white p-4 border-t-4 ${borderColor} rounded-md shadow-md space-y-4 h-full">
          <div class="flex justify-between items-center">
            <img src="${statusImg}" alt="" />
            <p class="px-6 rounded-full ${priorityColor(issue.priority)}">${issue.priority.toUpperCase()}</p>
          </div>

          <h3 class="font-semibold text-lg">${issue.title}</h3>
          <p class="text-[#64748B]">${issue.description}</p>

          <div class="flex flex-wrap items-center gap-1">
            ${issue.labels
              .map((label) => {
                const result = labelColor(label);
                if (!result) return "";
                const { color, icon } = result;
                return `<p class="border px-2 rounded-full ${color}">${icon} ${label.toUpperCase()}</p>`;
              })
              .join("")}
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
