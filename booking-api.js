// Google Sheets API Configuration
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyyvXYznLIM6Mm54woC3P-zKdTCidluTROcBAflUQOIjQtVq1VRNchRaAQLFhJVNVA/exec';

// Check slot availability
async function checkSlotAvailability(date) {
    try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?date=${date}`);
        const data = await response.json();
        return data.success ? data.bookedSlots : [];
    } catch (error) {
        console.error('Error checking availability:', error);
        return [];
    }
}

// Book appointment
async function bookAppointment(bookingData) {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });
        return { success: true };
    } catch (error) {
        console.error('Error booking:', error);
        return { success: false, message: error.message };
    }
}
