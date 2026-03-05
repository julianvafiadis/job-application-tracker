const trackerForm = document.getElementById("tracker-form");
const applicationsBody = document.getElementById("applications-body");
const STATUS_OPTIONS = ["Applied", "Interview", "Offer", "Rejected"];
const statsTotal = document.getElementById("stat-total");
const statsApplied = document.getElementById("stat-applied");
const statsInterview = document.getElementById("stat-interview");
const statsOffer = document.getElementById("stat-offer");
const statsRejected = document.getElementById("stat-rejected");

function updateStats() {
    if (!applicationsBody) {
        return;
    }

    const statusPills = applicationsBody.querySelectorAll("[data-status]");
    const counts = {
        Applied: 0,
        Interview: 0,
        Offer: 0,
        Rejected: 0
    };

    for (const statusPill of statusPills) {
        const status = statusPill.dataset.statusValue || statusPill.textContent.trim();
        if (counts[status] !== undefined) {
            counts[status] += 1;
        }
        if (status === "Offer") {
            counts.Interview += 1;
        }
    }

    if (statsTotal) {
        statsTotal.textContent = String(statusPills.length);
    }
    if (statsApplied) {
        statsApplied.textContent = String(counts.Applied);
    }
    if (statsInterview) {
        statsInterview.textContent = String(counts.Interview);
    }
    if (statsOffer) {
        statsOffer.textContent = String(counts.Offer);
    }
    if (statsRejected) {
        statsRejected.textContent = String(counts.Rejected);
    }
}

function setStatusPillState(statusPill, status) {
    statusPill.textContent = status;
    statusPill.dataset.statusValue = status;
}

function formatSubmittedDate(timestamp) {
    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}

function openStatusSelect(statusPill) {
    const cell = statusPill.parentElement;
    if (!cell) {
        return;
    }

    const select = document.createElement("select");
    select.className = "status-inline-select";
    select.setAttribute("aria-label", "Update application status");

    for (const status of STATUS_OPTIONS) {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        select.appendChild(option);
    }

    const currentStatus = statusPill.textContent.trim();
    select.value = STATUS_OPTIONS.includes(currentStatus)
        ? currentStatus
        : STATUS_OPTIONS[0];

    let closed = false;
    const closeSelect = (nextStatus) => {
        if (closed) {
            return;
        }

        closed = true;
        setStatusPillState(statusPill, nextStatus);
        cell.replaceChild(statusPill, select);
        updateStats();
    };

    select.addEventListener("change", () => {
        closeSelect(select.value);
    });

    select.addEventListener("blur", () => {
        closeSelect(select.value);
    });

    select.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeSelect(currentStatus);
        }
    });

    cell.replaceChild(select, statusPill);
    select.focus();
    select.showPicker?.();
}

function makeRow(company, role, status, submittedAt) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${company}</td>
        <td>${role}</td>
        <td class="centered-elements-in-table"><button class="pill status-pill" type="button" data-status data-status-value="${status}">${status}</button></td>
        <td class="centered-elements-in-table">${formatSubmittedDate(submittedAt)}</td>
        <td class="centered-elements-in-table"><button class="btn btn-ghost" type="button" data-remove>Remove</button></td>
    `;
    return row;
}

if (applicationsBody) {
    applicationsBody.addEventListener("click", (event) => {
        const statusPill = event.target.closest("[data-status]");
        if (statusPill) {
            openStatusSelect(statusPill);
            return;
        }

        const removeButton = event.target.closest("[data-remove]");
        if (!removeButton) {
            return;
        }

        const row = removeButton.closest("tr");
        if (row) {
            row.remove();
            updateStats();
        }
    });
}

if (trackerForm && applicationsBody) {
    trackerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const company = trackerForm.company.value.trim();
        const role = trackerForm.role.value.trim();
        const status = STATUS_OPTIONS[0];
        const submittedAt = Date.now();

        if (!company || !role || !status) {
            return;
        }

        applicationsBody.appendChild(makeRow(company, role, status, submittedAt));
        trackerForm.reset();
        updateStats();
    });
}

if (applicationsBody) {
    const existingStatusPills = applicationsBody.querySelectorAll("[data-status]");
    for (const statusPill of existingStatusPills) {
        setStatusPillState(statusPill, statusPill.textContent.trim());
    }
}

updateStats();
