// Generate a random ID
export const generateId = () => Math.random().toString(36).substr(2, 9);

// Format date string to readable format
export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

// Simulate network delay
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
