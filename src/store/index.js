import { createStore } from "vuex";
import profile from "./profile";

// Import the CSS or use your own!

export const store = createStore({
  ...profile,
});

// Install the store instance as a plugin
