// src/plugins/clarity.js
import clarity from "@microsoft/clarity";

/**
 * Vanilla JS-style initializer for Microsoft Clarity in Vue 3 (Vite).
 * - Gates by env flags
 * - Avoids double init during HMR
 * - Safe in browser-only contexts
 * - Optional route annotation hook
 *
 * @param {object} options
 * @param {string} options.projectId - Clarity project ID
 * @param {boolean} [options.enabled=true] - Whether to start Clarity
 * @param {import('vue-router').Router} [options.router] - Optional router for route annotations
 * @param {(route: import('vue-router').RouteLocationNormalized) => string} [options.routeLabel] - Map route -> label
 */
export function initClarity(options = {}) {
  const { projectId = "", clarityEnabled = true, router, routeLabel } = options;

  // Browser only
  if (typeof window === "undefined") return;

  // Respect gate and presence of project ID
  if (!clarityEnabled || !projectId) return;

  // Avoid double initialization (HMR / multiple mounts)
  if (window.__clarity_initialized__) return;
  window.__clarity_initialized__ = true;

  // Start Clarity
  clarity.start(projectId);

  // Optional: annotate route changes for easier filtering
  if (router) {
    const toLabel =
      typeof routeLabel === "function"
        ? routeLabel
        : (to) => to.name ?? to.path;

    // Initial label (after app mounts you can call once)
    try {
      const current = router.currentRoute?.value ?? router.currentRoute;
      if (current) clarity.set("route", toLabel(current));
    } catch (error) {
      console.error(error);
    }

    router.afterEach((to) => {
      clarity.set("route", toLabel(to));
    });
  }
}

/**
 * Optional consent toggling utility (call from your CMP or cookie banner).
 * @param {boolean} consented
 */

export function setClarityConsent(consented) {
  try {
    clarity.consent(!!consented);
  } catch (error) {
    console.error(error);
  }
}
