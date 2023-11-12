export const csrfToken = document.querySelector('meta[name="csrf-token"]');

export const truncateText = (text, symbolsNumber = 25) => {
    if (text.length <= symbolsNumber) {
        return text;
    }

    return text.substring(0, symbolsNumber - 3).concat('...');
};

export const isJson = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }

    return true;
};

export const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });
