const agenda = new Agenda({ db: { address: mongoConnectionString } });

agenda.define("create invoice", async (job) => {
    const contracts = await contractModel.find({});
    
    if(contracts.length > 0) {
        contracts.forEach(async(contract) => {
            await contract.nextInvoice();
        })
    }
});

(async function () {
    // IIFE to give access to async/await
    await agenda.start();
    
    await agenda.every("1 months", "create invoice");
})();