function manageDataConsent() {
    try {
        window.googlefc.callbackQueue.push(
            window.googlefc.showRevocationMessage
        );
    } catch {
        console.warn("failed to display consent management dialog.");
    }
}

export default manageDataConsent;