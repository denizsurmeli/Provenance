const {ethers} = require('hardhat');

async function main() {

	const [deployer] = await ethers.getSigners();

	console.log(
	"Deploying contracts with the account:",
	deployer.address
	);

	console.log("Account balance:", (await deployer.getBalance()).toString());

	const LegalEntityVerification = await ethers.getContractFactory("LegalEntityVerification");
	const levContract = await LegalEntityVerification.deploy();

    const Provenance = await ethers.getContractFactory("Provenance");
    const provenanceContract = await Provenance.deploy("Test1","T1",levContract.address);



	console.log("LegalEntityVerification Contract deployed at:", levContract.address);
    console.log("Provenance Contract deployed at:", provenanceContract.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
	console.error(error);
	process.exit(1);
  });