import SyncClient from 'twilio-sync';

/*
// mock twilio sync interactions
class SyncClient {
    constructor(jwt) {
        console.log(`Creating mock sync client with JWT: ${jwt}`);
        this.data = {
            '+15202010410': {
                '+10002224444': { name: 'Alpha Tester', authorized: 'self'},
                '+10002225555': { name: 'Beta Tester', authorized: 'self'},
                '+10002226666': { name: 'Gamma Tester', authorized: 'self'},
                '+10002227777': { name: 'Production User', authorized: 'admin'},
            }
        }
    }
    map = mapKey => {
        const mapData = this.data[mapKey];
        return Promise.resolve({
            getItems: () => Promise.resolve({
                items: Object.keys(mapData).map(key => ({ key, value: mapData[key] })),
                hasNextPage: false
            }),
            remove: () => new Promise(resolve => setTimeout(resolve, 200)),
            set: () => new Promise(resolve => setTimeout(resolve, 200))
        });
    };
}
*/

export default SyncClient;