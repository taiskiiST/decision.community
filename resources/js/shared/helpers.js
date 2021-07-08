export const csrfToken = document.querySelector('meta[name="csrf-token"]');

export const truncateText = (text, symbolsNumber = 25) => {
    if (text.length <= symbolsNumber) {
        return text;
    }

    return text.substring(0, symbolsNumber - 3).concat('...');
};
