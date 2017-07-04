((exports) => {
    toast = (msg, options) => {
        if (!msg) return;
        options = options || 3000;

        const toastMsg = document.querySelector('.toast__msg');
        toastMsg.textContent = msg;
        toastMsg.classList.add("toast__msg--show");

        // Show toast for 3secs and hide it
        setTimeout(() => {
            toastMsg.classList.remove("toast__msg--show");
            toastMsg.textContent = "";
        }, options);
    }

    exports.toast = toast;
})(typeof window === 'undefined' ? module.exports : window);