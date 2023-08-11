const program = require('commander');
import { LDESinLDP, LDPCommunication } from "@treecg/versionawareldesinldp";

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
    const from = (timestamp.setMilliseconds(timestamp.getMilliseconds() - 1));
    const until = timestamp.setMilliseconds(timestamp.getMilliseconds() + 1);
    const ldes_in_ldp = new LDESinLDP(ldesLocation, new LDPCommunication());
    const event_stream = await ldes_in_ldp.readMembersSorted({
        from: new Date(from),
        until: new Date(until),
        chronological: true
    })
    event_stream.on('data', (event: any) => {
        console.log(event.quads);  
    })
}
