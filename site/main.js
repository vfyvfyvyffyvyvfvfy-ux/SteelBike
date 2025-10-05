import { fetchConfig, getClient, getActiveRental, createPayment } from './api.js';
import { renderDefaultView, renderActiveRentalView, renderOverdueRentalView, renderPendingReturnView, showLoadingSpinner, hideLoadingSpinner } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
    showLoadingSpinner();

    // Fetch configuration first
    window.APP_CONFIG = await fetchConfig();

    if (!window.APP_CONFIG) {
        hideLoadingSpinner();
        // You might want to show a permanent error message here
        alert('Failed to load application configuration. Please try again later.');
        return;
    }

    // Proceed with the rest of the initialization
    if (localStorage.getItem('isRegistered') !== 'true') {
        window.location.replace('start.html');
        return;
    }

    async function initializeRentalSystem() {
        const mainContent = document.querySelector('.app-main');
        const appHeader = document.querySelector('.app-header h1');
        const userId = localStorage.getItem('userId');

        if (!userId) {
            localStorage.clear();
            window.location.replace('start.html');
            return;
        }

        const currentUser = await getClient(userId);
        if (!currentUser) {
            localStorage.clear();
            window.location.replace('start.html');
            return;
        }

        appHeader.textContent = '';

        const activeRental = await getActiveRental(userId);

        if (activeRental) {
            switch(activeRental.status) {
                case 'active':
                    await renderActiveRentalView(mainContent, activeRental, currentUser.balance_rub);
                    break;
                case 'overdue': 
                    renderOverdueRentalView(mainContent, activeRental); 
                    break;
                case 'pending_return': 
                    renderPendingReturnView(mainContent, activeRental); 
                    break;
                default: 
                    renderDefaultView(mainContent);
                    initializeMainScreenEventListeners(currentUser);
            }
        } else {
            renderDefaultView(mainContent);
            initializeMainScreenEventListeners(currentUser);
        }
    }

    await initializeRentalSystem();
    initializeModals();
    hideLoadingSpinner();
});