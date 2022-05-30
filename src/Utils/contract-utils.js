import contract from "@truffle/contract";

module.exports.loadContract = async function (name) {
    const res = await fetch(`/contracts/${name}.json`);
    const Artifact = await res.json();
    return contract(Artifact);
}