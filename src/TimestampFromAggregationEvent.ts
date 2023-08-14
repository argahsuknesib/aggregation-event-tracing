const program = require('commander');
import { LDESinLDP, LDPCommunication } from "@treecg/versionawareldesinldp";
const linked_data_fetch = require('ldfetch');
const N3 = require('n3');
const fetch_ld = new linked_data_fetch({});
const query_engine = require('@comunica/query-sparql-link-traversal-solid').QueryEngine;
const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const myEngine = new QueryEngine();

program
    .version('1.0.0')
    .name('get-timestamp')

program
    .command('get-timestamp')
    .description('Get Timestamp of an Aggregation Event by providing the event')
    .option('-r --resource <resource>', 'Resource of the Aggregation Event')
    .parse(process.argv)
    .action((options: any) => {
        get_timestamp_from_event(options.resource)
    })

program.parse();

async function get_timestamp_from_event(resource: string) {
    let resource_metadata = fetch_ld.get(resource).catch((error: any) => {
        console.log(error);
    }).then(async (resource_metadata: any) => {
        const store = await new N3.Store(await resource_metadata.triples);
        const binding_stream = await myEngine.queryBindings(`
        select ?timestamp where {
            ?resource <https://saref.etsi.org/core/hasTimestamp> ?timestamp .
        }
        `, {
            sources: [store]
        });
        binding_stream.on('data', async (binding: any) => {
            return binding.get('timestamp').value;
        })
    });
}