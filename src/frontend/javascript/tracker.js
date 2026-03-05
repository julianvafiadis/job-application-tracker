const trackerForm = document.getElementById("tracker-form");
const applicationsBody = document.getElementById("applications-body");
const statusField = document.getElementById("status");
const STATUS_OPTIONS = statusField
    ? Array.from(statusField.options).map((option) => option.value)
    : ["Applied", "Interview", "Offer", "Rejected"];

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
        statusPill.textContent = nextStatus;
        cell.replaceChild(statusPill, select);
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

function makeRow(company, role, status) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${company}</td>
        <td>${role}</td>
        <td class="centered-elements-in-table"><button class="pill status-pill" type="button" data-status>${status}</button></td>
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
        }
    });
}

if (trackerForm && applicationsBody) {
    trackerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const company = trackerForm.company.value.trim();
        const role = trackerForm.role.value.trim();
        const status = trackerForm.status.value;

        if (!company || !role || !status) {
            return;
        }

        applicationsBody.appendChild(makeRow(company, role, status));
        trackerForm.reset();
    });
}
