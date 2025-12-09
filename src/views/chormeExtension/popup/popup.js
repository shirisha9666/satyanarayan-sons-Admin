const checkBtn = document.getElementById("checkBtn");
const message = document.getElementById("message");

checkBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Check if tab is LinkedIn
  if (!tab.url.includes("linkedin.com/in/")) {
    message.innerText = "You are not on a LinkedIn profile page";
    message.className = "error"; 
    return;
  }

  // Inject script to read the profile name
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => {
        const selectors = ["h1", "div.text-heading-xlarge"];
        for (let sel of selectors) {
          console.log("sel",sel)
          const el = document.querySelector(sel);
          if (el && el.innerText.trim()) {
            return el.innerText.trim();
          }
        }
        return null; // no name found
      },
    },
    (results) => {
      const name = results?.[0]?.result;
      if (name) {
        message.innerText = `Profile page of ${name}`;
        message.className = "success";
      } else {
        message.innerText = "Could not find profile name on this page";
        message.className = "error";
      }
    }
  );
});


// chrome.scripting.executeScript(
//   {
//     target: { tabId: tab.id },
//     func: () => {
//       const getText = (selector) => {
//         const el = document.querySelector(selector);
//         return el ? el.innerText.trim() : null;
//       };

//       // Name selectors
//       const name = getText("h1") || getText("div.text-heading-xlarge");

//       // Headline / Job title
//       const headline = getText("div.text-body-medium") || getText(".pv-text-details__left-panel");

//       // Location
//       const location = getText(".text-body-small.inline.t-black--light") || getText(".pv-top-card--list-bullet li");

//       // Education (first item)
//       const educationEl = document.querySelector(".pv-education-entity__school-name");
//       const education = educationEl ? educationEl.innerText.trim() : null;

//       // Current company
//       const companyEl = document.querySelector(".pv-entity__secondary-title");
//       const company = companyEl ? companyEl.innerText.trim() : null;

//       return { name, headline, location, education, company };
//     },
//   },
//   (results) => {
//     const profile = results?.[0]?.result;
//     if (profile && profile.name) {
//       message.innerHTML = `
//         <strong>Name:</strong> ${profile.name}<br>
//         ${profile.headline ? `<strong>Headline:</strong> ${profile.headline}<br>` : ""}
//         ${profile.location ? `<strong>Location:</strong> ${profile.location}<br>` : ""}
//         ${profile.education ? `<strong>Education:</strong> ${profile.education}<br>` : ""}
//         ${profile.company ? `<strong>Company:</strong> ${profile.company}<br>` : ""}
//       `;
//       message.className = "success";
//     } else {
//       message.innerText = "Could not find profile details on this page";
//       message.className = "error";
//     }
//   }
// );
