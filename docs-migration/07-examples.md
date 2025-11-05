# Code Examples

## Production-ready patterns you can copy

Explore curated examples covering backend services, realtime overlays, automation scripts, and workflow integrations. Each project includes source code, detailed comments, and deployment instructions.

## Featured Examples

### Server-side Matchmaking

Quickly assemble a matchmaking service that uses AeThex queues, weighting rules, and player telemetry streams.

**Language:** TypeScript  
**Repository:** [aethex/examples/matchmaking-service](https://github.com/aethex/examples/tree/main/matchmaking-service)

```typescript
import { createQueue, matchPlayers } from "@aethex/matchmaking";

const queue = await createQueue({
  region: "us-central",
  size: 4,
  constraints: [
    { field: "skillRating", tolerance: 120 },
    { field: "latency", max: 90 },
  ],
});

export async function enqueuePlayer(player) {
  await queue.enqueue(player.id, {
    skillRating: player.mmr,
    latency: player.ping,
  });

  const match = await matchPlayers(queue);
  if (match) {
    await queue.lock(match.id);
    return match;
  }

  return null;
}
```

### Realtime Activity Overlays

Broadcast live deployment and incident updates to your in-game HUD or operations dashboard using AeThex events.

**Language:** React  
**Repository:** [aethex/examples/realtime-overlay](https://github.com/aethex/examples/tree/main/realtime-overlay)

```javascript
import { useEffect, useState } from "react";
import { subscribe } from "@aethex/events";

export function ActivityOverlay() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribe("deployment.*", (event) => {
      setEvents((current) => [event, ...current].slice(0, 5));
    });

    return () => unsubscribe();
  }, []);

  return (
    <aside className="rounded-xl border border-purple-500/40 bg-black/60 p-4">
      <h3 className="text-sm font-semibold text-purple-200">Live activity</h3>
      <ul className="mt-3 space-y-2 text-xs text-gray-200">
        {events.map((evt) => (
          <li
            key={evt.id}
            className="rounded border border-purple-500/20 bg-purple-900/20 p-2"
          >
            <span className="font-mono text-purple-300">{evt.type}</span>
            <span className="ml-2 text-gray-400">{evt.payload.summary}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
```

### Workshop Automation

Automate the packaging and publishing of custom workshop content across AeThex environments using the CLI.

**Language:** Shell  
**Repository:** [aethex/examples/workshop-automation](https://github.com/aethex/examples/tree/main/workshop-automation)

```bash
#!/usr/bin/env bash
set -euo pipefail

WORKSPACE=${1:-"mods"}

npm install
aethex login --token "$AETHEX_TOKEN"

aethex workshop package "$WORKSPACE" --out dist/
aethex deploy --environment production --artifact dist/workshop.tgz

echo "Workshop build published"
```

## Integration Ideas

### Commerce Hooks

Sync AeThex purchase events into your billing or CRM system using the webhook relay template.

- [View guide](/docs/api)

### Live Operations Dashboard

Combine project metrics, incident response playbooks, and player sentiment into a single React dashboard.

- [View guide](/docs/tutorials)

### Cross-platform Presence

Mirror AeThex voice and party status with your Discord or Slack community using the presence bridge sample.

- [View community](/community)

### Analytics Pipeline

Export gameplay events to your data warehouse with the managed streaming connectors.

- [View guide](/docs/getting-started)

## Getting Started

1. Visit the [GitHub repository](https://github.com/aethex/examples)
2. Clone the example you want to explore
3. Follow the README instructions
4. Customize for your use case

## Contributing Examples

Have a great example? Submit it to the community!

- Fork the repository
- Add your example with detailed comments
- Submit a pull request
- Your example will be featured in our library
