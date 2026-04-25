import "node-window-polyfill/register";
(global as any).window = (global as any).window || {};
(global as any).window.screen = { deviceXDPI: 1 };
(global as any).screen = (global as any).window.screen;
(global as any)["document"] = {
  documentElement: { style: [] },
  createElement: () => ({}),
};
Object.defineProperty(global, "navigator", {
  configurable: true,
  value: { userAgent: "", platform: "" },
});
