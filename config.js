exports.config = {
    appPort: 3000,
    appPath: '',
    inventoryFile: 'inventory.json',
    statesFile: 'states.json',
    db: {
        host: 'ds043467.mongolab.com',
        port: 43467,
        database: 'bloom-sandbox',
        username: 'bloomuser',
        password: 'gobloom',
        collection: 'shoppingcart'
    }
}