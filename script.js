// Sidebar functionality
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        mainContent.style.marginLeft = '0';
        document.querySelector('header').style.left = '0';
    } else {
        sidebar.classList.add('active');
        mainContent.style.marginLeft = getComputedStyle(sidebar).width;
        document.querySelector('header').style.left = getComputedStyle(sidebar).width;
    }
}

// Modal functionality (About & Help)
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Event Listeners for buttons
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('aboutUsButton').addEventListener('click', () => openModal('aboutModal'));
    document.getElementById('helpSupportButton').addEventListener('click', () => openModal('helpSupportModal'));

    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        const aboutModal = document.getElementById('aboutModal');
        const helpSupportModal = document.getElementById('helpSupportModal');
        if (event.target == aboutModal) {
            closeModal('aboutModal');
        }
        if (event.target == helpSupportModal) {
            closeModal('helpSupportModal');
        }
    });

    // Example of showing a specific section (will be expanded later)
    // For now, only welcome-section is active
    // You can add more functionality here to switch sections via sidebar links later
    // e.g., document.getElementById('authLink').addEventListener('click', () => showPage('auth-section'));
});

// Function to switch active pages (will be used by sidebar links)
function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none'; // Ensure it's hidden
    });
    const activeSection = document.getElementById(pageId);
    if (activeSection) {
        activeSection.classList.add('active');
        activeSection.style.display = 'flex'; // Make it flex to center content
        // Close sidebar after navigation
        toggleSidebar();
    }
}
