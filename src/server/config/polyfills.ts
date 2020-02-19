import "node-window-polyfill/register";
(window as any).screen = {deviceXDPI: 1};
(global as any)['document'] = {'documentElement': {style: []}, createElement: () => ({})};
(global as any)['navigator'] = {userAgent: '', platform: ''};
