const Migrations = artifacts.require("Migrations");
const Hub = artifacts.require("Hub");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Hub);
};
