export function removeDefaultConsentLink() {
    const observer = new MutationObserver(() => (
        document.querySelector(".ipr-container")?.remove()
    ));

    observer.observe(document.body, { childList: true });
}

export function manageDataConsent() {
    try {
        window.googlefc.callbackQueue.push(
            window.googlefc.showRevocationMessage
        );
    } catch {
        console.warn("failed to display consent management dialog.");
    }
}