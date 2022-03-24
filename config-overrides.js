module.exports = config => {
  require('react-app-rewire-postcss')(config, {
     plugins: loader => []
  });

  return config;
};
