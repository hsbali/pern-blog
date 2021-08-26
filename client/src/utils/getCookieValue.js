const getCookieValue = (name) => {
  let result = document.cookie.match(
    "(^|[^;]+)\\s*" + name + "\\s*=\\s*([^;]+)"
  );
  return result ? result.pop() : "";
};

export default getCookieValue;
