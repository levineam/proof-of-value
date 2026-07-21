import { Protobuf, System } from "@koinos/sdk-as";
import { spike } from "./proto/spike";

export class Spike {
  record_content(args: spike.record_content_arguments): spike.record_content_result {
    const event = new spike.content_recorded_event();
    event.content = args.content;
    event.event_version = 1;
    System.event(
      "pov.spike.content_recorded",
      Protobuf.encode(event, spike.content_recorded_event.encode),
      [],
    );

    const result = new spike.record_content_result();
    result.event_version = 1;
    return result;
  }
}
