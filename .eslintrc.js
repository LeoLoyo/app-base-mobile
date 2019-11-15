module.exports = {
  root: true,
  extends: '@react-native-community',
  rules:{
    "no-console": ["error", { allow: ["warn","error"] }],
    "max-len": [1, 120, 2, {ignoreComments: true}],
}
};
