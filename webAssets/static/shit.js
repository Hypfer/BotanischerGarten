function arrowKeys(e) {
    switch (e.keyCode) {
        case 39:
            var prev = document.getElementById('prev');
            if (prev) prev.click();
            break;
        case 37:
            var next = document.getElementById('next');
            if (next) next.click();
            break;
        case 82:
            var random = document.getElementById('random');
            if (random) random.click();
    }
}
if (document.readyState == 'complete' || document.readyState == 'loaded')
    document.addEventListener('keydown', arrowKeys);
else {
    if (/Chrome/i.test(navigator.userAgent))
        window.addEventListener('load', function () {
            document.addEventListener('keydown', arrowKeys);
        });
    else
        document.addEventListener('DOMContentLoaded', function () {
            document.addEventListener('keydown', arrowKeys);
        });
}
