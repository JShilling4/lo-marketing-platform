/* eslint-disable no-mixed-operators */
const scrollToBottom = (el, smooth) => {
  if (typeof el.scroll === 'function') {
    el.scroll({
      top: el.scrollHeight,
      behavior: smooth ? 'smooth' : 'instant',
    });
  } else {
    el.scrollTop = el.scrollHeight;
  }
};

const ChatScroll = {
  bind: (el, binding) => {
    let scrolled = false;

    el.addEventListener('scroll', (e) => {
      scrolled = el.scrollTop + el.clientHeight + 1 < el.scrollHeight;
    });

    (new MutationObserver((e) => {
      const config = binding.value || {};
      const pause = config.always === false && scrolled;
      const addedNodes = e[e.length - 1].addedNodes.length;
      const removedNodes = e[e.length - 1].removedNodes.length;

      if (config.scrollonremoved) {
        if (pause || addedNodes != 1 && removedNodes != 1) return;
      } else if (pause || addedNodes != 1) return;

      let { smooth } = config;
      const loadingRemoved = !addedNodes && removedNodes === 1;
      if (loadingRemoved && config.scrollonremoved && 'smoothonremoved' in config) {
        smooth = config.smoothonremoved;
      }
      scrollToBottom(el, smooth);
    })).observe(el, { childList: true, subtree: true });
  },
  inserted: (el, binding) => {
    const config = binding.value || {};
    scrollToBottom(el, config.smooth);
  },
};

export default ChatScroll;
