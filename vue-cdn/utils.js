function blockUI(el, msg = "Processing...") {
    $(el).block({
        overlayCSS: {
            backgroundColor: "#000",
            opacity: 0.4,
            cursor: "wait",
        },
        css: {
            padding: 0,
            margin: 0,
            width: "150px",
            top: "50%",
            left: "45%",
            textAlign: "center",
            color: "#000",
            border: "0px solid #aaa",
            borderRadius: "10px",
            backgroundColor: "#fff",
            cursor: "wait",
        },
        state: "primary",
        message: '<i class="fa fa-spin fa-spinner"></i> ' + msg,
    });
}
function pDebounce(fn, wait, options = {}) {
    if (!Number.isFinite(wait)) {
        throw new TypeError("Expected `wait` to be a finite number");
    }

    let leadingValue;
    let timer;
    let resolveList = [];

    return function (...arguments_) {
        return new Promise((resolve) => {
            const runImmediately = options.leading && !timer;

            clearTimeout(timer);

            timer = setTimeout(() => {
                timer = null;

                const result = options.leading
                    ? leadingValue
                    : fn.apply(this, arguments_);

                for (resolve of resolveList) {
                    resolve(result);
                }

                resolveList = [];
            }, wait);

            if (runImmediately) {
                leadingValue = fn.apply(this, arguments_);
                resolve(leadingValue);
            } else {
                resolveList.push(resolve);
            }
        });
    };
}
