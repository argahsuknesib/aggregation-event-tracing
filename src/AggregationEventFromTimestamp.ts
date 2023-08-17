const program = require('commander');
import { LDESinLDP, LDPCommunication} from "@treecg/versionawareldesinldp";


program
    .version('1.0.0')
    .name('get-event')

program
    .command('get-event')
    .description('Get Aggregation Event by providing the timestamp')
    .option('-ll --ldesLocation <ldesLocation>', 'Location of the LDES')
    .option('-t, --timestamp <timestamp>', 'Timestamp of the Aggregation Event')
    .parse(process.argv)
    .action((options: any) => {
        get_event_from_timestamp(new Date(options.timestamp), options.ldesLocation)
    })

program.parse();

async function get_event_from_timestamp(timestamp: Date, ldesLocation: string) {    
    const from = (timestamp.setMilliseconds(timestamp.getMilliseconds()));
    const until = (timestamp.setMilliseconds(timestamp.getMilliseconds()));  
    const ldes_in_ldp = new LDESinLDP(ldesLocation, new LDPCommunication());
    const event_stream = ldes_in_ldp.readMembersSorted({
        from: new Date(from),
        until: new Date(until),
        chronological: true
    });    
    (await event_stream).on('data', (event: any) => {        
        let quad_list: any = []
        for (const quad of event.quads) {
            if (quad.predicate.value === "http://purl.org/dc/terms/source"){
            quad_list.push(quad.object.id);
            }
        }
        console.log(quad_list);
    })
}
