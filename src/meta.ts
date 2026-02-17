import pkg from '../package.json';

export const APP_META = pkg;
export const APP_NAME = APP_META.name;
export const APP_VERSION = APP_META.version;
export const APP_DISPLAY_NAME = APP_META.displayName ?? APP_NAME;
