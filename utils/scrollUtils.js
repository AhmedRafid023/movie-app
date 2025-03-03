// utils/scrollUtils.js
export const scrollContainer = (direction, container) => {
    const scrollAmount = 200; // Adjust this value as needed
    if (container) {
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    }
};