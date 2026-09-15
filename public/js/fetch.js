async function fetchWithLoader(...args) {
  const timer = setTimeout(() => {
    document.querySelector(".loader").classList.remove("hidden");
  }, 300);

  return fetch(...args).then((response) => {
    clearTimeout(timer);
    document.querySelector(".loader").classList.add("hidden");
    return response;
  });
}
