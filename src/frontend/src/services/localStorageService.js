export default {
  set(name, val) {
    console.log('setting in local storage', val);
    localStorage.setItem(name, val);
    if (window.location.hostname === 'localhost') {
      // Chrome localhost bug
      localStorage.getItem(val);
    }
  },
  get(item) {
    const val = localStorage.getItem(item);
    console.log('getting from local storage', val);
    return val;
  },
  clear() {
    return localStorage.clear();
  },
};
