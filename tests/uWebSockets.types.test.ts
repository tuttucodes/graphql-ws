import { expectTypeOf, it } from 'vitest';
import type { ConnectionInitMessage } from '../src/common';
import { makeBehavior } from '../src/use/uWebSockets';

it('preserves the context type without an upgrade hook', () => {
  makeBehavior({
    onConnect(ctx) {
      expectTypeOf(ctx.extra.persistedRequest.url).toEqualTypeOf<string>();
    },
  });
});

it('preserves the context type when the upgrade hook returns nothing', () => {
  makeBehavior(
    {
      onConnect(ctx) {
        expectTypeOf(ctx.extra.persistedRequest.url).toEqualTypeOf<string>();
      },
    },
    { upgrade() {} },
  );
});

it('makes upgrade data optional when the hook may return nothing', () => {
  makeBehavior<ConnectionInitMessage['payload'], { remoteAddress: string }>(
    {
      onConnect(ctx) {
        expectTypeOf(ctx.extra.remoteAddress).toEqualTypeOf<
          string | undefined
        >();
      },
    },
    {
      upgrade(res) {
        if (res.getRemoteAddressAsText().byteLength) {
          return { remoteAddress: '127.0.0.1' };
        }
        return;
      },
    },
  );
});

it('accepts custom upgrade data with the existing explicit extra generic', () => {
  makeBehavior<ConnectionInitMessage['payload'], { remoteAddress: string }>(
    {
      onConnect(ctx) {
        expectTypeOf(ctx.extra.remoteAddress).toEqualTypeOf<
          string | undefined
        >();
      },
    },
    { upgrade: () => ({ remoteAddress: '127.0.0.1' }) },
  );
});

it('accepts object-returning hooks without explicit generics', () => {
  makeBehavior({}, { upgrade: () => ({ remoteAddress: '127.0.0.1' }) });
});
