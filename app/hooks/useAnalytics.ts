/**
 * Analytics tracking hook for component interactions
 * Supports both custom callback tracking and Google Analytics (gtag)
 *
 * @example
 * ```tsx
 * const { trackEvent } = useAnalytics();
 *
 * const handleClick = () => {
 *   trackEvent({
 *     event: "button_click",
 *     category: "engagement",
 *     label: "contact_button",
 *     component: "AskOrganizer",
 *   });
 * };
 * ```
 */

interface AnalyticsEvent {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  component?: string;
  variant?: string;
  [key: string]: unknown;
}

interface UseAnalyticsReturn {
  trackEvent: (_event: AnalyticsEvent) => void;
  trackCustomEvent: (
    _event: string,
    _data: Record<string, unknown>,
    _callback?: (_data: Record<string, unknown>) => void,
  ) => void;
}

declare global {
  interface Window {
    gtag?: (
      _command: string,
      _eventName: string,
      _params?: Record<string, unknown>,
    ) => void;
  }
}

export function useAnalytics(): UseAnalyticsReturn {
  const trackEvent = (eventData: AnalyticsEvent) => {
    const { event, category = "engagement", label, value, ...rest } = eventData;

    // Track with Google Analytics if available
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", event, {
        event_category: category,
        event_label: label,
        value: value ?? 1,
        ...rest,
      });
    }
  };

  const trackCustomEvent = (
    event: string,
    data: Record<string, unknown>,
    callback?: (_data: Record<string, unknown>) => void,
  ) => {
    // Execute custom callback if provided
    if (callback) {
      callback({
        event,
        ...data,
        timestamp: new Date().toISOString(),
      });
    }

    // Also track with Google Analytics
    trackEvent({
      event,
      category: "custom",
      ...data,
    });
  };

  return {
    trackEvent,
    trackCustomEvent,
  };
}
