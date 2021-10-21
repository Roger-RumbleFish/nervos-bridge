function managerEntries(entry = []) {
  return [...entry, require.resolve("./register")];
}

function config(entry= []) {
  return [...entry, require.resolve('./config')];
}

module.exports = {
  managerEntries,
  config
}