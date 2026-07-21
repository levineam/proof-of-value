import { Spike } from '../Spike';
import { spike } from '../proto/spike';
import { MockVM, Protobuf } from '@koinos/sdk-as';

describe('contract', () => {
  it('encodes the representative content reference in one event', () => {
    const c = new Spike();
    const content = new spike.content_reference();
    content.did = 'did:plc:exampleauthor';
    const cid = new Uint8Array(4);
    cid[0] = 1;
    cid[1] = 2;
    cid[2] = 3;
    cid[3] = 4;
    content.cid = cid;
    content.at_uri = 'at://did:plc:exampleauthor/app.bsky.feed.post/3k';
    content.version = spike.content_reference_version.content_reference_version_v1;

    const res = c.record_content(new spike.record_content_arguments(content));
    const events = MockVM.getEvents();
    const emitted = Protobuf.decode<spike.content_recorded_event>(
      events[0].data,
      spike.content_recorded_event.decode,
    );

    expect(res.event_version).toStrictEqual(1);
    expect(events.length).toStrictEqual(1);
    expect(events[0].name).toStrictEqual('pov.spike.content_recorded');
    expect(emitted.content!.did).toStrictEqual(content.did);
    expect(emitted.content!.cid).toStrictEqual(content.cid);
    expect(emitted.content!.at_uri).toStrictEqual(content.at_uri);
    expect(emitted.content!.version).toStrictEqual(content.version);
  });
});
