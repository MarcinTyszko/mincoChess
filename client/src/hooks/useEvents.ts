import EventType from "@constants/EventType";

function subscribeEventListener(event: EventType, listener: () => void) {
    document.addEventListener(event, listener);
}
  
function unsubscribeEventListener(event: EventType, listener: () => void) {
    document.removeEventListener(event, listener);
}
  
function dispatchEvent(eventName: string) {
    document.dispatchEvent(
        new Event(eventName)
    );
}

function useEvents() {
    return {
        subscribeEventListener,
        unsubscribeEventListener,
        dispatchEvent
    };
}

export default useEvents;