exports.config = {
    appPort: 3000,
    appPath: '',
    inventoryFile: 'inventory.json',
    db: {
        host: 'ds043957.mongolab.com',
        port: 43957,
        database: 'bloom-sandbox',
        username: 'bloomuser',
        password: 'gobloom',
        collection: 'shoppingcart'
    }
}